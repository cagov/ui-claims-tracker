import renderer from 'react-test-renderer'
import { ClaimStatus } from '../../components/ClaimStatus'
import getScenarioContent, { ScenarioType } from '../../utils/getScenarioContent'
import apiGatewayStub from '../../utils/apiGatewayStub'
import { ClaimStatusContent } from '../../types/common'

function renderClaimStatusComponent(statusContent: ClaimStatusContent): string {
  return renderer
    .create(
      <ClaimStatus
        loading={false}
        heading={statusContent.heading}
        summary={statusContent.summary}
        yourNextSteps={statusContent.yourNextSteps}
        eddNextSteps={statusContent.eddNextSteps}
      />,
    )
    .toJSON()
}

function testClaimStatus(scenarioType: ScenarioType, hasCertificationWeeksAvailable: boolean): string {
  const scenarioContent = getScenarioContent(apiGatewayStub(scenarioType, hasCertificationWeeksAvailable))
  return renderClaimStatusComponent(scenarioContent.statusContent)
}

describe('Scenario 1', () => {
  it('matches when there are weeks to certify', () => {
    expect(testClaimStatus(ScenarioType.Scenario1, true)).toMatchSnapshot()
  })
  it("matches when there aren't weeks to certify", () => {
    expect(testClaimStatus(ScenarioType.Scenario1, false)).toMatchSnapshot()
  })
})

describe('Scenario 4', () => {
  it('matches when there are weeks to certify', () => {
    expect(testClaimStatus(ScenarioType.Scenario4, true)).toMatchSnapshot()
  })
  it("matches when there aren't weeks to certify", () => {
    expect(testClaimStatus(ScenarioType.Scenario4, false)).toMatchSnapshot()
  })
})

// Note that Scenarios 5 & 6 explicitly differ based on whether hasCertificationWeeksAvailable
// is true or false, so it doesn't make sense to test again.
describe('Scenario 5', () => {
  it('matches', () => {
    expect(testClaimStatus(ScenarioType.Scenario5)).toMatchSnapshot()
  })
})

describe('Scenario 6', () => {
  it('matches', () => {
    expect(testClaimStatus(ScenarioType.Scenario6)).toMatchSnapshot()
  })
})
