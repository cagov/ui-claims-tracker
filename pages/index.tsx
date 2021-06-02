import fs from 'fs'
import path from 'path'
import https from 'https'
import { promisify } from 'util'

import Head from 'next/head'
import Container from 'react-bootstrap/Container'
import pino from 'pino'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps } from 'next'
import pem, { Pkcs12ReadResult } from 'pem'
import fetch, { Response } from 'node-fetch'

import { Header } from '../components/Header'
import { Main } from '../components/Main'
import { Footer } from '../components/Footer'

export interface Claim {
  ClaimType: string | 'not working'
}

export interface HomeProps {
  claimData?: Claim[]
}

export default function Home({ claimData }: HomeProps): ReactElement {
  const { t } = useTranslation('common')

  return (
    <Container fluid className="index">
      <Head>
        <title>{t('title')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Main />
      <Footer />
      {console.dir({ claimData })} {/* @TODO: Remove. For development purposes only. */}
    </Container>
  )
}

export interface QueryParams {
  user_key: string
  uniqueNumber: string
}

function buildApiUrl(url: string, queryParams: QueryParams) {
  const apiUrl = new URL(url)

  for (const key in queryParams) {
    apiUrl.searchParams.append(key, queryParams[key as 'user_key' | 'uniqueNumber'])
  }

  return apiUrl.toString()
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const isProd = process.env.NODE_ENV === 'production'
  const logger = isProd ? pino({}) : pino({ prettyPrint: true })
  logger.info(req)

  // Load environmental variables to be used for authentication & API calls.
  // TypeScript: Use non-null assertions (`!`) because these environmental vars need to
  // exist for the app to function properly.
  // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
  // API fields
  const API_URL: string = process.env.API_URL!
  const API_USER_KEY: string = process.env.API_USER_KEY!
  const UNIQUE_NUMBER_HEADER: string = process.env.UNIQUE_NUMBER_HEADER_TITLE!
  // TLS Certificate fields
  const CERT_DIR: string = process.env.CERTIFICATE_DIR!
  const P12_FILE: string = process.env.P12_FILE!
  const P12_PATH: string = path.join(CERT_DIR, P12_FILE)!
  // const PASSWORD: string = process.env.CERTIFICATE_PASSPHRASE!

  let apiData: JSON | null = null

  // Returns certificate object with cert, key, and ca fields.
  // https://dexus.github.io/pem/jsdoc/module-pem.html#.readPkcs12
  async function getCertificate() {
    const pemReadPkcs12 = promisify(pem.readPkcs12)
    const pfx = fs.readFileSync(P12_PATH)

    // TS does not play very nicely with util.promisify
    // See, e.g., https://github.com/Microsoft/TypeScript/issues/26048
    // Non-MVP TODO: Consider removing this ignore & TypeScriptifying.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- TypeScript does not handle promisify well.
    const keybundle = await pemReadPkcs12(pfx, {})
    return keybundle
  }

  // Takes certificate that getCertificate function returns as argument,
  // makes API call, returns all API data.
  async function makeRequest(certificate: Pkcs12ReadResult) {
    const headers = {
      Accept: 'application/json',
    }

    /* https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options

    // TODO: Store certs in memory, instead of loading every time.
    // TODO: rejectUnauthorized - set to true or implement a `checkServerIdentity`
    // function to check that the certificate is actually
    //  issued by the host you're connecting to.
    //  https://nodejs.org/api/https.html#https_https_request_url_options_callback
    */
    const options = {
      cert: certificate.cert,
      key: certificate.key,
      rejectUnauthorized: false,
      keepAlive: false,
    }

    // Instantiate agent to use with TLS Certificate.
    // Reference: https://sebtrif.xyz/blog/2019-10-03-client-side-ssl-in-node-js-with-fetch/
    const sslConfiguredAgent: https.Agent = new https.Agent(options)

    // TODO: if no uniqueNumber, redirect.
    const apiUrlParams: QueryParams = {
      user_key: API_USER_KEY,
      uniqueNumber: req.headers[UNIQUE_NUMBER_HEADER] as string,
    }

    const apiUrl: RequestInfo = buildApiUrl(API_URL, apiUrlParams)

    try {
      const response: Response = await fetch(apiUrl, {
        headers: headers,
        agent: sslConfiguredAgent,
      })

      // TODO: Why does @ts-ignore not work on this line?
      // TODO: Implement proper typing of responseBody if possible.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const responseBody: JSON = await response.json()

      apiData = responseBody
    } catch (error) {
      console.log(error)
    }

    // Explicitly destroy agent so connection does not persist.
    // https://nodejs.org/api/http.html#http_agent_destroy
    // There were reports (SNAT?) of connection pool problems,
    // which could be caused by testing?  Either way, explicitly destroy the HTTP Agent.
    sslConfiguredAgent.destroy()

    return apiData
  }

  // The 3 steps where the above code is invoked and getServerSideProps returns props.
  // Step 1: Get the certificate.
  const certificate = await getCertificate()
  // Step 2: Use certificate to make the API request and return the data.
  const data = await makeRequest(certificate)

  // Step 3: Return Props
  return {
    props: {
      claimData: [data],
      ...(await serverSideTranslations(locale || 'en', ['common', 'header', 'footer'])),
    },
  }
}
