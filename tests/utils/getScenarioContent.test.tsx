import getScenarioContent, {
  getScenario,
  getClaimStatusDescription,
  mapProgramType,
  programTypeMapping,
  ProgramTypeParts,
  programTypes,
  ScenarioType,
} from '../../utils/getScenarioContent'
import { ScenarioContent } from '../../types/common'

// Shared test constants for mock API gateway responses
const pendingDeterminationScenario = { pendingDetermination: ['temporary text'] }
const basePendingScenario = { hasPendingWeeks: true }
const baseNoPendingScenario = { hasPendingWeeks: false }

/**
 * Begin tests
 */

// Test getScenarioContent()
// describe('Retrieving the scenario content', () => {
//   // Test Claim Details
//   it('returns the correct programType and extensionType', () => {})
// })

// Test getClaimStatusDescripton()
describe('Getting the Claim Status description', () => {
  it('returns the correct description for the scenario', () => {
    const pendingDetermination = getClaimStatusDescription(ScenarioType.PendingDetermination)
    expect(pendingDetermination).toBe('claim-status:pending-determination.description')

    const basePending = getClaimStatusDescription(ScenarioType.BasePending)
    expect(basePending).toBe('claim-status:base-pending.description')

    const baseNoPending = getClaimStatusDescription(ScenarioType.BaseNoPending)
    expect(baseNoPending).toBe('claim-status:base-no-pending.description')
  })
  it('throws an error if given an unknown scenario', () => {
    expect(() => {
      getClaimStatusDescription('unknown')
    }).toThrowError('Unknown Scenario Type')
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

// Test getScenario(): error
describe('Getting the scenario', () => {
  it.skip('errors when given an unknown scenario', () => {
    expect(() => {
      getScenario({})
    }).toThrowError('Unknown Scenario')
})

// Test mapProgramType()
describe('Converting ProgramType to user-facing strings', () => {
  it('returns the correct string for each known ProgramType', () => {
    for (const [id, map] of Object.entries(programTypeMapping)) {
      const parts: ProgramTypeParts = mapProgramType(programTypes[id])
      expect(parts.programType).toBe(map.programType)
      expect(parts.extensionType).toBe(parts.extensionType)
    }
  })

  it('throws an error if an unknown ProgramType is given', () => {
    expect(() => {
      mapProgramType('unknown')
    }).toThrowError('Unknown Program Type')
  })
})
