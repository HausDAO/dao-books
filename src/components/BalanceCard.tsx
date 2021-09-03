import { FC } from 'react'
import { formatNumber } from '../utils/methods'
type VaultCardProps = {
  title: string
  balance?: number
}

export const BalanceCard: FC<VaultCardProps> = ({ title, balance }) => {
  return (
    <div className="flex rounded-md shadow border-2 border-primary-300 flex-col p-4 lg:w-80 md:w-56 w-48">
      <div className="text-lg">{title}</div>
      <div className="text-sm">$ {formatNumber(balance) || 0}</div>
    </div>
  )
}
