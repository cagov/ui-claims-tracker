import { useTranslation } from 'next-i18next'

import { NextSteps } from './NextSteps'
import { TextLine } from './TextLine'
import { ClaimStatusContent } from '../types/common'

export interface ClaimStatusProps extends ClaimStatusContent {
  loading: boolean
}

export const ClaimStatus: React.FC<ClaimStatusProps> = ({ loading = false, statusDescription, nextSteps }) => {
  const { t } = useTranslation(['common', 'claim-status'])

  let nextStepsElement: JSX.Element[] = []
  if (nextSteps) {
    nextStepsElement = (
      <div className="status-box">
        <div className="topbar">
          <h3 className="next-steps">{t('claim-status.next-steps')}</h3>
        </div>
        <div className="explanation">
          <NextSteps loading={loading} nextSteps={nextSteps} />
        </div>
      </div>
    )
  }

  return (
    <div className="claim-status">
      <h2>{t('claim-status.title')}</h2>
      <div className="pending-status">
        <TextLine loading={loading} text={t(statusDescription)} />
      </div>
      {nextStepsElement}
    </div>
  )
}
