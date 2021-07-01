import { Claim, ClaimDetailsContent, ClaimStatusContent, ScenarioContent } from '../types/common'

export type ScenarioTypeKey = keyof typeof ScenarioType

export enum ScenarioType {
  PendingDetermination = 'Pending determination scenario',
  Scenario7 = 'Base state; No pending weeks; No weeks to certify',
  Scenario8 = 'Base state; No pending weeks; Has weeks to certify',
  Scenario9 = 'Base state; Has pending weeks; No weeks to certify',
  Scenario10 = 'Base state; Has pending weeks; Has weeks to certify',
}
console.log(ScenarioType)

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
    return ScenarioType.PendingDetermination
  }

  // Otherwise display a Base State scenario.
  else {
    // @TODO: Validate that hasPendingWeeks is a boolean
    if (claimData.hasPendingWeeks === false) {
      // @TODO: Validate that hasCertificationWeeks is a boolean
      if (claimData.hasCertificationWeeksAvailable === false) {
        return ScenarioType.Scenario7
      } else {
        return ScenarioType.Scenario8
      }
    } else {
      if (claimData.hasCertificationWeeksAvailable === false) {
        return ScenarioType.Scenario9
      } else {
        return ScenarioType.Scenario10
      }
    }
  }
}

/**
 * Get Claim Status description content.
 * This returns an i18n string.
 */
export function getClaimStatusDescription(scenarioType: ScenarioType): string {
  switch (scenarioType) {
    case ScenarioType.PendingDetermination:
      return 'claim-status:pending-determination.description'
    case ScenarioType.Scenario7:
      return 'claim-status:base-pending.description'
    case ScenarioType.Scenario8:
      return 'claim-status:base-no-pending-active.description'
    case ScenarioType.Scenario9:
      return 'claim-status:base-no-pending-inactive.description'
  }

  // If an unknown Scenario Type is given, throw an error.
  throw new Error('Unknown Scenario Type')
}

/**
 * Get Claim Status content.
 */
export function buildClaimStatusContent(scenarioType: ScenarioType): ClaimStatusContent {
  const statusContent: ClaimStatusContent = {
    statusDescription: getClaimStatusDescription(scenarioType),
    nextSteps: [
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    ],
  }

  return statusContent
}

/**
 * Return scenario content.
 */
export default function getScenarioContent(claimData: Claim): ScenarioContent {
  // Get the scenario type.
  const scenarioType = getScenario(claimData)

  // Construct claim status content.
  const statusContent = buildClaimStatusContent(scenarioType)

  // Construct claim details content.
  // @TODO: Remove placeholder default content
  const detailsContent: ClaimDetailsContent = {
    programType: 'Unemployment Insurance (UI)',
    benefitYear: '3/21/2020 - 3/20/2021',
    claimBalance: '$0.00',
    weeklyBenefitAmount: '$111.00',
    lastPaymentIssued: '4/29/2021',
    extensionType: 'Tier 2 Extension',
  }

  if (claimData.claimDetails) {
    detailsContent.programType = claimData.claimDetails.programType
    detailsContent.benefitYear = `${claimData.claimDetails.benefitYearStartDate} - ${claimData.claimDetails.benefitYearEndDate}`
    detailsContent.claimBalance = claimData.claimDetails.claimBalance
    detailsContent.weeklyBenefitAmount = claimData.claimDetails.weeklyBenefitAmount
    detailsContent.lastPaymentIssued = claimData.claimDetails.lastPaymentIssued
    // @TODO
    // detailsContent.extensionType = ''
  }

  const content: ScenarioContent = {
    statusContent: statusContent,
    detailsContent: detailsContent,
  }

  return content
}
