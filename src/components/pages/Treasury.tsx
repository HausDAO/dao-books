import { Button } from '@chakra-ui/react'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Cell, Column } from 'react-table'
import { getServerSideProps } from '../../pages/dao/[id]/treasury'
import { formatDate } from '../../utils/methods'
import dynamic from 'next/dynamic'

import { MultiLineCell, SelectColumnFilter } from '../table'
import moment from 'moment'
import { TokenBalance } from '../../types/DAO'
// Making this client side because chart.js cannot render on server side
const Table = dynamic(() => import('@/components/table/Table'), {
  ssr: false,
})
export const Treasury = ({
  daoMetadata,
  treasuryTransactions,
  tokenBalances,
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
  tokenValue: number
  usdValue: number
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
      const inValue = Math.round(row.original.in)
      const usdValue = Math.round(row.original.usdIn)
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
      const outValue = Math.round(row.original.out)
      const usdValue = Math.round(row.original.usdOut)
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
    Header: 'Balance',
    Footer: 'Balance',
    accessor: 'tokenBalance',
    Cell: ({ row }: Cell<TokenBalanceLineItem>) => {
      const tokenValue = Math.round(row.original.tokenValue)
      const usdValue = Math.round(row.original.usdValue)
      return (
        <MultiLineCell
          description={`$ ${usdValue}`}
          title={String(tokenValue)}
        />
      )
    },
  },
]
