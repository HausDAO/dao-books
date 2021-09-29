import { ChakraProvider } from '@chakra-ui/react'
import { HashRouter as Router } from 'react-router-dom'
import { SWRConfig } from 'swr'

import Routes from './Routes'
import { theme } from './utils/theme'

function App() {
  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }}
    >
      <ChakraProvider theme={theme}>
        <div className="flex flex-col h-full bg-primary-500 text-white">
          <div className="bg-primary-700 w-full z-10 fixed">
            <div className="p-4">
              <a href="/">
                <img
                  src="https://daohaus.club/img/logo.png"
                  alt="daohaus logo"
                  width="134px"
                  height="32px"
                />
              </a>
            </div>
          </div>
          <div className="min-h-screen flex-1 overflow-y-auto">
            <div className="mt-20 flex flex-col xl:max-w-7xl lg:max-w-5xl md:max-w-4xl m-auto">
              <Router>
                <Routes />
              </Router>
            </div>
          </div>
        </div>
      </ChakraProvider>
    </SWRConfig>
  )
}

export default App
