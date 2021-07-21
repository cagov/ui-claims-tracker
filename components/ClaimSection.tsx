import { ClaimDetails } from './ClaimDetails'
import { ClaimStatus } from './ClaimStatus'
import { ScenarioContent } from '../types/common'

export interface ClaimSectionProps extends ScenarioContent {
  loading: boolean
  userArrivedFromUioMobile: boolean
}

export const ClaimSection: React.FC<ClaimSectionProps> = ({
  loading = false,
  userArrivedFromUioMobile = false,
  statusContent,
  detailsContent,
}) => {
  return (
    <div className="claim-section">
      <ClaimStatus
        loading={loading}
        userArrivedFromUioMobile={userArrivedFromUioMobile}
        heading={statusContent.heading}
        summary={statusContent.summary}
        yourNextSteps={statusContent.yourNextSteps}
        eddNextSteps={statusContent.eddNextSteps}
      />
      <ClaimDetails
        loading={loading}
        programType={detailsContent.programType}
        benefitYear={detailsContent.benefitYear}
        claimBalance={detailsContent.claimBalance}
        weeklyBenefitAmount={detailsContent.weeklyBenefitAmount}
        lastPaymentIssued={detailsContent.lastPaymentIssued}
        extensionType={detailsContent.extensionType}
      />
    </div>
  )
}
