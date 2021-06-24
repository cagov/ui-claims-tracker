import { Story, Meta } from '@storybook/react'
import { withNextRouter } from 'storybook-addon-next-router'

import Home, { HomeProps } from '../pages/index'
import * as MainStories from './Main.stories'
import { ScenarioContent } from '../types/common'

export default {
  title: 'Claim Tracker/Page',
  component: Home,
  decorators: [withNextRouter],
} as Meta

const Template: Story<HomeProps> = (args) => <Home {...args} />

export const Page = Template.bind({})
Page.args = {
  scenarioContent: MainStories.Main.args as ScenarioContent,
  errorCode: null,
}
