import { BigNumber } from '@ethersproject/bignumber'
import { orderBy, startCase } from 'lodash'

import { DaoMetadata } from '../../../hooks/useDaoMetadata/types'
import { getDAOMetadata } from '../../../services/getDAOMetadata'
import { Moloch, MolochStatsBalance, TokenBalance } from '../../../types/DAO'
import { getProposalLink } from '../../../utils/web3/daohaus'
import {
  getTokenExplorerLink,
  getTxExplorerLink,
} from '../../../utils/web3/explorer'
import fetchGraph from '../../../utils/web3/fetchGraph'
import fetchStatsGraph from '../../../utils/web3/fetchStatsGraph'
import { cacheTokenPrices } from '../../../utils/web3/token'
import CalculateTokenBalances, {
  CalculatedTokenBalances,
} from './CalculateTokenBalances'
import { TokenBalanceLineItem, VaultTransaction } from './columns'

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
query MolochBalances($molochAddress: String!, $first: Int, $skip: Int) {
  balances(
    first: $first,
    skip: $skip,
    where: {molochAddress: $molochAddress, action_not: "summon"}
    orderBy: timestamp
    orderDirection: asc
  ) {
    id
    timestamp
    balance
    tokenSymbol
    tokenAddress
    transactionHash
    tokenDecimals
    action
    payment
    tribute
    amount
    proposalDetail {
      proposalId
      applicant
      details
      sharesRequested
      lootRequested
    }
  }
}
`
type MolochData = {
  moloch: Moloch
}
type MolochStatsBalancesData = {
  balances: MolochStatsBalance[]
}

const retrieveAllBalances = async (daoMeta: DaoMetadata) => {
  const PAGINATE_COUNT = 1000

  const fetchBalances = async (
    skip: number,
    allBalances: MolochStatsBalance[]
  ): Promise<MolochStatsBalance[]> => {
    const molochStatsBalances = await fetchStatsGraph<
      MolochStatsBalancesData,
      { molochAddress: string; first: number; skip: number }
    >(daoMeta.network, BALANCES, {
      molochAddress: daoMeta.contractAddress,
      first: PAGINATE_COUNT,
      skip,
    })

    allBalances = [...allBalances, ...molochStatsBalances.data.balances]
    skip += PAGINATE_COUNT

    if (molochStatsBalances.data.balances.length === PAGINATE_COUNT) {
      return fetchBalances(skip, allBalances)
    }

    return allBalances
  }

  return fetchBalances(0, [])
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getTreasuryDetailProps = async (daoAddress: string) => {
  // FIXME: A hack to cache token prices before we fetch prices for all tokens in parallel
  await cacheTokenPrices()

  try {
    const daoMeta = await getDAOMetadata(daoAddress as string)
    const molochStatsBalances = await retrieveAllBalances(daoMeta)

    const moloch = await fetchGraph<MolochData, { contractAddr: string }>(
      daoMeta.network,
      GET_MOLOCH,
      {
        contractAddr: daoMeta.contractAddress,
      }
    )

    // used to store all the inflow and outflow of each token when iterating over the list of moloch stats
    const calculatedTokenBalances = new CalculateTokenBalances()

    const mapMolochStatsToTreasuryTransaction = async (
      molochStatsBalances: MolochStatsBalance[]
    ): Promise<VaultTransaction[]> => {
      const treasuryTransactions = await Promise.all(
        molochStatsBalances.map(async (molochStatBalance) => {
          /**
           * molochStatBalance.amount is incorrect because ragequit does not return the correct amount
           * so instead, we track the previous balance of the token in the calculatedTokenBalances class state
           * and subtract from current balance to get the amount.
           */
          const tokenValue = calculatedTokenBalances
            .getBalance(molochStatBalance.tokenAddress)
            .sub(BigNumber.from(molochStatBalance.balance))
            .abs()

          const balances = (() => {
            if (
              molochStatBalance.payment === false &&
              molochStatBalance.tribute === false
            ) {
              return {
                in: BigNumber.from(0),
                out: BigNumber.from(0),
              }
            }
            if (
              molochStatBalance.payment === false &&
              molochStatBalance.tribute === true
            ) {
              calculatedTokenBalances.incrementInflow(
                molochStatBalance.tokenAddress,
                tokenValue
              )
              return {
                in: tokenValue,
                out: BigNumber.from(0),
              }
            }

            if (
              molochStatBalance.payment === true &&
              molochStatBalance.tribute === false
            ) {
              calculatedTokenBalances.incrementOutflow(
                molochStatBalance.tokenAddress,
                tokenValue
              )
              return {
                in: BigNumber.from(0),
                out: tokenValue,
              }
            }

            return {
              in: BigNumber.from(0),
              out: BigNumber.from(0),
            }
          })()

          const txExplorerLink = getTxExplorerLink(
            daoMeta.network,
            molochStatBalance.transactionHash
          )

          const proposalTitle = (() => {
            try {
              return JSON.parse(
                molochStatBalance.proposalDetail?.details ?? '{}'
              ).title
            } catch (error) {
              return ''
            }
          })()

          const proposalLink = getProposalLink({
            network: daoMeta.network,
            daoAddress,
            proposalId: molochStatBalance.proposalDetail?.proposalId,
          })

          return {
            date: molochStatBalance.timestamp,
            type: startCase(molochStatBalance.action),
            tokenSymbol: molochStatBalance.tokenSymbol,
            tokenDecimals: molochStatBalance.tokenDecimals,
            tokenAddress: molochStatBalance.tokenAddress,
            txExplorerLink,
            counterparty: molochStatBalance.counterpartyAddress,
            proposal: {
              id: molochStatBalance.proposalDetail?.proposalId ?? '',
              link: proposalLink,
              shares: molochStatBalance.proposalDetail?.sharesRequested ?? '',
              loot: molochStatBalance.proposalDetail?.lootRequested ?? '',
              applicant: molochStatBalance.proposalDetail?.applicant ?? '',
              recipient: '', // TBD
              title: proposalTitle,
              type: '', // TBD
            },
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
          const tokenValue = BigNumber.from(molochTokenBalance.tokenBalance)
          const tokenExplorerLink = getTokenExplorerLink(
            daoMeta.network,
            molochTokenBalance.token.tokenAddress
          )

          return {
            ...molochTokenBalance,
            tokenExplorerLink,
            inflow: {
              tokenValue:
                calculatedTokenBalances[molochTokenBalance.token.tokenAddress]
                  ?.in || BigNumber.from(0),
            },
            outflow: {
              tokenValue:
                calculatedTokenBalances[molochTokenBalance.token.tokenAddress]
                  ?.out || BigNumber.from(0),
            },
            closing: {
              tokenValue,
            },
          }
        })
      )
      return tokenBalanceLineItems
    }

    const treasuryTransactions = await mapMolochStatsToTreasuryTransaction(
      molochStatsBalances
    )

    const tokenBalances = await mapMolochTokenBalancesToTokenBalanceLineItem(
      moloch.data.moloch.tokenBalances,
      calculatedTokenBalances.getBalances()
    )

    return {
      daoMetadata: daoMeta,
      transactions: orderBy(treasuryTransactions, 'date', 'desc'),
      tokenBalances: orderBy(
        tokenBalances,
        ['closing.usdValue', 'closing.tokenValue'],
        ['desc', 'desc']
      ),
      vaultName: 'DAO Treasury',
    }
  } catch (error) {
    return {
      error: {
        message: (error as Error).message,
      },
    }
  }
}
