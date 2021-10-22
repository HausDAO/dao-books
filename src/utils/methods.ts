import moment, { Moment } from 'moment'
import {
  Children,
  ElementType,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react'

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

export const formatNumber = (number?: number): string | undefined => {
  return number?.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export const updateUrlQueries = (
  history: any,
  pathname: string,
  queryString: string
) => {
  history.push({
    pathname,
    search: queryString && queryString.length > 0 ? `?${queryString}` : '',
  })
}

export const stringifyArray = (array: any) =>
  array.map((stringifiedFilter: any) => JSON.parse(stringifiedFilter))
