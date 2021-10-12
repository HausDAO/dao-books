import { Image } from '@chakra-ui/image'
import { Box, Flex, Heading } from '@chakra-ui/layout'
import { Link } from 'react-router-dom'
import { SWRConfig } from 'swr'

import Routes from './Routes'
import logo from './assets/img/logo.png'
function App() {
  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }}
    >
      <Flex direction="column" bg="brand.darkBlue2" height="full">
        <Box
          width="full"
          zIndex="10"
          position="fixed"
          bg="brand.darkBlue2"
          borderBottom="1px solid"
          borderColor="#373B49"
        >
          <Box py="4" pr="4" pl="9">
            <Link to="/">
              <Flex alignItems="center">
                <Image src={logo} mr="5" alt="Books" width={12} height={12} />
                <Heading variant="h1">DAO Books</Heading>
              </Flex>
            </Link>
          </Box>
        </Box>
        <Box sx={{ minHeight: '100vh' }} flex="1" overflowY="auto">
          <Flex direction="column" mt="28" px="9">
            <Routes />
          </Flex>
        </Box>
      </Flex>
    </SWRConfig>
  )
}

export default App
