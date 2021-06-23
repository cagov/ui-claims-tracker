import { Claim, ClaimDetailsContent, ClaimStatusContent, ScenarioContent } from '../types/common'

export enum ScenarioType {
  PendingDetermination = 'Pending determination scenario',
  BasePending = 'Base state with pending weeks',
  BaseNoPending = 'Base state with no pending weeks',
}

/**
 * Identify the correct scenario to display.
 *
 * @param {Qbject} claim
 * @returns {Object}
 */
export function getScenario(claimData: Claim): ScenarioType {
  // The pending determination scenario: if claimData contains any pendingDetermination
  // objects
  // @TODO: refactor with more detailed pending determination scenarios #252
  if (claimData.pendingDetermination && claimData.pendingDetermination.length > 0) {
    return ScenarioType.PendingDetermination
  }
  // The generic pending scenario: if there are no pendingDetermination objects
  // AND hasPendingWeeks is true
  else if (claimData.hasPendingWeeks === true) {
    return ScenarioType.BasePending
  }
  // The generic "all clear"/base state scenario: if there are no pendingDetermination objects
  // and hasPendingWeeks is false
  else if (claimData.hasPendingWeeks === false) {
    return ScenarioType.BaseNoPending
  }
  // This is unexpected
  // @TODO: Log the scenario and display 500
  else {
    // throw new Error('Unexpected scenario')
    return ScenarioType.BaseNoPending
  }
}

/**
 * Return scenario content.
 *
 * @param {Object} claim
 * @param {enum} scenarioType
 * @returns {Object}
 */
export default function getScenarioContent(claimData: Claim): ScenarioContent {
  // Get the scenario type.
  const scenarioType = getScenario(claimData)

  // Construct claim status content.
  let statusDescription = ''
  if (scenarioType === ScenarioType.PendingDetermination) {
    statusDescription = 'claim-status:pending-determination.description'
  } else if (scenarioType === ScenarioType.BasePending) {
    statusDescription = 'claim-status:base-pending.description'
  } else {
    statusDescription = 'claim-status:base-no-pending.description'
  }

  const nextSteps = [
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  ]

  const statusContent: ClaimStatusContent = {
    statusDescription: statusDescription,
    nextSteps: nextSteps,
  }

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
