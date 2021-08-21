import { Button, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import useDaoMetadata from '../../hooks/useDaoMetadata/useDaoMetadata'

export default function Vaults(): JSX.Element {
  const router = useRouter()
  const { id } = router.query
  const { data, error, loading } = useDaoMetadata(id as string)

  const handleGoToHome = () => {
    router.replace('/')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-2">
        <p className="text-xl">{error.message}</p>
        <Button onClick={handleGoToHome}>Go to Home</Button>
      </div>
    )
  }

  return <div>{JSON.stringify(data)}</div>
}
