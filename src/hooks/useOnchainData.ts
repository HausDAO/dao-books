import { useState, useEffect } from 'react'
import fetchGraph from '@/utils/fetchGraph'

const useOnchainData = (network: string, query: string): any => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGraphData = async () => {
      setLoading(true)
      const graphResult = await fetchGraph(network, query)
        .then((data: any) => data)
        .catch((err: any) => {
          throw err
        })
        .finally(() => setLoading(false))

      setData(graphResult)
    }

    fetchGraphData()
  }, [network, query])

  return {
    data,
    loading,
  }
}

export default useOnchainData
