import { BigNumber } from '@ethersproject/bignumber'

export type CalculatedTokenBalances = {
  [tokenAddress: string]: {
    in: BigNumber
    out: BigNumber
    balance: BigNumber
  }
}
export default class CalculateTokenBalances {
  calculatedTokenBalances: CalculatedTokenBalances

  constructor() {
    this.calculatedTokenBalances = {}
  }

  getBalance(tokenAddress: string) {
    this.initTokenBalance(tokenAddress)
    return this.calculatedTokenBalances[tokenAddress].balance
  }

  initTokenBalance(tokenAddress: string) {
    if (!(tokenAddress in this.calculatedTokenBalances)) {
      this.calculatedTokenBalances[tokenAddress] = {
        out: BigNumber.from(0),
        in: BigNumber.from(0),
        balance: BigNumber.from(0),
      }
    }
  }

  incrementInflow(tokenAddress: string, inValue: BigNumber) {
    this.initTokenBalance(tokenAddress)
    const tokenStats = this.calculatedTokenBalances[tokenAddress]
    this.calculatedTokenBalances[tokenAddress] = {
      ...tokenStats,
      in: tokenStats.in.add(inValue),
      balance: tokenStats.balance.add(inValue),
    }
  }

  incrementOutflow(tokenAddress: string, outValue: BigNumber) {
    this.initTokenBalance(tokenAddress)
    const tokenStats = this.calculatedTokenBalances[tokenAddress]
    this.calculatedTokenBalances[tokenAddress] = {
      ...tokenStats,
      out: tokenStats.out.add(outValue),
      balance: tokenStats.balance.sub(outValue),
    }
  }

  getBalances() {
    return this.calculatedTokenBalances
  }
}
