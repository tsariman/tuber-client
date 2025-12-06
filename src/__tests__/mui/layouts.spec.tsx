import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Layout from '../../mui/layout'
import { LayoutCenteredNoScroll, LayoutCentered } from '../../mui/layout/layouts'
import type StatePage from '../../controllers/StatePage'

// Mock StatePage for testing
const createMockPage = (layout: string = 'layout_default', hasAppbar: boolean = true): StatePage => ({
  layout,
  hasAppbar,
} as unknown as StatePage)

describe('src/mui/layout/index.tsx', () => {

  describe('Layout', () => {

    it('should render default layout', () => {
      const mockPage = createMockPage('layout_default')
      
      const { container, getByText } = render(
        <Layout def={mockPage}>
          <div>Default content</div>
        </Layout>
      )
      
      expect(getByText('Default content')).toBeInTheDocument()
      const containerElement = container.querySelector('.MuiContainer-root')
      expect(containerElement).toBeInTheDocument()
    })

    it('should render centered layout', () => {
      const mockPage = createMockPage('layout_centered')
      
      const { getByText } = render(
        <Layout def={mockPage}>
          <div>Centered content</div>
        </Layout>
      )
      
      expect(getByText('Centered content')).toBeInTheDocument()
    })

    it('should handle unknown layout gracefully', () => {
      const mockPage = createMockPage('unknown_layout')
      
      const { getByText } = render(
        <Layout def={mockPage}>
          <div>Unknown layout content</div>
        </Layout>
      )
      
      expect(getByText('Unknown layout content')).toBeInTheDocument()
    })

  })

  describe('LayoutCenteredNoScroll', () => {

    it('should render', () => {
      const { getByText } = render(
        <LayoutCenteredNoScroll>
          <div>Centered no scroll test</div>
        </LayoutCenteredNoScroll>
      )
      
      expect(getByText('Centered no scroll test')).toBeInTheDocument()
    })

  })

  describe('LayoutCentered', () => {

    it('should render', () => {
      const { getByText } = render(
        <LayoutCentered>
          <div>Centered test</div>
        </LayoutCentered>
      )
      
      expect(getByText('Centered test')).toBeInTheDocument()
    })

  })

})