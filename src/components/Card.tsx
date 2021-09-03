import { FC } from 'react'
type CardProps = {
  title: string
  description?: string
}

export const Card: FC<CardProps> = ({ title, description }) => {
  return (
    <div className="flex rounded-md shadow border-2 border-primary-300 flex-col p-4 lg:w-80 md:w-56 w-48 space-y-2 justify-between">
      <div>
        <div className="text-xl">{title}</div>
        <div className="text-sm">{description}</div>
      </div>
      <p className="font-bold pt-2 text-secondary-500 hover:underline">
        Visit the DAO &rarr;
      </p>
    </div>
  )
}
