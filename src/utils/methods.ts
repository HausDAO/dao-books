import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import moment, { Moment } from 'moment'
import {
  Children,
  ElementType,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react'

import { getTokenUSDPrice } from '../services/getTokenUSDPrice'
import { Token, TokenBalance } from '../types/DAO'

export const momentUTC = moment.utc

export const formatDate = (
  date: string | Date | undefined | Moment
): string => {
  if (date === undefined) {
    return ''
  }
  return momentUTC(date).format('DD-MMM-YYYY')
}
// Join classes
export const classNames = (...classes: string[]): string => {
  return classes.filter(Boolean).join(' ')
}

export const findChildByType = (
  children: ReactNode | ReactNode[],
  type: ElementType
): ReactElement | undefined => {
  const kid = Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === type
  )
  if (isValidElement(kid)) {
    return kid
  }
  return undefined
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

export const formatNumber = (number?: number): string | undefined => {
  return number?.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export const formatToken = (
  decimals: string | number,
  number?: BigNumber | string
): string | undefined => {
  if (!number) {
    return
  }
  const num = BigNumber.from(number)
  return formatUnits(num, Number(decimals))
}

export const convertTokenToValue = (
  tokenAmount: number | string,
  decimals: string
): number => {
  return Number(tokenAmount) / Math.pow(10, Number(decimals))
}

export const getTokenImage = (token: Token): string => {
  const TOKEN_IMAGES: { [symbol: string]: string } = {
    RAID: 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png',
    XDAI: 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png',
  }

  const image = TOKEN_IMAGES[token.symbol]
  return image
}

export const formatAddress = (
  address: string | null | undefined,
  ensName: string | null | undefined,
  chars = 4
): string => {
  if (ensName) return ensName
  else if (address)
    return `${address.substring(0, chars)}...${address.substring(
      address.length - chars
    )}`
  else return ''
}
