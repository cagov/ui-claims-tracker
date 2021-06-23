import '@testing-library/jest-dom/extend-expect'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from './public/locales/en/common.json'
import enClaimStatus from './public/locales/en/claim-status.json'

/* eslint-disable @typescript-eslint/no-floating-promises */
// Disabling this rule due to hitting a half hour of debugging,
// and considering this is a specialized file used only for tests

// Mock react-i18next for tests
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'claim-status'],
  defaultNS: 'common',
  resources: {
    en: { common: enCommon, 'claim-status': enClaimStatus },
  },
})
/* eslint-enable @typescript-eslint/no-floating-promises */
