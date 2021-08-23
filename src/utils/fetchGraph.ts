import {
  ApolloClient,
  InMemoryCache,
  gql,
  ApolloQueryResult,
} from '@apollo/client'

const SUBGRAPH_MAP: { [network: string]: string } = {
  xdai: 'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-xdai',
}

const fetchGraph = async <T, V>(
  network: string,
  query: string
): Promise<ApolloQueryResult<T>> => {
  const client = new ApolloClient({
    uri: SUBGRAPH_MAP[network],
    cache: new InMemoryCache(),
  })

  return client.query<T, V>({
    query: gql(query),
  })
}

export default fetchGraph
