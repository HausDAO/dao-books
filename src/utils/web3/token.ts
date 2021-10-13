import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import cache from 'memory-cache'

import { TokenBalance } from '../../types/DAO'
import fetchJson from '../fetchJson'

const getTokenPrices = async () => {
  let tokenPrices: {
    [tokenAddress: string]: {
      price: number
      logoURI?: string | null
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

export const getTokenImage = async (tokenAddress: string): Promise<string> => {
  const tokens = await getTokenPrices()
  const { logoURI = '' } = tokens[tokenAddress] || {}
  return logoURI ?? ''
}

export const cacheTokenPrices = async (): Promise<void> => {
  await getTokenPrices()
}

export const formatToken = (
  decimals: string | number,
  number?: BigNumber | string
): string | undefined => {
  if (!number) {
    return
  }
  const num = BigNumber.from(number)
  const formatted = formatUnits(num, Number(decimals))
  const split = formatted.split('.')
  if (split.length > 1) {
    return split[0] + '.' + split[1].substr(0, 6)
  }
  return formatted
}

export const convertTokenValueToUSD = async (
  tokenBalance: TokenBalance
): Promise<number> => {
  const usdPrice = await getTokenUSDPrice(tokenBalance.token.tokenAddress)
  return (
    usdPrice *
    Number(formatToken(tokenBalance.token.decimals, tokenBalance.tokenBalance))
  )
}
