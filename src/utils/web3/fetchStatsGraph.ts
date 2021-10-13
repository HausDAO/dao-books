import {
  ApolloClient,
  InMemoryCache,
  gql,
  ApolloQueryResult,
} from '@apollo/client'

const SUBGRAPH_MAP: { [network: string]: string } = {
  xdai: 'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-xdai',
  matic:
    'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-matic',
  mainnet:
    'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats',
}

const fetchStatsGraph = async <T, V>(
  network: string,
  query: string,
  variables?: V
): Promise<ApolloQueryResult<T>> => {
  const client = new ApolloClient({
    uri: SUBGRAPH_MAP[network],
    cache: new InMemoryCache(),
  })

  return client.query<T, V>({
    query: gql(query),
    variables,
  })
}

export default fetchStatsGraph
