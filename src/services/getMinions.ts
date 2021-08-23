import { MinionWithTokenBalances } from '../types/DAO'
import { DAO_HAUS_API_URL } from '../utils/constants'
import fetchJson from '../utils/fetchJson'

export type CachedMinion = {
  address: string
  name: string
  erc20s: {
    tokenBalance: string
    tokenAddress: string
    decimals: string
    symbol: string
  }[]
}

export const getMinions = async (
  minionAddresses: string[],
  network: string
): Promise<MinionWithTokenBalances[]> => {
  const cachedMinions = await fetchJson<CachedMinion[]>(
    `${DAO_HAUS_API_URL}/vaults`,
    {
      method: 'POST',
      body: JSON.stringify({
        minions: minionAddresses,
        network,
      }),
    }
  )

  const formatCachedMinionToMinionWithTokenBalances = (
    cachedMinions: CachedMinion[]
  ): MinionWithTokenBalances[] => {
    return cachedMinions.map((cachedMinion) => {
      return {
        minionAddress: cachedMinion.address,
        name: cachedMinion.name,
        tokenBalances: cachedMinion.erc20s.map((erc20) => ({
          tokenBalance: Number(erc20.tokenBalance),
          token: {
            tokenAddress: erc20.tokenAddress,
            decimals: erc20.decimals,
            symbol: erc20.symbol,
          },
        })),
      }
    })
  }

  return formatCachedMinionToMinionWithTokenBalances(cachedMinions)
}
