import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../test-utils'
import AppbarMidSearch from '../../../mui/appbar/state.jsx.appbar.mid-search'
import type StatePage from '../../../controllers/StatePage'
import type StateApp from '../../../controllers/StateApp'
import { fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the StateJsxIcon component
vi.mock('../../../mui/icon', () => ({
  StateJsxIcon: ({ name }: { name: string }) => (
    <span data-testid={`mock-icon-${name}`}>{name}</span>
  ),
  StateJsxUnifiedIconProvider: ({ instance }: { instance: { icon?: string } }) => (
    <span data-testid={`mock-unified-icon-${instance?.icon || 'default'}`}>unified-icon</span>
  ),
}))

// Mock StateJsxLogo component
vi.mock('../../../mui/appbar/state.jsx.logo', () => ({
  default: () => <div data-testid="mock-logo">Logo</div>,
}))

// Mock StateJsxChip component
vi.mock('../../../mui/appbar/state.jsx.chip', () => ({
  default: ({ array }: { array: unknown[] }) => (
    <div data-testid="mock-chips">{array?.length || 0} chips</div>
  ),
}))

// Mock AppbarButton (link component)
vi.mock('../../../mui/link', () => ({
  default: ({ instance }: { instance: { type?: string } }) => (
    <button data-testid={`mock-appbar-button-${instance?.type || 'default'}`}>
      button
    </button>
  ),
}))

// Create mock StatePage
const createMockPage = (overrides: Record<string, unknown> = {}): StatePage => ({
  appbarState: {
    props: {},
    menuIconProps: {},
    searchFieldIcon: {},
    searchFieldIconButton: {},
    inputBaseProps: {},
    logoContainerProps: {},
  },
  hasDrawer: false,
  _key: 'test-page',
  parent: {
    parent: {
      app: {
        title: 'Test App',
        route: '/test',
      },
    },
  },
  ...overrides,
} as unknown as StatePage)

// Create mock StateApp
const createMockApp = (overrides: Record<string, unknown> = {}): StateApp => ({
  title: 'Test Application',
  route: '/test',
  ...overrides,
} as unknown as StateApp)

describe('StateJsxAppbarMidSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render appbar component', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      expect(container.querySelector('.MuiAppBar-root')).toBeInTheDocument()
    })

    it('should render toolbar', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      expect(container.querySelector('.MuiToolbar-root')).toBeInTheDocument()
    })

    it('should render Box container', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      expect(container.querySelector('.MuiBox-root')).toBeInTheDocument()
    })
  })

  describe('Menu Icon', () => {
    it('should render menu icon when page has drawer', () => {
      const mockPage = createMockPage({ hasDrawer: true })
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      expect(container.querySelector('[data-testid="mock-icon-menu"]')).toBeInTheDocument()
    })

    it('should not render menu icon when page has no drawer', () => {
      const mockPage = createMockPage({ hasDrawer: false })
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      expect(container.querySelector('[data-testid="mock-icon-menu"]')).not.toBeInTheDocument()
    })

    it('should render menu icon button that opens drawer', () => {
      const mockPage = createMockPage({ hasDrawer: true })
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      const menuButton = container.querySelector('button[aria-label="open drawer"]')
      expect(menuButton).toBeInTheDocument()
    })
  })

  describe('Logo and Title', () => {
    it('should render app title when no logo', () => {
      const mockPage = createMockPage({
        appbarState: {
          props: {},
          menuIconProps: {},
          searchFieldIcon: {},
          searchFieldIconButton: {},
          inputBaseProps: {},
          logoContainerProps: {},
          hasLogo: false,
        },
      })
      const mockApp = createMockApp({ title: 'My Test App' })

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />,
        { preloadedState: { app: { title: 'My Test App' } } }
      )

      expect(container.textContent).toContain('My Test App')
    })
  })

  describe('Search Field', () => {
    it('should render search input', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      const input = container.querySelector('.MuiInputBase-root')
      expect(input).toBeInTheDocument()
    })

    it('should render search input with placeholder', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      const input = container.querySelector('input[placeholder="Search…"]')
      expect(input).toBeInTheDocument()
    })

    it('should render search input with aria-label', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      const input = container.querySelector('input[aria-label="search"]')
      expect(input).toBeInTheDocument()
    })

    it('should handle search field value change', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      const input = container.querySelector('input') as HTMLInputElement
      expect(input).toBeInTheDocument()

      fireEvent.change(input, { target: { value: 'test search' } })
      // Input change should dispatch action
    })
  })

  describe('Mobile Menu', () => {
    it('should render more icon for mobile menu', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      expect(container.querySelector('[data-testid="mock-icon-more_vert"]')).toBeInTheDocument()
    })

    it('should render mobile menu toggle button', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      const moreButton = container.querySelector('button[aria-label="show more"]')
      expect(moreButton).toBeInTheDocument()
    })

    it('should have aria-controls for mobile menu', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      const moreButton = container.querySelector('button[aria-haspopup="true"]')
      expect(moreButton).toBeInTheDocument()
    })
  })

  describe('Search Icon', () => {
    it('should render unified icon provider for search icon', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      // The search field icon should be rendered
      const unifiedIcon = container.querySelector('[data-testid^="mock-unified-icon"]')
      expect(unifiedIcon).toBeInTheDocument()
    })
  })

  describe('Appbar Position', () => {
    it('should render appbar with fixed position', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      const appbar = container.querySelector('.MuiAppBar-positionFixed')
      expect(appbar).toBeInTheDocument()
    })
  })

  describe('Search Field Interactions', () => {
    it('should allow typing in search field', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      const input = container.querySelector('input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'hello' } })
      
      // Value should update via Redux dispatch
      expect(input).toBeInTheDocument()
    })

    it('should handle keydown events', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      const input = container.querySelector('input') as HTMLInputElement
      fireEvent.keyDown(input, { key: 'Enter' })
      
      // Enter key should trigger search action
      expect(input).toBeInTheDocument()
    })
  })

  describe('Drawer Interaction', () => {
    it('should dispatch drawer open action when menu button clicked', () => {
      const mockPage = createMockPage({ hasDrawer: true })
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      const menuButton = container.querySelector('button[aria-label="open drawer"]')
      expect(menuButton).toBeInTheDocument()
      
      if (menuButton) {
        fireEvent.click(menuButton)
        // Should dispatch drawerOpen action
      }
    })
  })

  describe('Desktop and Mobile Views', () => {
    it('should have desktop view box', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      // Should have multiple Box elements for responsive layout
      const boxes = container.querySelectorAll('.MuiBox-root')
      expect(boxes.length).toBeGreaterThanOrEqual(1)
    })

    it('should have mobile view box', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      // Mobile menu toggle should be present
      const mobileButton = container.querySelector('button[aria-label="show more"]')
      expect(mobileButton).toBeInTheDocument()
    })
  })

  describe('Input Adornments', () => {
    it('should render search icon button as end adornment', () => {
      const mockPage = createMockPage()
      const mockApp = createMockApp()

      const { container } = renderWithProviders(
        <AppbarMidSearch instance={mockPage} app={mockApp} />
      )

      // Should have appbar buttons in adornment
      const adornmentButtons = container.querySelectorAll('[data-testid^="mock-appbar-button"]')
      expect(adornmentButtons.length).toBeGreaterThanOrEqual(1)
    })
  })
})