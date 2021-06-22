import { useTranslation } from 'next-i18next'

import { NextSteps } from './NextSteps'
import { TextLine } from './TextLine'
import { ScenarioType } from '../utils/getScenario'

export interface ClaimStatusProps {
  loading: boolean
  scenarioType: ScenarioType
  nextSteps?: string[]
}

export const ClaimStatus: React.FC<ClaimStatusProps> = ({
  loading,
  scenarioType = ScenarioType.PendingDetermination,
  nextSteps = ['step one', 'step two'],
}) => {
  const { t } = useTranslation('common')

  let status = ''
  if (scenarioType === ScenarioType.PendingDetermination) {
    status = t('claim-status.pending-determination')
  } else if (scenarioType === ScenarioType.GenericPending) {
    status = t('claim-status.generic-pending')
  } else {
    status = t('claim-status.generic-all-clear')
  }

  return (
    <div className="claim-status">
      <h2>{t('claim-status.title')}</h2>
      <div className="pending-status">
        <TextLine loading={loading} text={status} />
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
