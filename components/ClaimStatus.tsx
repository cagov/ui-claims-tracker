import { useTranslation } from 'next-i18next'

import { NextSteps } from './NextSteps'
import { TextLine } from './TextLine'
import { TransLine } from './TransLine'
import { ClaimStatusContent } from '../types/common'

export interface ClaimStatusProps extends ClaimStatusContent {
  loading: boolean
  userArrivedFromUioMobile: boolean
}

export const ClaimStatus: React.FC<ClaimStatusProps> = ({
  loading = false,
  userArrivedFromUioMobile = false,
  heading,
  summary,
  yourNextSteps,
  eddNextSteps,
}) => {
  const { t } = useTranslation(['common', 'claim-status'])

  return (
    <div className="claim-status claim-section">
      <h2>{t('claim-status.title')}</h2>
      <div className="pending-status claim-subsection">
        <TextLine loading={loading} header text={t(heading)} />
      </div>
      <div className="summary">
        <TransLine
          loading={loading}
          userArrivedFromUioMobile={userArrivedFromUioMobile}
          i18nKey={summary.i18nKey}
          links={summary.links}
        />
      </div>
      <NextSteps
        loading={loading}
        userArrivedFromUioMobile={userArrivedFromUioMobile}
        header={t('claim-status.your-next-steps')}
        nextSteps={yourNextSteps}
      />
      <NextSteps
        loading={loading}
        userArrivedFromUioMobile={userArrivedFromUioMobile}
        header={t('claim-status.edd-next-steps')}
        nextSteps={eddNextSteps}
      />
    </div>
  )
}
