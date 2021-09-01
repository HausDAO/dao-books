const EXPLORER_MAP: { [network: string]: string } = {
  xdai: 'https://blockscout.com/xdai/mainnet',
  matic: 'https://polygonscan.com',
  mainnet: 'https://etherscan.io',
}

export const getTokenExplorer = (network: string, address: string): string => {
  return `${EXPLORER_MAP[network] || 'https://etherscan.io'}/address/${address}`
}

export const getTxExplorer = (network: string, address: string): string => {
  return `${EXPLORER_MAP[network] || 'https://etherscan.io'}/tx/${address}`
}
