import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import AppbarBasic from '../../../mui/appbar/state.jsx.appbar.basic';
import type StatePage from '../../../controllers/StatePage';
import '@testing-library/jest-dom'

// Mock interface for testing the basic appbar component
interface MockAppbarPage {
  appbar: {
    props: Record<string, unknown>;
    toolbarProps: Record<string, unknown>;
    parent: {
      hasDrawer: boolean;
    };
    menuIconProps: Record<string, unknown>;
    hasLogo: boolean;
    typography: {
      fontFamily: string;
      color: string;
    };
    textLogoProps: Record<string, unknown>;
    items: unknown[];
  };
  hasDrawer: boolean;
  parent: {
    parent: {
      app: {
        title: string;
      };
    };
  };
}

describe('src/mui/appbar/state.jsx.basic.appbar.tsx', () => {
  it('should render basic appbar without drawer', () => {
    const mockPage: MockAppbarPage = {
      appbar: {
        props: {},
        toolbarProps: {},
        parent: {
          hasDrawer: false,
        },
        menuIconProps: {},
        hasLogo: false,
        typography: {
          fontFamily: 'Arial',
          color: '#000000',
        },
        textLogoProps: {},
        items: [],
      },
      hasDrawer: false,
      parent: {
        parent: {
          app: {
            title: 'Test App',
          },
        },
      },
    };

    const { container } = renderWithProviders(<AppbarBasic def={mockPage as unknown as StatePage} />);
    expect(container.querySelector('.MuiAppBar-root')).toBeInTheDocument();
  });

  it('should render basic appbar with drawer menu icon', () => {
    const mockPage: MockAppbarPage = {
      appbar: {
        props: {},
        toolbarProps: {},
        parent: {
          hasDrawer: true,
        },
        menuIconProps: {},
        hasLogo: false,
        typography: {
          fontFamily: 'Arial',
          color: '#000000',
        },
        textLogoProps: {},
        items: [],
      },
      hasDrawer: true,
      parent: {
        parent: {
          app: {
            title: 'Test App',
          },
        },
      },
    };

    const { container } = renderWithProviders(<AppbarBasic def={mockPage as unknown as StatePage} />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should render app title when no logo is present', () => {
    const mockPage: MockAppbarPage = {
      appbar: {
        props: {},
        toolbarProps: {},
        parent: {
          hasDrawer: false,
        },
        menuIconProps: {},
        hasLogo: false,
        typography: {
          fontFamily: 'Arial',
          color: '#000000',
        },
        textLogoProps: {},
        items: [],
      },
      hasDrawer: false,
      parent: {
        parent: {
          app: {
            title: 'My Test App',
          },
        },
      },
    };

    const { getByText } = renderWithProviders(<AppbarBasic def={mockPage as unknown as StatePage} />, {
      preloadedState: { app: { title: 'My Test App' } }
    });
    expect(getByText('My Test App')).toBeInTheDocument();
  });
});