import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../../test-utils'
import StateJsxSwitch from '../../../../mui/form/items/state.jsx.switch'
import type StateFormItemSwitch from '../../../../controllers/templates/StateFormItemSwitch'

// Mock StateFormItemSwitch for testing
const createMockSwitch = (label: string = 'Test Switch', checked: boolean = false): StateFormItemSwitch => ({
  label,
  name: 'testSwitch',
  _type: 'switch',
  checked,
  value: checked,
  props: {
    'data-testid': 'test-switch',
  },
  disabled: false,
  required: false,
  color: 'primary',
} as unknown as StateFormItemSwitch)

describe('src/mui/form/items/state.jsx.switch.tsx', () => {

  describe('StateJsxSwitch', () => {

    it('should render switch correctly', () => {
      const mockSwitch = createMockSwitch('Enable Notifications')
      
      const { getByTestId } = renderWithProviders(
        <StateJsxSwitch def={mockSwitch} />
      )
      
      expect(getByTestId('test-switch')).toBeInTheDocument()
    })

    it('should render with label', () => {
      const mockSwitch = createMockSwitch('Dark Mode')
      
      const { getByText } = renderWithProviders(
        <StateJsxSwitch def={mockSwitch} />
      )
      
      expect(getByText('Dark Mode')).toBeInTheDocument()
    })

    it('should handle checked state', () => {
      const mockSwitch = createMockSwitch('Enabled Feature', true)
      
      const { getByRole } = renderWithProviders(
        <StateJsxSwitch def={mockSwitch} />
      )
      
      const switchElement = getByRole('checkbox')
      expect(switchElement).toBeChecked()
    })

    it('should handle unchecked state', () => {
      const mockSwitch = createMockSwitch('Disabled Feature', false)
      
      const { getByRole } = renderWithProviders(
        <StateJsxSwitch def={mockSwitch} />
      )
      
      const switchElement = getByRole('checkbox')
      expect(switchElement).not.toBeChecked()
    })

    it('should handle disabled state', () => {
      const mockSwitch = {
        ...createMockSwitch(),
        disabled: true,
      } as unknown as StateFormItemSwitch
      
      const { getByRole } = renderWithProviders(
        <StateJsxSwitch def={mockSwitch} />
      )
      
      const switchElement = getByRole('checkbox')
      expect(switchElement).toBeDisabled()
    })

  })

})
