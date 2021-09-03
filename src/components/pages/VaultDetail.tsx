import { Button } from '@chakra-ui/react'
import moment from 'moment'
import { InferGetServerSidePropsType } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { Cell, Column } from 'react-table'
import { getServerSideProps } from '../../pages/dao/[id]/treasury'
import { TokenBalance } from '../../types/DAO'
import { formatNumber } from '../../utils/methods'
import { BalanceCard } from '../BalanceCard'
import { MultiLineCell, SelectColumnFilter } from '../table'

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
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  const transactionsColumns = useMemo(() => TRANSACTIONS_COLUMNS, [])
  const tokenBalancesColumns = useMemo(() => TOKEN_BALANCES_COLUMNS, [])
  const router = useRouter()

  const handleGoToHome = () => {
    router.replace('/')
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
          {daoMetadata.name} - {vaultName}
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
        data={transactions || []}
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
    Cell: ({ value, row }: Cell<VaultTransaction>): JSX.Element => {
      const date = moment.unix(value).format('DD-MMM-YYYY HH:mm:ss')
      const txExplorerLink = row.original.txExplorerLink
      return (
        <div className="flex flex-col space-y-2">
          <div className="text-gray-900">{date}</div>
          <Link href={txExplorerLink}>
            <a
              className="text-xs text-primary-500 flex items-center"
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
    filter: 'includes',
    Cell: ({ value, row }: Cell<TokenBalanceLineItem>) => {
      const tokenExplorerLink = row.original.tokenExplorerLink
      return (
        <div className="flex flex-col space-y-2">
          <div className="text-gray-900">{value}</div>
          <Link href={tokenExplorerLink}>
            <a
              className="text-xs text-primary-500 flex items-center"
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
