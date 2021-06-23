import renderer from 'react-test-renderer'
import { render, screen } from '@testing-library/react'
import Index from '../../pages/index'
import getScenarioContent from '../../utils/getScenarioContent'
import { ScenarioContent } from '../../types/common'

import { useRouter } from 'next/router'

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))

let scenarioContent: ScenarioContent

beforeAll(() => {
  const pendingDeterminationScenario = { pendingDetermination: ['temporary text'] }
  scenarioContent = getScenarioContent(pendingDeterminationScenario)
})

describe('Exemplar react-test-renderer Snapshot test', () => {
  it('renders homepage unchanged', () => {
    const mockRouter = {
      locale: 'en',
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    const tree = renderer.create(<Index loading={false} scenarioContent={scenarioContent} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Example react testing-library Test', () => {
  it('has our placeholder app', () => {
    render(<Index loading={false} scenarioContent={scenarioContent} />)
    expect(screen.queryByText('Claim Tracker')).toBeInTheDocument()
  })
})
