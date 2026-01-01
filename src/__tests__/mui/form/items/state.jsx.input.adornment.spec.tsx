import { JSX } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { StateJsxAdornment } from '../../../../mui/form/items/state.jsx.input.adornment'
import type { IAdornment } from '@tuber/shared'

// Mock the icon provider
vi.mock('../../../../mui/icon', () => ({
  StateJsxUnifiedIconProvider: ({ instance }: { instance: any }) => (
    <span data-testid="mock-icon">{instance.icon || 'icon'}</span>
  )
}))

// Mock StateFormItemCustom
vi.mock('../../../../controllers/StateFormItemCustom', () => ({
  default: class MockStateFormItemCustom {
    icon: string | undefined
    constructor(config: { icon?: string }) {
      this.icon = config.icon
    }
  }
}))

describe('StateJsxAdornment', () => {
  describe('Basic Rendering', () => {
    it('should return undefined when no adornment is provided', () => {
      const result = StateJsxAdornment()
      expect(result).toBeUndefined()
    })

    it('should return undefined when adornment is undefined', () => {
      const result = StateJsxAdornment(undefined)
      expect(result).toBeUndefined()
    })

    it('should render adornment with icon', () => {
      const adornment: IAdornment = {
        position: 'start',
        icon: 'search'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      expect(container.querySelector('.MuiInputAdornment-root')).toBeInTheDocument()
      expect(container.querySelector('[data-testid="mock-icon"]')).toBeInTheDocument()
    })

    it('should render adornment with text', () => {
      const adornment: IAdornment = {
        position: 'end',
        text: 'USD'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      expect(container.querySelector('.MuiInputAdornment-root')).toBeInTheDocument()
      expect(container.textContent).toContain('USD')
    })

    it('should render adornment with both icon and text', () => {
      const adornment: IAdornment = {
        position: 'start',
        icon: 'attach_money',
        text: 'USD'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      expect(container.querySelector('.MuiInputAdornment-root')).toBeInTheDocument()
      expect(container.querySelector('[data-testid="mock-icon"]')).toBeInTheDocument()
      expect(container.textContent).toContain('USD')
    })
  })

  describe('Position Handling', () => {
    it('should render adornment with start position', () => {
      const adornment: IAdornment = {
        position: 'start',
        icon: 'person'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      const adornmentEl = container.querySelector('.MuiInputAdornment-root')
      expect(adornmentEl).toBeInTheDocument()
      expect(adornmentEl?.classList.contains('MuiInputAdornment-positionStart')).toBe(true)
    })

    it('should render adornment with end position', () => {
      const adornment: IAdornment = {
        position: 'end',
        icon: 'visibility'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      const adornmentEl = container.querySelector('.MuiInputAdornment-root')
      expect(adornmentEl).toBeInTheDocument()
      expect(adornmentEl?.classList.contains('MuiInputAdornment-positionEnd')).toBe(true)
    })
  })

  describe('Icon Handling', () => {
    it('should pass icon to StateJsxAdornmentIcon', () => {
      const adornment: IAdornment = {
        position: 'start',
        icon: 'email'
      }
      
      const result = StateJsxAdornment(adornment)
      const { getByTestId } = render(result as JSX.Element)
      
      expect(getByTestId('mock-icon')).toBeInTheDocument()
    })

    it('should handle faIcon property', () => {
      const adornment: IAdornment = {
        position: 'start',
        faIcon: 'fa-user'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      expect(container.querySelector('[data-testid="mock-icon"]')).toBeInTheDocument()
    })

    it('should render adornment without icon when not provided', () => {
      const adornment: IAdornment = {
        position: 'start',
        text: 'Label'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      expect(container.querySelector('.MuiInputAdornment-root')).toBeInTheDocument()
      expect(container.querySelector('[data-testid="mock-icon"]')).toBeInTheDocument()
    })
  })

  describe('Text Handling', () => {
    it('should add space before text when text is provided', () => {
      const adornment: IAdornment = {
        position: 'end',
        text: 'kg'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      // Text should have a leading space
      expect(container.textContent).toContain(' kg')
    })

    it('should not add text when text is empty string', () => {
      const adornment: IAdornment = {
        position: 'end',
        icon: 'check',
        text: ''
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      // Should only contain icon, no additional text
      expect(container.textContent?.trim()).toBe('check')
    })

    it('should not add text when text is undefined', () => {
      const adornment: IAdornment = {
        position: 'start',
        icon: 'search'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      expect(container.textContent).toContain('search')
    })
  })

  describe('Additional InputAdornment Props', () => {
    it('should pass through additional InputAdornment props', () => {
      const adornment: IAdornment = {
        position: 'start',
        icon: 'lock',
        disablePointerEvents: true
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      const adornmentEl = container.querySelector('.MuiInputAdornment-root')
      expect(adornmentEl).toBeInTheDocument()
    })

    it('should handle empty adornment object', () => {
      const adornment: IAdornment = {
        position: 'start'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      expect(container.querySelector('.MuiInputAdornment-root')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null icon value', () => {
      const adornment: IAdornment = {
        position: 'start',
        icon: undefined,
        text: 'Text only'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      expect(container.querySelector('.MuiInputAdornment-root')).toBeInTheDocument()
      expect(container.textContent).toContain('Text only')
    })

    it('should handle complex text values', () => {
      const adornment: IAdornment = {
        position: 'end',
        text: '$/unit'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      expect(container.textContent).toContain('$/unit')
    })

    it('should handle very long text', () => {
      const adornment: IAdornment = {
        position: 'end',
        text: 'This is a very long text that might wrap'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      expect(container.textContent).toContain('This is a very long text that might wrap')
    })

    it('should handle special characters in text', () => {
      const adornment: IAdornment = {
        position: 'start',
        text: '@ #$%'
      }
      
      const result = StateJsxAdornment(adornment)
      const { container } = render(result as JSX.Element)
      
      expect(container.textContent).toContain('@ #$%')
    })
  })
})
