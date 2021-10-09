// Uncomment below if you need runtime vars. Do not remove the example until there it at least one variable configured for each
// import getConfig from 'next/config'
// const { publicRuntimeConfig = {}, serverRuntimeConfig = {} } = getConfig()

// export const PUBLIC_VAR = publicRuntimeConfig.PUBLIC_VAR
// export const SERVER_VAR = serverRuntimeConfig.SERVER_VAR

export const DAO_HAUS_API_URL = 'https://data.daohaus.club/dao'

export const CHAIN_IDS: { [network: string]: string } = {
  xdai: '0x64',
  matic: '0x89',
  mainnet: '0x1',
}

export const EXPLORER_MAP: { [network: string]: string } = {
  xdai: 'https://blockscout.com/xdai/mainnet',
  matic: 'https://polygonscan.com',
  mainnet: 'https://etherscan.io',
}
