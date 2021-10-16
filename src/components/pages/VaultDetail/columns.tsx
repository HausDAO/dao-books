import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'
import { Cell, Column } from 'react-table'

import { TokenBalance } from '../../../types/DAO'
import {
  AddressCell,
  MultiLineCell,
  SelectColumnFilter,
  TokenCell,
  WithExternalLinkCell,
} from '../../table'
import { DateRangeFilter, filterByDate } from '../../table/DateRangeFilter'

export type VaultTransaction = {
  date: string | Date
  txExplorerLink: string
  type: string
  tokenSymbol: string
  tokenDecimals: string
  tokenAddress: string
  in: BigNumber
  out: BigNumber
  counterparty: string // receiver/sender to minion vault or sender to treasury
  proposal?: {
    id: string
    link: string
    shares: string // requested in case of proposal, ragequitted in case of rage quit
    loot: string // requested in case of proposal, ragequitted in case of rage quit
    title: string // title of the proposal in details
    applicant: string // submitted by address
  }
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

export const TOKEN_BALANCES_COLUMNS: Column<TokenBalanceLineItem>[] = [
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
        <WithExternalLinkCell
          label={value}
          link={tokenExplorerLink}
          linkLabel="View Contract"
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

export const MINION_COLUMNS: Column<VaultTransaction>[] = [
  {
    Header: 'Counter Party',
    Footer: 'Counter Party',
    accessor: 'counterparty',
    Cell: ({ value, row }: Cell<VaultTransaction>): JSX.Element => (
      <AddressCell address={value} />
    ),
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
]

export const TREASURY_COLUMNS: Column<VaultTransaction>[] = [
  {
    Header: 'Shares',
    Footer: 'Shares',
    // @ts-ignore
    accessor: 'proposal.shares',
  },
  {
    Header: 'Loot',
    Footer: 'Loot',
    // @ts-ignore
    accessor: 'proposal.loot',
  },
  {
    Header: 'Applicant',
    Footer: 'Applicant',
    // @ts-ignore
    accessor: 'proposal.applicant',
    Cell: ({ value, row }: Cell<VaultTransaction>): JSX.Element => (
      <AddressCell address={value} />
    ),
  },
  {
    Header: 'Title',
    Footer: 'Title',
    // @ts-ignore
    accessor: 'proposal.title',
    Cell: ({ value, row }: Cell<VaultTransaction>): JSX.Element => {
      const title = value
      const shares = Number(row.original.proposal?.shares ?? '')
      console.log('shares', shares)
      return (
        <MultiLineCell
          title={title}
          description={`${shares ? `Shares: ${shares}` : ''}`}
        />
      )
    },
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
]

export const TRANSACTIONS_COLUMNS: Column<VaultTransaction>[] = [
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
        <div className="w-40">
          <WithExternalLinkCell
            label={date}
            link={txExplorerLink}
            linkLabel="View Tx"
          />
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
    Cell: ({ value, row }: Cell<VaultTransaction>): JSX.Element => {
      const proposalLink = row.original.proposal?.link
      return (
        <div className="w-40">
          <WithExternalLinkCell
            label={value}
            link={proposalLink ?? ''}
            linkLabel="View Proposal"
          />
        </div>
      )
    },
  },
]
