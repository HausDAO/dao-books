import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Image } from '@chakra-ui/image'
import {
  Box,
  Flex,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/layout'
import { FC } from 'react'
import { Link } from 'react-router-dom'
type DAOCardProps = {
  dao: {
    name: string
    address: string
    description: string
  }
}

export const DAOCard: FC<DAOCardProps> = ({ dao }) => {
  return (
    <Flex
      direction="column"
      bg="brand.darkBlue1"
      p="6"
      border="1px solid #C4C4C4"
      borderRadius="md"
      w="80"
      h="56"
      justify="space-between"
    >
      <Box>
        <Stack spacing="4">
          <HStack spacing="4">
            <Avatar w="12" src="https://bit.ly/dan-abramov" />
            <Text fontSize="2xl">{dao.name}</Text>
          </HStack>
          <Text>{dao.description}</Text>
        </Stack>
      </Box>
      <Box justifySelf="flex-end" alignSelf="flex-end">
        <Link to={`/dao/${dao.address}`}>
          <Button variant="outline">View Books</Button>
        </Link>
      </Box>
    </Flex>
  )
}
