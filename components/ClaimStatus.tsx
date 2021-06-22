import { useTranslation } from 'next-i18next'

import { NextSteps } from './NextSteps'
import { TextLine } from './TextLine'

export interface ClaimStatusProps {
  loading: boolean
  statusDescriptionKey: string
  nextSteps?: string[]
}

export const ClaimStatus: React.FC<ClaimStatusProps> = ({
  loading,
  statusDescriptionKey = 'claim-status.generic-pending',
  nextSteps = ['step one', 'step two'],
}) => {
  const { t } = useTranslation('common')

  return (
    <div className="claim-status">
      <h2>{t('claim-status.title')}</h2>
      <div className="pending-status">
        <TextLine loading={loading} text={t(statusDescriptionKey)} />
      </div>
      <div className="status-box">
        <div className="topbar">
          <h3 className="next-steps">{t('claim-status.next-steps')}</h3>
        </div>
        <div className="explanation">
          <NextSteps loading={loading} nextSteps={nextSteps} />
        </div>
      </div>
    </div>
  )
}
