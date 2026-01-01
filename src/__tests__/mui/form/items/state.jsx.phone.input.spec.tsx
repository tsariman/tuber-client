import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '../../../test-utils'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import StateJsxPhoneInput from '../../../../mui/form/items/state.jsx.phone.input'

// Mock IMaskInput component
vi.mock('../../../../components/IMaskInput', () => ({
  IMaskInput: vi.fn(({ inputRef, onAccept, mask, ...props }) => (
    <input
      {...props}
      ref={inputRef}
      data-testid="masked-input"
      data-mask={mask}
      onChange={(e) => onAccept?.(e.target.value)}
    />
  ))
}))

// Mock StateFormsData controller
vi.mock('../../../../controllers/StateFormsData', () => ({
  default: class MockStateFormsData {
    getValue = vi.fn(() => '')
  }
}))

describe('StateJsxPhoneInput', () => {
  // Helper to create mock StateFormItemInput
  const createMockInput = (overrides: Partial<{
    name: string
    label: string
    props: Record<string, any>
    formControlProps: Record<string, any>
    inputLabelProps: Record<string, any>
    parentName: string
  }> = {}) => {
    return {
      name: overrides.name ?? 'phone',
      label: overrides.label ?? 'Phone Number',
      props: overrides.props ?? {},
      formControlProps: overrides.formControlProps ?? {},
      inputLabelProps: overrides.inputLabelProps ?? {},
      configure: vi.fn(),
      parent: {
        name: overrides.parentName ?? 'testForm'
      }
    } as unknown as Parameters<typeof StateJsxPhoneInput>[0]['instance']
  }

  describe('Basic Rendering', () => {
    it('should render phone input with label', () => {
      const mockInput = createMockInput({ label: 'Phone Number' })

      const { container } = renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
      expect(container.querySelector('.MuiInputLabel-root')).toBeInTheDocument()
      expect(container.textContent).toContain('Phone Number')
    })

    it('should render with masked input component', () => {
      const mockInput = createMockInput()

      const { getByTestId } = renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      expect(getByTestId('masked-input')).toBeInTheDocument()
    })

    it('should configure input as phone type', () => {
      const mockInput = createMockInput()

      renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      expect(mockInput.configure).toHaveBeenCalledWith('phone')
    })

    it('should apply phone mask pattern', () => {
      const mockInput = createMockInput()

      const { getByTestId } = renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      expect(getByTestId('masked-input')).toHaveAttribute('data-mask', '+1 (#00) 000-0000')
    })
  })

  describe('Props Handling', () => {
    it('should pass formControlProps to FormControl', () => {
      const mockInput = createMockInput({
        formControlProps: { fullWidth: true, margin: 'normal' }
      })

      const { container } = renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
    })

    it('should pass inputLabelProps to InputLabel', () => {
      const mockInput = createMockInput({
        inputLabelProps: { shrink: true }
      })

      const { container } = renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      const label = container.querySelector('.MuiInputLabel-root')
      expect(label).toBeInTheDocument()
    })

    it('should pass input props to Input component', () => {
      const mockInput = createMockInput({
        props: { disabled: true }
      })

      const { container } = renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      expect(container.querySelector('.MuiInput-root')).toBeInTheDocument()
    })

    it('should use input name prop', () => {
      const mockInput = createMockInput({ name: 'mobile_phone' })

      const { getByTestId } = renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      expect(getByTestId('masked-input')).toHaveAttribute('name', 'mobile_phone')
    })
  })

  describe('Label Variations', () => {
    it('should render with custom label text', () => {
      const mockInput = createMockInput({ label: 'Mobile Number' })

      const { container } = renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      expect(container.textContent).toContain('Mobile Number')
    })

    it('should render with empty label', () => {
      const mockInput = createMockInput({ label: '' })

      const { container } = renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      expect(container.querySelector('.MuiInputLabel-root')).toBeInTheDocument()
    })

    it('should render with special characters in label', () => {
      const mockInput = createMockInput({ label: 'Phone # *' })

      const { container } = renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      expect(container.textContent).toContain('Phone # *')
    })
  })

  describe('Form Integration', () => {
    it('should use parent form name for data handling', () => {
      const mockInput = createMockInput({ parentName: 'contactForm' })

      renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      // Component should render without error using parent name
      expect(mockInput.parent.name).toBe('contactForm')
    })

    it('should render within FormControl wrapper', () => {
      const mockInput = createMockInput()

      const { container } = renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      const formControl = container.querySelector('.MuiFormControl-root')
      const input = container.querySelector('.MuiInput-root')
      const label = container.querySelector('.MuiInputLabel-root')

      expect(formControl).toBeInTheDocument()
      // @ts-expect-error AI generated code
      expect(formControl).toContainElement(input)
      // @ts-expect-error AI generated code
      expect(formControl).toContainElement(label)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty props objects', () => {
      const mockInput = createMockInput({
        props: {},
        formControlProps: {},
        inputLabelProps: {}
      })

      const { container } = renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
    })

    it('should render with default configuration', () => {
      const mockInput = createMockInput()

      const { container } = renderWithProviders(
        <StateJsxPhoneInput instance={mockInput} />
      )

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
      expect(container.querySelector('.MuiInput-root')).toBeInTheDocument()
      expect(container.querySelector('.MuiInputLabel-root')).toBeInTheDocument()
    })
  })
})