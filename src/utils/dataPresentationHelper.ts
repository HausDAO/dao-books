const EXPLORER_MAP: { [network: string]: string } = {
  xdai: 'https://blockscout.com/xdai/mainnet',
  matic: 'https://polygonscan.com',
  mainnet: 'https://etherscan.io',
}

export const getTokenExplorerLink = (
  network: string,
  address: string
): string => {
  return `${EXPLORER_MAP[network] || 'https://etherscan.io'}/address/${address}`
}

export const getTxExplorerLink = (network: string, address: string): string => {
  return `${EXPLORER_MAP[network] || 'https://etherscan.io'}/tx/${address}`
}

export function formatAddress(
  address: string | null | undefined,
  ensName: string | null | undefined,
  chars = 4
): string {
  if (ensName) return ensName
  else if (address)
    return `${address.substring(0, chars)}...${address.substring(
      address.length - chars
    )}`
  else return ''
}
