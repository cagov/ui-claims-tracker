import { Trans } from 'react-i18next'
import React from 'react'

export interface TransLineProps {
  i18nKey: string // Expects an i18n key
  links?: string[] | null
}

export const TransLine: React.FC<TransLineProps> = ({ i18nKey, links = null }) => {
  let linkComponents: JSX.Element[] = []
  if (links && links.length > 0) {
    // Disabling some linting rules for this line. The anchor <a> element will
    // be interporlated by <Trans>.
    /* eslint-disable jsx-a11y/anchor-has-content */
    /* eslint-disable react/self-closing-comp */
    linkComponents = links.map((link) => <a href={link} key={link}></a>)
    /* eslint-enable jsx-a11y/anchor-has-content */
    /* eslint-enable react/self-closing-comp */
  }
  return <Trans i18nKey={i18nKey}>{linkComponents}</Trans>
}
