import { Story, Meta } from '@storybook/react'
import { withNextRouter } from 'storybook-addon-next-router'

import { Main as MainComponent, MainProps } from '../components/Main'
import * as ClaimDetailsStories from './ClaimDetails.stories'
import * as ClaimStatusStories from './ClaimStatus.stories'
import { ClaimDetailsContent, ClaimStatusContent } from '../types/common'

export default {
  title: 'Component/Page Section/Main',
  component: MainComponent,
  decorators: [withNextRouter],
} as Meta

const Template: Story<MainProps> = (args) => <MainComponent {...args} />

export const Main = Template.bind({})
Main.args = {
  detailsContent: ClaimDetailsStories.ClaimDetails.args as ClaimDetailsContent,
  statusContent: ClaimStatusStories.ClaimStatus.args as ClaimStatusContent,
}

export const TimedOut = Template.bind({})
TimedOut.args = { timedOut: true, ...Main.args }

export const Loading = Template.bind({})
Loading.args = { loading: true, ...Main.args }
