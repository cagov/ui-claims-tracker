import { useTranslation } from 'next-i18next'

import { NextSteps } from './NextSteps'
import { TextLine } from './TextLine'
import { ClaimStatusContent } from '../types/common'

export interface ClaimStatusProps extends ClaimStatusContent {
  loading: boolean
}

export const ClaimStatus: React.FC<ClaimStatusProps> = ({ loading = false, statusDescription, nextSteps }) => {
  const { t } = useTranslation(['common', 'claim-status'])

  return (
    <div className="claim-status claim-section">
      <h2>{t('claim-status.title')}</h2>
      <div className="pending-status claim-subsection">
        <TextLine loading={loading} header text={t(statusDescription)} />
      </div>
      <NextSteps loading={loading} header={t('claim-status.next-steps')} nextSteps={nextSteps} />
    </div>
  )
}
