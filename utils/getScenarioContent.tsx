import { Claim } from '../types/common'

export enum ScenarioType {
  PendingDetermination = 'Pending Determination Scenario',
  GenericPending = 'Generic Pending Scenario',
  GenericAllClear = 'Generic All Clear Scenario',
}

export interface ScenarioContent {
  statusDescription: string
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
    return ScenarioType.GenericPending
  }
  // The generic "all clear"/base state scenario: if there are no pendingDetermination objects
  // and hasPendingWeeks is false
  else if (claimData.hasPendingWeeks === false) {
    return ScenarioType.GenericAllClear
  }
  // This is unexpected
  // @TODO: Log the scenario and display 500
  else {
    // throw new Error('Unexpected scenario')
    return ScenarioType.GenericAllClear
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
  const content = {} as ScenarioContent

  // Get the scenario type.
  const scenarioType = getScenario(claimData)

  if (scenarioType === ScenarioType.PendingDetermination) {
    content.statusDescription = 'claim-status.pending-determination'
  } else if (scenarioType === ScenarioType.GenericPending) {
    content.statusDescription = 'claim-status.generic-pending'
  } else {
    content.statusDescription = 'claim-status.generic-all-clear'
  }

  return content
}
