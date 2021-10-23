import { CachedMinion, MinionWithTokenBalances } from '@/types/DAO'
import fetchJson from '@/utils/fetchJson'
import { DAO_HAUS_API_URL } from '@/utils/web3/constants'

export const getMinions = async (
  daoAddress: string
): Promise<MinionWithTokenBalances[]> => {
  const cachedMinions = await fetchJson<CachedMinion[]>(
    `${DAO_HAUS_API_URL}/vaults/${daoAddress}`
  )

  const formatCachedMinionToMinionWithTokenBalances = (
    cachedMinions: CachedMinion[]
  ): MinionWithTokenBalances[] => {
    return cachedMinions.map((cachedMinion) => {
      // TODO: maybe we need to get the usd balance directly from this api
      return {
        minionAddress: cachedMinion.address,
        name: cachedMinion.name,
        tokenBalances: cachedMinion.erc20s.map((erc20) => ({
          tokenBalance: erc20.tokenBalance,
          token: {
            tokenAddress: erc20.tokenAddress,
            decimals: erc20.decimals,
            symbol: erc20.symbol,
          },
        })),
        transactions: cachedMinion.balanceHistory,
      }
    })
  }

  return formatCachedMinionToMinionWithTokenBalances(cachedMinions)
}
