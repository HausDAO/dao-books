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

export const getTokenUSDPrice = async (
  tokenAddress: string
): Promise<number> => {
  const tokens = await fetchJson<{ [tokenAddress: string]: { price: number } }>(
    `https://daohaus-metadata.s3.amazonaws.com/daoTokenPrices.json`
  )

  const { price } = tokens[tokenAddress]

  return price
}
