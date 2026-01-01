import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '../../../test-utils'
import '@testing-library/jest-dom'
import StateJsxSingleSwitch from '../../../../mui/form/items/state.jsx.single.switch'

// Mock StateFormsData controller
vi.mock('../../../../controllers/StateFormsData', () => ({
  default: class MockStateFormsData {
    getValue = vi.fn(() => 'false')
  }
}))

describe('StateJsxSingleSwitch', () => {
  // Helper to create mock StateFormItemSwitch
  const createMockSwitch = (overrides: Partial<{
    name: string
    label: string
    disabled: boolean
    props: Record<string, any>
    formControlProps: Record<string, any>
    formControlLabelProps: Record<string, any>
    formHelperTextProps: Record<string, any>
    helperText: string
    defaultValue: string
    parentName: string
  }> = {}) => {
    return {
      name: overrides.name ?? 'published',
      label: overrides.label ?? 'Published',
      disabled: overrides.disabled ?? false,
      props: overrides.props ?? {},
      formControlProps: overrides.formControlProps ?? {},
      formControlLabelProps: overrides.formControlLabelProps ?? {},
      formHelperTextProps: overrides.formHelperTextProps ?? {},
      has: {
        helperText: overrides.helperText ?? 'Toggle to enable/disable',
        defaultValue: overrides.defaultValue ?? 'false'
      },
      parent: {
        name: overrides.parentName ?? 'testForm'
      }
    } as unknown as Parameters<typeof StateJsxSingleSwitch>[0]['instance']
  }

  describe('Basic Rendering', () => {
    it('should render switch with label', () => {
      const mockSwitch = createMockSwitch({ label: 'Published' })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiSwitch-root')).toBeInTheDocument()
      expect(container.textContent).toContain('Published')
    })

    it('should render FormControl wrapper', () => {
      const mockSwitch = createMockSwitch()

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
    })

    it('should render FormControlLabel', () => {
      const mockSwitch = createMockSwitch()

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiFormControlLabel-root')).toBeInTheDocument()
    })

    it('should render helper text', () => {
      const mockSwitch = createMockSwitch({ helperText: 'Toggle to enable/disable' })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.textContent).toContain('Toggle to enable/disable')
    })

    it('should render FormHelperText component', () => {
      const mockSwitch = createMockSwitch()

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiFormHelperText-root')).toBeInTheDocument()
    })
  })

  describe('Props Handling', () => {
    it('should pass formControlProps to FormControl', () => {
      const mockSwitch = createMockSwitch({
        formControlProps: { fullWidth: true }
      })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
    })

    it('should pass formControlLabelProps to FormControlLabel', () => {
      const mockSwitch = createMockSwitch({
        formControlLabelProps: { labelPlacement: 'start' }
      })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      const label = container.querySelector('.MuiFormControlLabel-root')
      expect(label).toBeInTheDocument()
      expect(label).toHaveClass('MuiFormControlLabel-labelPlacementStart')
    })

    it('should pass props to Switch component', () => {
      const mockSwitch = createMockSwitch({
        props: { color: 'secondary' }
      })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiSwitch-colorSecondary')).toBeInTheDocument()
    })

    it('should pass formHelperTextProps to FormHelperText', () => {
      const mockSwitch = createMockSwitch({
        formHelperTextProps: { error: true }
      })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      const helperText = container.querySelector('.MuiFormHelperText-root')
      expect(helperText).toBeInTheDocument()
    })

    it('should render switch input with label', () => {
      const mockSwitch = createMockSwitch({ label: 'Enable Feature' })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      const input = container.querySelector('input[type="checkbox"]')
      expect(input).toBeInTheDocument()
      expect(container.textContent).toContain('Enable Feature')
    })
  })

  describe('Disabled State', () => {
    it('should render disabled switch when disabled is true', () => {
      const mockSwitch = createMockSwitch({ disabled: true })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      const input = container.querySelector('input[type="checkbox"]')
      expect(input).toBeDisabled()
    })

    it('should render enabled switch when disabled is false', () => {
      const mockSwitch = createMockSwitch({ disabled: false })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      const input = container.querySelector('input[type="checkbox"]')
      expect(input).not.toBeDisabled()
    })
  })

  describe('Name Not Set Fallback', () => {
    it('should render TextField fallback when name is empty', () => {
      const mockSwitch = createMockSwitch({ name: '' })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      const textField = container.querySelector('.MuiTextField-root')
      expect(textField).toBeInTheDocument()
    })

    it('should show NAME_NOT_SET message when name is empty', () => {
      const mockSwitch = createMockSwitch({ name: '' })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      const input = container.querySelector('input')
      expect(input).toHaveValue('SWITCH NAME NOT SET!')
    })

    it('should render disabled TextField when name is empty', () => {
      const mockSwitch = createMockSwitch({ name: '' })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      const input = container.querySelector('input')
      expect(input).toBeDisabled()
    })
  })

  describe('Label Variations', () => {
    it('should render with custom label', () => {
      const mockSwitch = createMockSwitch({ label: 'Enable Notifications' })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.textContent).toContain('Enable Notifications')
    })

    it('should render with empty label', () => {
      const mockSwitch = createMockSwitch({ label: '' })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiSwitch-root')).toBeInTheDocument()
    })

    it('should render with special characters in label', () => {
      const mockSwitch = createMockSwitch({ label: 'Enable Feature *' })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.textContent).toContain('Enable Feature *')
    })
  })

  describe('Helper Text Variations', () => {
    it('should render with custom helper text', () => {
      const mockSwitch = createMockSwitch({ helperText: 'This controls visibility' })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.textContent).toContain('This controls visibility')
    })

    it('should render with empty helper text', () => {
      const mockSwitch = createMockSwitch({ helperText: '' })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiFormHelperText-root')).toBeInTheDocument()
    })

    it('should render with long helper text', () => {
      const longText = 'This is a very long helper text that explains the switch functionality in detail'
      const mockSwitch = createMockSwitch({ helperText: longText })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.textContent).toContain(longText)
    })
  })

  describe('Form Integration', () => {
    it('should use parent form name', () => {
      const mockSwitch = createMockSwitch({ parentName: 'settingsForm' })

      renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(mockSwitch.parent.name).toBe('settingsForm')
    })

    it('should set switch value attribute to name', () => {
      const mockSwitch = createMockSwitch({ name: 'autoSave' })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      const input = container.querySelector('input[type="checkbox"]')
      expect(input).toHaveAttribute('value', 'autoSave')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty props objects', () => {
      const mockSwitch = createMockSwitch({
        props: {},
        formControlProps: {},
        formControlLabelProps: {},
        formHelperTextProps: {}
      })

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiSwitch-root')).toBeInTheDocument()
    })

    it('should render switch with standard variant FormControl', () => {
      const mockSwitch = createMockSwitch()

      const { container } = renderWithProviders(<StateJsxSingleSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
    })
  })
})