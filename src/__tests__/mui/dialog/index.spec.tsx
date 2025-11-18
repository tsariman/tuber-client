import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import StateJsxDialog from '../../../mui/dialog';

describe('src/mui/dialog/index.tsx', () => {
  it('should render null for unknown dialog type', () => {
    const preloadedState = {
      dialog: {
        _type: 'unknown' as 'alert',
        open: true,
        title: 'Test Dialog',
        content: 'Test content',
      },
    };
    
    const { container } = renderWithProviders(<StateJsxDialog />, { preloadedState });
    
    expect(container.firstChild).toBeNull();
  });

  it('should render alert dialog', () => {
    const preloadedState = {
      dialog: {
        _type: 'alert' as const,
        open: true,
        title: 'Alert Dialog',
        content: 'Alert content',
        actions: [],
      },
    };
    
    const { container } = renderWithProviders(<StateJsxDialog />, { preloadedState });
    
    // Should render some dialog content
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render form dialog', () => {
    const preloadedState = {
      dialog: {
        _type: 'form' as const,
        open: true,
        title: 'Form Dialog',
        content: 'Form content',
        actions: [],
      },
    };
    
    const { container } = renderWithProviders(<StateJsxDialog />, { preloadedState });
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render selection dialog', () => {
    const preloadedState = {
      dialog: {
        _type: 'selection' as const,
        open: true,
        title: 'Selection Dialog',
        content: 'Selection content',
        actions: [],
      },
    };
    
    const { container } = renderWithProviders(<StateJsxDialog />, { preloadedState });
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render customized dialog for any type', () => {
    const preloadedState = {
      dialog: {
        _type: 'any' as const,
        open: true,
        title: 'Custom Dialog',
        content: 'Custom content',
        actions: [],
      },
    };
    
    const { container } = renderWithProviders(<StateJsxDialog />, { preloadedState });
    
    expect(container.firstChild).toBeInTheDocument();
  });
});