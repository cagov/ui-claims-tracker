import { useTranslation } from 'next-i18next'
import { InfoField } from './InfoField'
import { ClaimDetailsContent } from '../types/common'

export interface ClaimDetailsProps extends ClaimDetailsContent {
  loading: boolean
}

export const ClaimDetails: React.FC<ClaimDetailsProps> = ({
  loading = false,
  programType = 'Unemployment Insurance (UI)',
  benefitYear = '3/21/2020 - 3/20/2021',
  claimBalance = '$508.00',
  weeklyBenefitAmount = '$120.00',
  lastPaymentIssued = '4/29/2021',
  extentionType = 'Tier 2 Extension',
  extensionEndDate = '5/22/2021',
}) => {
  const { t } = useTranslation('common')

  return (
    <div className="claim-details container">
      <h2>{t('claim-details.title')}</h2>

      <div className="claim-details-box">
        <div className="row">
          <div className="col-6">
            <InfoField loading={loading} label={t('claim-details.program-type')} text={programType} />

            <InfoField loading={loading} label={t('claim-details.benefit-year')} text={benefitYear} />

            <InfoField loading={loading} label={t('claim-details.claim-balance')} text={claimBalance} />

            <InfoField loading={loading} label={t('claim-details.weekly-benefit-amount')} text={weeklyBenefitAmount} />

            <InfoField loading={loading} label={t('claim-details.last-payment-issued')} text={lastPaymentIssued} />
          </div>
          <div className="col-6">
            <div />
            <InfoField loading={loading} label={t('claim-details.extension-type')} text={extensionType} />

            <InfoField loading={loading} label={t('claim-details.extension-end-date')} text={extensionEndDate} />
          </div>
        </div>
      </div>
    </div>
  )
}
