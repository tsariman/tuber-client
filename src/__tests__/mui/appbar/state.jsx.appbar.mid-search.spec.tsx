import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../test-utils'
import AppbarMidSearch from '../../../mui/appbar/state.jsx.appbar.mid-search'
import type StatePage from '../../../controllers/StatePage'
import StateApp from '../../../controllers/StateApp'

// Mock StatePage with middle search appbar for testing
const createMockPage = (): StatePage => ({
  appbar: {
    _type: 'middle-search',
    title: 'Search Page',
    search: {
      placeholder: 'Search...',
      value: '',
      props: { 'data-testid': 'search-input' },
    },
    props: {
      'data-testid': 'middle-search-appbar',
    },
    position: 'fixed',
    color: 'primary',
  },
} as unknown as StatePage)

describe('src/mui/appbar/state.jsx.middle-search.appbar.tsx', () => {
  // Minimal mock of StateApp; components under test don't read fields
    const mockApp = {} as unknown as StateApp;
  it('should render middle search appbar correctly', () => {
    const mockPage = createMockPage()
    
    const { getByTestId } = renderWithProviders(
      <AppbarMidSearch instance={mockPage} app={mockApp} />
    )
    
    expect(getByTestId('middle-search-appbar')).toBeInTheDocument()
  })

  it('should render search input field', () => {
    const mockPage = createMockPage()
    
    const { getByTestId } = renderWithProviders(
      <AppbarMidSearch instance={mockPage} app={mockApp} />
    )
    
    expect(getByTestId('search-input')).toBeInTheDocument()
  })

  it('should render appbar title', () => {
    const mockPage = createMockPage()
    
    const { getByText } = renderWithProviders(
      <AppbarMidSearch instance={mockPage} app={mockApp} />
    )
    
    expect(getByText('Search Page')).toBeInTheDocument()
  })

  it('should handle search placeholder', () => {
    const mockPage = createMockPage()
    
    const { getByPlaceholderText } = renderWithProviders(
      <AppbarMidSearch instance={mockPage} app={mockApp} />
    )
    
    expect(getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('should render with middle search layout', () => {
    const mockPage = createMockPage()
    
    const { container } = renderWithProviders(
      <AppbarMidSearch instance={mockPage} app={mockApp} />
    )
    
    const toolbar = container.querySelector('[class*="MuiToolbar"]')
    expect(toolbar).toBeInTheDocument()
  })
})