import { FC, useEffect, useState } from 'react'

import { TokenBalance } from '../../../types/DAO'
import {
  convertTokenValueToUSD,
  formatNumber,
  formatToken,
} from '../../../utils/methods'
import { MultiLineCell } from '../../table'

const TokenCell: FC<{ tokenBalance: TokenBalance }> = ({ tokenBalance }) => {
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
    <MultiLineCell description={`$ ${usdValue}`} title={String(tokenValue)} />
  )
}

export default TokenCell
