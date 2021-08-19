import {
  Children,
  ElementType,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react'

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
