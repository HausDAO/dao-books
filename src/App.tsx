import { Image } from '@chakra-ui/image'
import { Box, Flex, Heading, Text } from '@chakra-ui/layout'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { SWRConfig } from 'swr'

import Routes from './Routes'
import logo from './assets/img/logo.png'
import { useCustomTheme } from './contexts/CustomThemeContext'
import { getImageFromIPFSHash } from './utils/web3/ipfs'
function App() {
  const { theme } = useCustomTheme()
  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }}
    >
      <Helmet>
        <title>DAO Books</title>
        <meta
          name="description"
          content="Double entry style bookkeeping solution for moloch DAOs from https://daohaus.club/"
        />
      </Helmet>
      <Flex direction="column" bg="brand.darkBlue2" height="full">
        <Box
          width="full"
          zIndex="10"
          position="fixed"
          bg="brand.darkBlue2"
          borderBottom="1px solid"
          borderColor="#373B49"
        >
          <Flex py="4" pr="4" pl="9">
            <Link to="/">
              <Flex alignItems="center">
                <Image src={logo} mr="5" alt="Books" width={12} height={12} />
                <Heading fontFamily="Mulish" variant="h1">
                  DAO Books
                </Heading>
              </Flex>
            </Link>
            <Box position="relative" top="4" ml="4" color="#0E99C4">
              <Link to="/">
                <Text fontFamily="Mulish">SWITCH DAO</Text>
              </Link>
            </Box>
          </Flex>
        </Box>
        <Box sx={{ minHeight: '100vh' }} flex="1" overflowY="auto">
          <Flex direction="column" pt="20">
            <Box
              sx={{ minHeight: 'calc(100vh - 5rem)' }}
              bgImage={getImageFromIPFSHash(theme?.images?.bg)}
              backgroundSize="cover"
            >
              <Box
                sx={{ minHeight: 'calc(100vh - 5rem)' }}
                p="9"
                backdropFilter={
                  theme?.images?.bg &&
                  `brightness(${theme?.images?.bgOpacity?.toString()}%)`
                }
              >
                <Routes />
              </Box>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </SWRConfig>
  )
}

export default App
