import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders } from '../../../test-utils'
import StateJsxTextfield from '../../../../mui/form/items/state.jsx.textfield'
import type StateFormItem from '../../../../controllers/StateFormItem'

// Mock StateFormsData controller
vi.mock('../../../../controllers/StateFormsData', () => ({
  default: class MockStateFormsData {
    getValue = vi.fn(() => '')
  }
}))

// Mock StateJsxTextfieldInputProps
vi.mock('../../../../mui/form/items/state.jsx.textfield.input.props', () => ({
  default: vi.fn(() => ({}))
}))

// Mock StateJsxAdornment
vi.mock('../../../../mui/form/items/state.jsx.input.adornment', () => ({
  StateJsxAdornment: () => null
}))

describe('StateJsxTextfield', () => {
  // Helper to create mock StateFormItem
  const createMockTextfield = (overrides: Partial<{
    name: string
    label: string
    type: string
    disabled: boolean
    props: Record<string, any>
    parentName: string
    maxLength: number
    invalidationRegex: string
    validationRegex: string
    required: boolean
    requiredMessage: string
    helperText: string
    inputProps: any
  }> = {}): StateFormItem => {
    return {
      name: overrides.name ?? 'username',
      label: overrides.label ?? 'Username',
      type: overrides.type ?? 'text',
      disabled: overrides.disabled ?? false,
      props: {
        helperText: overrides.helperText ?? '',
        ...overrides.props
      },
      has: {
        maxLength: overrides.maxLength ?? 0,
        invalidationRegex: overrides.invalidationRegex,
        validationRegex: overrides.validationRegex,
        requiredMessage: overrides.requiredMessage ?? 'This field is required',
        state: {
          maxLengthMessage: '',
          disableOnError: false,
          invalidationRegex: '',
          invalidationMessage: '',
          validationRegex: '',
          validationMessage: '',
          mustMatch: '',
          mustMatchMessage: ''
        },
        regexError: vi.fn(() => false)
      },
      is: {
        required: overrides.required ?? false
      },
      parent: {
        name: overrides.parentName ?? 'testForm'
      },
      inputProps: overrides.inputProps ?? {
        start: undefined,
        end: undefined,
        props: {}
      },
      onFocus: vi.fn(),
      onKeyDown: vi.fn(() => vi.fn()),
      onBlur: vi.fn(() => vi.fn())
    } as unknown as StateFormItem
  }

  describe('Basic Rendering', () => {
    it('should render TextField with label', () => {
      const mockTextfield = createMockTextfield({ label: 'Username' })

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.querySelector('.MuiTextField-root')).toBeInTheDocument()
      expect(container.textContent).toContain('Username')
    })

    it('should render TextField with MuiFormControl', () => {
      const mockTextfield = createMockTextfield()

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
    })

    it('should render input element', () => {
      const mockTextfield = createMockTextfield()

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.querySelector('input')).toBeInTheDocument()
    })

    it('should render InputLabel', () => {
      const mockTextfield = createMockTextfield({ label: 'Email' })

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.querySelector('.MuiInputLabel-root')).toBeInTheDocument()
    })
  })

  describe('Props Handling', () => {
    it('should pass custom props to TextField', () => {
      const mockTextfield = createMockTextfield({
        props: { variant: 'outlined', fullWidth: true }
      })

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.querySelector('.MuiTextField-root')).toBeInTheDocument()
    })

    it('should render with different text types', () => {
      const mockTextfield = createMockTextfield({ type: 'password' })

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.querySelector('input')).toBeInTheDocument()
    })

    it('should render helper text', () => {
      const mockTextfield = createMockTextfield({
        helperText: 'Enter your username'
      })

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.querySelector('.MuiFormHelperText-root')).toBeInTheDocument()
      expect(container.textContent).toContain('Enter your username')
    })
  })

  describe('Name Not Set Fallback', () => {
    it('should render fallback TextField when name is empty', () => {
      const mockTextfield = createMockTextfield({ name: '' })

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      const textField = container.querySelector('.MuiTextField-root')
      expect(textField).toBeInTheDocument()
    })

    it('should show NAME_NOT_SET message when name is empty', () => {
      const mockTextfield = createMockTextfield({ name: '' })

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      const input = container.querySelector('input')
      expect(input).toHaveValue('NAME NOT SET!')
    })

    it('should render disabled TextField when name is empty', () => {
      const mockTextfield = createMockTextfield({ name: '' })

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      const input = container.querySelector('input')
      expect(input).toBeDisabled()
    })
  })

  describe('Label Variations', () => {
    it('should render with custom label', () => {
      const mockTextfield = createMockTextfield({ label: 'Full Name' })

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.textContent).toContain('Full Name')
    })

    it('should render with empty label', () => {
      const mockTextfield = createMockTextfield({ label: '' })

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.querySelector('.MuiTextField-root')).toBeInTheDocument()
    })

    it('should render with special characters in label', () => {
      const mockTextfield = createMockTextfield({ label: 'Email Address *' })

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.textContent).toContain('Email Address *')
    })
  })

  describe('Form Integration', () => {
    it('should use parent form name', () => {
      const mockTextfield = createMockTextfield({ parentName: 'registrationForm' })

      renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(mockTextfield.parent.name).toBe('registrationForm')
    })

    it('should render within FormControl wrapper', () => {
      const mockTextfield = createMockTextfield()

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty props objects', () => {
      const mockTextfield = createMockTextfield({
        props: {}
      })

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.querySelector('.MuiTextField-root')).toBeInTheDocument()
    })

    it('should render standard variant by default', () => {
      const mockTextfield = createMockTextfield()

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.querySelector('.MuiTextField-root')).toBeInTheDocument()
    })

    it('should handle textfield with validation props', () => {
      const mockTextfield = createMockTextfield({
        maxLength: 50,
        required: true
      })

      const { container } = renderWithProviders(<StateJsxTextfield instance={mockTextfield} />)

      expect(container.querySelector('.MuiTextField-root')).toBeInTheDocument()
    })
  })
})