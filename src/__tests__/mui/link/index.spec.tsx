import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders } from '../../test-utils'
import '@testing-library/jest-dom'
import StateJsxLink from '../../../mui/link'
import type StateLink from '../../../controllers/StateLink'

// Mock StateJsxBadgedIcon
vi.mock('../../../mui/icon', () => ({
  default: () => <span data-testid="mock-badged-icon">icon</span>
}))

// Mock StateFormItemCustomChip
vi.mock('../../../controllers/templates/StateFormItemCustomChip', () => ({
  default: class MockStateFormItemCustomChip {
    constructor(public state: any, public parent: any) {}
    get text() { return 'Chip Text' }
    get color() { return 'primary' }
  }
}))

// Mock get_redux
vi.mock('../../../state', () => ({
  get_redux: vi.fn(() => ({ dispatch: vi.fn(), getState: vi.fn() }))
}))

describe('StateJsxLink', () => {
  // Helper to create mock StateLink
  const createMockLink = (overrides: Partial<{
    type: string
    color: string
    props: Record<string, any>
    text: string
    label: string
    route: string
    state: any
    onClick: () => any
  }> = {}): StateLink => {
    return {
      type: overrides.type ?? 'link',
      color: overrides.color ?? 'inherit',
      props: overrides.props ?? {},
      has: {
        text: overrides.text ?? 'Link Text',
        label: overrides.label ?? 'Link Label',
        route: overrides.route ?? '/test',
        state: overrides.state ?? {},
        color: overrides.color ?? 'primary'
      },
      onClick: overrides.onClick ?? (() => vi.fn()),
      parent: {
        menuItemsProps: {},
        menuItemsSx: {},
        typography: { fontFamily: 'Arial', color: 'inherit' }
      }
    } as unknown as StateLink
  }

  describe('Link Type (Hyperlink)', () => {
    it('should render MUI Link for type "link"', () => {
      const mockLink = createMockLink({ type: 'link', text: 'Click Me' })

      const { container } = renderWithProviders(<StateJsxLink instance={mockLink} />)

      expect(container.querySelector('.MuiLink-root')).toBeInTheDocument()
      expect(container.textContent).toContain('Click Me')
    })

    it('should render with body2 variant', () => {
      const mockLink = createMockLink({ type: 'link' })

      const { container } = renderWithProviders(<StateJsxLink instance={mockLink} />)

      expect(container.querySelector('.MuiTypography-body2')).toBeInTheDocument()
    })
  })

  describe('Text Button Type', () => {
    it('should render Button for type "text"', () => {
      const mockLink = createMockLink({ type: 'text', text: 'Button Text' })

      const { container } = renderWithProviders(<StateJsxLink instance={mockLink} />)

      expect(container.querySelector('.MuiButton-root')).toBeInTheDocument()
      expect(container.textContent).toContain('Button Text')
    })

    it('should set aria-label on button', () => {
      const mockLink = createMockLink({ type: 'text', label: 'Test Label' })

      const { container } = renderWithProviders(<StateJsxLink instance={mockLink} />)

      const button = container.querySelector('.MuiButton-root')
      expect(button).toHaveAttribute('aria-label', 'Test Label')
    })
  })

  describe('Textlogo Button Type', () => {
    it('should render Button with Typography for type "textlogo"', () => {
      const mockLink = createMockLink({ type: 'textlogo', text: 'Logo Text' })

      const { container } = renderWithProviders(<StateJsxLink instance={mockLink} />)

      expect(container.querySelector('.MuiButton-root')).toBeInTheDocument()
      expect(container.querySelector('.MuiTypography-h6')).toBeInTheDocument()
      expect(container.textContent).toContain('Logo Text')
    })
  })

  describe('SVG Button Types', () => {
    it('should render IconButton for type "svg"', () => {
      const mockLink = createMockLink({ type: 'svg' })

      const { container } = renderWithProviders(
        <StateJsxLink instance={mockLink}>
          <span>SVG Icon</span>
        </StateJsxLink>
      )

      expect(container.querySelector('.MuiIconButton-root')).toBeInTheDocument()
    })

    it('should render IconButton with text on right for type "svg_right"', () => {
      const mockLink = createMockLink({ type: 'svg_right', text: 'Right Text' })

      const { container } = renderWithProviders(
        <StateJsxLink instance={mockLink}>
          <span>Icon</span>
        </StateJsxLink>
      )

      expect(container.querySelector('.MuiIconButton-root')).toBeInTheDocument()
      expect(container.textContent).toContain('Right Text')
    })

    it('should render IconButton with text on left for type "svg_left"', () => {
      const mockLink = createMockLink({ type: 'svg_left', text: 'Left Text' })

      const { container } = renderWithProviders(
        <StateJsxLink instance={mockLink}>
          <span>Icon</span>
        </StateJsxLink>
      )

      expect(container.querySelector('.MuiIconButton-root')).toBeInTheDocument()
      expect(container.textContent).toContain('Left Text')
    })
  })

  describe('Icon Button Type', () => {
    it('should render IconButton with badged icon for type "icon"', () => {
      const mockLink = createMockLink({ type: 'icon' })

      const { container } = renderWithProviders(<StateJsxLink instance={mockLink} />)

      expect(container.querySelector('.MuiIconButton-root')).toBeInTheDocument()
      expect(container.querySelector('[data-testid="mock-badged-icon"]')).toBeInTheDocument()
    })
  })

  describe('Hybrid Button Type', () => {
    it('should render Button with icon and text for type "hybrid"', () => {
      const mockLink = createMockLink({ type: 'hybrid', text: 'Hybrid Text' })

      const { container } = renderWithProviders(<StateJsxLink instance={mockLink} />)

      expect(container.querySelector('.MuiButton-root')).toBeInTheDocument()
      expect(container.querySelector('[data-testid="mock-badged-icon"]')).toBeInTheDocument()
      expect(container.textContent).toContain('Hybrid Text')
    })
  })

  describe('Chip Button Type', () => {
    it('should render Chip for type "chip"', () => {
      const mockLink = createMockLink({ type: 'chip' })

      const { container } = renderWithProviders(<StateJsxLink instance={mockLink} />)

      expect(container.querySelector('.MuiChip-root')).toBeInTheDocument()
    })
  })

  describe('Default Button Type', () => {
    it('should render Link for unknown type', () => {
      const mockLink = createMockLink({ type: 'unknown_type', text: 'Default Text' })

      const { container } = renderWithProviders(<StateJsxLink instance={mockLink} />)

      expect(container.querySelector('.MuiLink-root')).toBeInTheDocument()
      expect(container.textContent).toContain('Default Text')
    })
  })

  describe('Dropdown Type', () => {
    it('should render empty fragment for type "dropdown"', () => {
      const mockLink = createMockLink({ type: 'dropdown' })

      const { container } = renderWithProviders(<StateJsxLink instance={mockLink} />)

      // Dropdown renders empty Fragment
      expect(container.textContent).toBe('')
    })
  })

  describe('Case Insensitivity', () => {
    it('should handle uppercase type', () => {
      const mockLink = createMockLink({ type: 'LINK', text: 'Uppercase' })

      const { container } = renderWithProviders(<StateJsxLink instance={mockLink} />)

      expect(container.querySelector('.MuiLink-root')).toBeInTheDocument()
    })

    it('should handle mixed case type', () => {
      const mockLink = createMockLink({ type: 'Text', text: 'Mixed Case' })

      const { container } = renderWithProviders(<StateJsxLink instance={mockLink} />)

      expect(container.querySelector('.MuiButton-root')).toBeInTheDocument()
    })
  })

  describe('Props Handling', () => {
    it('should pass custom props to component', () => {
      const mockLink = createMockLink({
        type: 'link',
        props: { 'data-custom': 'value' }
      })

      const { container } = renderWithProviders(<StateJsxLink instance={mockLink} />)

      expect(container.querySelector('[data-custom="value"]')).toBeInTheDocument()
    })
  })

  describe('Children Rendering', () => {
    it('should render children in svg button', () => {
      const mockLink = createMockLink({ type: 'svg' })

      const { container } = renderWithProviders(
        <StateJsxLink instance={mockLink}>
          <span data-testid="child-content">Child</span>
        </StateJsxLink>
      )

      expect(container.querySelector('[data-testid="child-content"]')).toBeInTheDocument()
    })
  })
})