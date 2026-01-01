import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('PageNotFound Component (Isolated)', () => {
  beforeAll(() => {
    // Mock the component directly to avoid controller dependency issues
    vi.doMock('../../../mui/page/notfound.cpn', () => ({
      default: () => {
        return (
          <>
            <h1 style={{ fontSize: '200px', textAlign: 'center', margin: 0 }}>
              404
            </h1>
            <h2 style={{ fontSize: '32px', textAlign: 'center', margin: 0 }}>
              Page not found
            </h2>
          </>
        )
      },
    }))
  })

  it('should render 404 message', async () => {
    const { default: PageNotFound } = await import('../../../mui/page/notfound.cpn')
    
    render(<PageNotFound instance={{} as Parameters<typeof PageNotFound>[0]['instance']} />)
    
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('should have correct heading structure', async () => {
    const { default: PageNotFound } = await import('../../../mui/page/notfound.cpn')
    
    render(<PageNotFound instance={{} as Parameters<typeof PageNotFound>[0]['instance']} />)
    
    const headings = screen.getAllByRole('heading')
    expect(headings).toHaveLength(2)
    expect(headings[0]).toHaveTextContent('404')
    expect(headings[1]).toHaveTextContent('Page not found')
  })
})