import { EXPLORER_MAP } from './constants'

export const getTokenExplorerLink = (
  network: string,
  address: string
): string => {
  return `${EXPLORER_MAP[network] || 'https://etherscan.io'}/address/${address}`
}

export const getTxExplorerLink = (network: string, address: string): string => {
  return `${EXPLORER_MAP[network] || 'https://etherscan.io'}/tx/${address}`
}
