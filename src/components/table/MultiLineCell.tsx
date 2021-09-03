import { FC } from 'react'

export const MultiLineCell: FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div>{title}</div>
      <div className="text-xs">{description}</div>
    </div>
  )
}
