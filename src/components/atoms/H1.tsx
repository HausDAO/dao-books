import { FC } from 'react'

export const H1: FC = ({ children }) => {
  return (
    <h1 className="font-semibold text-3xl">
      {children} <span className="h-1 block mt-1 w-28 bg-primary-300" />
    </h1>
  )
}
