import { Link, Stack } from '@chakra-ui/layout'
import { get } from 'lodash'
import qs from 'qs'
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, useHistory, useLocation } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'
import { TableState } from 'react-table'

import Table from '../../table/Table'
import { BalanceCard } from './BalanceCard'
import {
  MINION_COLUMNS,
  TokenBalanceLineItem,
  TOKEN_BALANCES_COLUMNS,
  TRANSACTIONS_COLUMNS,
  TREASURY_COLUMNS,
  VaultTransaction,
} from './columns'
import { getMinionDetailProps } from './getMinionDetailProps'
import { getTreasuryDetailProps } from './getTreasuryDetailProps'

import { LoadingLogo, DAOHead } from '@/components'
import { Error } from '@/components/Error'
import { H2 } from '@/components/atoms'
import { useCustomTheme } from '@/contexts/CustomThemeContext'

enum TableName {
  TRANSACTIONS = 'transactions',
  TOKEN_BALANCES = 'tokenBalances',
}

export const VaultDetail = (): JSX.Element => {
  const history = useHistory()
  const location = useLocation()
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
  const [transactionsTableState, setTransactionsTableState] = useState<
    Partial<TableState<VaultTransaction>>
  >({})
  const [tokenBalancesTableState, setTokenBalancesTableState] = useState<
    Partial<TableState<TokenBalanceLineItem>>
  >({})

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

  // set initial Tables filters based on current url queries
  const updateInitialTableState = () => {
    const URLState = qs.parse(location.search, { ignoreQueryPrefix: true })

    setTransactionsTableState(
      get(URLState, TableName.TRANSACTIONS, {}) as Partial<
        TableState<VaultTransaction>
      >
    )
    setTokenBalancesTableState(
      get(URLState, TableName.TOKEN_BALANCES, {}) as Partial<
        TableState<TokenBalanceLineItem>
      >
    )
  }

  useEffect(() => {
    updateProps()
    updateInitialTableState()
  }, [])

  const { daoMetadata, transactions, tokenBalances, vaultName, error } = props

  if (!daoMetadata && !error) {
    return <LoadingLogo />
  }

  if (error) {
    return <Error />
  }

  if (!daoMetadata) {
    return <Error />
  }

  const handleTableStateChange =
    (tableName: TableName) => (tableState: any) => {
      const { filters, globalFilter, pageSize, sortBy } = tableState

      const currentURLState = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      })

      const newURLParams = qs.stringify(
        {
          ...currentURLState,
          [tableName]: { filters, globalFilter, pageSize, sortBy },
        },
        { addQueryPrefix: true }
      )

      history.replace(newURLParams)
    }

  return (
    <Stack spacing="8">
      <Helmet>
        <title>
          {minionAddress ? vaultName : 'Treasury'} | {daoMetadata.name} | DAO
          Books
        </title>
      </Helmet>
      <div className="space-y-3">
        <Link as={RouterLink} to={`/dao/${daoAddress}`}>
          &larr; All Vaults
        </Link>
        <DAOHead
          title={`${minionAddress ? vaultName : 'Treasury'} | ${
            daoMetadata.name
          }`}
          daoMetadata={daoMetadata}
        />
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
            ...transactionsTableState,
          }}
          onStateChangeCallback={handleTableStateChange(TableName.TRANSACTIONS)}
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
            ...tokenBalancesTableState,
          }}
          onStateChangeCallback={handleTableStateChange(
            TableName.TOKEN_BALANCES
          )}
        />
      </div>
    </Stack>
  )
}
