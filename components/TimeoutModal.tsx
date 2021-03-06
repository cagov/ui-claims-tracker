import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import Modal from 'react-bootstrap/Modal'

import { Button } from './Button'
import getUrl from '../utils/getUrl'

let timeOutTimerId: NodeJS.Timeout | null = null
let warningTimerId: NodeJS.Timeout | null = null

export interface TimeoutModalProps {
  action: string
  timedOut: boolean
}

export const TimeoutModal: React.FC<TimeoutModalProps> = (props) => {
  const { t } = useTranslation()
  const { action, timedOut } = props
  const TIMEOUT_MS = 30 * 60 * 1000
  const TIMEOUT_DISPLAY_TIME_IN_MINUTES = 5
  const TIMEOUT_WARNING_MS = TIMEOUT_MS - TIMEOUT_DISPLAY_TIME_IN_MINUTES * 60 * 1000
  const [numberOfMinutes, setNumberOfMinutes] = useState(TIMEOUT_DISPLAY_TIME_IN_MINUTES)
  const [showWarningModal, setShowWarningModal] = useState<boolean | null>(timedOut)

  useEffect(() => {
    if (showWarningModal) {
      const timer = setTimeout(() => {
        setNumberOfMinutes(numberOfMinutes - 1)
      }, 60 * 1000)
      return () => clearTimeout(timer)
    }
  })

  useEffect(() => {
    if (showWarningModal) {
      const timer = setTimeout(() => {
        setNumberOfMinutes(numberOfMinutes - 1)
      }, 60 * 1000)
      return () => clearTimeout(timer)
    }
  })

  function clear() {
    if (timeOutTimerId) {
      clearTimeout(timeOutTimerId)
      timeOutTimerId = null
    }
    if (warningTimerId) {
      clearTimeout(warningTimerId)
      warningTimerId = null
    }
  }

  function startOrUpdate() {
    clear()
    warningTimerId = setTimeout(() => {
      setShowWarningModal(true)
      setNumberOfMinutes(TIMEOUT_DISPLAY_TIME_IN_MINUTES)
    }, TIMEOUT_WARNING_MS)
    timeOutTimerId = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const eddLocation = getUrl('edd-log-in')?.concat(encodeURIComponent(window.location.toString()))
        window.location.href = eddLocation || ''
      }
    }, TIMEOUT_MS)
  }

  function closeWarningModal() {
    setShowWarningModal(false)
    startOrUpdate()
  }

  // If the modal is showing, we don't want to restart the timer.
  if (action === 'startOrUpdate' && !showWarningModal) {
    startOrUpdate()
  } else if (action === 'clear') {
    clear()
  }

  return (
    <Modal show={showWarningModal} onHide={closeWarningModal} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title>
          <strong>{t('timeout-modal.header')}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('timeout-modal.warning', { numberOfMinutes })}</Modal.Body>
      <Modal.Footer className="border-0">
        <Button onClick={closeWarningModal} label={t('timeout-modal.button')} />
      </Modal.Footer>
    </Modal>
  )
}
