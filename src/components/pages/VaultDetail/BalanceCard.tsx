import { FC, useEffect, useState } from 'react'

import { formatNumber } from '../../../utils/methods'
import { convertTokenValueToUSD } from '../../../utils/web3/token'
import { TokenBalanceLineItem } from './columns'
type VaultCardProps = {
  title: string
  tokenBalances: TokenBalanceLineItem[]
  type: 'inflow' | 'outflow' | 'closing'
}

export const BalanceCard: FC<VaultCardProps> = ({
  title,
  tokenBalances,
  type,
}) => {
  const [usdValues, setUsdValues] = useState<string>('0')
  const fetchUSD = async () => {
    const list = await Promise.all(
      tokenBalances?.map(async (tokenBalance) => {
        return await convertTokenValueToUSD({
          token: tokenBalance.token,
          tokenBalance: tokenBalance[type].tokenValue.toString(),
        })
      })
    )

    const usdValues = list.reduce((acc, usdValue) => {
      return acc + usdValue
    }, 0)

    setUsdValues(formatNumber(usdValues) ?? '0')
  }

  useEffect(() => {
    fetchUSD()
  }, [])

  return (
    <div className="flex rounded-md shadow border-2 border-primary-300 flex-col p-4 lg:w-80 md:w-56 w-48">
      <div className="text-lg">{title}</div>
      <div className="text-sm">$ {usdValues}</div>
    </div>
  )
}
