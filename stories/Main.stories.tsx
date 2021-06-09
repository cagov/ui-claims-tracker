import { Story, Meta } from '@storybook/react'
import { withNextRouter } from 'storybook-addon-next-router'

import { Main as MainComponent, MainProps } from '../components/Main'

export default {
  title: 'Component/Page Section/Main',
  component: MainComponent,
  decorators: [withNextRouter],
} as Meta

const Template: Story<MainProps> = (args) => <MainComponent {...args} />

export const Main = Template.bind({})
Main.args = {}

export const TimedOut = Template.bind({})
TimedOut.args = { timedOut: true }

export const Loading = Template.bind({})
Loading.args = { loading: true }
