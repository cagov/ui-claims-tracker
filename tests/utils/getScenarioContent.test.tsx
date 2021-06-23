import getScenarioContent, { getScenario, ScenarioType } from '../../utils/getScenarioContent'
import { ScenarioContent } from '../../types/common'

// Shared test constants
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
    expect(pendingDetermination.statusContent.statusDescription).toBe('pending-determination.description')

    const basePending: ScenarioContent = getScenarioContent(basePendingScenario)
    expect(basePending.statusContent.statusDescription).toBe('base-pending.description')

    const baseNoPending: ScenarioContent = getScenarioContent(baseNoPendingScenario)
    expect(baseNoPending.statusContent.statusDescription).toBe('base-no-pending.description')
  })
})

// Test getScenario()
describe('Identifying the scenario', () => {
  it('returns the pending determination scenario if there is a pendingDetermination object', () => {
    const scenarioType: ScenarioType = getScenario(pendingDeterminationScenario)
    expect(scenarioType).toBe(ScenarioType.PendingDetermination)
  })

  it('returns the pending determination scenario if there is a pendingDetermination object regardless of other criteria', () => {
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

  it('returns the base state (with pending weeks) if there are pending weeks', () => {
    const scenarioType: ScenarioType = getScenario(basePendingScenario)
    expect(scenarioType).toBe(ScenarioType.BasePending)
  })

  it('returns the base state (with pending weeks) if there are pending weeks and pendingDetermination is null', () => {
    const basePendingScenarioNull = { hasPendingWeeks: true, pendingDetermination: null }
    const scenarioType: ScenarioType = getScenario(basePendingScenarioNull)
    expect(scenarioType).toBe(ScenarioType.BasePending)
  })

  it('returns the base state (with pending weeks) if there are pending weeks and pendingDetermination is an empty array', () => {
    const basePendingScenarioEmpty = { hasPendingWeeks: true, pendingDetermination: [] }
    const scenarioType: ScenarioType = getScenario(basePendingScenarioEmpty)
    expect(scenarioType).toBe(ScenarioType.BasePending)
  })

  it('returns base state (with no pending weeks) if there are no pending weeks', () => {
    const scenarioType: ScenarioType = getScenario(baseNoPendingScenario)
    expect(scenarioType).toBe(ScenarioType.BaseNoPending)
  })

  it('returns base state (with no pending weeks) if there are no pending weeks and pendingDetermination is null', () => {
    const baseNoPendingScenarioNull = { hasPendingWeeks: false, pendingDetermination: null }
    const scenarioType: ScenarioType = getScenario(baseNoPendingScenarioNull)
    expect(scenarioType).toBe(ScenarioType.BaseNoPending)
  })

  it('returns base state (with no pending weeks) if there are no pending weeks and pendingDetermination is an empty array', () => {
    const baseNoPendingScenarioEmpty = { hasPendingWeeks: false, pendingDetermination: [] }
    const scenarioType: ScenarioType = getScenario(baseNoPendingScenarioEmpty)
    expect(scenarioType).toBe(ScenarioType.BaseNoPending)
  })
})
