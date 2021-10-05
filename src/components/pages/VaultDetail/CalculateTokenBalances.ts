import { BigNumber } from '@ethersproject/bignumber'

export type CalculatedTokenBalances = {
  [tokenAddress: string]: {
    in: BigNumber
    out: BigNumber
  }
}
export default class CalculateTokenBalances {
  calculatedTokenBalances: CalculatedTokenBalances

  constructor() {
    this.calculatedTokenBalances = {}
  }

  initTokenBalance(tokenAddress: string) {
    if (!(tokenAddress in this.calculatedTokenBalances)) {
      this.calculatedTokenBalances[tokenAddress] = {
        out: BigNumber.from(0),
        in: BigNumber.from(0),
      }
    }
  }

  incrementInflow(tokenAddress: string, inValue: BigNumber) {
    this.initTokenBalance(tokenAddress)

    const tokenStats = this.calculatedTokenBalances[tokenAddress]
    this.calculatedTokenBalances[tokenAddress] = {
      ...tokenStats,
      in: tokenStats.in.add(inValue),
    }
  }

  incrementOutflow(tokenAddress: string, outValue: BigNumber) {
    this.initTokenBalance(tokenAddress)

    const tokenStats = this.calculatedTokenBalances[tokenAddress]
    this.calculatedTokenBalances[tokenAddress] = {
      ...tokenStats,
      out: tokenStats.out.add(outValue),
    }
  }

  getBalances() {
    return this.calculatedTokenBalances
  }
}
