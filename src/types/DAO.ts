export type Token = {
  tokenAddress: string
  decimals: string
  symbol: string
}

export type TokenBalance = {
  token: Token
  tokenBalance: number
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
  balance: number
  tokenSymbol: string
  tokenAddress: string
  tokenDecimals: string
  transactionHash: string
  amount: number
  payment: boolean
  tribute: boolean
  currentShares: number
  currentLoot: number
  action: string
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
