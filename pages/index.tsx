import Head from 'next/head'
import Container from 'react-bootstrap/Container'
import pino from 'pino'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps } from 'next'
import ErrorComponent from 'next/error'

import { Header } from '../components/Header'
import { Title } from '../components/Title'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { ClaimSection } from '../components/ClaimSection'
import { TimeoutModal } from '../components/TimeoutModal'
import { Footer } from '../components/Footer'
import { WorkInProgress } from '../components/WorkInProgress'

import queryApiGateway from '../utils/queryApiGateway'
import getScenarioContent from '../utils/getScenarioContent'
import { ScenarioContent } from '../types/common'
import { useRouter } from 'next/router'

export interface HomeProps {
  scenarioContent: ScenarioContent
  timedOut?: boolean
  loading: boolean
  errorCode?: number | null
}

export default function Home({
  scenarioContent,
  timedOut = false,
  loading,
  errorCode = null,
}: HomeProps): ReactElement {
  const { t } = useTranslation('common')

  // Note whether the user came from the main UIO website or UIO Mobile, and match
  // that in our links back out to UIO.
  const router = useRouter()
  const userArrivedFromUioMobile = router.query?.from === 'uiom'

  // If any errorCode is provided, render the error page.
  let mainComponent: JSX.Element
  if (errorCode) {
    mainComponent = (
      <main className="main">
        <Container className="main-content">
          <ErrorComponent statusCode={errorCode} />
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
      </Head>
      <WorkInProgress />
      <Header userArrivedFromUioMobile={userArrivedFromUioMobile} />
      {mainComponent}
      <TimeoutModal action="startOrUpdate" timedOut={timedOut} />
      <Footer />
      {console.dir({ scenarioContent })} {/* @TODO: Remove. For development purposes only. */}
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const isProd = process.env.NODE_ENV === 'production'
  const logger = isProd ? pino({}) : pino({ prettyPrint: true })

  // const insights = require('pino-applicationinsights')
  // const pinoms = require('pino-multi-stream')
  // create the Azure Application Insights destination stream
  // const writeStream = await insights.createWriteStream()
  // create pino loggger
  // const logger = pinoms({ streams: [{ stream: writeStream }] })
  // log some events
  logger.info('Just Pino: Informational message')
  logger.error(new Error('error'), 'Just pino: error message')

  logger.info(req)

  let errorCode: number | null = null
  let scenarioContent: ScenarioContent | null = null

  try {
    // Make the API request and return the data.
    const claimData = await queryApiGateway(req)

    // Run business logic to get content for the current scenario.
    scenarioContent = getScenarioContent(claimData)
  } catch (error) {
    // If an error occurs, log it and show 500.
    logger.error(error)
    errorCode = 500
  }

  // Return Props.
  return {
    props: {
      scenarioContent: scenarioContent,
      loading: false,
      errorCode: errorCode,
      ...(await serverSideTranslations(locale || 'en', ['common', 'claim-status'])),
    },
  }
}
