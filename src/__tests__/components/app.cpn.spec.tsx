import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '../test-utils'
import '@testing-library/jest-dom'

// Mock problematic controller templates before importing the component
vi.mock('../../controllers/StateAppbar', () => ({
  default: class MockStateAppbar {
    constructor() { return {} }
  }
}))

vi.mock('../../controllers/templates/StateAppbarDefault', () => ({
  default: class MockStateAppbarDefault {
    constructor() { return {} }
  }
}))

vi.mock('../../controllers/State', () => ({
  default: class MockState {
    _rootState: unknown
    constructor(rootState: unknown) { this._rootState = rootState }
  }
}))

vi.mock('../../controllers/StatePage', () => ({
  default: class MockStatePage {
    _type: string
    configure: any
    constructor() {
      this._type = 'generic'
      this.configure = vi.fn()
    }
  }
}))

// Mock the app components
vi.mock('../../mui/app.generic.cpn', () => ({
  default: () => <div data-testid="app-generic">GenericApp</div>
}))

vi.mock('../../mui/app.complex.cpn', () => ({
  default: () => <div data-testid="app-complex">ComplexApp</div>
}))

import AppPage from '../../components/app.cpn'
import StateApp from '../../controllers/StateApp'
import StateAllPages from '../../controllers/StateAllPages'

describe('AppPage Component', () => {
  const createMockStateApp = () => {
    return {
      page: 'test-page'
    } as unknown as StateApp
  }

  const createMockStatePage = (type: 'generic' | 'complex' = 'generic') => {
    return {
      _type: type,
      _id: 'test-page-id',
      title: 'Test Page',
      configure: vi.fn()
    }
  }

  const createMockStateAllPages = (pageType: 'generic' | 'complex' = 'generic') => {
    const mockPage = createMockStatePage(pageType)
    return {
      getPage: vi.fn(() => mockPage)
    } as unknown as StateAllPages
  }

  it('should render GenericApp when page type is generic', () => {
    const mockApp = createMockStateApp()
    const mockAllPages = createMockStateAllPages('generic')

    renderWithProviders(<AppPage instance={mockAllPages} app={mockApp} />)

    expect(screen.getByTestId('app-generic')).toBeInTheDocument()
    expect(screen.getByText('GenericApp')).toBeInTheDocument()
  })

  it('should render ComplexApp when page type is complex', () => {
    const mockApp = createMockStateApp()
    const mockAllPages = createMockStateAllPages('complex')

    renderWithProviders(<AppPage instance={mockAllPages} app={mockApp} />)

    expect(screen.getByTestId('app-complex')).toBeInTheDocument()
    expect(screen.getByText('ComplexApp')).toBeInTheDocument()
  })

  it('should call getPage with app parameter', () => {
    const mockApp = createMockStateApp()
    const mockAllPages = createMockStateAllPages('generic')

    renderWithProviders(<AppPage instance={mockAllPages} app={mockApp} />)

    expect(mockAllPages.getPage).toHaveBeenCalledWith(mockApp)
  })

  it('should configure page with default states', () => {
    const mockApp = createMockStateApp()
    const mockPage = createMockStatePage('generic')
    const mockAllPages = {
      getPage: vi.fn(() => mockPage)
    } as unknown as StateAllPages

    renderWithProviders(<AppPage instance={mockAllPages} app={mockApp} />)

    expect(mockPage.configure).toHaveBeenCalled()
    const callArgs = (mockPage.configure as any).mock.calls[0][0]
    expect(callArgs).toHaveProperty('defaultAppbarState')
    expect(callArgs).toHaveProperty('defaultBackgroundState')
    expect(callArgs).toHaveProperty('defaultDrawerState')
  })

  it('should render Fragment wrapper', () => {
    const mockApp = createMockStateApp()
    const mockAllPages = createMockStateAllPages('generic')

    const { container } = renderWithProviders(<AppPage instance={mockAllPages} app={mockApp} />)

    // Fragment doesn't create a DOM node, but its children should be in the container
    expect(container.querySelector('[data-testid="app-generic"]')).toBeInTheDocument()
  })
})