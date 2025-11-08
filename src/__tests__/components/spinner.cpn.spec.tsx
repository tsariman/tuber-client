import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../test-utils';
import Spinner from '../../components/spinner.cpn';
import { APP_IS_FETCHING } from '@tuber/shared';

describe('Spinner Component', () => {
  it('should render spinner when showSpinner is true and status is fetching', () => {
    const mockStore = {
      app: {
        showSpinner: true,
        status: APP_IS_FETCHING,
        spinnerDisabled: false,
      },
    };

    renderWithProviders(<Spinner />, {
      preloadedState: mockStore,
    });

    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toBeVisible();
  });

  it('should not render spinner when showSpinner is false', () => {
    const mockStore = {
      app: {
        showSpinner: false,
        status: APP_IS_FETCHING,
        spinnerDisabled: false,
      },
    };

    renderWithProviders(<Spinner />, {
      preloadedState: mockStore,
    });

    const spinner = screen.getByRole('progressbar');
    expect(spinner).not.toBeVisible();
  });

  it('should not render spinner when spinnerDisabled is true', () => {
    const mockStore = {
      app: {
        showSpinner: true,
        status: APP_IS_FETCHING,
        spinnerDisabled: true,
      },
    };

    renderWithProviders(<Spinner />, {
      preloadedState: mockStore,
    });

    const spinner = screen.getByRole('progressbar');
    expect(spinner).not.toBeVisible();
  });

  it('should not render spinner when status is not fetching', () => {
    const mockStore = {
      app: {
        showSpinner: true,
        status: 'idle',
        spinnerDisabled: false,
      },
    };

    renderWithProviders(<Spinner />, {
      preloadedState: mockStore,
    });

    const spinner = screen.getByRole('progressbar');
    expect(spinner).not.toBeVisible();
  });

  it('should render spinner when status is undefined', () => {
    const mockStore = {
      app: {
        showSpinner: true,
        status: undefined,
        spinnerDisabled: false,
      },
    };

    renderWithProviders(<Spinner />, {
      preloadedState: mockStore,
    });

    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeVisible();
  });

  it('should have correct styling properties', () => {
    const mockStore = {
      app: {
        showSpinner: true,
        status: APP_IS_FETCHING,
        spinnerDisabled: false,
      },
    };

    renderWithProviders(<Spinner />, {
      preloadedState: mockStore,
    });

    const spinner = screen.getByRole('progressbar');
    expect(spinner).toHaveAttribute('aria-valuenow', '0');
    // Note: MUI CircularProgress with color='secondary' and specific size/thickness
    // would need more specific testing based on your theme configuration
  });
});