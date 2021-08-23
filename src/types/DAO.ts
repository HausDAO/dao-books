export type Token = {
  address: string
  decimals: string
  symbol: string
}

export type TokenBalance = {
  token: Token
  balance: number
}
