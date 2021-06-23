import { render, screen } from '@testing-library/react'
import { Main } from '../../components/Main'
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

describe('Main component shows the page', () => {
  it('has our title, details, and body', () => {
    const mockRouter = {
      locale: 'en',
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    render(
      <Main
        loading={false}
        statusContent={scenarioContent.statusContent}
        detailsContent={scenarioContent.detailsContent}
      />,
    )
    expect(screen.queryByText('Claim Tracker')).toBeInTheDocument()
    expect(screen.queryByText('Claim Status')).toBeInTheDocument()
    expect(screen.queryByText('Next Steps')).toBeInTheDocument()
    expect(screen.queryByText('Benefit Year')).toBeInTheDocument()
    expect(screen.queryByText('Claim Status')).toBeInTheDocument()
  })
})

describe('Main component shows loading', () => {
  it('has our titles but content is shimmer', () => {
    const mockRouter = {
      locale: 'en',
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    render(
      <Main loading statusContent={scenarioContent.statusContent} detailsContent={scenarioContent.detailsContent} />,
    )
    expect(screen.queryByText('Claim Tracker')).toBeInTheDocument()
    expect(screen.queryByText('Claim Status')).toBeInTheDocument()
    expect(screen.queryByText('Next Steps')).toBeInTheDocument()
    expect(screen.queryByText('Benefit Year')).not.toBeInTheDocument()
    expect(screen.queryByText('Claim Status')).toBeInTheDocument()
    expect(screen.queryByText('Your payments')).not.toBeInTheDocument()
  })
})

describe('Main component shows the timeout', () => {
  it('has our timeout modal', () => {
    const mockRouter = {
      locale: 'en',
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    render(
      <Main
        timedOut
        loading={false}
        statusContent={scenarioContent.statusContent}
        detailsContent={scenarioContent.detailsContent}
      />,
    )
    expect(screen.queryByText('Your Session Will End Soon')).toBeInTheDocument()
  })
})
