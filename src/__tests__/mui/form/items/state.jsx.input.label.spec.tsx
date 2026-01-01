import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import StateJsxInputLabel from '../../../../mui/form/items/state.jsx.input.label'

describe('StateJsxInputLabel', () => {
  // Helper to create mock StateFormItem
  const createMockFormItem = (overrides: { text?: string; props?: Record<string, any> } = {}) => {
    return {
      text: overrides.text ?? 'Default Label',
      props: overrides.props ?? {}
    } as unknown as Parameters<typeof StateJsxInputLabel>[0]['def']
  }

  describe('Basic Rendering', () => {
    it('should render InputLabel with text', () => {
      const mockItem = createMockFormItem({ text: 'Username' })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      expect(container.querySelector('.MuiInputLabel-root')).toBeInTheDocument()
      expect(container.textContent).toBe('Username')
    })

    it('should render InputLabel with empty text', () => {
      const mockItem = createMockFormItem({ text: '' })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      expect(container.querySelector('.MuiInputLabel-root')).toBeInTheDocument()
      expect(container.textContent).toBe('')
    })

    it('should render InputLabel with special characters', () => {
      const mockItem = createMockFormItem({ text: 'Email @ddress *' })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      expect(container.textContent).toBe('Email @ddress *')
    })
  })

  describe('Props Handling', () => {
    it('should pass props to InputLabel', () => {
      const mockItem = createMockFormItem({
        text: 'Required Field',
        props: { required: true }
      })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      const label = container.querySelector('.MuiInputLabel-root')
      expect(label).toBeInTheDocument()
    })

    it('should handle color prop', () => {
      const mockItem = createMockFormItem({
        text: 'Primary Label',
        props: { color: 'primary' }
      })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      expect(container.querySelector('.MuiInputLabel-root')).toBeInTheDocument()
    })

    it('should handle disabled prop', () => {
      const mockItem = createMockFormItem({
        text: 'Disabled Label',
        props: { disabled: true }
      })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      const label = container.querySelector('.MuiInputLabel-root')
      expect(label).toBeInTheDocument()
      expect(label).toHaveClass('Mui-disabled')
    })

    it('should handle error prop', () => {
      const mockItem = createMockFormItem({
        text: 'Error Label',
        props: { error: true }
      })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      const label = container.querySelector('.MuiInputLabel-root')
      expect(label).toBeInTheDocument()
      expect(label).toHaveClass('Mui-error')
    })

    it('should handle shrink prop', () => {
      const mockItem = createMockFormItem({
        text: 'Shrunk Label',
        props: { shrink: true }
      })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      const label = container.querySelector('.MuiInputLabel-root')
      expect(label).toBeInTheDocument()
      expect(label).toHaveClass('MuiInputLabel-shrink')
    })

    it('should handle sx prop', () => {
      const mockItem = createMockFormItem({
        text: 'Styled Label',
        props: { sx: { color: 'red' } }
      })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      expect(container.querySelector('.MuiInputLabel-root')).toBeInTheDocument()
    })

    it('should handle empty props object', () => {
      const mockItem = createMockFormItem({
        text: 'Simple Label',
        props: {}
      })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      expect(container.querySelector('.MuiInputLabel-root')).toBeInTheDocument()
      expect(container.textContent).toBe('Simple Label')
    })
  })

  describe('Edge Cases', () => {
    it('should handle long text', () => {
      const longText = 'This is a very long label text that might overflow or wrap in certain situations'
      const mockItem = createMockFormItem({ text: longText })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      expect(container.textContent).toBe(longText)
    })

    it('should handle numeric-like text', () => {
      const mockItem = createMockFormItem({ text: '12345' })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      expect(container.textContent).toBe('12345')
    })

    it('should handle whitespace text', () => {
      const mockItem = createMockFormItem({ text: '   ' })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      expect(container.textContent).toBe('   ')
    })

    it('should handle multiple props together', () => {
      const mockItem = createMockFormItem({
        text: 'Complex Label',
        props: {
          required: true,
          error: true,
          shrink: true,
          sx: { fontWeight: 'bold' }
        }
      })

      const { container } = render(<StateJsxInputLabel def={mockItem} />)

      const label = container.querySelector('.MuiInputLabel-root')
      expect(label).toBeInTheDocument()
      expect(label).toHaveClass('Mui-error')
      expect(label).toHaveClass('MuiInputLabel-shrink')
    })
  })
})