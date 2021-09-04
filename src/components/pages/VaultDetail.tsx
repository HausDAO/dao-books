import moment from 'moment'
import { InferGetServerSidePropsType } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useMemo } from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { Cell, Column } from 'react-table'
import { getServerSideProps } from '../../pages/dao/[id]/treasury'
import { TokenBalance } from '../../types/DAO'
import { formatNumber } from '../../utils/methods'
import { BalanceCard } from '../BalanceCard'
import { MultiLineCell, SelectColumnFilter } from '../table'
import { Error } from '@/components/Error'
import { H1, H2 } from '@/components/atoms'
import { DateRangeFilter, filterByDate } from '../table/DateRangeFilter'
// Making this client side because chart.js cannot render on server side
const Table = dynamic(() => import('@/components/table/Table'), {
  ssr: false,
})
export const VaultDetail = ({
  daoMetadata,
  transactions,
  tokenBalances,
  combinedFlows,
  vaultName,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  const transactionsColumns = useMemo(() => TRANSACTIONS_COLUMNS, [])
  const tokenBalancesColumns = useMemo(() => TOKEN_BALANCES_COLUMNS, [])
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
        <BalanceCard title="Inflow" balance={combinedFlows?.inflow} />
        <BalanceCard title="Outflow" balance={combinedFlows?.outflow} />
        <BalanceCard title="Closing" balance={combinedFlows?.closing} />
      </div>

      <div className="space-y-2">
        <H2>Transactions</H2>
        <Table
          // @ts-ignore - dont know why it doesnt work when using with dynamic import
          columns={transactionsColumns}
          data={transactions || []}
          initialState={{
            pageSize: 20,
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

export type VaultTransaction = {
  date: string | Date
  txExplorerLink: string
  type: string
  tokenSymbol: string
  tokenDecimals: string
  tokenAddress: string
  in: number
  usdIn: number
  out: number
  usdOut: number
}

export type TokenBalanceLineItem = TokenBalance & {
  tokenExplorerLink: string
  inflow: {
    tokenValue: number
    usdValue: number
  }
  outflow: {
    tokenValue: number
    usdValue: number
  }
  closing: {
    tokenValue: number
    usdValue: number
  }
}

const TRANSACTIONS_COLUMNS: Column<VaultTransaction>[] = [
  {
    Header: 'Date',
    Footer: 'Date',
    accessor: 'date',
    Filter: DateRangeFilter,
    filter: filterByDate,
    Cell: ({ value, row }: Cell<VaultTransaction>): JSX.Element => {
      const date = moment.unix(value).format('DD-MMM-YYYY HH:mm:ss')
      const txExplorerLink = row.original.txExplorerLink
      return (
        <div className="flex rounded-md shadow flex-col p-4 w-80 space-y-2">
          <div>{date}</div>
          <Link href={txExplorerLink}>
            <a
              className="text-xs hover:underline flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Tx
              <HiOutlineExternalLink className="inline ml-1" />
            </a>
          </Link>
        </div>
      )
    },
  },

  {
    Header: 'Type',
    Footer: 'Type',
    accessor: 'type',
    Filter: SelectColumnFilter,
    filter: 'includes',
  },
  {
    Header: 'Token',
    Footer: 'Token',
    accessor: 'tokenSymbol',
    Filter: SelectColumnFilter,
    filter: 'includes',
  },
  {
    Header: 'In',
    Footer: 'In',
    accessor: 'in',
    Cell: ({ row }: Cell<VaultTransaction>) => {
      if (row.original.out > row.original.in) {
        return null
      }
      const inValue = formatNumber(row.original.in)
      const usdValue = formatNumber(row.original.usdIn)
      return (
        <MultiLineCell description={`$ ${usdValue}`} title={String(inValue)} />
      )
    },
  },
  {
    Header: 'Out',
    Footer: 'Out',
    accessor: 'out',
    Cell: ({ row }: Cell<VaultTransaction>) => {
      if (row.original.in > row.original.out) {
        return null
      }
      const outValue = formatNumber(row.original.out)
      const usdValue = formatNumber(row.original.usdOut)
      return (
        <MultiLineCell description={`$ ${usdValue}`} title={String(outValue)} />
      )
    },
  },
]

const TOKEN_BALANCES_COLUMNS: Column<TokenBalanceLineItem>[] = [
  {
    Header: 'Token',
    Footer: 'Token',
    // @ts-ignore this is fine
    accessor: 'token.symbol',
    Filter: SelectColumnFilter,
    width: 500,
    filter: 'includes',
    Cell: ({ value, row }: Cell<TokenBalanceLineItem>) => {
      const tokenExplorerLink = row.original.tokenExplorerLink
      return (
        <div className="flex flex-col space-y-2 p-4">
          <div>{value}</div>
          <Link href={tokenExplorerLink}>
            <a
              className="text-xs hover:underline flex items-center min-w-max"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Contract
              <HiOutlineExternalLink className="inline ml-1" />
            </a>
          </Link>
        </div>
      )
    },
  },
  {
    Header: 'Inflow',
    Footer: 'Inflow',
    // @ts-ignore this is fine
    accessor: 'inflow.tokenValue',
    Cell: ({ row }: Cell<TokenBalanceLineItem>) => {
      const tokenValue = formatNumber(row.original.inflow.tokenValue)
      const usdValue = formatNumber(row.original.inflow.usdValue)
      return (
        <MultiLineCell
          description={`$ ${usdValue}`}
          title={String(tokenValue)}
        />
      )
    },
  },
  {
    Header: 'Outflow',
    Footer: 'Outflow',
    // @ts-ignore this is fine
    accessor: 'outflow.tokenValue',
    Cell: ({ row }: Cell<TokenBalanceLineItem>) => {
      const tokenValue = formatNumber(row.original.outflow.tokenValue)
      const usdValue = formatNumber(row.original.outflow.usdValue)
      return (
        <MultiLineCell
          description={`$ ${usdValue}`}
          title={String(tokenValue)}
        />
      )
    },
  },

  {
    Header: 'Balance',
    Footer: 'Balance',
    // @ts-ignore this is fine
    accessor: 'closing.tokenValue',
    Cell: ({ row }: Cell<TokenBalanceLineItem>) => {
      const tokenValue = formatNumber(row.original.closing.tokenValue)
      const usdValue = formatNumber(row.original.closing.usdValue)
      return (
        <MultiLineCell
          description={`$ ${usdValue}`}
          title={String(tokenValue)}
        />
      )
    },
  },
]
