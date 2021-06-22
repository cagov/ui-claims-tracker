export interface PendingDetermination {
  determinationStatus?: null | undefined | string
}

export interface Claim {
  ClaimType?: null | undefined | string
  hasPendingWeeks?: null | undefined | boolean
  pendingDetermination?: null | [PendingDetermination]
}
