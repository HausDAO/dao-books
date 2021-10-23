import { FC, useEffect, useState } from 'react'

import { MultiLineCell } from './MultiLineCell'

import { TokenBalance } from '@/types/DAO'
import { formatNumber } from '@/utils/methods'
import { convertTokenValueToUSD, formatToken } from '@/utils/web3/token'

export const TokenCell: FC<{ tokenBalance: TokenBalance }> = ({
  tokenBalance,
}) => {
  const [usdValue, setUsdValue] = useState<string>()

  const fetchUSD = async () => {
    const usdValue = await convertTokenValueToUSD(tokenBalance)
    setUsdValue(formatNumber(usdValue))
  }

  useEffect(() => {
    fetchUSD()
  }, [])

  const tokenValue = formatToken(
    tokenBalance.token.decimals,
    tokenBalance.tokenBalance
  )
  return (
    <MultiLineCell description={`$${usdValue}`} title={String(tokenValue)} />
  )
}
