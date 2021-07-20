/**
 * Utility file for returning the correct content for each scenario.
 *
 * Scenarios are referred to by number and the numbers match the content spreadsheet from
 * UIB. The ScenarioType enum is a numeric enum so that we can take advantage of the
 * built-in Typescript reverse mapping for numeric enums. However, we set the long-form
 * description in ScenarioTypeNames for easy(ish) reference.
 */

import { Claim, ClaimDetailsContent, ScenarioContent } from '../types/common'
import getClaimDetails from './getClaimDetails'
import getClaimStatus from './getClaimStatus'

export enum ScenarioType {
  Scenario1,
  Scenario4,
  Scenario5,
  Scenario6,
}

export const ScenarioTypeNames = {
  [ScenarioType.Scenario1]: 'Pending determination scenario',
  [ScenarioType.Scenario4]: 'Generic pending state: pending weeks',
  [ScenarioType.Scenario5]: 'Base state: no pending weeks, no weeks to certify',
  [ScenarioType.Scenario6]: 'Base state: no pending weeks, weeks to certify',
}

/**
 * Identify the correct scenario to display.
 *
 * @TODO: Validating the API gateway response #150
 */
export function getScenario(claimData: Claim): ScenarioType {
  // The pending determination scenario: if claimData contains any pendingDetermination
  // objects
  // @TODO: refactor with more detailed pending determination scenarios #252
  if (claimData.pendingDetermination && claimData.pendingDetermination.length > 0) {
    return ScenarioType.Scenario1
  }

  // No pendingDetermination objects.
  else {
    // @TODO: Validate that hasPendingWeeks is a boolean
    if (claimData.hasPendingWeeks === true) {
      // @TODO: Validate that hasCertificationWeeks is a boolean
      return ScenarioType.Scenario4
    }
    // hasPendingWeeks === false
    else {
      if (claimData.hasCertificationWeeksAvailable === false) {
        return ScenarioType.Scenario5
      } else {
        return ScenarioType.Scenario6
      }
    }
  }
}

/**
 * Return whether the Claim Status should display the "continue certifying" content.
 */
export function continueCertifying(scenarioType: ScenarioType, claimData: Claim): boolean {
  // If the Scenario is not scenario 5 or 6
  // AND hasCertificationWeeksAvailable is true
  // Then we should display the "continue certifying" content.
  if (
    ![ScenarioType.Scenario5, ScenarioType.Scenario6].includes(scenarioType) &&
    claimData.hasCertificationWeeksAvailable
  ) {
    return true
  }
  // Otherwise, we should not display the "continue certifying" content.
  else {
    return false
  }
}

/*
 * Return scenario content.
 */
export default function getScenarioContent(claimData: Claim): ScenarioContent {
  // Get the scenario type.
  const scenarioType = getScenario(claimData)

  // Construct claim status content.
  const statusContent = getClaimStatus(scenarioType, continueCertifying(scenarioType, claimData))

  // Construct claim details content.
  if (!claimData.claimDetails) {
    throw new Error('Missing claim details')
  }
  const detailsContent: ClaimDetailsContent = getClaimDetails(claimData.claimDetails)

  const content: ScenarioContent = {
    statusContent: statusContent,
    detailsContent: detailsContent,
  }

  return content
}
