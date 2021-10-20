import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router'

import { useCustomTheme } from '../../../contexts/CustomThemeContext'
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

export const VaultDetail = (): JSX.Element => {
  const tokenBalancesColumns = useMemo(() => TOKEN_BALANCES_COLUMNS, [])
  const { daoAddress, minionAddress } =
    useParams<{ daoAddress: string; minionAddress?: string }>()
  const { updateTheme } = useCustomTheme()
  const transactionsColumns = useMemo(() => {
    if (minionAddress) {
      return TRANSACTIONS_COLUMNS.concat(MINION_COLUMNS)
    } else {
      return TRANSACTIONS_COLUMNS.concat(TREASURY_COLUMNS)
    }
  }, [])

  const [props, setProps] = useState<any>({})
  const updateProps = async () => {
    const data = await (async () => {
      if (minionAddress) {
        return getMinionDetailProps(daoAddress, minionAddress)
      } else {
        return getTreasuryDetailProps(daoAddress)
      }
    })()
    setProps(data)
    updateTheme(data?.daoMetadata)
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
      <Helmet>
        {!!minionAddress && (
          <title>
            {vaultName} | {daoMetadata.name} | DAO Books
          </title>
        )}
        {!minionAddress && (
          <title>Treasury | {daoMetadata.name} | DAO Books</title>
        )}
      </Helmet>
      <div>
        <H1>
          {daoMetadata.name} - {vaultName}
        </H1>
      </div>
      <div className="flex flex-wrap gap-3 md:gap-6 lg:gap-9">
        <BalanceCard
          title="INFLOW"
          tokenBalances={tokenBalances}
          type="inflow"
        />
        <BalanceCard
          title="OUTFLOW"
          tokenBalances={tokenBalances}
          type="outflow"
        />
        <BalanceCard
          title="CLOSING"
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
            hiddenColumns: ['proposal.shares', 'proposal.loot'],
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
