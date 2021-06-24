import getScenarioContent, { getScenario, ScenarioType } from '../../utils/getScenarioContent'
import { ScenarioContent } from '../../types/common'

// Shared test constants for mock API gateway responses
const pendingDeterminationScenario = { pendingDetermination: ['temporary text'] }
const basePendingScenario = { hasPendingWeeks: true }
const baseNoPendingScenario = { hasPendingWeeks: false }

/**
 * Begin tests
 */

// Test getScenarioContent()
describe('Retrieving the scenario content', () => {
  it('returns the correct status description for the scenario', () => {
    const pendingDetermination: ScenarioContent = getScenarioContent(pendingDeterminationScenario)
    expect(pendingDetermination.statusContent.statusDescription).toBe('claim-status:pending-determination.description')

    const basePending: ScenarioContent = getScenarioContent(basePendingScenario)
    expect(basePending.statusContent.statusDescription).toBe('claim-status:base-pending.description')

    const baseNoPending: ScenarioContent = getScenarioContent(baseNoPendingScenario)
    expect(baseNoPending.statusContent.statusDescription).toBe('claim-status:base-no-pending.description')
  })
})

// Test getScenario(): pending determination scenario
describe('The pending determination scenario', () => {
  it('is returned when there is a pendingDetermination object', () => {
    const scenarioType: ScenarioType = getScenario(pendingDeterminationScenario)
    expect(scenarioType).toBe(ScenarioType.PendingDetermination)
  })

  it('is returned when there is a pendingDetermination object regardless of other criteria', () => {
    const pendingDeterminationScenarioWith = {
      pendingDetermination: ['temporary text'],
      hasPendingWeeks: true,
    }
    const scenarioTypeWith: ScenarioType = getScenario(pendingDeterminationScenarioWith)
    expect(scenarioTypeWith).toBe(ScenarioType.PendingDetermination)

    const pendingDeterminationScenarioWithout = {
      pendingDetermination: ['temporary text'],
      hasPendingWeeks: false,
    }
    const scenarioTypeWithout: ScenarioType = getScenario(pendingDeterminationScenarioWithout)
    expect(scenarioTypeWithout).toBe(ScenarioType.PendingDetermination)
  })
})

// Test getScenario(): base state with pending weeks scenario
describe('The base state (with pending weeks) scenario', () => {
  it('is returned when there are pending weeks', () => {
    const scenarioType: ScenarioType = getScenario(basePendingScenario)
    expect(scenarioType).toBe(ScenarioType.BasePending)
  })

  it('is returned when there are pending weeks and pendingDetermination is null', () => {
    const basePendingScenarioNull = { hasPendingWeeks: true, pendingDetermination: null }
    const scenarioType: ScenarioType = getScenario(basePendingScenarioNull)
    expect(scenarioType).toBe(ScenarioType.BasePending)
  })

  it('is returned when there are pending weeks and pendingDetermination is an empty array', () => {
    const basePendingScenarioEmpty = { hasPendingWeeks: true, pendingDetermination: [] }
    const scenarioType: ScenarioType = getScenario(basePendingScenarioEmpty)
    expect(scenarioType).toBe(ScenarioType.BasePending)
  })
})

// Test getScenario(): base state with no pending weeks scenario
describe('The base state (with no pending weeks) scenario', () => {
  it('is returned when there are no pending weeks', () => {
    const scenarioType: ScenarioType = getScenario(baseNoPendingScenario)
    expect(scenarioType).toBe(ScenarioType.BaseNoPending)
  })

  it('is returned when there are no pending weeks and pendingDetermination is null', () => {
    const baseNoPendingScenarioNull = { hasPendingWeeks: false, pendingDetermination: null }
    const scenarioType: ScenarioType = getScenario(baseNoPendingScenarioNull)
    expect(scenarioType).toBe(ScenarioType.BaseNoPending)
  })

  it('is returned when there are no pending weeks and pendingDetermination is an empty array', () => {
    const baseNoPendingScenarioEmpty = { hasPendingWeeks: false, pendingDetermination: [] }
    const scenarioType: ScenarioType = getScenario(baseNoPendingScenarioEmpty)
    expect(scenarioType).toBe(ScenarioType.BaseNoPending)
  })
})
