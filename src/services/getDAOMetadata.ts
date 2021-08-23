import { DaoMetadata } from '../hooks/useDaoMetadata/types'
import { DAO_HAUS_API_URL } from '../utils/constants'
import fetchJson from '../utils/fetchJson'

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
