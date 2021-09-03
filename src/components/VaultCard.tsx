import { useEffect, useState } from 'react'
import { FC } from 'react'
import { TokenBalance } from '../types/DAO'
import { convertTokenValueToUSD, formatNumber } from '../utils/methods'
type VaultCardProps = {
  address: string
  name: string
  tokenBalances: TokenBalance[]
}

export const VaultCard: FC<VaultCardProps> = ({
  name,
  address,
  tokenBalances,
}) => {
  const [balance, setBalance] = useState<number>()

  /**
   * Using async reduce because convertTokenToUSD returns a promise
   */
  useEffect(() => {
    const getTokenBalances = async () => {
      const balance = await tokenBalances.reduce(async (usd, tokenBalance) => {
        const previousValue = await usd
        const usdValue = await convertTokenValueToUSD(tokenBalance)
        return usdValue + previousValue
      }, Promise.resolve(0))
      setBalance(balance)
    }

    getTokenBalances()
  })

  return (
    <div className="flex rounded-md shadow border-2 border-primary-300 flex-col p-4 w-80 space-y-2">
      <div>{name}</div>
      <div>$ {formatNumber(balance) || 0}</div>
      <p className="font-bold pt-2 text-secondary-500">Vault Book &rarr;</p>
    </div>
  )
}
