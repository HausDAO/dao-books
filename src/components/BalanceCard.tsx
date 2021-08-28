import { FC } from 'react'
import { formatNumber } from '../utils/methods'
type VaultCardProps = {
  title: string
  balance?: number
}

export const BalanceCard: FC<VaultCardProps> = ({ title, balance }) => {
  return (
    <div className="inline-flex rounded-md shadow flex-col p-4 bg-gray-200">
      <div className="text-xl text-gray-800">{title}</div>
      <div className="text-sm text-gray-700">
        $ {formatNumber(balance) || 0}
      </div>
    </div>
  )
}
