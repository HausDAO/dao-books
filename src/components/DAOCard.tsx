import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Box, Flex, Stack, Text } from '@chakra-ui/layout'
import { FC } from 'react'
import { Link } from 'react-router-dom'

import { getImageFromIPFSHash } from '../utils/web3/ipfs'
import { Card } from './atoms'
type DAOCardProps = {
  dao: {
    name: string
    address: string
    description: string
    avatar: string
  }
}

export const DAOCard: FC<DAOCardProps> = ({ dao }) => {
  return (
    <Card>
      <Box>
        <Stack spacing="4">
          <Flex alignItems="center">
            <Avatar w="12" src={getImageFromIPFSHash(dao.avatar)} mr="4" />
            <Text fontSize="xl">{dao.name}</Text>
          </Flex>
          <Text>{dao.description}</Text>
        </Stack>
      </Box>
      <Box justifySelf="flex-end" alignSelf="flex-end">
        <Link to={`/dao/${dao.address}`}>
          <Button variant="outline">View Books</Button>
        </Link>
      </Box>
    </Card>
  )
}
