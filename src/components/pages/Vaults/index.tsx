import { Button } from '@chakra-ui/button'
import { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

import { DaoMetadata } from '../../../hooks/useDaoMetadata/types'
import { MinionWithTokenBalances, Moloch } from '../../../types/DAO'
import { VaultCard } from '../../VaultCard'
import { getVaultsProps } from './getVaultsProps'

import { Error } from '@/components/Error'
import { H1, H2 } from '@/components/atoms'

export const Vaults = (): JSX.Element => {
  const history = useHistory()
  const { daoAddress } = useParams<{ daoAddress: string }>()
  const handleGoToHome = () => {
    history.replace('/')
  }

  const [props, setProps] = useState<{
    daoMetadata?: DaoMetadata
    moloch?: Moloch
    minions?: MinionWithTokenBalances[]
    error?: { message: string }
  }>({})
  const updateProps = async () => {
    setProps(await getVaultsProps(daoAddress))
  }

  useEffect(() => {
    updateProps()
  }, [])

  const { daoMetadata, moloch, minions, error } = props

  if (!daoMetadata && !error) {
    return <>Loading</>
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
        <Link
          className="block"
          to={`/dao/${daoMetadata.contractAddress}/treasury`}
        >
          <VaultCard
            name="DAO Treasury"
            address={daoMetadata.contractAddress}
            tokenBalances={moloch.tokenBalances}
            nbrTokens={moloch.tokenBalances.length}
          />
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
                  to={`/dao/${daoMetadata.contractAddress}/minion/${minion.minionAddress}`}
                >
                  <VaultCard
                    name={minion.name}
                    address={minion.minionAddress}
                    tokenBalances={minion.tokenBalances}
                    nbrTokens={minion.tokenBalances.length}
                    nbrTransactions={minion.transactions.length}
                  />
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
