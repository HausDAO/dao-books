import { orderBy } from 'lodash'

import { TokenBalanceLineItem, VaultTransaction } from '.'
import { getMinions } from '../../../services/getMinions'

import { getDAOMetadata } from '@/services/getDAOMetadata'
import { cacheTokenPrices } from '@/services/getTokenUSDPrice'
import { MinionTransaction, TokenBalance } from '@/types/DAO'
import { getTokenExplorerLink } from '@/utils/explorer'
import { convertTokenToValue, convertTokenValueToUSD } from '@/utils/methods'

type CalculatedTokenBalances = {
  [tokenAddress: string]: {
    in: number
    out: number
    usdIn: number
    usdOut: number
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getMinionDetailProps = async (
  daoAddress: string,
  minionAddress: string
) => {
  // FIXME: A hack to cache token prices before we fetch prices for all tokens in parallel
  await cacheTokenPrices()

  try {
    const daoMeta = await getDAOMetadata(daoAddress as string)
    const cachedMinions = await getMinions(daoAddress as string)
    const minion = cachedMinions.find(
      (cachedMinion) => cachedMinion.minionAddress === minionAddress
    )

    if (minion === undefined) {
      return {
        error: {
          message: 'Minion not found',
        },
      }
    }

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

    const mapMinionTransactionsToTreasuryTransaction = async (
      minionTransactions: MinionTransaction[]
    ): Promise<VaultTransaction[]> => {
      const treasuryTransactions = await Promise.all(
        minionTransactions.map(async (minionTransaction) => {
          const usdValue = await convertTokenValueToUSD({
            token: {
              tokenAddress: minionTransaction.tokenAddress,
              decimals: minionTransaction.tokenDecimals,
              symbol: minionTransaction.tokenSymbol,
            },
            tokenBalance: Number(minionTransaction.value),
          })

          const tokenValue = convertTokenToValue(
            minionTransaction.value,
            minionTransaction.tokenDecimals
          )

          const balances = (() => {
            if (minionTransaction.deposit === true) {
              incrementInflow(
                minionTransaction.tokenAddress,
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

            if (minionTransaction.deposit === false) {
              incrementOutflow(
                minionTransaction.tokenAddress,
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

          // const txExplorerLink = getTxExplorerLink(
          //   daoMeta.network,
          //   minionTransaction.id
          // )

          // TODO: To be implemented later
          const txExplorerLink = '#'

          return {
            date: minionTransaction.timestamp,
            type: minionTransaction.deposit ? 'Deposit' : 'Withdraw',
            tokenSymbol: minionTransaction.tokenSymbol,
            tokenDecimals: minionTransaction.tokenDecimals,
            tokenAddress: minionTransaction.tokenAddress,
            txExplorerLink,
            ...balances,
          }
        })
      )
      return treasuryTransactions
    }

    const mapMinionTokenBalancesToTokenBalanceLineItem = async (
      minionTokenBalances: TokenBalance[],
      calculatedTokenBalances: CalculatedTokenBalances
    ): Promise<TokenBalanceLineItem[]> => {
      const tokenBalanceLineItems = await Promise.all(
        minionTokenBalances.map(async (molochTokenBalance) => {
          const usdValue = await convertTokenValueToUSD(molochTokenBalance)

          const tokenValue = convertTokenToValue(
            molochTokenBalance.tokenBalance,
            molochTokenBalance.token.decimals
          )

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

    const minionTransactions = await mapMinionTransactionsToTreasuryTransaction(
      minion.transactions
    )

    const tokenBalances = await mapMinionTokenBalancesToTokenBalanceLineItem(
      minion.tokenBalances,
      calculatedTokenBalances
    )

    const combinedFlows = { inflow: 0, outflow: 0, closing: 0 }

    tokenBalances.forEach((tokenBalance) => {
      combinedFlows.inflow += tokenBalance.inflow.usdValue
      combinedFlows.outflow += tokenBalance.outflow.usdValue
      combinedFlows.closing += tokenBalance.closing.usdValue
    })

    return {
      daoMetadata: daoMeta,
      transactions: minionTransactions,
      tokenBalances: orderBy(
        tokenBalances,
        ['closing.usdValue', 'closing.tokenValue'],
        ['desc', 'desc']
      ),
      combinedFlows,
      vaultName: minion.name,
    }
  } catch (error) {
    return {
      error: {
        message: (error as Error).message,
      },
    }
  }
}
