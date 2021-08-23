import { useState, useEffect } from 'react'
import fetchGraph from '@/utils/fetchGraph'
import { ApolloQueryResult } from '@apollo/client'

const useOnchainData = <T, V>(
  network: string,
  query: string
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
        const graphResult = await fetchGraph<T, V>(network, query)
        setData(graphResult)
      } catch (error) {
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
