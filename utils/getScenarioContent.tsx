/**
 * Note: Some of the structure of this file is expected to change when we implement
 * an alternate API response validation method. See #150
 */
import {
  Claim,
  ClaimDetailsContent,
  ClaimDetailsResult,
  ClaimStatusContent,
  NextStep,
  ScenarioContent,
} from '../types/common'
import urls from '../public/urls.json'

export enum ScenarioType {
  PendingDetermination = 'Pending determination scenario',
  BasePending = 'Base state with pending weeks',
  BaseNoPendingActive = 'Base state with no pending weeks; Active claim',
  BaseNoPendingInactive = 'Base state with no pending weeks; Inactive claim',
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
 */
export function getScenario(claimData: Claim): ScenarioType {
  // The pending determination scenario: if claimData contains any pendingDetermination
  // objects
  // @TODO: refactor with more detailed pending determination scenarios #252
  if (claimData.pendingDetermination && claimData.pendingDetermination.length > 0) {
    return ScenarioType.PendingDetermination
  }
  // The base state (with pending weeks) scenario:
  // - there are no pendingDetermination objects AND
  // - hasPendingWeeks is true
  else if (claimData.hasPendingWeeks === true) {
    return ScenarioType.BasePending
  } else if (claimData.hasPendingWeeks === false) {
    if (claimData.claimDetails) {
      // The base state (with no pending weeks); active claim scenario:
      // - there are no pendingDetermination objects AND
      // - hasPendingWeeks is false AND
      // - monetaryStatus is "active"
      if (claimData.claimDetails.monetaryStatus && claimData.claimDetails.monetaryStatus.toLowerCase() === 'active') {
        return ScenarioType.BaseNoPendingActive
      }
      // The base state (with no pending weeks); Inactive claim scenario:
      // - there are no pendingDetermination objects AND
      // - hasPendingWeeks is false AND
      // - monetaryStatus is not "active"
      else {
        return ScenarioType.BaseNoPendingInactive
      }
    } else {
      return ScenarioType.BaseNoPendingInactive
      // throw new Error('Missing claim details')
    }
  } else {
    // throw new Error('Unknown Scenario')
    return ScenarioType.BaseNoPendingInactive
  }
}

/**
 * Map the ProgramType to user-facing translation keys.
 *  This returns i18n strings.
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
 * Constrtuct the benefit year string.
 */
export function buildBenefitYear(start: string, end: string): string {
  return `${start} - ${end}`
}

/**
 * Get Claim Details content.
 */
export function getClaimDetails(rawDetails: ClaimDetailsResult): ClaimDetailsContent {
  // Get programType and extensionType.
  const parts: ProgramTypeParts = mapProgramType(rawDetails.programType)
  const benefitYear = buildBenefitYear(rawDetails.benefitYearStartDate, rawDetails.benefitYearEndDate)

  return {
    programType: parts.programType,
    benefitYear: benefitYear,
    claimBalance: rawDetails.claimBalance,
    weeklyBenefitAmount: rawDetails.weeklyBenefitAmount,
    lastPaymentIssued: rawDetails.lastPaymentIssued,
    extensionType: parts.extensionType,
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
    case ScenarioType.BasePending:
      return 'claim-status:base-pending.description'
    case ScenarioType.BaseNoPendingActive:
      return 'claim-status:base-no-pending-active.description'
    case ScenarioType.BaseNoPendingInactive:
      return 'claim-status:base-no-pending-inactive.description'
  }

  // If an unknown Scenario Type is given, throw an error.
  throw new Error('Unknown Scenario Type')
}

/**
 * Construct conditional next steps content.
 * Returns an array of NextStep objects, which include i18n strings.
 */
export function buildConditionalNextSteps(scenarioType: ScenarioType, claimData: Claim): NextStep[] {
  const nextSteps: NextStep[] = []
  if (claimData.hasCertificationWeeksAvailable && scenarioType !== ScenarioType.BaseNoPendingInactive) {
    if (claimData.hasPendingWeeks) {
      nextSteps.push({
        i18nString: 'claim-status:conditional-next-steps:certify-pending',
        links: [urls['edd-ui-certify']],
      })
    } else {
      nextSteps.push({
        i18nString: 'claim-status:conditional-next-steps:certify-no-pending',
        links: [urls['edd-ui-certify']],
      })
    }
  }
  return nextSteps
}

/**
 * Construct next steps content for the scenario type.
 * Returns an array of NextStep objects, which include i18n strings.
 */
export function buildScenarioNextSteps(scenarioType: ScenarioType, claimData: Claim): NextStep[] {
  const nextSteps: NextStep[] = []
  if (scenarioType === ScenarioType.BasePending) {
    nextSteps.push({
      i18nString: 'claim-status:base-pending:next-step',
    })
    nextSteps.push({
      i18nString: 'claim-status:conditional-next-steps:contact-info',
      links: [urls['edd-faq-bpo']],
    })
  }
  return nextSteps
}

export function buildClaimStatusContent(scenarioType: ScenarioType, claimData: Claim): ClaimDetailsContent {
  const statusContent: ClaimStatusContent = {
    statusDescription: getClaimStatusDescription(scenarioType),
  }

  let nextSteps: NextStep[] = buildConditionalNextSteps(scenarioType, claimData)
  if (nextSteps && nextSteps.length > 0) {
    statusContent.nextSteps = nextSteps
  }
  // else {
  //   // @TODO: Remove placeholder default content
  //   statusContent.nextSteps = [
  //     'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  //     'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  //   ]
  // }
  return statusContent
}

/**
 * Return scenario content.
 */
export default function getScenarioContent(claimData: Claim): ScenarioContent {
  // Get the scenario type.
  const scenarioType = getScenario(claimData)

  // Construct claim status content.
  const statusContent = buildClaimStatusContent(scenarioType, claimData)

  // Construct claim details content.
  // @TODO: Remove placeholder default content
  let detailsContent: ClaimDetailsContent = {
    programType: 'Unemployment Insurance (UI)',
    benefitYear: '3/21/2020 - 3/20/2021',
    claimBalance: '$0.00',
    weeklyBenefitAmount: '$111.00',
    lastPaymentIssued: '4/29/2021',
    extensionType: 'Tier 2 Extension',
  }

  if (claimData.claimDetails) {
    detailsContent = getClaimDetails(claimData.claimDetails)
  }

  const content: ScenarioContent = {
    statusContent: statusContent,
    detailsContent: detailsContent,
  }

  return content
}
