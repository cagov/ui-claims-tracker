import Head from 'next/head'
import Container from 'react-bootstrap/Container'
import pino from 'pino'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps } from 'next'

import { Header } from '../components/Header'
import { Main } from '../components/Main'
import { Footer } from '../components/Footer'
import { WorkInProgress } from '../components/WorkInProgress'

import queryApiGateway from '../utils/queryApiGateway'
import getScenarioContent from '../utils/getScenarioContent'
import { ScenarioContent } from '../types/common'

export interface HomeProps {
  scenarioContent: ScenarioContent
  loading: boolean
}

export default function Home({ scenarioContent, loading }: HomeProps): ReactElement {
  const { t } = useTranslation('common')

  return (
    <Container fluid className="index">
      <Head>
        <title>{t('title')}</title>
        <link rel="icon" href="/claimstatus/favicon.ico" />
        <link href="https://fonts.googleapis.com/css?family=Source Sans Pro" rel="stylesheet" />
      </Head>
      <WorkInProgress />
      <Header />
      <Main
        loading={loading}
        statusContent={scenarioContent.statusContent}
        detailsContent={scenarioContent.detailsContent}
      />
      <Footer />
      {console.dir({ scenarioContent })} {/* @TODO: Remove. For development purposes only. */}
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const isProd = process.env.NODE_ENV === 'production'
  const logger = isProd ? pino({}) : pino({ prettyPrint: true })
  logger.info(req)

  // Make the API request and return the data.
  const claimData = await queryApiGateway(req)

  // Run business logic to get content for the current scenario.
  const scenarioContent = getScenarioContent(claimData)

  // Return Props.
  return {
    props: {
      scenarioContent: scenarioContent,
      loading: false,
      ...(await serverSideTranslations(locale || 'en', ['common', 'header', 'footer'])),
    },
  }
}
