export type Token = {
  address: string
  decimals: string
  symbol: string
}

export type TokenBalance = {
  token: Token
  balance: number
}

export type Moloch = {
  id: string
  version: string
  summoner: string
  newContract: string
}
