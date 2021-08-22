import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const SUBGRAPH_MAP = {
  xdai: 'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-xdai',
}

const fetchGraph = async (network: string, query: string): any => {
  const client = new ApolloClient({
    uri: SUBGRAPH_MAP[network],
    cache: new InMemoryCache(),
  })

  return client.query({
    query: gql(query),
  })
}

export default fetchGraph
