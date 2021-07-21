import renderer from 'react-test-renderer'
import { ClaimStatus } from '../../components/ClaimStatus'
import getScenarioContent, { ScenarioType } from '../../utils/getScenarioContent'
import apiGatewayStub from '../../utils/apiGatewayStub'
import { ClaimStatusContent } from '../../types/common'

function renderClaimStatusComponent(statusContent: ClaimStatusContent, userArrivedFromUioMobile: boolean): string {
  return renderer
    .create(
      <ClaimStatus
        loading={false}
        userArrivedFromUioMobile={userArrivedFromUioMobile}
        heading={statusContent.heading}
        summary={statusContent.summary}
        yourNextSteps={statusContent.yourNextSteps}
        eddNextSteps={statusContent.eddNextSteps}
      />,
    )
    .toJSON()
}

function testClaimStatus(
  scenarioType: ScenarioType,
  hasCertificationWeeksAvailable: boolean,
  userArrivedFromUioMobile: boolean,
): string {
  const scenarioContent = getScenarioContent(apiGatewayStub(scenarioType, hasCertificationWeeksAvailable))
  return renderClaimStatusComponent(scenarioContent.statusContent, userArrivedFromUioMobile)
}

describe('Scenario 1', () => {
  it('matches when there are weeks to certify, on desktop', () => {
    expect(testClaimStatus(ScenarioType.Scenario1, true)).toMatchSnapshot()
  })
  it('matches when there are weeks to certify, on mobile', () => {
    expect(testClaimStatus(ScenarioType.Scenario1, true, true)).toMatchSnapshot()
  })

  it("matches when there aren't weeks to certify, on desktop", () => {
    expect(testClaimStatus(ScenarioType.Scenario1, false)).toMatchSnapshot()
  })
  it("matches when there aren't weeks to certify, on mobile", () => {
    expect(testClaimStatus(ScenarioType.Scenario1, false, true)).toMatchSnapshot()
  })
})

describe('Scenario 4', () => {
  it('matches when there are weeks to certify, on desktop', () => {
    expect(testClaimStatus(ScenarioType.Scenario4, true)).toMatchSnapshot()
  })
  it('matches when there are weeks to certify, on mobile', () => {
    expect(testClaimStatus(ScenarioType.Scenario4, true, true)).toMatchSnapshot()
  })

  it("matches when there aren't weeks to certify, on desktop", () => {
    expect(testClaimStatus(ScenarioType.Scenario4, false)).toMatchSnapshot()
  })
  it("matches when there aren't weeks to certify, on mobile", () => {
    expect(testClaimStatus(ScenarioType.Scenario4, false, true)).toMatchSnapshot()
  })
})

// Note that Scenarios 5 & 6 explicitly differ based on whether hasCertificationWeeksAvailable
// is true or false, so it doesn't make sense to test again.
describe('Scenario 5', () => {
  it('matches, on desktop', () => {
    expect(testClaimStatus(ScenarioType.Scenario5)).toMatchSnapshot()
  })
  it('matches, on mobile', () => {
    expect(testClaimStatus(ScenarioType.Scenario5, true, true)).toMatchSnapshot()
  })
})

describe('Scenario 6', () => {
  it('matches, on desktop', () => {
    expect(testClaimStatus(ScenarioType.Scenario6)).toMatchSnapshot()
  })
  it('matches, on mobile', () => {
    expect(testClaimStatus(ScenarioType.Scenario6, true, true)).toMatchSnapshot()
  })
})
