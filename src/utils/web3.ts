import { CHAIN_IDS } from './constants'

export const getImageFromIPFSHash = (hash?: string) => {
  if (!hash) {
    return ''
  }
  return 'https://ipfs.io/ipfs/' + hash
}

export const getDAOLink = ({
  network,
  daoAddress,
}: {
  network: string
  daoAddress: string
}): string => {
  if (!daoAddress) {
    return ''
  }
  return `https://app.daohaus.club/dao/${CHAIN_IDS[network]}/${daoAddress}`
}
