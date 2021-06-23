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
  pendingDetermination?: null | [PendingDetermination]
  claimDetails?: ClaimDetailsResult
}

export interface ClaimStatusContent {
  statusDescription: string
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
