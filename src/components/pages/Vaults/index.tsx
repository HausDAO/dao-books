import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Flex, Spacer, Stack, Text, Wrap, WrapItem } from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import { useCustomTheme } from '../../../contexts/CustomThemeContext'
import { DaoMetadata } from '../../../hooks/useDaoMetadata/types'
import { MinionWithTokenBalances, Moloch } from '../../../types/DAO'
import { getDAOLink } from '../../../utils/web3/daohaus'
import { getImageFromIPFSHash } from '../../../utils/web3/ipfs'
import { VaultCard } from '../../VaultCard'
import { LoadingLogo } from '../../atoms'
import { getVaultsProps } from './getVaultsProps'

import { Error } from '@/components/Error'

export const Vaults = (): JSX.Element => {
  const { daoAddress } = useParams<{ daoAddress: string }>()
  const { updateTheme } = useCustomTheme()

  const [props, setProps] = useState<{
    daoMetadata?: DaoMetadata
    moloch?: Moloch
    minions?: MinionWithTokenBalances[]
    error?: { message: string }
  }>({})

  const updateProps = async () => {
    const data = await getVaultsProps(daoAddress)
    setProps(data)
    updateTheme(data.daoMetadata)
  }

  useEffect(() => {
    updateProps()
  }, [])

  const { daoMetadata, moloch, minions, error } = props

  if (!daoMetadata && !error) {
    return <LoadingLogo />
  }

  if (error) {
    return <Error />
  }

  if (!moloch || !daoMetadata || !minions) {
    return <Error />
  }

  return (
    <Stack spacing="8">
      <Helmet>
        <title>{daoMetadata.name} | DAO Books</title>
      </Helmet>
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
          <VaultCard
            type="TREASURY"
            name="DAO Treasury"
            daoAddress={daoMetadata.contractAddress}
            path="treasury"
            tokenBalances={moloch.tokenBalances}
          />
        </WrapItem>
        {minions.map((minion) => {
          return (
            <WrapItem>
              <VaultCard
                key={minion.minionAddress}
                type="MINION"
                name={minion.name}
                daoAddress={daoMetadata.contractAddress}
                path={`minion/${minion.minionAddress}`}
                tokenBalances={minion.tokenBalances}
              />
            </WrapItem>
          )
        })}
      </Wrap>
      <Spacer />
    </Stack>
  )
}
