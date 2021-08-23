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
  // TODO: show copy icon to copy the address
  const USDBalance = tokenBalances.reduce(
    (usd, tokenBalance) => convertTokenValueToUSD(tokenBalance) + usd,
    0
  )

  return (
    <div className="inline-flex rounded-md shadow flex-col p-2 bg-gray-200">
      <div>{name}</div>
      <div>$ {USDBalance}</div>
      {`Vault Book ->`}
    </div>
  )
}
