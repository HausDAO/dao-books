import { orderBy, startCase } from 'lodash'
import { GetServerSidePropsContext } from 'next'
import {
  TokenBalanceLineItem,
  Treasury,
  TreasuryTransaction,
} from '../../../components/pages'
import { getDAOMetadata } from '../../../services/getDAOMetadata'
import { Moloch, MolochStatsBalance, TokenBalance } from '../../../types/DAO'
import fetchGraph from '../../../utils/fetchGraph'
import fetchStatsGraph from '../../../utils/fetchStatsGraph'
import {
  convertTokenToValue,
  convertTokenValueToUSD,
} from '../../../utils/methods'

export default Treasury

const GET_MOLOCH = `
query moloch($contractAddr: String!) {
  moloch(id: $contractAddr) {
    id
    minions {
      minionAddress
    }
    tokenBalances(where: {guildBank: true}) {
      token {
        tokenAddress
        symbol
        decimals
      }
      tokenBalance
    }
  }
}
`

const BALANCES = `
query moloch($molochAddress: String!) {
  balances(
    where: {molochAddress: $molochAddress, action_not: "summon"}
    orderBy: timestamp
    orderDirection: asc
  ) {
    id
    timestamp
    balance
    tokenSymbol
    tokenAddress
    tokenDecimals
    currentShares
    currentLoot
    action
    payment
    tribute
    amount
  }
}
`
type MolochData = {
  moloch: Moloch
}
type MolochStatsBalancesData = {
  balances: MolochStatsBalance[]
}

