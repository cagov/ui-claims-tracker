import { Story, Meta } from '@storybook/react'

import { ClaimStatus as ClaimStatusComponent, ClaimStatusProps } from '../components/ClaimStatus'

export default {
  title: 'Component/Page Section/Claim Status',
  component: ClaimStatusComponent,
} as Meta

const Template: Story<ClaimStatusProps> = (args) => <ClaimStatusComponent {...args} />

export const ClaimStatus = Template.bind({})
ClaimStatus.args = {
  statusDescription: 'claim-status:base-pending.description',
  nextSteps: ['step one', 'step two'],
}
