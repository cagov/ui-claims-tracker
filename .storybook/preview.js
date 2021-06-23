/*
 * Preview.js is loaded in the Canvas tab, the “preview” iframe that renders your components in isolation. Use preview.js
 * for global code (such as CSS imports or JavaScript mocks) that applies to all stories.
 */
import '../styles/globals.scss'
import { initReactI18next } from 'react-i18next'
import i18n from './i18n'

import enCommon from '../public/locales/en/common.json'
import enClaimStatus from '../public/locales/en/claim-status.json'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      method: 'alphabetical',
      order: [
        'Claim Tracker',
        'Component',
        [
          'Page Section',
          [
            'Work In Progress',
            'Header',
            'Main',
            'Claim Section',
            'Claim Status',
            'Next Steps',
            'Claim Details',
            'Footer',
          ],
        ],
        'Atoms',
      ],
    },
  },
}

export const decorators = [
  (Story, Context) => {
    i18n.use(initReactI18next).init({
      lng: 'en',
      fallbackLng: 'en',
      ns: ['common', 'claim-status'],
      defaultNS: 'common',
      resources: {
        en: { common: enCommon, 'claim-status': enClaimStatus },
      },
    })

    return <Story />
  },
]
