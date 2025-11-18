import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../test-utils'
import AppbarResponsive from '../../../mui/appbar/state.jsx.appbar.responsive'
import type StatePage from '../../../controllers/StatePage'

// Mock StatePage for testing
const createMockPage = (): StatePage => ({
  appbar: {
    parent: {
      hasDrawer: false,
      generateDefaultDrawer: false,
    },
    menuIconProps: {},
  },
} as unknown as StatePage)

describe('src/mui/appbar/state.jsx.responsive.appbar.tsx', () => {
  it('should render responsive appbar correctly', () => {
    const mockPage = createMockPage()
    
    const { container } = renderWithProviders(<AppbarResponsive def={mockPage} />)
    const appbar = container.querySelector('nav')
    
    expect(appbar).toBeInTheDocument()
  })

  it('should render navigation items', () => {
    const mockPage = createMockPage()
    
    const { getByText } = renderWithProviders(<AppbarResponsive def={mockPage} />)
    
    expect(getByText('Home')).toBeInTheDocument()
    expect(getByText('About')).toBeInTheDocument()
    expect(getByText('Contact')).toBeInTheDocument()
  })

  it('should render MUI title', () => {
    const mockPage = createMockPage()
    
    const { getByText } = renderWithProviders(<AppbarResponsive def={mockPage} />)
    
    expect(getByText('MUI')).toBeInTheDocument()
  })

  it('should contain navigation buttons', () => {
    const mockPage = createMockPage()
    
    const { container } = renderWithProviders(<AppbarResponsive def={mockPage} />)
    const buttons = container.querySelectorAll('button')
    
    // Should have at least the navigation buttons
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })
})