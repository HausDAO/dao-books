import { ApolloQueryResult } from '@apollo/client'
import { useState, useEffect } from 'react'

import fetchGraph from '@/utils/fetchGraph'

const useOnchainData = <T, V>(
  network: string,
  query: string,
  variables?: V
): {
  data: ApolloQueryResult<T> | undefined
  loading: boolean
  error: Error | undefined
} => {
  const [data, setData] = useState<ApolloQueryResult<T>>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const fetchGraphData = async () => {
      setLoading(true)
      try {
        const graphResult = await fetchGraph<T, V>(network, query, variables)
        setData(graphResult)
      } catch (error: any) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchGraphData()
  }, [network, query])

  return {
    data,
    loading,
    error,
  }
}

export default useOnchainData
