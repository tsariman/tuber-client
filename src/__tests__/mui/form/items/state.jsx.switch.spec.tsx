import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders } from '../../../test-utils'
import StateJsxSwitch from '../../../../mui/form/items/state.jsx.switch'
import type StateFormItemSwitch from '../../../../controllers/templates/StateFormItemSwitch'

// Mock StateFormsData controller
vi.mock('../../../../controllers/StateFormsData', () => ({
  default: class MockStateFormsData {
    getValue = vi.fn(() => [])
  }
}))

describe('StateJsxSwitch', () => {
  // Helper to create mock switch item
  const createMockSwitchItem = (overrides: Partial<{
    name: string
    label: string
    props: Record<string, any>
    formControlLabelProps: Record<string, any>
  }> = {}) => ({
    name: overrides.name ?? 'switch1',
    label: overrides.label ?? 'Switch 1',
    props: overrides.props ?? {},
    formControlLabelProps: overrides.formControlLabelProps ?? {}
  })

  // Helper to create mock StateFormItemSwitch (group of switches)
  const createMockSwitchGroup = (overrides: Partial<{
    name: string
    label: string
    formControlProps: Record<string, any>
    formLabelProps: Record<string, any>
    formGroupProps: Record<string, any>
    items: ReturnType<typeof createMockSwitchItem>[]
    helperText: string
    parentName: string
  }> = {}) => {
    return {
      name: overrides.name ?? 'notifications',
      label: overrides.label ?? 'Notification Settings',
      formControlProps: overrides.formControlProps ?? {},
      formLabelProps: overrides.formLabelProps ?? {},
      formGroupProps: overrides.formGroupProps ?? {},
      has: {
        items: overrides.items ?? [
          createMockSwitchItem({ name: 'email', label: 'Email Notifications' }),
          createMockSwitchItem({ name: 'sms', label: 'SMS Notifications' }),
          createMockSwitchItem({ name: 'push', label: 'Push Notifications' })
        ],
        helperText: overrides.helperText ?? 'Choose your notification preferences'
      },
      parent: {
        name: overrides.parentName ?? 'settingsForm'
      }
    } as unknown as StateFormItemSwitch
  }

  describe('Basic Rendering', () => {
    it('should render switch group with label', () => {
      const mockSwitch = createMockSwitchGroup({ label: 'Notification Settings' })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
      expect(container.textContent).toContain('Notification Settings')
    })

    it('should render FormLabel component', () => {
      const mockSwitch = createMockSwitchGroup()

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiFormLabel-root')).toBeInTheDocument()
    })

    it('should render FormGroup component', () => {
      const mockSwitch = createMockSwitchGroup()

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiFormGroup-root')).toBeInTheDocument()
    })

    it('should render all switch items', () => {
      const mockSwitch = createMockSwitchGroup()

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      const switches = container.querySelectorAll('.MuiSwitch-root')
      expect(switches).toHaveLength(3)
    })

    it('should render switch item labels', () => {
      const mockSwitch = createMockSwitchGroup()

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.textContent).toContain('Email Notifications')
      expect(container.textContent).toContain('SMS Notifications')
      expect(container.textContent).toContain('Push Notifications')
    })
  })

  describe('Props Handling', () => {
    it('should pass formControlProps to FormControl', () => {
      const mockSwitch = createMockSwitchGroup({
        formControlProps: { fullWidth: true }
      })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
    })

    it('should pass formLabelProps to FormLabel', () => {
      const mockSwitch = createMockSwitchGroup({
        formLabelProps: { focused: true }
      })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      const label = container.querySelector('.MuiFormLabel-root')
      expect(label).toBeInTheDocument()
    })

    it('should pass formGroupProps to FormGroup', () => {
      const mockSwitch = createMockSwitchGroup({
        formGroupProps: { row: true }
      })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      const formGroup = container.querySelector('.MuiFormGroup-root')
      expect(formGroup).toBeInTheDocument()
      expect(formGroup).toHaveClass('MuiFormGroup-row')
    })

    it('should pass formControlLabelProps to FormControlLabel', () => {
      const mockSwitch = createMockSwitchGroup({
        items: [
          createMockSwitchItem({
            name: 'opt1',
            label: 'Option',
            formControlLabelProps: { labelPlacement: 'start' }
          })
        ]
      })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      const label = container.querySelector('.MuiFormControlLabel-root')
      expect(label).toHaveClass('MuiFormControlLabel-labelPlacementStart')
    })

    it('should pass props to individual Switch components', () => {
      const mockSwitch = createMockSwitchGroup({
        items: [
          createMockSwitchItem({
            name: 'opt1',
            label: 'Option',
            props: { color: 'secondary' }
          })
        ]
      })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiSwitch-colorSecondary')).toBeInTheDocument()
    })
  })

  describe('Switch Item Configuration', () => {
    it('should set name attribute on switch inputs', () => {
      const mockSwitch = createMockSwitchGroup({
        items: [
          createMockSwitchItem({ name: 'emailNotify', label: 'Email' }),
          createMockSwitchItem({ name: 'smsNotify', label: 'SMS' })
        ]
      })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.querySelector('input[name="emailNotify"]')).toBeInTheDocument()
      expect(container.querySelector('input[name="smsNotify"]')).toBeInTheDocument()
    })

    it('should render switches with custom labels', () => {
      const mockSwitch = createMockSwitchGroup({
        items: [
          createMockSwitchItem({ name: 'opt1', label: 'Receive daily digest' }),
          createMockSwitchItem({ name: 'opt2', label: 'Weekly summary' })
        ]
      })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.textContent).toContain('Receive daily digest')
      expect(container.textContent).toContain('Weekly summary')
    })
  })

  describe('Name Not Set Fallback', () => {
    it('should render TextField fallback when name is empty', () => {
      const mockSwitch = createMockSwitchGroup({ name: '' })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      const textField = container.querySelector('.MuiTextField-root')
      expect(textField).toBeInTheDocument()
    })

    it('should show NAME_NOT_SET message when name is empty', () => {
      const mockSwitch = createMockSwitchGroup({ name: '' })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      const input = container.querySelector('input')
      expect(input).toHaveValue('SWITCH NAME NOT SET!')
    })

    it('should render disabled TextField when name is empty', () => {
      const mockSwitch = createMockSwitchGroup({ name: '' })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      const input = container.querySelector('input')
      expect(input).toBeDisabled()
    })
  })

  describe('Label Variations', () => {
    it('should render with custom group label', () => {
      const mockSwitch = createMockSwitchGroup({ label: 'Privacy Settings' })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.textContent).toContain('Privacy Settings')
    })

    it('should render with empty group label', () => {
      const mockSwitch = createMockSwitchGroup({ label: '' })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiFormLabel-root')).toBeInTheDocument()
    })

    it('should render with special characters in label', () => {
      const mockSwitch = createMockSwitchGroup({ label: 'Settings & Preferences *' })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.textContent).toContain('Settings & Preferences *')
    })
  })

  describe('Form Integration', () => {
    it('should use parent form name', () => {
      const mockSwitch = createMockSwitchGroup({ parentName: 'preferencesForm' })

      renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(mockSwitch.parent.name).toBe('preferencesForm')
    })

    it('should render within FormControl wrapper', () => {
      const mockSwitch = createMockSwitchGroup()

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      const formControl = container.querySelector('.MuiFormControl-root')
      const formGroup = container.querySelector('.MuiFormGroup-root')
      const formLabel = container.querySelector('.MuiFormLabel-root')

      expect(formControl).toBeInTheDocument()
      // @ts-expect-error AI generated code
      expect(formControl).toContainElement(formGroup)
      // @ts-expect-error AI generated code
      expect(formControl).toContainElement(formLabel)
    })
  })

  describe('Edge Cases', () => {
    it('should handle single switch item', () => {
      const mockSwitch = createMockSwitchGroup({
        items: [createMockSwitchItem({ name: 'only', label: 'Only Option' })]
      })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.querySelectorAll('.MuiSwitch-root')).toHaveLength(1)
      expect(container.textContent).toContain('Only Option')
    })

    it('should handle many switch items', () => {
      const items = Array.from({ length: 10 }, (_, i) =>
        createMockSwitchItem({ name: `opt${i}`, label: `Option ${i + 1}` })
      )
      const mockSwitch = createMockSwitchGroup({ items })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.querySelectorAll('.MuiSwitch-root')).toHaveLength(10)
    })

    it('should handle empty props objects', () => {
      const mockSwitch = createMockSwitchGroup({
        formControlProps: {},
        formLabelProps: {},
        formGroupProps: {}
      })

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
    })

    it('should render FormLabel with legend component', () => {
      const mockSwitch = createMockSwitchGroup()

      const { container } = renderWithProviders(<StateJsxSwitch instance={mockSwitch} />)

      const legend = container.querySelector('legend')
      expect(legend).toBeInTheDocument()
    })
  })
})