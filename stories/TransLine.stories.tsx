import { Story, Meta } from '@storybook/react'
import { TransLine as TransLineComponent, TransLineProps } from '../components/TransLine'

export default {
  title: 'Component/Atoms/Trans Line',
  component: TransLineComponent,
} as Meta

const Template: Story<TransLineProps> = (args) => <TransLineComponent {...args} />

export const TransLine = Template.bind({})
TransLine.args = {
  i18nKey: 'work-in-progress.message',
  links: ['https://navapbc.com', 'https://edd.ca.gov'],
}
