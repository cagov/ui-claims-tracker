import getUrl from '../../utils/getUrl'

describe('Retrieving urls', () => {
  // Note: This tests against real content
  it('works for real keys', () => {
    expect(getUrl('ca-gov')).toBe('https://www.ca.gov/')
  })

  it('returns undefined for unknown keys', () => {
    expect(getUrl('foo')).toBe(undefined)
  })
})
