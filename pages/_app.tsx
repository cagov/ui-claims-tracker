import '../styles/globals.scss'
import { AppProps } from 'next/app'
import { ReactElement } from 'react'
import { appWithTranslation } from 'next-i18next'

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return <Component {...pageProps} />
}

export default appWithTranslation(MyApp)
