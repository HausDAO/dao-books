import { useRouter } from 'next/router'
import { FC } from 'react'
import { Button } from './atoms'

export const Error: FC = () => {
  const router = useRouter()
  const handleGoToHome = () => {
    router.replace('/')
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-2">
      <p className="text-xl">Something went wrong</p>
      <Button onClick={handleGoToHome}>Go to Home</Button>
    </div>
  )
}
