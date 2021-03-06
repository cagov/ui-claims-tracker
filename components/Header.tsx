import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { useTranslation } from 'next-i18next'
import getUrl from '../utils/getUrl'

export interface HeaderProps {
  userArrivedFromUioMobile: boolean
}

export const Header: React.FC<HeaderProps> = ({ userArrivedFromUioMobile = false }) => {
  const { t } = useTranslation('common')

  // Return a link back to:
  //   UIO Mobile landing page if user arrived from UIO Mobile
  //   main UIO landing page if user arrived from main UIO
  const uioHomeLink = userArrivedFromUioMobile ? getUrl('uio-home-url-mobile') : getUrl('uio-home-url-desktop')

  return (
    <header className="header border-bottom border-secondary">
      <Navbar collapseOnSelect className="justify-content-between" expand="lg" fixed-top="true" variant="dark">
        <Container>
          <Navbar.Brand target="_blank" rel="noopener noreferrer" href={getUrl('ca-gov')}>
            <img
              src="/claimstatus/images/Ca-Gov-Logo-Gold.svg"
              alt={t('header.alt-image-cagov')}
              width="46"
              height="34"
            />
          </Navbar.Brand>
          <Nav>
            <Navbar.Collapse>
              <Nav.Link target="_blank" rel="noopener noreferrer" href={getUrl('edd-ca-gov')}>
                <span className="text">{t('header.edd-home')}</span>
              </Nav.Link>
            </Navbar.Collapse>
            <Nav.Link target="_blank" rel="noopener noreferrer" href={getUrl('edd-help-new-claim')}>
              <span className="text">{t('header.help')}</span>
            </Nav.Link>
            <Nav.Link href={getUrl('edd-log-out')}>
              <span className="text">{t('header.logout')}</span>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Navbar className="justify-content-between" expand="lg" variant="light">
        <Container>
          <Navbar.Brand target="_blank" rel="noopener noreferrer" href={getUrl('edd-ca-gov')}>
            <img
              src="/claimstatus/images/edd-logo-2-Color.svg"
              alt={t('header.alt-image-edd')}
              height="60"
              width="171"
              className="d-inline-block align-top mr-5"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav>
              <Nav.Link target="_blank" rel="noopener noreferrer" href={uioHomeLink}>
                <span className="text">{t('header.uio-home')}</span>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}
