import getScenarioContent, {
  buildBenefitYear,
  buildConditionalNextSteps,
  getClaimDetails,
  getScenario,
  getClaimStatusDescription,
  mapProgramType,
  programTypeMapping,
  ProgramTypeParts,
  programTypes,
  ScenarioType,
} from '../../utils/getScenarioContent'
import { ScenarioContent } from '../../types/common'
import urls from '../../public/urls.json'

// Shared test constants for mock API gateway responses
const pendingDeterminationScenario = { pendingDetermination: ['temporary text'] }
const basePendingScenario = { hasPendingWeeks: true }
const baseNoPendingActiveScenario = { hasPendingWeeks: false, claimDetails: { monetaryStatus: 'active' } }
const baseNoPendingInactiveScenario = { hasPendingWeeks: false, claimDetails: { monetaryStatus: 'inactive' } }

/**
 * Begin tests
 */

// Test getScenarioContent()

// Test getClaimStatusDescripton()
describe('Getting the Claim Status description', () => {
  it('returns the correct description for the scenario', () => {
    const pendingDetermination = getClaimStatusDescription(ScenarioType.PendingDetermination)
    expect(pendingDetermination).toBe('claim-status:pending-determination.description')

    const basePending = getClaimStatusDescription(ScenarioType.BasePending)
    expect(basePending).toBe('claim-status:base-pending.description')

    const baseNoPendingActive = getClaimStatusDescription(ScenarioType.BaseNoPendingActive)
    expect(baseNoPendingActive).toBe('claim-status:base-no-pending-active.description')

    const baseNoPendingInactive = getClaimStatusDescription(ScenarioType.BaseNoPendingInactive)
    expect(baseNoPendingInactive).toBe('claim-status:base-no-pending-inactive.description')
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

// Test getScenario(): base state with no pending weeks; active claim scenario
describe('The base state (with no pending weeks); active claim scenario', () => {
  it('is returned when there are no pending weeks and there is an active claim', () => {
    const scenarioType: ScenarioType = getScenario(baseNoPendingActiveScenario)
    expect(scenarioType).toBe(ScenarioType.BaseNoPendingActive)
  })

  it('is returned when there are no pending weeks and there is an active claim and pendingDetermination is null', () => {
    const baseNoPendingActiveScenarioNull = {
      hasPendingWeeks: false,
      claimDetails: { monetaryStatus: 'active' },
      pendingDetermination: null,
    }
    const scenarioType: ScenarioType = getScenario(baseNoPendingActiveScenarioNull)
    expect(scenarioType).toBe(ScenarioType.BaseNoPendingActive)
  })

  it('is returned when there are no pending weeks and there is an active claim and pendingDetermination is an empty array', () => {
    const baseNoPendingActiveScenarioEmpty = {
      hasPendingWeeks: false,
      claimDetails: { monetaryStatus: 'active' },
      pendingDetermination: [],
    }
    const scenarioType: ScenarioType = getScenario(baseNoPendingActiveScenarioEmpty)
    expect(scenarioType).toBe(ScenarioType.BaseNoPendingActive)
  })
})

// Test getScenario(): base state with no pending weeks; Inactive claim scenario
describe('The base state (with no pending weeks); Inactive claim scenario', () => {
  it('is returned when there are no pending weeks and monetaryStatus is set to "inactive"', () => {
    const scenarioType: ScenarioType = getScenario(baseNoPendingInactiveScenario)
    expect(scenarioType).toBe(ScenarioType.BaseNoPendingInactive)
  })

  it('is returned when there are no pending weeks and monetaryStatus is set to null', () => {
    const inactiveScenario = {
      hasPendingWeeks: false,
      pendingDetermination: null,
      claimDetails: {
        monetaryStatus: null,
      },
    }
    const scenarioType: ScenarioType = getScenario(inactiveScenario)
    expect(scenarioType).toBe(ScenarioType.BaseNoPendingInactive)
  })

  it('is returned when there are no pending weeks and monetaryStatus is set to undefined', () => {
    const inactiveScenario = {
      hasPendingWeeks: false,
      pendingDetermination: null,
      claimDetails: {
        monetaryStatus: undefined,
      },
    }
    const scenarioType: ScenarioType = getScenario(inactiveScenario)
    expect(scenarioType).toBe(ScenarioType.BaseNoPendingInactive)
  })

  it('is returned when there are no pending weeks and monetaryStatus is not set', () => {
    const inactiveScenario = {
      hasPendingWeeks: false,
      pendingDetermination: null,
      claimDetails: {
        programType: 'UI',
      },
    }
    const scenarioType: ScenarioType = getScenario(inactiveScenario)
    expect(scenarioType).toBe(ScenarioType.BaseNoPendingInactive)
  })

  it('errors if there is no claimDetails object', () => {
    const baseNoPendingActiveScenarioNull = {
      hasPendingWeeks: false,
      pendingDetermination: null,
    }
    expect(() => {
      getScenario(baseNoPendingActiveScenarioNull)
    }).toThrowError('Missing claim details')
  })
})

// Test getScenario(): error
describe('Getting the scenario', () => {
  it('errors when given an unknown scenario', () => {
    expect(() => {
      getScenario({})
    }).toThrowError('Unknown Scenario')
  })
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

// Test buildBenefitYear()
describe('Constructing the benefit year', () => {
  it('results in a date range string', () => {
    const range = buildBenefitYear('foo', 'bar')
    expect(range).toBe('foo - bar')
  })
})

// Test getClaimDetails()
describe('Constructing the Claim Details object', () => {
  it('returns all the expected values', () => {
    // Mock ClaimDetailsResults
    const rawDetails = {
      programType: 'UI',
      benefitYearStartDate: '5/21/21',
      benefitYearEndDate: '5/20/22',
      claimBalance: '$100',
      weeklyBenefitAmount: '$25',
      lastPaymentIssued: '3/12/21',
      lastPaymentAmount: '$10',
      monetaryStatus: 'active',
    }

    // Expected results
    const expected = {
      programType: 'claim-details:program-type.ui',
      benefitYear: '5/21/21 - 5/20/22',
      claimBalance: rawDetails.claimBalance,
      weeklyBenefitAmount: rawDetails.weeklyBenefitAmount,
      lastPaymentIssued: rawDetails.lastPaymentIssued,
      extensionType: '',
    }
    const claimDetails = getClaimDetails(rawDetails)
    expect(claimDetails).toStrictEqual(expected)
  })
})

// Test buildConditionalNextSteps(): conditional next steps
describe('Conditional Next Steps', () => {
  it('are returned when there are certification weeks left', () => {
    // Scenario type can be anything except BaseNoPendingInactive.
    const scenarioType = ScenarioType.BasePending
    const claimData = {
      hasCertificationWeeksAvailable: true,
    }
    const certifyNoPending: NextStep[] = [
      {
        i18nString: 'claim-status:conditional-next-steps:certify-no-pending',
        links: [urls['edd-ui-certify']],
      },
    ]
    const nextSteps: string[] = buildConditionalNextSteps(scenarioType, claimData)
    expect(nextSteps).toStrictEqual(certifyNoPending)
  })

  it('are returned when there are certification weeks left and pending weeks left', () => {
    // Scenario type can be anything except BaseNoPendingInactive.
    const scenarioType = ScenarioType.BasePending
    const claimData = {
      hasCertificationWeeksAvailable: true,
      hasPendingWeeks: true,
    }
    const certifyPending: NextStep[] = [
      {
        i18nString: 'claim-status:conditional-next-steps:certify-pending',
        links: [urls['edd-ui-certify']],
      },
    ]
    const nextSteps: string[] = buildConditionalNextSteps(scenarioType, claimData)
    expect(nextSteps).toStrictEqual(certifyPending)
  })

  it('are not returned when there are no certification weeks left', () => {
    // Scenario type can be anything except BaseNoPendingInactive.
    const scenarioType = ScenarioType.BasePending
    const claimData = {
      hasCertificationWeeksAvailable: false,
      hasPendingWeeks: null,
    }
    const nextSteps: string[] = buildConditionalNextSteps(scenarioType, claimData)
    expect(nextSteps).toStrictEqual([])
  })

  it('are not returned when there are no certification weeks left, regardless of pending weeks', () => {
    // Scenario type can be anything except BaseNoPendingInactive.
    const scenarioType = ScenarioType.BasePending
    const claimData = {
      hasCertificationWeeksAvailable: false,
      hasPendingWeeks: true,
    }
    const nextSteps: string[] = buildConditionalNextSteps(scenarioType, claimData)
    expect(nextSteps).toStrictEqual([])
  })

  it('are not returned if the scenario is Base State (with no pending weeks) with inactive claim', () => {
    const scenarioType = ScenarioType.BaseNoPendingInactive
    const claimData = {
      hasCertificationWeeksAvailable: true,
      hasPendingWeeks: true,
    }
    const nextSteps: string[] = buildConditionalNextSteps(scenarioType, claimData)
    expect(nextSteps).toStrictEqual([])
  })
})
