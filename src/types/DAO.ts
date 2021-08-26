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

export type MinionWithTokenBalances = Minion & {
  tokenBalances: TokenBalance[]
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
  amount: number
  payment: boolean
  tribute: boolean
  currentShares: number
  currentLoot: number
  action: string
}
