import { Button } from '@chakra-ui/button'
import { FC } from 'react'
import { useHistory } from 'react-router'

export const Error: FC = () => {
  const history = useHistory()
  const handleGoToHome = () => {
    history.replace('/')
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-2">
      <p className="text-xl">Something went wrong</p>
      <Button onClick={handleGoToHome}>Go to Home</Button>
    </div>
  )
}
