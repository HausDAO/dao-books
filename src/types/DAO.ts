export type Token = {
  tokenAddress: string
  decimals: string
  symbol: string
}

export type TokenBalance = {
  token: Token
  tokenBalance: string
}

export type Minion = {
  minionAddress: string
  name: string
}

export type MinionTransaction = {
  value: string
  tokenDecimals: string
  tokenAddress: string
  tokenSymbol: string
  timestamp: string
  deposit: boolean
  transactionHash: string
  from: string
  to: string
}

export type MinionWithTokenBalances = Minion & {
  tokenBalances: TokenBalance[]
  transactions: MinionTransaction[]
}

export type Moloch = {
  id: string
  minions: Minion[]
  tokenBalances: TokenBalance[]
}

export type MolochStatsBalance = {
  id: string
  timestamp: string
  balance: string
  tokenSymbol: string
  tokenAddress: string
  tokenDecimals: string
  transactionHash: string
  amount: string
  payment: boolean
  tribute: boolean
  counterpartyAddress: string
  action: string
  proposalDetail: {
    proposalId: string
    applicant: string
    details: string | null
  } | null
}

export type CachedMinion = {
  address: string
  name: string
  erc20s: {
    tokenBalance: string
    tokenAddress: string
    decimals: string
    symbol: string
  }[]
  balanceHistory: MinionTransaction[]
}
