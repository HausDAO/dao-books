import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import {
  Box,
  Flex,
  Spacer,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { DaoMetadata } from '../../../hooks/useDaoMetadata/types'
import { MinionWithTokenBalances, Moloch } from '../../../types/DAO'
import { getDAOLink, getImageFromIPFSHash } from '../../../utils/web3'
import { VaultCard } from '../../VaultCard'
import { getVaultsProps } from './getVaultsProps'

import { Error } from '@/components/Error'

export const Vaults = (): JSX.Element => {
  const { daoAddress } = useParams<{ daoAddress: string }>()

  const [props, setProps] = useState<{
    daoMetadata?: DaoMetadata
    moloch?: Moloch
    minions?: MinionWithTokenBalances[]
    error?: { message: string }
  }>({})
  const updateProps = async () => {
    setProps(await getVaultsProps(daoAddress))
  }

  useEffect(() => {
    updateProps()
  }, [])

  const { daoMetadata, moloch, minions, error } = props

  if (!daoMetadata && !error) {
    return <>Loading</>
  }

  if (error) {
    return <Error />
  }

  if (!moloch || !daoMetadata || !minions) {
    return <Error />
  }

  return (
    <Box
      bgImage={getImageFromIPFSHash(daoMetadata.customThemeConfig?.bgImg)}
      backgroundSize="cover"
    >
      <Box
        p="9"
        backdropFilter={
          daoMetadata.customThemeConfig?.bgImg && 'brightness(30%)'
        }
      >
        <Stack spacing="8">
          <Flex justify="space-between">
            <Flex alignItems="center">
              <Avatar
                w="12"
                src={getImageFromIPFSHash(daoMetadata.avatarImg)}
                mr="4"
              />
              <Text fontSize="xl">{daoMetadata.name}</Text>
            </Flex>
            <a
              href={getDAOLink({ network: daoMetadata.network, daoAddress })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Visit DAO</Button>
            </a>
          </Flex>

          <Wrap spacing="8">
            <WrapItem>
              <Link
                className="block"
                to={`/dao/${daoMetadata.contractAddress}/treasury`}
              >
                <VaultCard
                  type="Treasury"
                  name="DAO Treasury"
                  address={daoMetadata.contractAddress}
                  tokenBalances={moloch.tokenBalances}
                  nbrTokens={moloch.tokenBalances.length}
                />
              </Link>
            </WrapItem>
            {minions.map((minion) => {
              return (
                <WrapItem>
                  <Link
                    key={minion.minionAddress}
                    to={`/dao/${daoMetadata.contractAddress}/minion/${minion.minionAddress}`}
                  >
                    <VaultCard
                      type="Minion"
                      name={minion.name}
                      address={minion.minionAddress}
                      tokenBalances={minion.tokenBalances}
                      nbrTokens={minion.tokenBalances.length}
                      nbrTransactions={minion.transactions.length}
                    />
                  </Link>
                </WrapItem>
              )
            })}
          </Wrap>
          <Spacer />
        </Stack>
      </Box>
    </Box>
  )
}
