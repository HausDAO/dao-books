import fetchJson from '@/utils/fetchJson'
import { useState, useCallback } from 'react'

type DaoMetadata = {
  data: any
  fetch: () => void
  loading: boolean
  errors: any
}

/**
 * Managing DAO metadata interaction abstracting state managment
 */
const useDatoMetadata = (
  daoAddress: string | string[] | undefined
): DaoMetadata => {
  const baseUrl = 'https://data.daohaus.club/dao'
  const api = useCallback(
    () => fetchJson(`${baseUrl}/${daoAddress}`),
    [baseUrl, daoAddress]
  )

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})

  const fetch = () => {
    setLoading(true)
    api()
      .then((data) => setData(data[0]))
      .catch((body) => setErrors(body))
      .finally(() => setLoading(false))
  }

  return {
    data,
    fetch: useCallback(fetch, [api]),
    loading,
    errors,
  }
}

export default useDatoMetadata
