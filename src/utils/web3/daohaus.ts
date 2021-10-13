import { CHAIN_IDS, DAO_HAUS_HOST } from './constants'

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
  return `${DAO_HAUS_HOST}/dao/${CHAIN_IDS[network]}/${daoAddress}`
}

export const getProposalLink = ({
  network,
  daoAddress,
  proposalId,
}: {
  network: string
  daoAddress: string
  proposalId?: string
}): string => {
  if (!proposalId) {
    return ''
  }
  return `${DAO_HAUS_HOST}/dao/${CHAIN_IDS[network]}/${daoAddress}/proposals/${proposalId}`
}
