import { CHAIN_IDS } from './constants'

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
  return `https://app.daohaus.club/dao/${CHAIN_IDS[network]}/${daoAddress}/proposals/${proposalId}`
}
