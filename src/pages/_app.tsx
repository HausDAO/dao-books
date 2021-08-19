import type { AppProps, AppContext } from 'next/app'
import App from 'next/app'

import fetch from '../utils/fetchJson'
import { SWRConfig } from 'swr'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../utils/theme'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }}
    >
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SWRConfig>
  )
}

/**
 * DO NOT REMOVE THIS
 * We use runtime variables and to use that we need to disable Automatic Static Optimisation
 * https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
 */
MyApp.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext)

  return { ...appProps }
}

export default MyApp
