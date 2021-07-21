import { Story, Meta } from '@storybook/react'
import { TransLine as TransLineComponent, TransLineProps } from '../components/TransLine'

export default {
  title: 'Component/Atoms/Trans Line',
  component: TransLineComponent,
} as Meta

const Template: Story<TransLineProps> = (args) => <TransLineComponent {...args} />

export const TransLine = Template.bind({})
TransLine.args = {
  i18nKey: 'claim-status:scenarios.scenario1.your-next-steps.0.text',
  links: ['https://edd.ca.gov'],
}
