import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../test-utils'
import AppbarMini from '../../../mui/appbar/state.jsx.appbar.mini'
import type StatePage from '../../../controllers/StatePage'
import { StateApp } from '../../../controllers'

// Mock StatePage for testing
const createMockPage = (hasDrawer: boolean = false, hasLogo: boolean = false): StatePage => ({
  appbar: {
    props: {},
    toolbarProps: {},
    parent: {
      hasDrawer,
    },
    menuIconProps: {},
    hasLogo,
    typography: {
      fontFamily: 'Arial',
      color: '#000000',
    },
    textLogoProps: {},
    items: [],
  },
  parent: {
    parent: {
      app: {
        title: 'Mini App',
      },
    },
  },
} as unknown as StatePage)

describe('src/mui/appbar/state.jsx.mini.appbar.tsx', () => {
  // Minimal mock of StateApp; components under test don't read fields
  const mockApp = {} as unknown as StateApp;

  it('should render mini appbar correctly', () => {
    const mockPage = createMockPage()
    
    const { container } = renderWithProviders(<AppbarMini instance={mockPage} app={mockApp} />)
    const appbar = container.querySelector('[role="banner"]')
    
    expect(appbar).toBeInTheDocument()
  })

  it('should render menu icon when drawer is available', () => {
    const mockPage = createMockPage(true)
    
    const { container } = renderWithProviders(<AppbarMini instance={mockPage} app={mockApp} />)
    const menuButton = container.querySelector('button')
    
    expect(menuButton).toBeInTheDocument()
  })

  it('should display app title when no logo', () => {
    const mockPage = createMockPage(false, false)
    
    const { getByText } = renderWithProviders(<AppbarMini instance={mockPage} app={mockApp} />)
    
    expect(getByText('Mini App')).toBeInTheDocument()
  })

  it('should adapt to drawer open state', () => {
    const mockPage = createMockPage(true)
    const preloadedState = {
      drawer: { open: true, width: 240 },
    }
    
    const { container } = renderWithProviders(<AppbarMini instance={mockPage} app={mockApp} />, { preloadedState })
    const appbar = container.querySelector('[role="banner"]')
    
    expect(appbar).toBeInTheDocument()
  })
})
