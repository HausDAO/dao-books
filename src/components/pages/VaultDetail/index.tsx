import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'

import Table from '../../table/Table'
import { BalanceCard } from './BalanceCard'
import {
  MINION_COLUMNS,
  TOKEN_BALANCES_COLUMNS,
  TRANSACTIONS_COLUMNS,
  TREASURY_COLUMNS,
} from './columns'
import { getMinionDetailProps } from './getMinionDetailProps'
import { getTreasuryDetailProps } from './getTreasuryDetailProps'

import { Error } from '@/components/Error'
import { H1, H2 } from '@/components/atoms'

// Making this client side because chart.js cannot render on server side

export const VaultDetail = (): JSX.Element => {
  const tokenBalancesColumns = useMemo(() => TOKEN_BALANCES_COLUMNS, [])
  const { daoAddress, minionAddress } =
    useParams<{ daoAddress: string; minionAddress?: string }>()

  const transactionsColumns = useMemo(() => {
    if (minionAddress) {
      return TRANSACTIONS_COLUMNS.concat(MINION_COLUMNS)
    } else {
      return TRANSACTIONS_COLUMNS.concat(TREASURY_COLUMNS)
    }
  }, [])

  const [props, setProps] = useState<any>({})
  const updateProps = async () => {
    if (minionAddress) {
      setProps(await getMinionDetailProps(daoAddress, minionAddress))
    } else {
      setProps(await getTreasuryDetailProps(daoAddress))
    }
  }

  useEffect(() => {
    updateProps()
  }, [])

  const { daoMetadata, transactions, tokenBalances, vaultName, error } = props

  if (!daoMetadata && !error) {
    return <>Loading</>
  }

  if (error) {
    return <Error />
  }

  if (!daoMetadata) {
    return <Error />
  }

  return (
    <div className="p-4 space-y-8">
      <div>
        <H1>
          {daoMetadata.name} - {vaultName}
        </H1>
      </div>
      <div className="flex flex-wrap gap-3 md:gap-6 lg:gap-9">
        <BalanceCard
          title="Inflow"
          tokenBalances={tokenBalances}
          type="inflow"
        />
        <BalanceCard
          title="Outflow"
          tokenBalances={tokenBalances}
          type="outflow"
        />
        <BalanceCard
          title="Closing"
          tokenBalances={tokenBalances}
          type="closing"
        />
      </div>

      <div className="space-y-2">
        <H2>Transactions</H2>
        <Table
          // @ts-ignore - dont know why it doesnt work when using with dynamic import
          columns={transactionsColumns}
          data={transactions || []}
          initialState={{
            pageSize: 20,
            hiddenColumns: ['currentLoot'],
          }}
        />
      </div>
      <div className="space-y-2">
        <H2>Token Balances</H2>
        <Table
          // @ts-ignore - dont know why it doesnt work when using with dynamic import
          columns={tokenBalancesColumns}
          data={tokenBalances || []}
          initialState={{
            pageSize: 20,
          }}
        />
      </div>
    </div>
  )
}
