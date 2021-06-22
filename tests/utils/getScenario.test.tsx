import getScenario, { ScenarioType } from '../../utils/getScenario'

/**
 * Begin tests
 */
describe('Identifying the scenario', () => {
  it('returns the pending determination scenario if there is a pendingDetermination object', () => {
    const pendingDeterminationScenario = { pendingDetermination: ['temporary text'] }
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

  it('returns generic pending scenario if there are pending weeks', () => {
    const genericPendingScenario = { hasPendingWeeks: true }
    const scenarioType: ScenarioType = getScenario(genericPendingScenario)
    expect(scenarioType).toBe(ScenarioType.GenericPending)
  })

  it('returns generic pending scenario if there are pending weeks and pendingDetermination is null', () => {
    const genericPendingScenarioNull = { hasPendingWeeks: true, pendingDetermination: null }
    const scenarioType: ScenarioType = getScenario(genericPendingScenarioNull)
    expect(scenarioType).toBe(ScenarioType.GenericPending)
  })

  it('returns generic pending scenario if there are pending weeks and pendingDetermination is an empty array', () => {
    const genericPendingScenarioEmpty = { hasPendingWeeks: true, pendingDetermination: [] }
    const scenarioType: ScenarioType = getScenario(genericPendingScenarioEmpty)
    expect(scenarioType).toBe(ScenarioType.GenericPending)
  })

  it('returns generic all clear scenario if there are no pending weeks', () => {
    const genericAllClearScenario = { hasPendingWeeks: false }
    const scenarioType: ScenarioType = getScenario(genericAllClearScenario)
    expect(scenarioType).toBe(ScenarioType.GenericAllClear)
  })

  it('returns generic all clear scenario if there are no pending weeks and pendingDetermination is null', () => {
    const genericAllClearScenarioNull = { hasPendingWeeks: false, pendingDetermination: null }
    const scenarioType: ScenarioType = getScenario(genericAllClearScenarioNull)
    expect(scenarioType).toBe(ScenarioType.GenericAllClear)
  })

  it('returns generic all clear scenario if there are no pending weeks and pendingDetermination is an empty array', () => {
    const genericAllClearScenarioEmpty = { hasPendingWeeks: false, pendingDetermination: [] }
    const scenarioType: ScenarioType = getScenario(genericAllClearScenarioEmpty)
    expect(scenarioType).toBe(ScenarioType.GenericAllClear)
  })
})
