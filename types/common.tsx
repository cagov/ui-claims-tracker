export interface PendingDetermination {
  determinationStatus?: null | undefined | string
}

export interface Claim {
  ClaimType?: null | undefined | string
  hasPendingWeeks?: null | undefined | boolean
  pendingDetermination?: null | [PendingDetermination]
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
  extensionEndDate: string
}

export interface ScenarioContent {
  statusContent: ClaimStatusContent
  detailsContent: ClaimDetailsContent
}
