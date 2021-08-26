import { GetServerSidePropsContext } from 'next'
import { Vaults } from '@/components/pages'
import { getDAOMetadata } from '@/services/getDAOMetadata'
import { getMinions } from '@/services/getMinions'
import { Moloch } from '@/types/DAO'
import fetchGraph from '@/utils/fetchGraph'

export default Vaults

const QUERY = `
query moloch($contractAddr: String!) {
  moloch(id: $contractAddr) {
    id
    minions {
      minionAddress
    }
    tokenBalances(where: {guildBank: true}) {
      token {
        tokenAddress
        symbol
        decimals
      }
      tokenBalance
    }
  }
}
`

type MolochData = {
  moloch: Moloch
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id: daoAddress } = context.query

  try {
    const daoMeta = await getDAOMetadata(daoAddress as string)

    const moloch = await fetchGraph<MolochData, { contractAddr: string }>(
      daoMeta.network,
      QUERY,
      {
        contractAddr: daoMeta.contractAddress,
      }
    )

    const minions = await getMinions(
      moloch.data.moloch.minions.map((m) => m.minionAddress),
      daoMeta.network
    )

    return {
      props: {
        daoMetadata: daoMeta,
        moloch: moloch.data.moloch,
        minions,
      },
    }
  } catch (error) {
    return {
      props: {
        error,
      },
    }
  }
}
