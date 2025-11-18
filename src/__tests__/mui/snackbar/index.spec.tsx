import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import StateJsxSnackbar from '../../../mui/snackbar';

describe('src/mui/snackbar.tsx', () => {

  describe('StateJsxSnackbar', () => {

    it('should render closed snackbar by default', () => {
      const { container } = renderWithProviders(<StateJsxSnackbar />);
      
      // Snackbar should be in DOM but not visible when closed
      const snackbar = container.querySelector('.MuiSnackbar-root');
      expect(snackbar).toBeInTheDocument();
    });

    it('should render open snackbar when state is open', () => {
      const preloadedState = {
        snackbar: {
          open: true,
          message: 'Test message',
          variant: 'info' as const,
          anchorOrigin: { vertical: 'bottom' as const, horizontal: 'center' as const },
          autoHideDuration: 6000,
        },
      };
      
      const { getByText } = renderWithProviders(<StateJsxSnackbar />, { preloadedState });
      
      expect(getByText('Test message')).toBeInTheDocument();
    });

    it('should render different severity variants', () => {
      const preloadedState = {
        snackbar: {
          open: true,
          message: 'Success message',
          variant: 'success' as const,
          anchorOrigin: { vertical: 'bottom' as const, horizontal: 'center' as const },
          autoHideDuration: 6000,
        },
      };
      
      const { container } = renderWithProviders(<StateJsxSnackbar />, { preloadedState });
      const alert = container.querySelector('.MuiAlert-standardSuccess');
      
      expect(alert).toBeInTheDocument();
    });

    it('should handle empty message gracefully', () => {
      const preloadedState = {
        snackbar: {
          open: true,
          message: '',
          variant: 'info' as const,
          anchorOrigin: { vertical: 'bottom' as const, horizontal: 'center' as const },
          autoHideDuration: 6000,
        },
      };
      
      const { container } = renderWithProviders(<StateJsxSnackbar />, { preloadedState });
      const snackbar = container.querySelector('.MuiSnackbar-root');
      
      expect(snackbar).toBeInTheDocument();
    });

  });

});