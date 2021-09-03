import type { AppProps, AppContext } from 'next/app'
import App from 'next/app'

import '../styles/globals.css'

import '@fontsource/mulish/200.css'
import '@fontsource/mulish/300.css'
import '@fontsource/mulish/400.css'
import '@fontsource/mulish/500.css'
import '@fontsource/mulish/600.css'
import '@fontsource/mulish/700.css'
import '@fontsource/mulish/800.css'
import '@fontsource/mulish/900.css'

import fetch from '../utils/fetchJson'
import { SWRConfig } from 'swr'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../utils/theme'
import ProgressBar from '@badrap/bar-of-progress'
import Router from 'next/router'

const progress = new ProgressBar({
  size: 4,
  color: '#1a84dd',
  className: 'bar-of-progress',
  delay: 100,
})

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function MyApp({ Component, pageProps }: AppProps) {
  // TODO: add applayout later (header and footer)

  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }}
    >
      <ChakraProvider theme={theme}>
        <div className="bg-primary-500 text-white">
          <div className="p-4">
            <img
              src="https://daohaus.club/img/logo.png"
              alt="daohaus logo"
              width="134px"
              height="32px"
            />
          </div>
          <div>
            <Component {...pageProps} />
          </div>
        </div>
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
