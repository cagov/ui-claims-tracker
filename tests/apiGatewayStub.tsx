import { ScenarioType } from '../utils/getScenarioContent'
import { Claim } from '../types/common'

export default function apiGatewayStub(scenarioType: ScenarioType): Claim {
  // return {
  //   ClaimType?: null | undefined | string
  //   hasPendingWeeks?: null | undefined | boolean
  //   hasCertificationWeeksAvailable?: null | undefined | boolean
  //   pendingDetermination?: null | [PendingDetermination]
  //   claimDetails?: ClaimDetailsResult
  // }
  return {
    hasPendingWeeks: false,
    hasCertificationWeeksAvailable: false,
    pendingDetermination: [],
    claimDetails: {
      monetaryStatus: 'Inactive',
    },
  }
}
