import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '../../test-utils'
import Layout from '../../../mui/layout'

// Mock the dependencies
vi.mock('@mui/material/Container', () => ({
  default: ({ children, maxWidth }: { children: React.ReactNode; maxWidth?: string }) => (
    <div data-testid="container" data-max-width={maxWidth || 'default'}>
      {children}
    </div>
  ),
}))

vi.mock('../../mui/layouts', () => ({
  LayoutCenteredNoScroll: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout-centered-no-scroll">{children}</div>
  ),
  LayoutCentered: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout-centered">{children}</div>
  ),
  VirtualizedTableLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="virtualized-table-layout">{children}</div>
  ),
  DefaultLayoutToolbared: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="default-layout-toolbared">{children}</div>
  ),
}))

vi.mock('../../business.logic', () => ({
  error_id: () => ({
    remember_exception: vi.fn(),
  }),
  log: vi.fn(),
}))

vi.mock('@tuber/shared', () => ({
  LAYOUT_CENTERED_NO_SCROLL: 'layout_centered_no_scroll',
  LAYOUT_CENTERED: 'layout_centered',
  LAYOUT_DEFAULT: 'layout_default',
  LAYOUT_MD: 'layout_md',
  LAYOUT_SM: 'layout_sm',
  LAYOUT_XL: 'layout_xl',
  LAYOUT_XS: 'layout_xs',
  LAYOUT_TABLE_VIRTUALIZED: 'layout_table_virtualized',
  LAYOUT_NONE: 'layout_none',
  LAYOUT_NONE_NO_APPBAR: 'layout_none_no_appbar',
}))

describe('Layout Component', () => {
  const createMockPage = (layout: string, hasAppbar = false) => ({
    layout,
    hasAppbar,
  } as unknown)

  const testChildren = <div data-testid="test-children">Test Content</div>

  it('should render LayoutCenteredNoScroll for centered no scroll layout', () => {
    const mockPage = createMockPage('layout_centered_no_scroll')

    renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    expect(screen.getByTestId('layout-centered-no-scroll')).toBeInTheDocument()
    expect(screen.getByTestId('test-children')).toBeInTheDocument()
  })

  it('should render LayoutCentered for centered layout', () => {
    const mockPage = createMockPage('layout_centered')

    renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    expect(screen.getByTestId('layout-centered')).toBeInTheDocument()
    expect(screen.getByTestId('test-children')).toBeInTheDocument()
  })

  it('should render default Container for default layout', () => {
    const mockPage = createMockPage('layout_default')

    renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    const container = screen.getByTestId('container')
    expect(container).toBeInTheDocument()
    expect(container).toHaveAttribute('data-max-width', 'default')
    expect(screen.getByTestId('test-children')).toBeInTheDocument()
  })

  it('should render Container with md maxWidth for md layout', () => {
    const mockPage = createMockPage('layout_md')

    renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    const container = screen.getByTestId('container')
    expect(container).toHaveAttribute('data-max-width', 'md')
  })

  it('should render Container with sm maxWidth for sm layout', () => {
    const mockPage = createMockPage('layout_sm')

    renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    const container = screen.getByTestId('container')
    expect(container).toHaveAttribute('data-max-width', 'sm')
  })

  it('should render Container with xl maxWidth for xl layout', () => {
    const mockPage = createMockPage('layout_xl')

    renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    const container = screen.getByTestId('container')
    expect(container).toHaveAttribute('data-max-width', 'xl')
  })

  it('should render Container with xs maxWidth for xs layout', () => {
    const mockPage = createMockPage('layout_xs')

    renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    const container = screen.getByTestId('container')
    expect(container).toHaveAttribute('data-max-width', 'xs')
  })

  it('should render VirtualizedTableLayout for table virtualized layout', () => {
    const mockPage = createMockPage('layout_table_virtualized')

    renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    expect(screen.getByTestId('virtualized-table-layout')).toBeInTheDocument()
    expect(screen.getByTestId('test-children')).toBeInTheDocument()
  })

  it('should render DefaultLayoutToolbared for layout_none with appbar', () => {
    const mockPage = createMockPage('layout_none', true)

    renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    expect(screen.getByTestId('default-layout-toolbared')).toBeInTheDocument()
    expect(screen.getByTestId('test-children')).toBeInTheDocument()
  })

  it('should render Fragment for layout_none without appbar', () => {
    const mockPage = createMockPage('layout_none', false)

    const { container } = renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    // Fragment doesn't create wrapper element
    expect(screen.getByTestId('test-children')).toBeInTheDocument()
    expect(container.firstChild).toEqual(screen.getByTestId('test-children'))
  })

  it('should render Fragment for layout_none_no_appbar', () => {
    const mockPage = createMockPage('layout_none_no_appbar')

    const { container } = renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    expect(screen.getByTestId('test-children')).toBeInTheDocument()
    expect(container.firstChild).toEqual(screen.getByTestId('test-children'))
  })

  it('should render Fragment for unknown layout', () => {
    const mockPage = createMockPage('unknown_layout')

    const { container } = renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    expect(screen.getByTestId('test-children')).toBeInTheDocument()
    expect(container.firstChild).toEqual(screen.getByTestId('test-children'))
  })

  it('should render Fragment for empty layout', () => {
    const mockPage = createMockPage('')

    const { container } = renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    expect(screen.getByTestId('test-children')).toBeInTheDocument()
    expect(container.firstChild).toEqual(screen.getByTestId('test-children'))
  })

  it('should handle layout with spaces and different casing', () => {
    const mockPage = createMockPage('  LAYOUT_CENTERED_NO_SCROLL  ')

    renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    expect(screen.getByTestId('layout-centered-no-scroll')).toBeInTheDocument()
  })

  it('should handle exceptions gracefully', () => {
    // Create a mock page that will cause an error in the layout map
    const mockPage = {
      layout: 'layout_centered',
      hasAppbar: null, // This might cause an error in the layout map
    } as unknown

    // Mock console to suppress error output during test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderWithProviders(
      <Layout instance={mockPage as Parameters<typeof Layout>[0]['instance']}>
        {testChildren}
      </Layout>
    )

    // Should fall back to Fragment
    expect(screen.getByTestId('test-children')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })
})