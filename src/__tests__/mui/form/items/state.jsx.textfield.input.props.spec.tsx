import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders } from '../../../test-utils'
import '@testing-library/jest-dom'
import StateJsxTextfieldInputProps from '../../../../mui/form/items/state.jsx.textfield.input.props'
import type StateFormItemInputProps from '../../../../controllers/StateFormItemInputProps'

// Mock StateLink and StateJsxLink
vi.mock('../../../../controllers/StateLink', () => ({
  default: class MockStateLink {
    constructor(public state: any) {}
  }
}))

vi.mock('../../../../mui/link', () => ({
  default: ({ instance }: any) => <span data-testid="mock-link-icon">icon</span>
}))

describe('StateJsxTextfieldInputProps', () => {
  // Helper to create mock StateFormItemInputProps
  const createMockInputProps = (overrides: Partial<{
    start: { icon?: any; text?: string; textProps?: Record<string, any> }
    end: { icon?: any; text?: string; textProps?: Record<string, any> }
    props: Record<string, any>
  }> = {}): StateFormItemInputProps => {
    return {
      start: overrides.start,
      end: overrides.end,
      props: overrides.props ?? {}
    } as unknown as StateFormItemInputProps
  }

  describe('Start Adornment', () => {
    it('should return startAdornment when start is provided', () => {
      const mockProps = createMockInputProps({
        start: { text: 'Start' }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      expect(result.startAdornment).toBeDefined()
    })

    it('should render start text adornment', () => {
      const mockProps = createMockInputProps({
        start: { text: '$' }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      // Wrap the adornment in a test component to render it
      const { container } = renderWithProviders(
        <div>{result.startAdornment}</div>
      )

      expect(container.textContent).toContain('$')
    })

    it('should render start icon adornment', () => {
      const mockProps = createMockInputProps({
        start: { icon: { type: 'icon', name: 'search' } }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      const { container } = renderWithProviders(
        <div>{result.startAdornment}</div>
      )

      expect(container.querySelector('[data-testid="mock-link-icon"]')).toBeInTheDocument()
    })

    it('should apply textProps to start text', () => {
      const mockProps = createMockInputProps({
        start: { text: 'USD', textProps: { className: 'currency-label' } }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      const { container } = renderWithProviders(
        <div>{result.startAdornment}</div>
      )

      expect(container.querySelector('.currency-label')).toBeInTheDocument()
    })
  })

  describe('End Adornment', () => {
    it('should return endAdornment when end is provided', () => {
      const mockProps = createMockInputProps({
        end: { text: 'End' }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      expect(result.endAdornment).toBeDefined()
    })

    it('should render end text adornment', () => {
      const mockProps = createMockInputProps({
        end: { text: 'kg' }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      const { container } = renderWithProviders(
        <div>{result.endAdornment}</div>
      )

      expect(container.textContent).toContain('kg')
    })

    it('should render end icon adornment', () => {
      const mockProps = createMockInputProps({
        end: { icon: { type: 'icon', name: 'visibility' } }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      const { container } = renderWithProviders(
        <div>{result.endAdornment}</div>
      )

      expect(container.querySelector('[data-testid="mock-link-icon"]')).toBeInTheDocument()
    })

    it('should apply textProps to end text', () => {
      const mockProps = createMockInputProps({
        end: { text: '%', textProps: { className: 'percent-label' } }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      const { container } = renderWithProviders(
        <div>{result.endAdornment}</div>
      )

      expect(container.querySelector('.percent-label')).toBeInTheDocument()
    })
  })

  describe('Both Adornments', () => {
    it('should return both adornments when both start and end are provided', () => {
      const mockProps = createMockInputProps({
        start: { text: '$' },
        end: { text: '.00' }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      expect(result.startAdornment).toBeDefined()
      expect(result.endAdornment).toBeDefined()
    })

    it('should render both text adornments', () => {
      const mockProps = createMockInputProps({
        start: { text: 'From:' },
        end: { text: 'To:' }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      const { container: startContainer } = renderWithProviders(
        <div>{result.startAdornment}</div>
      )
      const { container: endContainer } = renderWithProviders(
        <div>{result.endAdornment}</div>
      )

      expect(startContainer.textContent).toContain('From:')
      expect(endContainer.textContent).toContain('To:')
    })

    it('should render mixed icon and text adornments', () => {
      const mockProps = createMockInputProps({
        start: { icon: { type: 'icon', name: 'search' } },
        end: { text: 'Search' }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      const { container: startContainer } = renderWithProviders(
        <div>{result.startAdornment}</div>
      )
      const { container: endContainer } = renderWithProviders(
        <div>{result.endAdornment}</div>
      )

      expect(startContainer.querySelector('[data-testid="mock-link-icon"]')).toBeInTheDocument()
      expect(endContainer.textContent).toContain('Search')
    })
  })

  describe('No Adornments', () => {
    it('should not include startAdornment when start is undefined', () => {
      const mockProps = createMockInputProps({
        end: { text: 'end' }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      expect(result.startAdornment).toBeUndefined()
    })

    it('should not include endAdornment when end is undefined', () => {
      const mockProps = createMockInputProps({
        start: { text: 'start' }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      expect(result.endAdornment).toBeUndefined()
    })

    it('should return empty props object when no adornments', () => {
      const mockProps = createMockInputProps({})

      const result = StateJsxTextfieldInputProps(mockProps)

      expect(result.startAdornment).toBeUndefined()
      expect(result.endAdornment).toBeUndefined()
    })
  })

  describe('Props Passthrough', () => {
    it('should include additional props in result', () => {
      const mockProps = createMockInputProps({
        props: { disabled: true, readOnly: true }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      expect(result.disabled).toBe(true)
      expect(result.readOnly).toBe(true)
    })

    it('should merge props with adornments', () => {
      const mockProps = createMockInputProps({
        start: { text: '$' },
        props: { className: 'custom-input' }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      expect(result.startAdornment).toBeDefined()
      expect(result.className).toBe('custom-input')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty adornment state', () => {
      const mockProps = createMockInputProps({
        start: {},
        end: {}
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      // Should still create adornment wrappers even with empty state
      expect(result.startAdornment).toBeDefined()
      expect(result.endAdornment).toBeDefined()
    })

    it('should handle adornment with empty text', () => {
      const mockProps = createMockInputProps({
        start: { text: '' }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      const { container } = renderWithProviders(
        <div>{result.startAdornment}</div>
      )

      expect(container.querySelector('.MuiInputAdornment-root')).toBeInTheDocument()
    })

    it('should prioritize icon over text when both provided', () => {
      const mockProps = createMockInputProps({
        start: { icon: { type: 'icon', name: 'search' }, text: 'Search' }
      })

      const result = StateJsxTextfieldInputProps(mockProps)

      const { container } = renderWithProviders(
        <div>{result.startAdornment}</div>
      )

      // Icon should be rendered, not text (based on component logic)
      expect(container.querySelector('[data-testid="mock-link-icon"]')).toBeInTheDocument()
    })
  })
})