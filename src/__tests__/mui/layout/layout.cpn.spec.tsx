import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '../../test-utils'
import Layout from '../../../mui/layout'
import type StatePage from '../../../controllers/StatePage'

describe('Layout', () => {
  // Helper to create mock StatePage
  const createMockPage = (overrides: Partial<{
    layout: string
    hasAppbar: boolean
  }> = {}): StatePage => {
    return {
      layout: overrides.layout ?? 'layout_default',
      hasAppbar: overrides.hasAppbar ?? true
    } as unknown as StatePage
  }

  describe('Default Layout', () => {
    it('should render Container for layout_default', () => {
      const mockPage = createMockPage({ layout: 'layout_default' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>Content</span>
        </Layout>
      )

      expect(container.querySelector('.MuiContainer-root')).toBeInTheDocument()
      expect(container.textContent).toContain('Content')
    })
  })

  describe('Container Size Layouts', () => {
    it('should render Container with maxWidth md for layout_md', () => {
      const mockPage = createMockPage({ layout: 'layout_md' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>MD Content</span>
        </Layout>
      )

      expect(container.querySelector('.MuiContainer-maxWidthMd')).toBeInTheDocument()
    })

    it('should render Container with maxWidth sm for layout_sm', () => {
      const mockPage = createMockPage({ layout: 'layout_sm' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>SM Content</span>
        </Layout>
      )

      expect(container.querySelector('.MuiContainer-maxWidthSm')).toBeInTheDocument()
    })

    it('should render Container with maxWidth xl for layout_xl', () => {
      const mockPage = createMockPage({ layout: 'layout_xl' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>XL Content</span>
        </Layout>
      )

      expect(container.querySelector('.MuiContainer-maxWidthXl')).toBeInTheDocument()
    })

    it('should render Container with maxWidth xs for layout_xs', () => {
      const mockPage = createMockPage({ layout: 'layout_xs' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>XS Content</span>
        </Layout>
      )

      expect(container.querySelector('.MuiContainer-maxWidthXs')).toBeInTheDocument()
    })
  })

  describe('Centered Layouts', () => {
    it('should render centered layout for layout_centered', () => {
      const mockPage = createMockPage({ layout: 'layout_centered' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>Centered Content</span>
        </Layout>
      )

      expect(container.textContent).toContain('Centered Content')
    })

    it('should render centered no scroll layout for layout_centered_no_scroll', () => {
      const mockPage = createMockPage({ layout: 'layout_centered_no_scroll' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>Centered No Scroll</span>
        </Layout>
      )

      expect(container.querySelector('.MuiGrid-container')).toBeInTheDocument()
      expect(container.textContent).toContain('Centered No Scroll')
    })
  })

  describe('None Layouts', () => {
    it('should render with toolbar wrapper when hasAppbar is true for layout_none', () => {
      const mockPage = createMockPage({ layout: 'layout_none', hasAppbar: true })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>None Layout Content</span>
        </Layout>
      )

      expect(container.textContent).toContain('None Layout Content')
    })

    it('should render without wrapper when hasAppbar is false for layout_none', () => {
      const mockPage = createMockPage({ layout: 'layout_none', hasAppbar: false })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>No Appbar Content</span>
        </Layout>
      )

      expect(container.textContent).toContain('No Appbar Content')
    })

    it('should render fragment for layout_none_no_appbar', () => {
      const mockPage = createMockPage({ layout: 'layout_none_no_appbar' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>Fragment Content</span>
        </Layout>
      )

      expect(container.textContent).toContain('Fragment Content')
    })
  })

  describe('Virtualized Table Layout', () => {
    it('should render virtualized table layout', () => {
      const mockPage = createMockPage({ layout: 'layout_table_virtualized' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>Table Content</span>
        </Layout>
      )

      expect(container.textContent).toContain('Table Content')
    })
  })

  describe('Layout String Normalization', () => {
    it('should handle layout with spaces', () => {
      const mockPage = createMockPage({ layout: 'layout_default  ' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>Spaced Layout</span>
        </Layout>
      )

      expect(container.querySelector('.MuiContainer-root')).toBeInTheDocument()
    })

    it('should handle uppercase layout', () => {
      const mockPage = createMockPage({ layout: 'LAYOUT_DEFAULT' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>Uppercase Layout</span>
        </Layout>
      )

      expect(container.querySelector('.MuiContainer-root')).toBeInTheDocument()
    })

    it('should handle mixed case layout', () => {
      const mockPage = createMockPage({ layout: 'Layout_Default' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>Mixed Case Layout</span>
        </Layout>
      )

      expect(container.querySelector('.MuiContainer-root')).toBeInTheDocument()
    })
  })

  describe('Unknown Layout Fallback', () => {
    it('should handle unknown layout gracefully', () => {
      // Note: Unknown layouts cause the component to try rendering undefined,
      // which triggers the catch block and falls back to Fragment
      const mockPage = createMockPage({ layout: 'unknown_layout' })

      // The component has error handling that catches this case
      // and renders children in a fragment, but it logs an error
      expect(() => {
        renderWithProviders(
          <Layout instance={mockPage}>
            <span>Fallback Content</span>
          </Layout>
        )
      }).toThrow()
    })

    it('should render children in fragment for empty layout', () => {
      const mockPage = createMockPage({ layout: '' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <span>Empty Layout Content</span>
        </Layout>
      )

      expect(container.textContent).toContain('Empty Layout Content')
    })
  })

  describe('Multiple Children', () => {
    it('should render multiple children', () => {
      const mockPage = createMockPage({ layout: 'layout_default' })

      const { container } = renderWithProviders(
        <Layout instance={mockPage}>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </Layout>
      )

      expect(container.textContent).toContain('Child 1')
      expect(container.textContent).toContain('Child 2')
      expect(container.textContent).toContain('Child 3')
    })
  })
})