import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

import { ColorModeScript } from '@chakra-ui/react'
import { GA_TRACKING_ID } from '../utils/gtags'

export default class Document extends NextDocument {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
