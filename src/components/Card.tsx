import { FC } from 'react'
type CardProps = {
  title: string
  description?: string
}

export const Card: FC<CardProps> = ({ title, description }) => {
  return (
    <div className="inline-flex rounded-md shadow flex-col p-4 bg-gray-200 w-52">
      <div className="text-xl text-gray-800">{title}</div>
      <div className="text-sm text-gray-700">{description}</div>
    </div>
  )
}
