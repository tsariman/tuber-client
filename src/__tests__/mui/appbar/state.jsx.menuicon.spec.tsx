import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import MenuIcon from '../../../mui/appbar/state.jsx.menuicon'
import type StatePageAppbar from '../../../controllers/templates/StatePageAppbar'

// Mock StatePageAppbar for testing
const createMockAppbar = (hasDrawer: boolean, generateDefaultDrawer: boolean = false, menuIconProps: Record<string, unknown> = {}): StatePageAppbar => ({
  parent: {
    hasDrawer,
    generateDefaultDrawer,
  },
  menuIconProps,
} as unknown as StatePageAppbar)

describe('src/mui/appbar/state.jsx.menuicon.appbar.tsx', () => {
  it('should render menu icon when drawer exists', () => {
    const mockAppbar = createMockAppbar(true, false, { 'data-testid': 'menu-icon' })
    const mockToggle = () => {}
    
    const { container } = render(<MenuIcon instance={mockAppbar} toggle={mockToggle} />)
    const iconButton = container.querySelector('button')
    
    expect(iconButton).toBeInTheDocument()
  })

  it('should render default drawer menu icon when generateDefaultDrawer is true', () => {
    const mockAppbar = createMockAppbar(false, true)
    const mockToggle = () => {}
    
    const { container } = render(<MenuIcon instance={mockAppbar} toggle={mockToggle} />)
    const iconButton = container.querySelector('button')
    
    expect(iconButton).toBeInTheDocument()
    expect(iconButton).toHaveAttribute('aria-label', 'open drawer')
  })

  it('should return null when no drawer conditions are met', () => {
    const mockAppbar = createMockAppbar(false, false)
    const mockToggle = () => {}
    
    const { container } = render(<MenuIcon instance={mockAppbar} toggle={mockToggle} />)
    
    expect(container.firstChild).toBeNull()
  })

  it('should apply custom menu icon props', () => {
    const mockAppbar = createMockAppbar(true, false, { className: 'custom-menu-icon' })
    const mockToggle = () => {}
    
    const { container } = render(<MenuIcon instance={mockAppbar} toggle={mockToggle} />)
    const iconButton = container.querySelector('button.custom-menu-icon')
    
    expect(iconButton).toBeInTheDocument()
  })
})