import { render, screen } from '@testing-library/react'
import { TransLine } from '../../components/TransLine'

describe('TransLine component loads', () => {
  it('a string with no links or styles', () => {
    render(<TransLine i18nKey="test:transLine.plainString" />)
    expect(screen.getByText('just text')).toBeInTheDocument()
  })

  it('a string with one link and no styles', () => {
    const links = ['https://example.com']
    render(<TransLine i18nKey="test:transLine.plainStringOneLink" links={links} />)
    expect(screen.getByRole('link', { name: 'second' })).toHaveAttribute('href', links[0])
  })

  it('a string with multiple links and no styles', () => {
    const links = ['https://example.com/alpha', 'https://example.com/beta']
    render(<TransLine i18nKey="test:transLine.plainStringLinks" links={links} />)
    expect(screen.getByRole('link', { name: 'second' })).toHaveAttribute('href', links[0])
    expect(screen.getByRole('link', { name: 'third' })).toHaveAttribute('href', links[1])
  })

  it('a string with multiple links reused links and out of order', () => {
    const links = ['https://example.com/alpha', 'https://example.com/beta']
    render(<TransLine i18nKey="test:transLine.plainStringLinksComplicated" links={links} />)
    expect(screen.getByRole('link', { name: 'second' })).toHaveAttribute('href', links[0])
    expect(screen.getByRole('link', { name: 'fourth' })).toHaveAttribute('href', links[0])
    expect(screen.getByRole('link', { name: 'first' })).toHaveAttribute('href', links[1])
    expect(screen.getByRole('link', { name: 'fifth' })).toHaveAttribute('href', links[1])
  })

  it('a string with no links, but with styles', () => {
    render(<TransLine i18nKey="test:transLine.styledString" />)
    expect(screen.getByText('first', { exact: false })).toBeInTheDocument()
    screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'strong' && content.startsWith('second')
    })
    expect(screen.getByText('third', { exact: false })).toBeInTheDocument()
  })

  it('a string with one link and styles', () => {
    const links = ['https://example.com/alpha']
    render(<TransLine i18nKey="test:transLine.styledStringOneLink" links={links} />)
    expect(screen.getByText('first', { exact: false })).toBeInTheDocument()
    screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'strong' && content.startsWith('second')
    })
    expect(screen.getByRole('link', { name: 'third' })).toHaveAttribute('href', links[0])
  })

  it('a string with a styled link', () => {
    const links = ['https://example.com/alpha']
    render(<TransLine i18nKey="test:transLine.styledLink" links={links} />)
    expect(screen.getByText('first', { exact: false })).toBeInTheDocument()
    screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'strong'
    })
    expect(screen.getByRole('link', { name: 'second' })).toHaveAttribute('href', links[0])
  })
})
