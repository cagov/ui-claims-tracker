import { Claim, ClaimDetailsContent, ClaimStatusContent, ScenarioContent } from '../types/common'

export enum ScenarioType {
  PendingDetermination = 'Pending determination scenario',
  BasePending = 'Base state with pending weeks',
  BaseNoPending = 'Base state with no pending weeks',
}

export interface ProgramType {
  [key: string]: string
}

export const programTypes: ProgramType = {
  UI: 'UI',
  PEUC: 'PEUC - Tier 1 Extension',
  PEUX: 'PEUC - Tier 2 Extension',
  PEUY: 'PEUC - Tier 2 Augmentation',
  FEDED: 'FED-ED Extension',
  TRA: 'TRA Basic Extension',
  TRAAdditional: 'TRA Additional/Remedial Extension',
  TE: 'Training Extension (TE)',
  DUA: 'DUA',
  PUA: 'PUA',
}

export interface ProgramTypeParts {
  programType: string
  extensionType: string
}

export const programTypeMapping = {
  UI: {
    programType: 'claim-details:program-type.ui',
    extensionType: '',
  },
  PEUC: {
    programType: 'claim-details:program-type.ui',
    extensionType: 'claim-details:extension-type.peuc-1',
  },
  PEUX: {
    programType: 'claim-details:program-type.ui',
    extensionType: 'claim-details:extension-type.peuc-2',
  },
  PEUY: {
    programType: 'claim-details:program-type.ui',
    extensionType: 'claim-details:extension-type.peuc-2-augmentation',
  },
  FEDED: {
    programType: 'claim-details:program-type.ui',
    extensionType: 'claim-details:extension-type.fed-ed',
  },
  TRA: {
    programType: 'claim-details:program-type.ui',
    extensionType: 'claim-details:extension-type.tra',
  },
  TRAAdditional: {
    programType: 'claim-details:program-type.ui',
    extensionType: 'claim-details:extension-type.tra-additional',
  },
  TE: {
    programType: 'claim-details:program-type.ui',
    extensionType: 'claim-details:extension-type.te',
  },
  DUA: {
    programType: 'claim-details:program-type.dua',
    extensionType: '',
  },
  PUA: {
    programType: 'claim-details:program-type.pua',
    extensionType: '',
  },
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
  else {
    throw new Error('Unknown Scenario')
  }
}

/**
 * Map the ProgramType to user-facing translation keys.
 *
 * @param {string} programType
 * @returns {Object}
 */
export function mapProgramType(programType: string): ProgramTypeParts {
  for (const [id, map] of Object.entries(programTypeMapping)) {
    if (programType === programTypes[id]) {
      return map
    }
  }
  // If no known mapping is found, throw an error.
  throw new Error('Unknown Program Type')
}

/**
 * Get Claim Status description content.
 *
 * This returns an i18n string.
 *
 * @param {Object} scenarioType
 * @returns {string}
 */
export function getClaimStatusDescription(scenarioType: ScenarioType): string {
  switch (scenarioType) {
    case ScenarioType.PendingDetermination:
      return 'claim-status:pending-determination.description'
    case ScenarioType.BasePending:
      return 'claim-status:base-pending.description'
    case ScenarioType.BaseNoPending:
      return 'claim-status:base-no-pending.description'
  }

  // If an unknown Scenario Type is given, throw an error.
  throw new Error('Unknown Scenario Type')
}

/**
 * Return scenario content.
 *
 * @param {Object} claim
 * @returns {Object}
 */
export default function getScenarioContent(claimData: Claim): ScenarioContent {
  // Get the scenario type.
  const scenarioType = getScenario(claimData)

  // Construct claim status content.
  const nextSteps = [
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  ]

  const statusContent: ClaimStatusContent = {
    statusDescription: getClaimStatusDescription(scenarioType),
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
    detailsContent.benefitYear = `${claimData.claimDetails.benefitYearStartDate} - ${claimData.claimDetails.benefitYearEndDate}`
    detailsContent.claimBalance = claimData.claimDetails.claimBalance
    detailsContent.weeklyBenefitAmount = claimData.claimDetails.weeklyBenefitAmount
    detailsContent.lastPaymentIssued = claimData.claimDetails.lastPaymentIssued

    // Set programType and extensionType.
    const parts: ProgramTypeParts = mapProgramType(claimData.claimDetails.programType)
    detailsContent.programType = parts.programType
    detailsContent.extensionType = parts.extensionType
  }

  const content: ScenarioContent = {
    statusContent: statusContent,
    detailsContent: detailsContent,
  }

  return content
}
