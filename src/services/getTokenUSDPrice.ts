import fetchJson from '../utils/fetchJson'
import cache from 'memory-cache'
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

const getTokenPrices = async () => {
  let tokenPrices: {
    [tokenAddress: string]: {
      price: number
    }
  }

  if (cache.get('tokenPrices')) {
    tokenPrices = cache.get('tokenPrices')
  } else {
    tokenPrices = await fetchJson<{
      [tokenAddress: string]: { price: number }
    }>(`https://daohaus-metadata.s3.amazonaws.com/daoTokenPrices.json`)
    cache.put('tokenPrices', tokenPrices, 1000 * 60 * 60)
  }

  return tokenPrices
}

export const getTokenUSDPrice = async (
  tokenAddress: string
): Promise<number> => {
  const tokens = await getTokenPrices()
  const { price = 0 } = tokens[tokenAddress] || {}
  return price
}
