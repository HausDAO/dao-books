import { FC } from 'react'

export const MultiLineCell: FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-gray-900">{title}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  )
}
