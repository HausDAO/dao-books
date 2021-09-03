import { FC } from 'react'
type CardProps = {
  title: string
  description?: string
}

export const Card: FC<CardProps> = ({ title, description }) => {
  return (
    <div className="flex rounded-md shadow border-2 border-primary-300 flex-col p-4 w-80 space-y-2">
      <div className="text-xl">{title}</div>
      <div className="text-sm">{description}</div>
      <p className="font-bold pt-2 text-secondary-500">Visit the DAO &rarr;</p>
    </div>
  )
}
