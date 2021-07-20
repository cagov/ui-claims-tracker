/**
 * Stub for the API gateway.
 *
 * Provides stub responses for API gateway queries for Storybook and Jest testing.
 */

import { ScenarioType } from '../utils/getScenarioContent'
import { Claim } from '../types/common'

/**
 * Stub the API gateway response for a given scenario.
 */
export default function apiGatewayStub(
  scenarioType: ScenarioType,
  hasCertificationWeeksAvailable = false,
  programType = 'UI',
): Claim {
  // Default empty response from the API gateway
  const claim: Claim = {
    uniqueNumber: null,
    claimDetails: null,
    hasCertificationWeeksAvailable: false,
    hasPendingWeeks: false,
    pendingDetermination: null,
  }

  // If this is a known scenarioType, set a uniqueNumber.
  if (scenarioType in ScenarioType) {
    claim.uniqueNumber = '12345'
  }

  switch (scenarioType) {
    case ScenarioType.Scenario1:
      claim.pendingDetermination = [{ determinationStatus: null }]
      claim.hasCertificationWeeksAvailable = hasCertificationWeeksAvailable
      break

    case ScenarioType.Scenario4:
      claim.hasPendingWeeks = true
      claim.hasCertificationWeeksAvailable = hasCertificationWeeksAvailable
      break

    // Note that Scenarios 5 & 6 explicitly differ based on whether hasCertificationWeeksAvailable
    // is true or false, so we ignore the argument.
    case ScenarioType.Scenario5:
      claim.hasPendingWeeks = false
      claim.hasCertificationWeeksAvailable = false
      break

    case ScenarioType.Scenario6:
      claim.hasPendingWeeks = false
      claim.hasCertificationWeeksAvailable = true
      break

    // No match should throw an error
    default:
      throw new Error('Unknown scenario type')
  }

  claim.claimDetails = {
    programType: programType,
    benefitYearStartDate: '2020-03-21T00:00:00',
    benefitYearEndDate: '2021-03-20T00:00:00',
    claimBalance: 1100.45,
    weeklyBenefitAmount: 111,
    lastPaymentIssued: '2021-04-29T00:00:00',
    lastPaymentAmount: 100,
    monetaryStatus: 'Active',
  }

  return claim
}
