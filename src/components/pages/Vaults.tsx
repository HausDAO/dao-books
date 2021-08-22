import { FC } from 'react'
import { Button, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import useDaoMetadata from '../../hooks/useDaoMetadata/useDaoMetadata'
import { VaultCard } from '../VaultCard'
import Link from 'next/link'
export const Vaults: FC = () => {
  const router = useRouter()
  const { id } = router.query
  const { data: daoMetadata, error, loading } = useDaoMetadata(id as string)

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

  return (
    <div className="p-4 space-y-3">
      <h1 className="font-semibold text-3xl">{daoMetadata?.name}</h1>
      <h2 className="font-semibold text-2xl">DAO Treasury</h2>
      <Link
        href={`/dao/${daoMetadata?.contractAddress}/treasury/0xd83ac7d30495e1e1d2f42a0d796a058089719a45`}
      >
        <a>
          <VaultCard
            name="DAO Treasury"
            address="0xd83ac7d30495e1e1d2f42a0d796a058089719a45"
            tokenBalances={[
              {
                balance: 500000000000000000,
                token: {
                  address: '0xd83ac7d30495e1e1d2f42a0d796a058089719a45',
                  decimals: '18',
                  symbol: 'RAID',
                },
              },
              {
                balance: 500000000000000000,
                token: {
                  address: '0xd83ac7d30495e1e1d2f42a0d796a058089719a45',
                  decimals: '18',
                  symbol: 'XDAI',
                },
              },
            ]}
          />
        </a>
      </Link>

      <h2 className="font-semibold text-2xl">Minions</h2>
      <div className="space-x-2">
        <Link
          href={`/dao/${daoMetadata?.contractAddress}/minion/0xd83ac7d30495e1e1d2f42a0d796a058089719a45`}
        >
          <a>
            <VaultCard
              name="Ape"
              address="0xd83ac7d30495e1e1d2f42a0d796a058089719a45"
              tokenBalances={[
                {
                  balance: 500000000000000000,
                  token: {
                    address: '0xd83ac7d30495e1e1d2f42a0d796a058089719a45',
                    decimals: '18',
                    symbol: 'RAID',
                  },
                },
                {
                  balance: 500000000000000000,
                  token: {
                    address: '0xd83ac7d30495e1e1d2f42a0d796a058089719a45',
                    decimals: '18',
                    symbol: 'XDAI',
                  },
                },
              ]}
            />
          </a>
        </Link>
        <Link
          href={`/dao/${daoMetadata?.contractAddress}/minion/0xd83ac7d30495e1e1d2f42a0d796a058089719a45`}
        >
          <a>
            <VaultCard
              name="Valhalla"
              address="0xd83ac7d30495e1e1d2f42a0d796a058089719a45"
              tokenBalances={[
                {
                  balance: 500000000000000000,
                  token: {
                    address: '0xd83ac7d30495e1e1d2f42a0d796a058089719a45',
                    decimals: '18',
                    symbol: 'RAID',
                  },
                },
                {
                  balance: 500000000000000000,
                  token: {
                    address: '0xd83ac7d30495e1e1d2f42a0d796a058089719a45',
                    decimals: '18',
                    symbol: 'XDAI',
                  },
                },
              ]}
            />
          </a>
        </Link>
      </div>
    </div>
  )
}
