import {
  Button,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

export default function Home(): JSX.Element {
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
    <div className="h-screen flex flex-col items-center justify-center">
      <div>
        <h1 className="font-semibold text-3xl">DAO Bookkeeping</h1>
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <FormControl id="address" isRequired>
            <FormLabel htmlFor="address">Enter DAO Address</FormLabel>
            <Input id="address" {...register('address', { required: true })} />
            <FormHelperText>
              You can find the DAO address from the URL.
            </FormHelperText>
            <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            loadingText="Loading"
          >
            View Vaults
          </Button>
        </form>
      </div>
    </div>
  )
}
