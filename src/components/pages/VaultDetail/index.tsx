import { useClipboard } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { useParams } from 'react-router'
import { Cell, Column } from 'react-table'

import { TokenBalance } from '../../../types/DAO'
import { BalanceCard } from '../../BalanceCard'
import { SelectColumnFilter } from '../../table'
import { DateRangeFilter, filterByDate } from '../../table/DateRangeFilter'
import Table from '../../table/Table'
import { getMinionDetailProps } from './getMinionDetailProps'
import { getTreasuryDetailProps } from './getTreasuryDetailProps'
import TokenCell from './tokenCell'

import { Error } from '@/components/Error'
import { H1, H2, Button } from '@/components/atoms'
import { formatAddress } from '@/utils/dataPresentationHelper'
// Making this client side because chart.js cannot render on server side

export const VaultDetail = (): JSX.Element => {
  const transactionsColumns = useMemo(() => TRANSACTIONS_COLUMNS, [])
  const tokenBalancesColumns = useMemo(() => TOKEN_BALANCES_COLUMNS, [])
  const { daoAddress, minionAddress } =
    useParams<{ daoAddress: string; minionAddress?: string }>()

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

  const {
    daoMetadata,
    transactions,
    tokenBalances,
    combinedFlows,
    vaultName,
    error,
  } = props

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
  in: BigNumber
  out: BigNumber
  counterPartyAddress: string
}

export type TokenBalanceLineItem = TokenBalance & {
  tokenExplorerLink: string
  inflow: {
    tokenValue: BigNumber
  }
  outflow: {
    tokenValue: BigNumber
  }
  closing: {
    tokenValue: BigNumber
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
          <a
            href={txExplorerLink}
            className="text-xs hover:underline flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Tx
            <HiOutlineExternalLink className="inline ml-1" />
          </a>
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
      return (
        <TokenCell
          tokenBalance={{
            token: {
              decimals: row.original.tokenDecimals,
              symbol: row.original.tokenSymbol,
              tokenAddress: row.original.tokenAddress,
            },
            tokenBalance: row.original.in.toString(),
          }}
        />
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
      return (
        <TokenCell
          tokenBalance={{
            token: {
              decimals: row.original.tokenDecimals,
              symbol: row.original.tokenSymbol,
              tokenAddress: row.original.tokenAddress,
            },
            tokenBalance: row.original.out.toString(),
          }}
        />
      )
    },
  },
  {
    Header: 'Counter Party Address',
    Footer: 'Counter Party Address',
    accessor: 'counterPartyAddress',
    Cell: ({ value, row }: Cell<VaultTransaction>): JSX.Element => {
      const { hasCopied, onCopy } = useClipboard(value)
      const counterPartyShortAddress = formatAddress(value, null)

      return (
        <div className="flex rounded-md shadow flex-row  justify-between p-4 w-80 space-y-2">
          <div>{counterPartyShortAddress}</div>
          <Button onClick={onCopy} size="xs">
            {hasCopied ? 'Address Copied' : 'Copy Address'}
          </Button>
        </div>
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
          <a
            href={tokenExplorerLink}
            className="text-xs hover:underline flex items-center min-w-max"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Contract
            <HiOutlineExternalLink className="inline ml-1" />
          </a>
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
      return (
        <TokenCell
          tokenBalance={{
            token: row.original.token,
            tokenBalance: row.original.inflow.tokenValue.toString(),
          }}
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
      return (
        <TokenCell
          tokenBalance={{
            token: row.original.token,
            tokenBalance: row.original.outflow.tokenValue.toString(),
          }}
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
      return (
        <TokenCell
          tokenBalance={{
            token: row.original.token,
            tokenBalance: row.original.closing.tokenValue.toString(),
          }}
        />
      )
    },
  },
]