type CalculatedTokenBalances = {
  [tokenAddress: string]: {
    in: number
    out: number
    usdIn: number
    usdOut: number
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id: daoAddress } = context.query

  try {
    const daoMeta = await getDAOMetadata(daoAddress as string)
    const molochStatsBalances = await fetchStatsGraph<
      MolochStatsBalancesData,
      { molochAddress: string }
    >(daoMeta.network, BALANCES, {
      molochAddress: daoMeta.contractAddress,
    })

    const moloch = await fetchGraph<MolochData, { contractAddr: string }>(
      daoMeta.network,
      GET_MOLOCH,
      {
        contractAddr: daoMeta.contractAddress,
      }
    )

    // used to store all the inflow and outflow of each token when iterating over the list of moloch stats
    const calculatedTokenBalances: CalculatedTokenBalances = {}

    const initTokenBalance = (tokenAddress: string) => {
      if (!(tokenAddress in calculatedTokenBalances)) {
        calculatedTokenBalances[tokenAddress] = {
          out: 0,
          usdOut: 0,
          in: 0,
          usdIn: 0,
        }
      }
    }
    const incrementInflow = (
      tokenAddress: string,
      inValue: number,
      usdValue: number
    ) => {
      initTokenBalance(tokenAddress)

      const tokenStats = calculatedTokenBalances[tokenAddress]
      calculatedTokenBalances[tokenAddress] = {
        ...tokenStats,
        in: tokenStats.in + inValue,
        usdIn: tokenStats.usdIn + usdValue,
      }
    }

    const incrementOutflow = (
      tokenAddress: string,
      outValue: number,
      usdValue: number
    ) => {
      initTokenBalance(tokenAddress)

      const tokenStats = calculatedTokenBalances[tokenAddress]
      calculatedTokenBalances[tokenAddress] = {
        ...tokenStats,
        out: tokenStats.out + outValue,
        usdOut: tokenStats.usdOut + usdValue,
      }
    }

    const mapMolochStatsToTreasuryTransaction = async (
      molochStatsBalances: MolochStatsBalance[]
    ): Promise<TreasuryTransaction[]> => {
      const treasuryTransactions = await Promise.all(
        molochStatsBalances.map(async (molochStatBalance) => {
          const usdValue = await convertTokenValueToUSD({
            token: {
              tokenAddress: molochStatBalance.tokenAddress,
              decimals: molochStatBalance.tokenDecimals,
              symbol: molochStatBalance.tokenSymbol,
            },
            tokenBalance: molochStatBalance.amount,
          })

          const tokenValue = convertTokenToValue(
            molochStatBalance.amount,
            molochStatBalance.tokenDecimals
          )

          const balances = (() => {
            if (
              molochStatBalance.payment === false &&
              molochStatBalance.tribute === false
            ) {
              return {
                in: 0,
                usdIn: 0,
                out: 0,
                usdOut: 0,
              }
            }
            if (
              molochStatBalance.payment === false &&
              molochStatBalance.tribute === true
            ) {
              incrementInflow(
                molochStatBalance.tokenAddress,
                tokenValue,
                usdValue
              )
              return {
                in: tokenValue,
                usdIn: usdValue,
                out: 0,
                usdOut: 0,
              }
            }

            if (
              molochStatBalance.payment === true &&
              molochStatBalance.tribute === false
            ) {
              incrementOutflow(
                molochStatBalance.tokenAddress,
                tokenValue,
                usdValue
              )
              return {
                in: 0,
                usdIn: 0,
                out: tokenValue,
                usdOut: usdValue,
              }
            }

            return {
              in: 0,
              usdIn: 0,
              out: 0,
              usdOut: 0,
            }
          })()

          return {
            date: molochStatBalance.timestamp,
            type: startCase(molochStatBalance.action),
            tokenSymbol: molochStatBalance.tokenSymbol,
            tokenDecimals: molochStatBalance.tokenDecimals,
            tokenAddress: molochStatBalance.tokenAddress,
            ...balances,
          }
        })
      )
      return treasuryTransactions
    }

    const mapMolochTokenBalancesToTokenBalanceLineItem = async (
      molochTokenBalances: TokenBalance[],
      calculatedTokenBalances: CalculatedTokenBalances
    ): Promise<TokenBalanceLineItem[]> => {
      const tokenBalanceLineItems = await Promise.all(
        molochTokenBalances.map(async (molochTokenBalance) => {
          const usdValue = await convertTokenValueToUSD(molochTokenBalance)

          const tokenValue = convertTokenToValue(
            molochTokenBalance.tokenBalance,
            molochTokenBalance.token.decimals
          )

          return {
            ...molochTokenBalance,
            inflow: {
              tokenValue:
                calculatedTokenBalances[molochTokenBalance.token.tokenAddress]
                  ?.in || 0,
              usdValue:
                calculatedTokenBalances[molochTokenBalance.token.tokenAddress]
                  ?.usdIn || 0,
            },
            outflow: {
              tokenValue:
                calculatedTokenBalances[molochTokenBalance.token.tokenAddress]
                  ?.out || 0,
              usdValue:
                calculatedTokenBalances[molochTokenBalance.token.tokenAddress]
                  ?.usdOut || 0,
            },
            closing: {
              tokenValue,
              usdValue,
            },
          }
        })
      )
      return tokenBalanceLineItems
    }

    const treasuryTransactions = await mapMolochStatsToTreasuryTransaction(
      molochStatsBalances.data.balances
    )

    const tokenBalances = await mapMolochTokenBalancesToTokenBalanceLineItem(
      moloch.data.moloch.tokenBalances,
      calculatedTokenBalances
    )

    const combinedFlows = { inflow: 0, outflow: 0, closing: 0 }

    tokenBalances.forEach((tokenBalance) => {
      combinedFlows.inflow += tokenBalance.inflow.usdValue
      combinedFlows.outflow += tokenBalance.outflow.usdValue
      combinedFlows.closing += tokenBalance.closing.usdValue
    })

    return {
      props: {
        daoMetadata: daoMeta,
        treasuryTransactions,
        tokenBalances: orderBy(
          tokenBalances,
          ['closing.usdValue', 'closing.tokenValue'],
          ['desc', 'desc']
        ),
        combinedFlows,
      },
    }
  } catch (error) {
    return {
      props: {
        error,
      },
    }
  }
}