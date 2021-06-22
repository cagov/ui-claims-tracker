import { ClaimDetails } from './ClaimDetails'
import { ClaimStatus } from './ClaimStatus'

export interface ClaimSectionProps {
  loading: boolean
}

export const ClaimSection: React.FC<ClaimSectionProps> = ({ loading = false }) => {
  return (
    <div className="claim-section">
      <ClaimStatus
        loading={loading}
        statusDescriptionKey="claim-status.generic-pending"
        nextSteps={[
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        ]}
      />
      <ClaimDetails
        loading={loading}
        title="Claim Details"
        programType="Unemployment Insurance (UI)"
        benefitYear="3/21/2020 - 3/20/2021"
        claimBalance="$0.00"
        weeklyBenefitAmount="$111.00"
        lastPaymentIssued="4/29/2021"
        extentionType="Tier 2 Extension"
        extensionEndDate="5/22/2021"
      />
    </div>
  )
}
