import { Button } from '@chakra-ui/react'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Cell, Column } from 'react-table'
import { getServerSideProps } from '../../pages/dao/[id]/treasury'
import { formatDate, formatNumber } from '../../utils/methods'
import dynamic from 'next/dynamic'

import { MultiLineCell, SelectColumnFilter } from '../table'
import moment from 'moment'
import { TokenBalance } from '../../types/DAO'
import { BalanceCard } from '../BalanceCard'
// Making this client side because chart.js cannot render on server side
const Table = dynamic(() => import('@/components/table/Table'), {
  ssr: false,
})
export const Treasury = ({
  daoMetadata,
  treasuryTransactions,
  tokenBalances,
  combinedFlows,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  const transactionsColumns = useMemo(() => TRANSACTIONS_COLUMNS, [])
  const tokenBalancesColumns = useMemo(() => TOKEN_BALANCES_COLUMNS, [])
  const router = useRouter()

  const handleGoToHome = () => {
    router.replace('/')
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-2">
        <p className="text-xl">{error.message}</p>
        <Button onClick={handleGoToHome}>Go to Home</Button>
      </div>
    )
  }

  if (!daoMetadata) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-2">
        <p className="text-xl">Something went wrong</p>
        <Button onClick={handleGoToHome}>Go to Home</Button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      <div>
        <h1 className="font-semibold text-3xl inline mr-3">
          {daoMetadata.name} - DAO Treasury
        </h1>
      </div>
      <div className="space-x-2">
        <BalanceCard title="Inflow" balance={combinedFlows?.inflow} />
        <BalanceCard title="Outflow" balance={combinedFlows?.outflow} />
        <BalanceCard title="Closing" balance={combinedFlows?.closing} />
      </div>

      <h2 className="text-2xl">Transactions</h2>
      <Table
        // @ts-ignore - dont know why it doesnt work when using with dynamic import
        columns={transactionsColumns}
        data={treasuryTransactions || []}
        initialState={{
          pageSize: 20,
        }}
      />

      <h2 className="text-2xl">Token Balances</h2>
      <Table
        // @ts-ignore - dont know why it doesnt work when using with dynamic import
        columns={tokenBalancesColumns}
        data={tokenBalances || []}
        initialState={{
          pageSize: 20,
        }}
      />
    </div>
  )
}

export type TreasuryTransaction = {
  date: string | Date
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

const TRANSACTIONS_COLUMNS: Column<TreasuryTransaction>[] = [
  {
    Header: 'Date',
    Footer: 'Date',
    accessor: 'date',
    Cell: ({ value }: Cell<TreasuryTransaction>): JSX.Element => {
      const date = moment.unix(value)
      return (
        <MultiLineCell
          title={formatDate(date)}
          description={date.format('HH:mm')}
        />
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
    Cell: ({ row }: Cell<TreasuryTransaction>) => {
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
    Cell: ({ row }: Cell<TreasuryTransaction>) => {
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
    filter: 'includes',
    Cell: ({ value, row }: Cell<TokenBalanceLineItem>) => {
      return (
        <MultiLineCell
          description={row.original.token.tokenAddress}
          title={value}
        />
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
