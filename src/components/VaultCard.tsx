import { useEffect, useState } from 'react'
import { FC } from 'react'
import { TokenBalance } from '../types/DAO'
import { convertTokenValueToUSD } from '../utils/methods'
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
    <div className="inline-flex rounded-md shadow flex-col p-2 bg-gray-200">
      <div>{name}</div>
      <div>$ {Math.round(balance || 0)}</div>
      {`Vault Book ->`}
    </div>
  )
}
