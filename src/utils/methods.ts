import {
  Children,
  ElementType,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react'
import { Token, TokenBalance } from '../types/DAO'

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

export const convertTokenValueToUSD = (tokenBalance: TokenBalance): number => {
  // TODO: fetch it from a reliable source
  const TOKEN_VALUES_IN_USD: { [symbol: string]: number } = {
    RAID: 0.01,
    XDAI: 1,
    WXDAI: 1,
  }

  const value = TOKEN_VALUES_IN_USD[tokenBalance.token.symbol]
  return (
    (value * Number(tokenBalance.tokenBalance)) /
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
