import { DaoMetadata } from '@/hooks/useDaoMetadata/types'
import fetchJson from '@/utils/fetchJson'
import { DAO_HAUS_API_URL } from '@/utils/web3/constants'

export const getDAOMetadata = async (
  daoAddress: string
): Promise<DaoMetadata> => {
  const data = await fetchJson<DaoMetadata[]>(
    `${DAO_HAUS_API_URL}/${daoAddress}`
  )

  if (data !== undefined && data.length === 0) {
    throw new Error('DAO not found')
  }

  return data[0]
}
