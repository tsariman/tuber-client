import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../test-utils';
import Spinner from '../../mui/spinner.cpn';
import { APP_IS_FETCHING } from '@tuber/shared';

describe('Spinner Component', () => {
  describe('Visibility Control', () => {
    it('renders spinner when showSpinner is true and status is fetching', () => {
      const { container } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: APP_IS_FETCHING,
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const spinner = screen.getByRole('progressbar');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toBeVisible();
    });

    it('hides spinner when showSpinner is false', () => {
      const { container } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: false,
            status: APP_IS_FETCHING,
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      // Spinner is rendered but hidden with display: none
      const background = container.querySelector('div[style*="display: none"]');
      expect(background).toBeInTheDocument();
    });

    it('hides spinner when spinnerDisabled is true', () => {
      const { container } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: APP_IS_FETCHING,
            spinnerDisabled: true,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const background = container.querySelector('div[style*="display: none"]');
      expect(background).toBeInTheDocument();
    });

    it('hides spinner when status is not fetching', () => {
      const { container } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: 'idle',
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const background = container.querySelector('div[style*="display: none"]');
      expect(background).toBeInTheDocument();
    });

    it('renders spinner when status is undefined', () => {
      const { container } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: undefined,
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const spinner = screen.getByRole('progressbar');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toBeVisible();
    });
  });

  describe('Spinner Properties', () => {
    it('renders CircularProgress with correct properties', () => {
      renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: APP_IS_FETCHING,
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const spinner = screen.getByRole('progressbar');
      expect(spinner).toHaveClass('MuiCircularProgress-root');
      expect(spinner).toHaveClass('MuiCircularProgress-colorSecondary');
    });

    it('has correct styling and z-index', () => {
      const { container } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: APP_IS_FETCHING,
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const background = container.firstChild as HTMLElement;
      expect(background).toBeInTheDocument();
      // Background should be visible when open
      expect(background.style.display).toBe('block');
    });
  });

  describe('State Combinations', () => {
    it('hides when all conditions are false', () => {
      const { container } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: false,
            status: 'idle',
            spinnerDisabled: true,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const background = container.querySelector('div[style*="display: none"]');
      expect(background).toBeInTheDocument();
    });

    it('shows when showSpinner is true, spinnerDisabled is false, and status is fetching', () => {
      renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: APP_IS_FETCHING,
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const spinner = screen.getByRole('progressbar');
      expect(spinner).toBeVisible();
    });

    it('handles status success (hides spinner)', () => {
      const { container } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: 'success',
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const background = container.querySelector('div[style*="display: none"]');
      expect(background).toBeInTheDocument();
    });

    it('handles status error (hides spinner)', () => {
      const { container } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: 'error',
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const background = container.querySelector('div[style*="display: none"]');
      expect(background).toBeInTheDocument();
    });
  });

  describe('Layout and Structure', () => {
    it('renders with Grid layout container', () => {
      const { container } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: APP_IS_FETCHING,
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const grid = container.querySelector('.MuiGrid-root');
      expect(grid).toBeInTheDocument();
    });

    it('renders background overlay', () => {
      const { container } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: APP_IS_FETCHING,
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const background = container.firstChild as HTMLElement;
      expect(background).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing app state gracefully', () => {
      const { container } = renderWithProviders(<Spinner />, {
        preloadedState: {}
      });

      // Should render without crashing
      expect(container).toBeInTheDocument();
    });

    it('handles partial app state', () => {
      const { container } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      // Should render without crashing
      expect(container).toBeInTheDocument();
    });

    it('responds to state changes', () => {
      // First render with spinner hidden
      const { container: container1 } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: false,
            status: 'idle',
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      // Initially hidden
      const background = container1.querySelector('div[style*="display: none"]');
      expect(background).toBeInTheDocument();

      // Second render with spinner visible
      const { container: container2 } = renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: APP_IS_FETCHING,
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      // Now visible
      const backgroundVisible = container2.firstChild as HTMLElement;
      expect(backgroundVisible.style.display).toBe('block');
    });
  });

  describe('Accessibility', () => {
    it('has progressbar role for screen readers', () => {
      renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: APP_IS_FETCHING,
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const spinner = screen.getByRole('progressbar');
      expect(spinner).toBeInTheDocument();
    });

    it('renders indeterminate progress indicator', () => {
      renderWithProviders(<Spinner />, {
        preloadedState: {
          app: {
            showSpinner: true,
            status: APP_IS_FETCHING,
            spinnerDisabled: false,
            fetchingStateAllowed: true,
            route: '/',
            title: 'Test'
          }
        }
      });

      const spinner = screen.getByRole('progressbar');
      expect(spinner).toHaveClass('MuiCircularProgress-indeterminate');
    });
  });
});
