import { Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import useDaoMetadata from '@/services/useDaoMetadata'
import { useEffect } from 'react'

const AppIndex = (): JSX.Element => {
  const router = useRouter()
  const { id } = router.query
  const { data, fetch } = useDaoMetadata(id)

  useEffect(() => {
    fetch()
  }, [fetch])

  return <Button>{data.name}</Button>
}

export default AppIndex
