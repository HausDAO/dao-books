import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Flex, Text } from '@chakra-ui/layout'
import { FC } from 'react'

import { DaoMetadata } from '@/hooks/useDaoMetadata/types'
import { getDAOLink } from '@/utils/web3/daohaus'
import { getImageFromIPFSHash } from '@/utils/web3/ipfs'

export const DAOHead: FC<{ daoMetadata: DaoMetadata }> = ({ daoMetadata }) => {
  return (
    <Flex justify="space-between" wrap="wrap">
      <Flex alignItems="center">
        <Avatar
          w="12"
          src={getImageFromIPFSHash(daoMetadata.avatarImg)}
          mr="4"
        />
        <Text fontSize="xl">{daoMetadata.name}</Text>
      </Flex>
      <a
        href={getDAOLink({
          network: daoMetadata.network,
          daoAddress: daoMetadata.contractAddress,
        })}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button>Visit DAO</Button>
      </a>
    </Flex>
  )
}
