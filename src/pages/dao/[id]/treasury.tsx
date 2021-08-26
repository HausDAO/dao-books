import { startCase } from 'lodash'
import { GetServerSidePropsContext } from 'next'
import { Treasury, TreasuryTransaction } from '../../../components/pages'
import { getDAOMetadata } from '../../../services/getDAOMetadata'
import { MolochStatsBalance } from '../../../types/DAO'
import fetchStatsGraph from '../../../utils/fetchStatsGraph'
import { convertTokenValueToUSD } from '../../../utils/methods'

export default Treasury

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

type MolochStatsBalancesData = {
  balances: MolochStatsBalance[]
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

          const tokenValue =
            Number(molochStatBalance.amount) /
            Math.pow(10, Number(molochStatBalance.tokenDecimals))

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

    const treasuryTransactions = await mapMolochStatsToTreasuryTransaction(
      molochStatsBalances.data.balances
    )

    return {
      props: {
        daoMetadata: daoMeta,
        treasuryTransactions,
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
