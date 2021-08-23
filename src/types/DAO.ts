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
