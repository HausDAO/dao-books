import { Button } from '@chakra-ui/react'
import { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getServerSideProps } from '../../pages/dao/[id]'
import { VaultCard } from '../VaultCard'

export const Vaults = ({
  daoMetadata,
  moloch,
  minions,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  const router = useRouter()

  const handleGoToHome = () => {
    router.replace('/')
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center space-y-2">
        <p className="text-xl">{error.message}</p>
        <Button onClick={handleGoToHome}>Go to Home</Button>
      </div>
    )
  }

  if (!moloch || !daoMetadata || !minions) {
    return (
      <div className="flex flex-col justify-center items-center space-y-2">
        <p className="text-xl">Something went wrong</p>
        <Button onClick={handleGoToHome}>Go to Home</Button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      <div>
        <h1 className="font-semibold text-3xl inline mr-3">
          {daoMetadata.name}
        </h1>
        <Button onClick={handleGoToHome}>Switch Dao</Button>
      </div>
      <h2 className="font-semibold text-2xl">DAO Treasury</h2>
      <Link href={`/dao/${daoMetadata.contractAddress}/treasury`}>
        <a>
          <VaultCard
            name="DAO Treasury"
            address={daoMetadata.contractAddress}
            tokenBalances={moloch.tokenBalances}
          />
        </a>
      </Link>
      {minions.length > 0 && (
        <>
          <h2 className="font-semibold text-2xl">Minions</h2>
          <div className="space-x-2">
            {minions.map((minion) => {
              return (
                <Link
                  key={minion.minionAddress}
                  href={`/dao/${daoMetadata.contractAddress}/minion/${minion.minionAddress}`}
                >
                  <a>
                    <VaultCard
                      name={minion.name}
                      address={minion.minionAddress}
                      tokenBalances={minion.tokenBalances}
                    />
                  </a>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
