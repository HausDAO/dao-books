import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, useHistory, useLocation } from 'react-router'

import { useCustomTheme } from '../../../contexts/CustomThemeContext'
import { updateUrlQueries, stringifyArray } from '../../../utils/methods'
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

const TRANSACTIONS_FILTERS_URL_QUERY_NAME = 'transactionsFilter'
const TRANSACTIONS_GLOBAL_FILTER_URL_QUERY_NAME = 'transactionsGlobalFilter'
const BALANCES_FILTERS_URL_QUERY_NAME = 'balancesFilter'
const BALANCES_GLOBAL_FILTER_URL_QUERY_NAME = 'balancesGlobalFilter'

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
  const [transactionsFiltersInitState, setTransactionsFiltersInitState] =
    useState<any>({})
  const [balancesFiltersInitState, setBalancesFiltersInitState] = useState<any>(
    {}
  )

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
  const updateInitialTableFilters = () => {
    const uRLSearchParams = new URLSearchParams(location.search)

    const transactionsFilters = uRLSearchParams.getAll(
      TRANSACTIONS_FILTERS_URL_QUERY_NAME
    )
    const transactionsFiltersStringified = stringifyArray(transactionsFilters)
    const transactionsGlobalFilter = uRLSearchParams.get(
      TRANSACTIONS_GLOBAL_FILTER_URL_QUERY_NAME
    )

    const balancesFilters = uRLSearchParams.getAll(
      BALANCES_FILTERS_URL_QUERY_NAME
    )
    const balancesFiltersStringified = stringifyArray(balancesFilters)
    const balancesGlobalFilter = uRLSearchParams.get(
      BALANCES_GLOBAL_FILTER_URL_QUERY_NAME
    )

    setTransactionsFiltersInitState({
      filters: transactionsFiltersStringified,
      globalFilter: transactionsGlobalFilter,
    })
    setBalancesFiltersInitState({
      filters: balancesFiltersStringified,
      globalFilter: balancesGlobalFilter,
    })
  }

  useEffect(() => {
    updateProps()
    updateInitialTableFilters()
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

  const handleTableStateChange =
    (filtersQueryName: string, globalFilterQueryName: string) =>
    (tableState: any) => {
      const { filters, globalFilter } = tableState
      const queryParams = new URLSearchParams(location.search)

      // delete old filter queries first
      queryParams.delete(filtersQueryName)
      queryParams.delete(globalFilterQueryName)

      filters.forEach((filter: object) =>
        queryParams.append(filtersQueryName, JSON.stringify(filter))
      )

      if (globalFilter) {
        queryParams.append(globalFilterQueryName, globalFilter)
      }

      // add new filter queries to the url
      updateUrlQueries(history, location.pathname, queryParams.toString())
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
            filters: transactionsFiltersInitState?.filters,
            globalFilter: transactionsFiltersInitState?.globalFilter || '',
          }}
          onStateChangeCallback={handleTableStateChange(
            TRANSACTIONS_FILTERS_URL_QUERY_NAME,
            TRANSACTIONS_GLOBAL_FILTER_URL_QUERY_NAME
          )}
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
            filters: balancesFiltersInitState?.filters,
            globalFilter: balancesFiltersInitState?.globalFilter || '',
          }}
          onStateChangeCallback={handleTableStateChange(
            BALANCES_FILTERS_URL_QUERY_NAME,
            BALANCES_GLOBAL_FILTER_URL_QUERY_NAME
          )}
        />
      </div>
    </div>
  )
}
