import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { renderWithProviders } from '../../../test-utils'
import StateJsxDialogAction from '../../../../mui/dialog/actions/state.jsx.form.button'
import type StateFormItem from '../../../../controllers/StateFormItem'
import type StateForm from '../../../../controllers/StateForm'

interface ICreateMockFormButtonOptions {
  text?: string
  disabled?: boolean
  disableOnAll?: boolean
}

// Mock StateFormItem for testing
const createMockFormButton = (options: ICreateMockFormButtonOptions = {}): StateFormItem<StateForm> => ({
  text: options.text ?? 'Form Button',
  props: {
    type: 'submit',
    'data-testid': 'form-button',
  },
  has: {
    icon: undefined,
    faIcon: undefined,
    iconPosition: 'left',
  },
  disabled: options.disabled ?? false,
  disableOnAll: options.disableOnAll ?? false,
  clickReduxHandler: vi.fn(() => () => {}),
} as unknown as StateFormItem<StateForm>)

describe('src/mui/dialog/actions/state.jsx.form.button.tsx', () => {
  it('should render form button correctly', () => {
    const mockButton = createMockFormButton({ text: 'Submit Form' })

    const { getByTestId, getByText } = renderWithProviders(
      <StateJsxDialogAction instance={mockButton} />
    )

    expect(getByTestId('form-button')).toBeInTheDocument()
    expect(getByText('Submit Form')).toBeInTheDocument()
  })

  it('should handle button props correctly', () => {
    const mockButton = createMockFormButton({ text: 'Save' })

    const { getByTestId } = renderWithProviders(
      <StateJsxDialogAction instance={mockButton} />
    )

    const button = getByTestId('form-button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('should render without text', () => {
    const mockButton = createMockFormButton({ text: '' })

    const { container } = renderWithProviders(
      <StateJsxDialogAction instance={mockButton} />
    )

    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
  })

  it('should be disabled when item.disabled is true', () => {
    const mockButton = createMockFormButton({ disabled: true, disableOnAll: false })

    const { getByTestId } = renderWithProviders(
      <StateJsxDialogAction instance={mockButton} />
    )

    expect(getByTestId('form-button')).toBeDisabled()
  })

  it('should be disabled when disableOnAll is true', () => {
    const mockButton = createMockFormButton({ disabled: false, disableOnAll: true })

    const { getByTestId } = renderWithProviders(
      <StateJsxDialogAction instance={mockButton} />
    )

    expect(getByTestId('form-button')).toBeDisabled()
  })
})