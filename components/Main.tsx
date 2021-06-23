import Container from 'react-bootstrap/Container'

import { Title } from './Title'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ClaimSection } from './ClaimSection'
import { TimeoutModal } from './TimeoutModal'
import { ClaimDetailsContent, ClaimStatusContent } from '../types/common'

export interface MainProps {
  timedOut?: boolean
  loading: boolean
}

export const Main: React.FC<MainProps> = ({ timedOut = false, loading = false }) => {
  const statusContent: ClaimStatusContent = {
    statusDescription: 'claim-status.generic-all-clear',
    nextSteps: [
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    ],
  }

  const detailsContent: ClaimDetailsContent = {
    programType: 'Unemployment Insurance (UI)',
    benefitYear: '3/21/2020 - 3/20/2021',
    claimBalance: '$0.00',
    weeklyBenefitAmount: '$111.00',
    lastPaymentIssued: '4/29/2021',
    extensionType: 'Tier 2 Extension',
    extensionEndDate: '5/22/2021',
  }

  return (
    <main className="main">
      <Container className="main-content">
        <Title />
        <LanguageSwitcher />
        <ClaimSection loading={loading} statusContent={statusContent} detailsContent={detailsContent} />
      </Container>
      <TimeoutModal action="startOrUpdate" timedOut={timedOut} />
    </main>
  )
}
