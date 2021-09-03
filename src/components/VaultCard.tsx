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
    <div className="flex rounded-md shadow border-2 border-primary-300 flex-col p-4 lg:w-80 md:w-56 w-48 space-y-2">
      <div>
        <div className="text-lg">{name}</div>
        <div className="text-sm">$ {formatNumber(balance) || 0}</div>
      </div>
      <p className="text-secondary-500 text-sm hover:underline">
        Vault Book &rarr;
      </p>
    </div>
  )
}
