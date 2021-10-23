import { Text } from '@chakra-ui/layout'
import { FC, useEffect, useState } from 'react'

import { TokenBalanceLineItem } from './columns'

import { Card } from '@/components'
import { formatNumber } from '@/utils/methods'
import { convertTokenValueToUSD } from '@/utils/web3/token'

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
    <Card h="24">
      <Text fontSize="sm">{title}</Text>
      <Text mt="1">$ {usdValues}</Text>
    </Card>
  )
}
