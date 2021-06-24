// Type interfaces for API gateway result
export interface PendingDetermination {
  determinationStatus?: null | undefined | string
}

export interface ClaimDetailsResult {
  programType: string
  benefitYearStartDate: string
  benefitYearEndDate: string
  claimBalance: string
  weeklyBenefitAmount: string
  lastPaymentIssued: string
  lastPaymentAmount: string
  monetaryStatus: string
}

export interface Claim {
  ClaimType?: null | undefined | string
  hasPendingWeeks?: null | undefined | boolean
  hasCertificationWeeksAvailable?: null | undefined | boolean
  pendingDetermination?: null | [PendingDetermination]
  claimDetails?: ClaimDetailsResult
}

// Type interfaces for Claim Status and Claim Details
export interface ClaimStatusContent {
  statusDescription: string // This is an i18n string
  nextSteps?: string[]
}

export interface ClaimDetailsContent {
  programType: string
  benefitYear: string
  claimBalance: string
  weeklyBenefitAmount: string
  lastPaymentIssued: string
  extensionType: string
}

export interface ScenarioContent {
  statusContent: ClaimStatusContent
  detailsContent: ClaimDetailsContent
}
