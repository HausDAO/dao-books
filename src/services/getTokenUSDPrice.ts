import fetchJson from '../utils/fetchJson'
import cache from 'memory-cache'

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
    }>(`https://data.daohaus.club/dao-tokens`)
    cache.put('tokenPrices', tokenPrices, 1000 * 60 * 5)
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

export const cacheTokenPrices = async (): Promise<void> => {
  await getTokenPrices()
  return
}
