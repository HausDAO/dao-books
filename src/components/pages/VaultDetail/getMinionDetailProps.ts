import { BigNumber } from '@ethersproject/bignumber'
import { orderBy } from 'lodash'

import CalculateTokenBalances, {
  CalculatedTokenBalances,
} from './CalculateTokenBalances'
import { TokenBalanceLineItem, VaultTransaction } from './columns'

import { getDAOMetadata } from '@/services/getDAOMetadata'
import { getMinions } from '@/services/getMinions'
import { MinionTransaction, TokenBalance } from '@/types/DAO'
import { getTokenExplorerLink, getTxExplorerLink } from '@/utils/web3/explorer'
import { cacheTokenPrices } from '@/utils/web3/token'

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
    const calculatedTokenBalances = new CalculateTokenBalances()

    const mapMinionTransactionsToTreasuryTransaction = async (
      minionTransactions: MinionTransaction[]
    ): Promise<VaultTransaction[]> => {
      const treasuryTransactions = await Promise.all(
        minionTransactions.map(async (minionTransaction) => {
          const tokenValue = BigNumber.from(minionTransaction.value)

          const balances = (() => {
            if (minionTransaction.deposit === true) {
              calculatedTokenBalances.incrementInflow(
                minionTransaction.tokenAddress,
                tokenValue
              )
              return {
                in: tokenValue,
                out: BigNumber.from(0),
              }
            }

            if (minionTransaction.deposit === false) {
              calculatedTokenBalances.incrementOutflow(
                minionTransaction.tokenAddress,
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
            minionTransaction.transactionHash
          )

          const counterPartyOrigin = minionTransaction.deposit
            ? minionTransaction.from
            : minionTransaction.to

          return {
            date: minionTransaction.timestamp,
            type: minionTransaction.deposit ? 'Deposit' : 'Withdraw',
            tokenSymbol: minionTransaction.tokenSymbol,
            tokenDecimals: minionTransaction.tokenDecimals,
            tokenAddress: minionTransaction.tokenAddress,
            txExplorerLink,
            counterparty: counterPartyOrigin,
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

    const minionTransactions = await mapMinionTransactionsToTreasuryTransaction(
      minion.transactions
    )

    const tokenBalances = await mapMinionTokenBalancesToTokenBalanceLineItem(
      minion.tokenBalances,
      calculatedTokenBalances.getBalances()
    )

    return {
      daoMetadata: daoMeta,
      transactions: orderBy(minionTransactions, 'date', 'desc'),
      tokenBalances: orderBy(
        tokenBalances,
        ['closing.usdValue', 'closing.tokenValue'],
        ['desc', 'desc']
      ),
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
