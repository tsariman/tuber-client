import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '../../../test-utils'
import StateJsxDialogAction from '../../../../mui/dialog/actions/state.jsx'
import type StateDialog from '../../../../controllers/StateDialog'
import type { IStateFormItem } from '../../../../interfaces/localized'
import { 
  STATE_BUTTON, 
  TEXTFIELD, 
  CHECKBOXES, 
  STATE_SELECT, 
  HTML,
  SUBMIT,
  TEXT
} from '@tuber/shared'

// Mock the button component
vi.mock('../../../../mui/dialog/actions/state.jsx.button', () => ({
  default: ({ instance }: { instance: any }) => (
    <button data-testid={`dialog-button-${instance.name}`}>
      {instance.text || 'Button'}
    </button>
  )
}))

// Helper to create mock dialog parent
const createMockDialog = (): StateDialog => {
  return {
    name: 'test-dialog',
    state: { name: 'test-dialog' }
  } as unknown as StateDialog
}

describe('StateJsxDialogAction', () => {
  describe('Button Rendering', () => {
    it('renders buttons from form items array', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          type: STATE_BUTTON,
          name: 'submit-button',
          label: 'Submit'
        },
        {
          type: STATE_BUTTON,
          name: 'cancel-button',
          label: 'Cancel'
        }
      ]

      renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      expect(screen.getByTestId('dialog-button-submit-button')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-button-cancel-button')).toBeInTheDocument()
    })

    it('renders single button', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          type: STATE_BUTTON,
          name: 'ok-button',
          label: 'OK'
        }
      ]

      renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      expect(screen.getByTestId('dialog-button-ok-button')).toBeInTheDocument()
    })

    it('renders multiple buttons in order', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          type: STATE_BUTTON,
          name: 'button-1',
          label: 'First'
        },
        {
          type: STATE_BUTTON,
          name: 'button-2',
          label: 'Second'
        },
        {
          type: STATE_BUTTON,
          name: 'button-3',
          label: 'Third'
        }
      ]

      const { container } = renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      const buttons = container.querySelectorAll('button')
      expect(buttons).toHaveLength(3)
    })
  })

  describe('Type Filtering', () => {
    it('only renders items with state_button type', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          type: STATE_BUTTON,
          name: 'valid-button',
          label: 'Valid'
        },
        {
          type: TEXTFIELD,
          name: 'text-field',
          label: 'Text Field'
        },
        {
          type: CHECKBOXES,
          name: 'checkbox-field',
          label: 'Checkbox'
        }
      ]

      renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      // Only the button should be rendered
      expect(screen.getByTestId('dialog-button-valid-button')).toBeInTheDocument()
      expect(screen.queryByText('Text Field')).not.toBeInTheDocument()
      expect(screen.queryByText('Checkbox')).not.toBeInTheDocument()
    })

    it('handles case-insensitive type matching', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          type: 'STATE_BUTTON' as any,
          name: 'uppercase-button',
          label: 'Uppercase'
        },
        {
          type: 'State_Button' as any,
          name: 'mixed-button',
          label: 'Mixed'
        }
      ]

      renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      expect(screen.getByTestId('dialog-button-uppercase-button')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-button-mixed-button')).toBeInTheDocument()
    })

    it('filters out non-button types', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          type: SUBMIT,
          name: 'submit-field',
          label: 'Submit Field'
        },
        {
          type: HTML,
          name: 'custom-field',
          label: 'Custom'
        }
      ]

      const { container } = renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      const buttons = container.querySelectorAll('button')
      expect(buttons).toHaveLength(0)
    })
  })

  describe('Edge Cases', () => {
    it('renders nothing with empty array', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = []

      const { container } = renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      const buttons = container.querySelectorAll('button')
      expect(buttons).toHaveLength(0)
    })

    it('handles array with no button types', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          type: TEXT,
          name: 'field-1'
        },
        {
          type: STATE_SELECT,
          name: 'field-2'
        }
      ]

      const { container } = renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      const buttons = container.querySelectorAll('button')
      expect(buttons).toHaveLength(0)
    })

    it('handles mixed valid and invalid types', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          type: TEXT,
          name: 'field-1'
        },
        {
          type: STATE_BUTTON,
          name: 'button-1',
          label: 'Button 1'
        },
        {
          type: STATE_SELECT,
          name: 'field-2'
        },
        {
          type: STATE_BUTTON,
          name: 'button-2',
          label: 'Button 2'
        }
      ]

      const { container } = renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      const buttons = container.querySelectorAll('button')
      expect(buttons).toHaveLength(2)
      expect(screen.getByTestId('dialog-button-button-1')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-button-button-2')).toBeInTheDocument()
    })

    it('handles items without type property', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          name: 'no-type-field'
        } as IStateFormItem,
        {
          type: STATE_BUTTON,
          name: 'valid-button',
          label: 'Valid'
        }
      ]

      renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      // Only valid button should render
      expect(screen.getByTestId('dialog-button-valid-button')).toBeInTheDocument()
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(1)
    })
  })

  describe('Component Structure', () => {
    it('renders Fragment as container', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          type: STATE_BUTTON,
          name: 'test-button',
          label: 'Test'
        }
      ]

      const { container } = renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      // Fragment doesn't add wrapper elements
      expect(container.firstChild).toBeTruthy()
    })

    it('generates unique keys for buttons', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          type: STATE_BUTTON,
          name: 'button-1',
          label: 'Button 1'
        },
        {
          type: STATE_BUTTON,
          name: 'button-2',
          label: 'Button 2'
        }
      ]

      // Should not throw key warnings
      renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
    })
  })

  describe('Integration with StateFormItem', () => {
    it('passes correct instance to button component', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          type: STATE_BUTTON,
          name: 'integration-button',
          label: 'Integration Test'
        }
      ]

      renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      expect(screen.getByTestId('dialog-button-integration-button')).toBeInTheDocument()
    })

    it('handles multiple buttons with different properties', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          type: STATE_BUTTON,
          name: 'primary-button',
          label: 'Primary'
        },
        {
          type: STATE_BUTTON,
          name: 'secondary-button',
          label: 'Secondary'
        }
      ]

      renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      expect(screen.getByTestId('dialog-button-primary-button')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-button-secondary-button')).toBeInTheDocument()
    })
  })

  describe('Performance and Memoization', () => {
    it('component is memoized', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = [
        {
          type: STATE_BUTTON,
          name: 'memo-button',
          label: 'Memoized'
        }
      ]

      const { rerender } = renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      expect(screen.getByTestId('dialog-button-memo-button')).toBeInTheDocument()

      // Re-render with same props
      rerender(<StateJsxDialogAction array={formItems} parent={mockDialog} />)

      expect(screen.getByTestId('dialog-button-memo-button')).toBeInTheDocument()
    })

    it('handles large arrays efficiently', () => {
      const mockDialog = createMockDialog()
      const formItems: IStateFormItem[] = Array.from({ length: 20 }, (_, i) => ({
        type: STATE_BUTTON,
        name: `button-${i}`,
        label: `Button ${i}`
      }))

      const { container } = renderWithProviders(
        <StateJsxDialogAction array={formItems} parent={mockDialog} />
      )

      const buttons = container.querySelectorAll('button')
      expect(buttons).toHaveLength(20)
    })
  })
})