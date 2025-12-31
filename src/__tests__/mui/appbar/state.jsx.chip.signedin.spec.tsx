import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../test-utils'
import ChipSignedIn from '../../../mui/appbar/state.jsx.chip.signedin'
import type StatePage from '../../../controllers/StatePage'

// Mock StatePage with signed in appbar for testing
const createMockSignedInPage = (): StatePage => ({
  appbar: {
    _type: 'signedin',
    title: 'Dashboard',
    user: {
      name: 'John Doe',
      avatar: '/avatar.jpg',
      props: { 'data-testid': 'user-avatar' },
    },
    menuItems: [
      {
        text: 'Profile',
        icon: 'person',
        props: { 'data-testid': 'menu-profile' },
      },
      {
        text: 'Settings',
        icon: 'settings',
        props: { 'data-testid': 'menu-settings' },
      },
      {
        text: 'Logout',
        icon: 'logout',
        props: { 'data-testid': 'menu-logout' },
      },
    ],
    props: {
      'data-testid': 'signedin-appbar',
    },
    position: 'fixed',
    color: 'primary',
  },
} as unknown as StatePage)

describe('src/mui/appbar/state.jsx.signedin.appbar.tsx', () => {
  it('should render signed in appbar correctly', () => {
    // const mockPage = createMockSignedInPage()
    
    const { getByTestId } = renderWithProviders(
      <ChipSignedIn />
    )
    
    expect(getByTestId('signedin-appbar')).toBeInTheDocument()
  })

  it('should render user avatar', () => {
    // const mockPage = createMockSignedInPage()
    
    const { getByTestId } = renderWithProviders(
      <ChipSignedIn />
    )
    
    expect(getByTestId('user-avatar')).toBeInTheDocument()
  })

  it('should render appbar title', () => {
    // const mockPage = createMockSignedInPage()
    
    const { getByText } = renderWithProviders(
      <ChipSignedIn />
    )
    
    expect(getByText('Dashboard')).toBeInTheDocument()
  })

  it('should render user menu items', () => {
    // const mockPage = createMockSignedInPage()
    
    const { getByTestId } = renderWithProviders(
      <ChipSignedIn />
    )
    
    expect(getByTestId('menu-profile')).toBeInTheDocument()
    expect(getByTestId('menu-settings')).toBeInTheDocument()
    expect(getByTestId('menu-logout')).toBeInTheDocument()
  })

  it('should display user name', () => {
    // const mockPage = createMockSignedInPage()
    
    const { getByText } = renderWithProviders(
      <ChipSignedIn />
    )
    
    expect(getByText('John Doe')).toBeInTheDocument()
  })

  it('should render with signed in layout', () => {
    // const mockPage = createMockSignedInPage()
    
    const { container } = renderWithProviders(
      <ChipSignedIn />
    )
    
    const toolbar = container.querySelector('[class*="MuiToolbar"]')
    expect(toolbar).toBeInTheDocument()
  })
})