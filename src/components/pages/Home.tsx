import {
  Button,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from '../Card'

const POPULAR_DAOS = [
  {
    name: 'MetaCartel',
    description: 'The airport to Web3',
    address: '0xb152b115c94275b54a3f0b08c1aa1d21f32a659a',
  },
  {
    name: 'Meta Gamma Delta',
    description: 'Supporting women-led projects in Web3',
    address: '0x93fa3b9d57bcddda4ed2ee40831f5859a9c417b7',
  },
  {
    name: 'Raid Guild',
    description: 'Collective of Web3 product builders',
    address: '0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f',
  },
  {
    name: 'LexDAO',
    description: 'The decentralized legal engineering guild',
    address: '0x58234d4bf7a83693dc0815d97189ed7d188f6981',
  },
  {
    name: 'Venture DAO',
    description: 'Investing in Web3 projects and teams',
    address: '0x4570b4faf71e23942b8b9f934b47ccedf7540162',
  },
  {
    name: 'Machi X DAO',
    description: 'Community of Crypto Artists',
    address: '0xab94cb340b92c15865ed385acd0e1eabedb3c5ae',
  },
]

export const Home: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<{ address: string }>()
  const router = useRouter()
  const onSubmit = (data: { address: string }) => {
    // TODO: should we validate if the address is correct?
    router.push(`/dao/${data.address}`)
  }
  return (
    <div className="h-screen flex flex-col max-w-3xl m-auto">
      <div className="space-y-2 p-4">
        <h1 className="font-semibold text-3xl lg:pt-10 md:pt-6">
          DAO Bookkeeping
        </h1>
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <FormControl id="address" isRequired>
            <FormLabel htmlFor="address">Enter DAO Address</FormLabel>
            <Input id="address" {...register('address', { required: true })} />
            <FormHelperText>
              You can find the DAO address from the URL of the DAO page on
              app.daohaus.club.
            </FormHelperText>
            <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            loadingText="Loading"
            colorScheme="secondary"
            color="primary.700"
          >
            View Vaults
          </Button>
        </form>
        <h2 className="font-semibold text-2xl pt-6">Popular DAOs</h2>
        <div className="flex flex-wrap gap-x-12 gap-y-6">
          {POPULAR_DAOS.map((dao) => {
            return (
              <Link key={dao.address} href={`/dao/${dao.address}`}>
                <a className="inline-flex">
                  <Card title={dao.name} description={dao.description} />
                </a>
              </Link>
            )
          })}
        </div>
        <Link href="https://app.daohaus.club/explore">
          <a target="_blank" rel="noopener noreferrer">
            <p className="font-bold pt-2">Explore All DAOs &rarr;</p>
          </a>
        </Link>
      </div>
    </div>
  )
}
