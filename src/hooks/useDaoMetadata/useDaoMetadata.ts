import useSWR from 'swr'

import { DaoMetadata } from './types'

import { DAO_HAUS_API_URL } from '@/utils/web3/constants'

type DaoMetadataReturnType = {
  data?: DaoMetadata
  error?: Error
  loading: boolean
}

/**
 * Managing DAO metadata interaction abstracting state management
 */
const useDaoMetadata = (daoAddress: string): DaoMetadataReturnType => {
  const { data, error } = useSWR<DaoMetadata[]>(
    `${DAO_HAUS_API_URL}/${daoAddress}`,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )
  const loading = !data && !error

  if (data !== undefined && data.length === 0) {
    return {
      error: new Error('DAO not found'),
      loading: false,
    }
  }

  // TODO: Maybe we throw an error if there is more than 1 DaoMetadata in the list.

  return {
    data: data?.[0], // assuming there will always be 1 DaoMetadata in data.
    error,
    loading,
  }
}

export { useDaoMetadata }
