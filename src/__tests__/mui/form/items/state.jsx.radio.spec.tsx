import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '../../../test-utils'
import '@testing-library/jest-dom'
import StateJsxRadio from '../../../../mui/form/items/state.jsx.radio'

// Mock StateFormsData controller
vi.mock('../../../../controllers/StateFormsData', () => ({
  default: class MockStateFormsData {
    getValue = vi.fn(() => 'male')
  }
}))

describe('StateJsxRadio', () => {
  // Helper to create mock radio button item
  const createMockRadioItem = (overrides: Partial<{
    name: string
    label: string
    disabled: boolean
    props: Record<string, any>
    formControlLabelProps: Record<string, any>
    state: { color?: string }
  }> = {}) => ({
    name: overrides.name ?? 'option1',
    label: overrides.label ?? 'Option 1',
    disabled: overrides.disabled ?? false,
    props: overrides.props ?? {},
    formControlLabelProps: overrides.formControlLabelProps ?? {},
    state: overrides.state ?? { color: 'primary' }
  })

  // Helper to create mock StateFormItemRadio
  const createMockRadioGroup = (overrides: Partial<{
    name: string
    text: string
    props: Record<string, any>
    formControlProps: Record<string, any>
    formLabelProps: Record<string, any>
    items: ReturnType<typeof createMockRadioItem>[]
    parentName: string
  }> = {}) => {
    return {
      name: overrides.name ?? 'gender',
      text: overrides.text ?? 'Select Gender',
      props: overrides.props ?? {},
      formControlProps: overrides.formControlProps ?? {},
      formLabelProps: overrides.formLabelProps ?? {},
      has: {
        items: overrides.items ?? [
          createMockRadioItem({ name: 'male', label: 'Male' }),
          createMockRadioItem({ name: 'female', label: 'Female' }),
          createMockRadioItem({ name: 'other', label: 'Other' })
        ]
      },
      parent: {
        name: overrides.parentName ?? 'testForm'
      }
    } as unknown as Parameters<typeof StateJsxRadio>[0]['instance']
  }

  describe('Basic Rendering', () => {
    it('should render radio group with label', () => {
      const mockRadio = createMockRadioGroup({ text: 'Select Gender' })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
      expect(container.querySelector('.MuiFormLabel-root')).toBeInTheDocument()
      expect(container.textContent).toContain('Select Gender')
    })

    it('should render all radio options', () => {
      const mockRadio = createMockRadioGroup()

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      const radioButtons = container.querySelectorAll('.MuiRadio-root')
      expect(radioButtons).toHaveLength(3)
    })

    it('should render radio option labels', () => {
      const mockRadio = createMockRadioGroup()

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(container.textContent).toContain('Male')
      expect(container.textContent).toContain('Female')
      expect(container.textContent).toContain('Other')
    })

    it('should render RadioGroup component', () => {
      const mockRadio = createMockRadioGroup()

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(container.querySelector('.MuiRadioGroup-root')).toBeInTheDocument()
    })
  })

  describe('Props Handling', () => {
    it('should pass formControlProps to FormControl', () => {
      const mockRadio = createMockRadioGroup({
        formControlProps: { fullWidth: true }
      })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
    })

    it('should pass formLabelProps to FormLabel', () => {
      const mockRadio = createMockRadioGroup({
        formLabelProps: { focused: true }
      })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(container.querySelector('.MuiFormLabel-root')).toBeInTheDocument()
    })

    it('should pass props to RadioGroup', () => {
      const mockRadio = createMockRadioGroup({
        props: { row: true }
      })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      const radioGroup = container.querySelector('.MuiRadioGroup-root')
      expect(radioGroup).toBeInTheDocument()
      expect(radioGroup).toHaveClass('MuiRadioGroup-row')
    })

    it('should use radio group name', () => {
      const mockRadio = createMockRadioGroup({ name: 'preference' })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      const radioInputs = container.querySelectorAll('input[type="radio"]')
      radioInputs.forEach(input => {
        expect(input).toHaveAttribute('name', 'preference')
      })
    })
  })

  describe('Radio Item Configuration', () => {
    it('should render disabled radio options', () => {
      const mockRadio = createMockRadioGroup({
        items: [
          createMockRadioItem({ name: 'opt1', label: 'Enabled', disabled: false }),
          createMockRadioItem({ name: 'opt2', label: 'Disabled', disabled: true })
        ]
      })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      const labels = container.querySelectorAll('.MuiFormControlLabel-root')
      expect(labels[1]).toHaveClass('Mui-disabled')
    })

    it('should apply radio color from state', () => {
      const mockRadio = createMockRadioGroup({
        items: [
          createMockRadioItem({ name: 'opt1', label: 'Primary', state: { color: 'primary' } }),
          createMockRadioItem({ name: 'opt2', label: 'Secondary', state: { color: 'secondary' } })
        ]
      })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(container.querySelectorAll('.MuiRadio-root')).toHaveLength(2)
    })

    it('should render radio with custom labels', () => {
      const mockRadio = createMockRadioGroup({
        items: [
          createMockRadioItem({ name: 'yes', label: 'Yes, I agree' }),
          createMockRadioItem({ name: 'no', label: 'No, I disagree' })
        ]
      })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(container.textContent).toContain('Yes, I agree')
      expect(container.textContent).toContain('No, I disagree')
    })
  })

  describe('Label Variations', () => {
    it('should render with custom group label', () => {
      const mockRadio = createMockRadioGroup({ text: 'Choose Your Option' })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(container.textContent).toContain('Choose Your Option')
    })

    it('should render with empty group label', () => {
      const mockRadio = createMockRadioGroup({ text: '' })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(container.querySelector('.MuiFormLabel-root')).toBeInTheDocument()
    })

    it('should render with special characters in label', () => {
      const mockRadio = createMockRadioGroup({ text: 'Select Option *' })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(container.textContent).toContain('Select Option *')
    })
  })

  describe('Form Integration', () => {
    it('should use parent form name', () => {
      const mockRadio = createMockRadioGroup({ parentName: 'surveyForm' })

      renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(mockRadio.parent.name).toBe('surveyForm')
    })

    it('should render within FormControl wrapper', () => {
      const mockRadio = createMockRadioGroup()

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      const formControl = container.querySelector('.MuiFormControl-root')
      const radioGroup = container.querySelector('.MuiRadioGroup-root')
      const formLabel = container.querySelector('.MuiFormLabel-root')

      expect(formControl).toBeInTheDocument()
      // @ts-expect-error AI generated code
      expect(formControl).toContainElement(radioGroup)
      // @ts-expect-error AI generated code
      expect(formControl).toContainElement(formLabel)
    })
  })

  describe('Edge Cases', () => {
    it('should handle single radio option', () => {
      const mockRadio = createMockRadioGroup({
        items: [createMockRadioItem({ name: 'only', label: 'Only Option' })]
      })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(container.querySelectorAll('.MuiRadio-root')).toHaveLength(1)
      expect(container.textContent).toContain('Only Option')
    })

    it('should handle many radio options', () => {
      const items = Array.from({ length: 10 }, (_, i) =>
        createMockRadioItem({ name: `opt${i}`, label: `Option ${i + 1}` })
      )
      const mockRadio = createMockRadioGroup({ items })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(container.querySelectorAll('.MuiRadio-root')).toHaveLength(10)
    })

    it('should handle empty props objects', () => {
      const mockRadio = createMockRadioGroup({
        props: {},
        formControlProps: {},
        formLabelProps: {}
      })

      const { container } = renderWithProviders(<StateJsxRadio instance={mockRadio} />)

      expect(container.querySelector('.MuiFormControl-root')).toBeInTheDocument()
    })
  })
})