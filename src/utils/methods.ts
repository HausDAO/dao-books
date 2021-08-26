import {
  Children,
  ElementType,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react'
import { getTokenUSDPrice } from '../services/getTokenUSDPrice'
import { Token, TokenBalance } from '../types/DAO'
import moment, { Moment } from 'moment'

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
    (usdPrice * Number(tokenBalance.tokenBalance)) /
    Math.pow(10, Number(tokenBalance.token.decimals))
  )
}

export const getTokenImage = (token: Token): string => {
  const TOKEN_IMAGES: { [symbol: string]: string } = {
    RAID: 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png',
    XDAI: 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png',
  }

  const image = TOKEN_IMAGES[token.symbol]
  return image
}
