import { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { getServerSideProps } from '../../pages/dao/[id]'
import { VaultCard } from '../VaultCard'
import { Error } from '@/components/Error'
import { H1, Button, H2 } from '@/components/atoms'
import { useRouter } from 'next/router'

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
    return <Error />
  }

  if (!moloch || !daoMetadata || !minions) {
    return <Error />
  }

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between flex-wrap">
        <H1>{daoMetadata.name}</H1>
        <Button onClick={handleGoToHome}>Switch DAO</Button>
      </div>
      <div className="space-y-2">
        <H2>DAO Treasury</H2>
        <Link href={`/dao/${daoMetadata.contractAddress}/treasury`}>
          <a className="block">
            <VaultCard
              name="DAO Treasury"
              address={daoMetadata.contractAddress}
              tokenBalances={moloch.tokenBalances}
            />
          </a>
        </Link>
      </div>
      {minions.length > 0 && (
        <div className="space-y-2">
          <H2>Minions</H2>
          <div className="flex flex-wrap gap-3 md:gap-6 lg:gap-9">
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
        </div>
      )}
    </div>
  )
}
