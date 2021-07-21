import Head from 'next/head'
import Container from 'react-bootstrap/Container'
import pino from 'pino'
import appInsights from 'pino-applicationinsights'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps } from 'next'
import Error from 'next/error'

import { Header } from '../components/Header'
import { Title } from '../components/Title'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { ClaimSection } from '../components/ClaimSection'
import { TimeoutModal } from '../components/TimeoutModal'
import { Footer } from '../components/Footer'

import queryApiGateway from '../utils/queryApiGateway'
import getScenarioContent from '../utils/getScenarioContent'
import { ScenarioContent } from '../types/common'

export interface HomeProps {
  scenarioContent: ScenarioContent
  timedOut?: boolean
  loading: boolean
  errorCode?: number | null
  userArrivedFromUioMobile?: boolean
}

export default function Home({
  scenarioContent,
  timedOut = false,
  loading,
  errorCode = null,
  userArrivedFromUioMobile = false,
}: HomeProps): ReactElement {
  const { t } = useTranslation('common')

  // If any errorCode is provided, render the error page.
  let mainComponent: JSX.Element
  if (errorCode) {
    mainComponent = (
      <main className="main">
        <Container className="main-content">
          <Error statusCode={errorCode} />
        </Container>
      </main>
    )
  } else {
    mainComponent = (
      <main className="main">
        <Container className="main-content">
          <Title />
          <LanguageSwitcher userArrivedFromUioMobile={userArrivedFromUioMobile} />
          <ClaimSection
            loading={loading}
            userArrivedFromUioMobile={userArrivedFromUioMobile}
            statusContent={scenarioContent.statusContent}
            detailsContent={scenarioContent.detailsContent}
          />
        </Container>
      </main>
    )
  }

  // Otherwise, render normally.
  return (
    <Container fluid className="index">
      <Head>
        <title>{t('title')}</title>
        <link rel="icon" href="/claimstatus/favicon.ico" />
        <link href="https://fonts.googleapis.com/css?family=Source Sans Pro" rel="stylesheet" />
        <link href="https://allfont.net/allfont.css?fonts=source-sans-pro-bold" rel="stylesheet" type="text/css" />
      </Head>
      <Header userArrivedFromUioMobile={userArrivedFromUioMobile} />
      {mainComponent}
      <TimeoutModal action="startOrUpdate" timedOut={timedOut} />
      <Footer />
      {console.dir({ scenarioContent })} {/* @TODO: Remove. For development purposes only. */}
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale, query }) => {
  const isAzureEnv = process.env.NODE_ENV === 'production'

  // Pino: use pretty print and log to STDOUT for local environments.
  let logger = pino({ prettyPrint: true })

  // Pino: otherwise, log to Azure Application Insights.
  if (isAzureEnv) {
    const appInsightsStream = await appInsights.createWriteStream()
    logger = pino(appInsightsStream)
  }

  logger.info(req)
  logger.info(query)

  let errorCode: number | null = null
  let scenarioContent: ScenarioContent | null = null

  try {
    // Make the API request and return the data.
    const claimData = await queryApiGateway(req)

    logger.info(claimData) /* @TODO: Remove. For development purposes only. */

    // Run business logic to get content for the current scenario.
    scenarioContent = getScenarioContent(claimData)
  } catch (error) {
    // If an error occurs, log it and show 500.
    logger.error(error, 'Application error')
    errorCode = 500
  }

  // Note whether the user came from the main UIO website or UIO Mobile, and match
  // that in our links back out to UIO.
  const userArrivedFromUioMobile = query?.from === 'uiom'

  // Return Props.
  return {
    props: {
      scenarioContent: scenarioContent,
      loading: false,
      errorCode: errorCode,
      userArrivedFromUioMobile: userArrivedFromUioMobile,
      ...(await serverSideTranslations(locale || 'en', ['common', 'claim-details', 'claim-status'])),
    },
  }
}
