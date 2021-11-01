import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Image } from '@chakra-ui/image'
import { Flex, Text } from '@chakra-ui/layout'
import makeBlockie from 'ethereum-blockies-base64'
import { FC } from 'react'

import { DaoMetadata } from '@/hooks/useDaoMetadata/types'
import { getDAOLink } from '@/utils/web3/daohaus'
import { getImageFromIPFSHash } from '@/utils/web3/ipfs'

export const DAOHead: FC<{ daoMetadata: DaoMetadata; title?: string }> = ({
  daoMetadata,
  title,
}) => {
  return (
    <Flex justify="space-between" wrap="wrap">
      <Flex alignItems="center">
        <Avatar
          w="12"
          src={getImageFromIPFSHash(daoMetadata.avatarImg)}
          mr="4"
          icon={
            <Image
              rounded="full"
              src={makeBlockie(daoMetadata.contractAddress)}
            />
          }
        />
        <Text fontSize="xl">{title ? title : daoMetadata.name}</Text>
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
