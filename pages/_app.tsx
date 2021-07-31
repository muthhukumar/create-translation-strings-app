import '@fontsource/roboto-mono/400.css'
import '@fontsource/open-sans/700.css'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { ChakraProvider } from '@chakra-ui/react'
import { DefaultSeo } from 'next-seo'

import * as gtag from '../utils/gtags'
import SEO from '../next-seo.config'
import theme from '../config/theme'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <ChakraProvider resetCSS theme={theme}>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
