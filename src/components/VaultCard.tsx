import { Button } from '@chakra-ui/button'
import { Flex, Stack, Text, Wrap } from '@chakra-ui/layout'
import { useEffect, useState, FC } from 'react'
import { Link } from 'react-router-dom'

import { TokenBalance } from '../types/DAO'
import { formatNumber } from '../utils/methods'
import { convertTokenValueToUSD } from '../utils/web3/token'
import { Card, TokenAvatar } from './atoms'
type VaultCardProps = {
  type: string
  daoAddress: string
  path: string
  name: string
  tokenBalances: TokenBalance[]
}

export const VaultCard: FC<VaultCardProps> = ({
  name,
  type,
  daoAddress,
  path,
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
    <Card h="60">
      <Stack spacing="1">
        <Text fontSize="sm">{type}</Text>
        <div className="text-lg">{name}</div>
      </Stack>
      <Stack spacing="2">
        <div className="text-sm">$ {formatNumber(balance) ?? 0}</div>
        <Wrap>
          {tokenBalances.map((tokenBalance) => {
            return <TokenAvatar token={tokenBalance.token} />
          })}
        </Wrap>
      </Stack>
      <Flex justify="space-between" align="center">
        <div className="text-sm">
          {formatNumber(tokenBalances.length) ?? 0} token(s)
        </div>
        <Link to={`/dao/${daoAddress}/${path}`}>
          <Button variant="outline">Vault Book</Button>
        </Link>
      </Flex>
    </Card>
  )
}
