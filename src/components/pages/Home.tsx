import { Button } from '@chakra-ui/button'
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Box, Heading, Stack, Text, Wrap, WrapItem } from '@chakra-ui/layout'
import { FC, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router'

import { useCustomTheme } from '../../contexts/CustomThemeContext'
import { DAOCard } from '../DAOCard'

const POPULAR_DAOS = [
  {
    name: 'MetaCartel',
    description: 'The airport to Web3',
    address: '0xb152b115c94275b54a3f0b08c1aa1d21f32a659a',
    avatar: 'QmUYPn3g6gAxRVAYjhFKzByGn4B5yvVTX12VENvz6bgwiH',
  },
  {
    name: 'Meta Gamma Delta',
    description: 'Supporting women-led projects in Web3',
    address: '0x93fa3b9d57bcddda4ed2ee40831f5859a9c417b7',
    avatar: 'QmV6XACB8DFAiRSjnSacFZueWoLvYeGwLPCZJoukTFv63u',
  },
  {
    name: 'Raid Guild',
    description: 'Collective of Web3 product builders',
    address: '0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f',
    avatar: 'QmZ24prBMemP2zLPZs5GzSwhMnZ18F2ssny6uhTxMmZBVa',
  },
  {
    name: 'LexDAO',
    description: 'The decentralized legal engineering guild',
    address: '0x58234d4bf7a83693dc0815d97189ed7d188f6981',
    avatar: 'QmXvZiCfYxHkXAbwqpbpWH7arr5RNg94MFpGDTdHLvYJ6P',
  },
  {
    name: 'Venture DAO',
    description: 'Investing in Web3 projects and teams',
    address: '0x4570b4faf71e23942b8b9f934b47ccedf7540162',
    avatar: 'QmZN7Pn2fJWgRbrBp6VrYAobUsuTQ5hT4oqFwUno1cGQEt',
  },
  {
    name: 'Machi X DAO',
    description: 'Community of Crypto Artists',
    address: '0xab94cb340b92c15865ed385acd0e1eabedb3c5ae',
    avatar: 'QmbM2cw2yx7Zdc8zMtijHxrYyvwK96hRcTTwXC3AXvw6Bj',
  },
]

export const Home: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<{ address: string }>()
  const history = useHistory()
  const onSubmit = (data: { address: string }) => {
    // TODO: should we validate if the address is correct?
    history.push(`/dao/${data.address}`)
  }

  const { resetTheme } = useCustomTheme()

  useEffect(() => {
    resetTheme()
  }, [])

  return (
    <Stack spacing="8">
      <Helmet>
        <title>DAO books</title>
        <meta
          name="description"
          content="Double entry style bookkeeping solution for moloch DAOs from https://daohaus.club/"
        />
      </Helmet>
      <Box>
        <Heading variant="h2" as="h2" mb="4">
          Explore DAO Books
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl maxWidth="3xl" id="address" mb="3" isRequired>
            <Input
              placeholder="Enter DAO Address"
              id="address"
              {...register('address', { required: true })}
            />
            <FormHelperText>
              You can find the DAO address from the URL of the DAO page on
              app.daohaus.club.
            </FormHelperText>
            <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            variant="outline"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            loadingText="Loading"
          >
            View Books
          </Button>
        </form>
      </Box>
      <Stack spacing="4">
        <Heading variant="h2">Popular DAOs</Heading>
        <Wrap spacing="6">
          {POPULAR_DAOS.map((dao) => {
            return (
              <WrapItem>
                <DAOCard dao={dao} />
              </WrapItem>
            )
          })}
        </Wrap>
        <a
          href="https://app.daohaus.club/explore"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text
            _hover={{
              textDecoration: 'underline',
            }}
          >
            Explore All DAOs &rarr;
          </Text>
        </a>
      </Stack>
    </Stack>
  )
}
