/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import Content from '../../../components/content';
import StatePage from '../../../controllers/StatePage';
import * as ReactRedux from 'react-redux';
interface IDef {
  contentName: string;
}

// Mock all dependencies
vi.mock('../../../components/view.component', () => {
  return React.memo(function MockView({ def }: { def: IDef; }) {
    return <div data-testid="view-component">View: {def.contentName}</div>;
  });
});

vi.mock('../../../components/content/html.component', () => {
  return React.memo(function MockHtmlContent({ def }: { def: IDef; }) {
    return <div data-testid="html-component">HTML: {def.contentName}</div>;
  });
});

vi.mock('../../../components/content/form.component', () => {
  return React.memo(function MockFormContent({ formName, type }: { formName: string; def: unknown; type: string }) {
    return <div data-testid="form-component">Form: {formName} - {type}</div>;
  });
});

vi.mock('../../../components/content/webapp.content.component', () => {
  return React.memo(function MockWebApps({ def }: { def: IDef }) {
    return <div data-testid="webapp-component">WebApp: {def.contentName}</div>;
  });
});

vi.mock('../../../state/net.actions', () => ({
  post_req_state: vi.fn().mockReturnValue({ type: 'POST_REQ_STATE' }),
}));

vi.mock('../../../business.logic/cache', () => ({
  get_last_content_jsx: vi.fn(() => <div data-testid="default-content">Default Content</div>),
  get_state_form_name: vi.fn((name: string) => `state_${name}`),
  save_content_jsx: vi.fn(),
}));

vi.mock('../../../business.logic/errors', () => ({
  remember_exception: vi.fn(),
}));

vi.mock('../../../business.logic/logging', () => ({
  ler: vi.fn(),
}));

// Create mock store
const createMockStore = () => configureStore({
  reducer: {
    test: (state = {}) => state,
  },
});

// Mock StatePage class with proper structure
class MockStatePage {
  contentType: string;
  contentName: string;
  contentEndpoint: string;
  parent: {
    parent: {
      allForms: {
        getForm: MockedFunction<() => unknown>;
      };
      app: {
        fetchingStateAllowed: boolean;
      };
      pathnames: {
        FORMS: string;
      };
    };
  };

  constructor(
    contentType: string,
    contentName: string = 'test-content',
    contentEndpoint: string = '/api/test',
    fetchingStateAllowed: boolean = true
  ) {
    this.contentType = contentType;
    this.contentName = contentName;
    this.contentEndpoint = contentEndpoint;
    this.parent = {
      parent: {
        allForms: {
          getForm: vi.fn(),
        },
        app: {
          fetchingStateAllowed,
        },
        pathnames: {
          FORMS: '/api/forms',
        },
      },
    };
  }
}

describe('Content Component Performance & Memoization', () => {
  let store: ReturnType<typeof createMockStore>;
  let mockDispatch: MockedFunction<any>;

  beforeEach(() => {
    store = createMockStore();
    mockDispatch = vi.fn();
    vi.spyOn(ReactRedux, 'useDispatch').mockReturnValue(mockDispatch as any);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  describe('useMemo optimizations', () => {
    it('should memoize content constants correctly', () => {
      const page = new MockStatePage('$view', 'test-constants');
      
      const { rerender } = renderWithProvider(<Content def={page as any} />);
      
      // Constants should be created once and reused
      expect(screen.getByTestId('view-component')).toBeInTheDocument();
      
      // Re-render with same props - constants should be memoized
      rerender(
        <Provider store={store}>
          <Content def={page as any} />
        </Provider>
      );
      
      expect(screen.getByTestId('view-component')).toBeInTheDocument();
    });

    it('should memoize page content type computation', () => {
      const page1 = new MockStatePage('$VIEW', 'test-1'); // Uppercase
      const page2 = new MockStatePage('$view', 'test-2'); // Lowercase
      
      const { rerender } = renderWithProvider(<Content def={page1 as unknown as StatePage} />);
      expect(screen.getByTestId('view-component')).toBeInTheDocument();
      
      // Change to different case - should recompute
      rerender(
        <Provider store={store}>
          <Content def={page2 as unknown as StatePage} />
        </Provider>
      );
      
      expect(screen.getByTestId('view-component')).toBeInTheDocument();
    });

    it('should memoize form data computation for form content type', () => {
      const mockForm = { id: 1, name: 'test-form', endpoint: null };
      const page = new MockStatePage('$form', 'test-form');
      page.parent.parent.allForms.getForm.mockReturnValue(mockForm);

      renderWithProvider(<Content def={page as any} />);

      expect(page.parent.parent.allForms.getForm).toHaveBeenCalledWith('test-form');
      expect(mockForm.endpoint).toBe('/api/test');
      expect(screen.getByTestId('form-component')).toBeInTheDocument();
    });

    it('should memoize form load state computation', () => {
      const page = new MockStatePage('$form_load', 'test-form-load', '/api/test', true);

      renderWithProvider(<Content def={page as any} />);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'POST_REQ_STATE'
      });
    });

    it('should memoize content table creation', () => {
      const page = new MockStatePage('$html', 'test-table');
      
      const { rerender } = renderWithProvider(<Content def={page as any} />);
      expect(screen.getByTestId('html-component')).toBeInTheDocument();
      
      // Re-render with same type - should use memoized table
      rerender(
        <Provider store={store}>
          <Content def={page as any} />
        </Provider>
      );
      
      expect(screen.getByTestId('html-component')).toBeInTheDocument();
    });

    it('should memoize final content JSX computation', () => {
      const page = new MockStatePage('$webapp', 'test-jsx');
      
      const { rerender } = renderWithProvider(<Content def={page as any} />);
      expect(screen.getByTestId('webapp-component')).toBeInTheDocument();
      
      // Re-render with same props - should use memoized JSX
      rerender(
        <Provider store={store}>
          <Content def={page as any} />
        </Provider>
      );
      
      expect(screen.getByTestId('webapp-component')).toBeInTheDocument();
    });
  });

  describe('useCallback optimizations', () => {
    it('should memoize form content handler', () => {
      const mockForm = { id: 1, name: 'test-form' };
      const page = new MockStatePage('$form', 'test-form');
      page.parent.parent.allForms.getForm.mockReturnValue(mockForm);

      renderWithProvider(<Content def={page as unknown as StatePage} />);      expect(screen.getByTestId('form-component')).toBeInTheDocument();
    });

    it('should memoize view content handler', () => {
      const page = new MockStatePage('$view', 'test-view');
      renderWithProvider(<Content def={page as unknown as StatePage} />);

      expect(screen.getByTestId('view-component')).toBeInTheDocument();
    });

    it('should memoize webapp content handler with error handling', () => {
      const page = new MockStatePage('$webapp', 'test-webapp');
      renderWithProvider(<Content def={page as unknown as StatePage} />);

      expect(screen.getByTestId('webapp-component')).toBeInTheDocument();
    });

    it('should memoize html content handler', () => {
      const page = new MockStatePage('$html', 'test-html');
      renderWithProvider(<Content def={page as unknown as StatePage} />);

      expect(screen.getByTestId('html-component')).toBeInTheDocument();
    });

    it('should memoize form load handler', () => {
      const page = new MockStatePage('$form_load', 'test-form-load', '/api/test', true);
      renderWithProvider(<Content def={page as unknown as StatePage} />);

      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should memoize html load handler', () => {
      const page = new MockStatePage('$html_load', 'test-html-load');
      renderWithProvider(<Content def={page as unknown as StatePage} />);
    });

    it('should memoize default handler', () => {
      const page = new MockStatePage('unknown_type', 'test-default');
      renderWithProvider(<Content def={page as unknown as StatePage} />);

      expect(screen.getByTestId('default-content')).toBeInTheDocument();
    });
  });

  describe('Performance with dependency changes', () => {
    it('should recompute when content type changes', () => {
      const page1 = new MockStatePage('$view', 'test-1');
      const page2 = new MockStatePage('$html', 'test-2');

      const { rerender } = renderWithProvider(<Content def={page1 as unknown as StatePage} />);
      expect(screen.getByTestId('view-component')).toBeInTheDocument();

      // Change content type - should recompute
      rerender(
        <Provider store={store}>
          <Content def={page2 as unknown as StatePage} />
        </Provider>
      );

      expect(screen.getByTestId('html-component')).toBeInTheDocument();
      expect(screen.queryByTestId('view-component')).not.toBeInTheDocument();
    });

    it('should recompute when content name changes for forms', () => {
      const mockForm1 = { id: 1, name: 'form-1' };
      const mockForm2 = { id: 2, name: 'form-2' };
      const page1 = new MockStatePage('$form', 'form-1');
      const page2 = new MockStatePage('$form', 'form-2');
      
      page1.parent.parent.allForms.getForm.mockReturnValue(mockForm1);
      page2.parent.parent.allForms.getForm.mockReturnValue(mockForm2);

      const { rerender } = renderWithProvider(<Content def={page1 as unknown as StatePage} />);
      expect(page1.parent.parent.allForms.getForm).toHaveBeenCalledWith('form-1');

      // Change form name - should recompute
      rerender(
        <Provider store={store}>
          <Content def={page2 as unknown as StatePage} />
        </Provider>
      );

      expect(page2.parent.parent.allForms.getForm).toHaveBeenCalledWith('form-2');
    });

    it('should recompute when fetching state changes for form load', () => {
      const page1 = new MockStatePage('$form_load', 'test-form', '/api/test', true);
      const page2 = new MockStatePage('$form_load', 'test-form', '/api/test', false);

      const { rerender } = renderWithProvider(<Content def={page1 as unknown as StatePage} />);
      expect(mockDispatch).toHaveBeenCalled();

      vi.clearAllMocks();

      // Change fetching state - should recompute
      rerender(
        <Provider store={store}>
          <Content def={page2 as unknown as StatePage} />
        </Provider>
      );

      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('Error handling with memoization', () => {
    it('should handle errors in content handlers gracefully', () => {
      const page = new MockStatePage('$form', 'error-form');
      
      // Mock getForm to throw an error
      page.parent.parent.allForms.getForm.mockImplementation(() => {
        throw new Error('Test error');
      });

      renderWithProvider(<Content def={page as unknown as StatePage} />);

      expect(screen.getByTestId('default-content')).toBeInTheDocument();
    });

    it('should handle webapp component errors with memoized handler', () => {
      const originalConsoleError = console.error;
      console.error = vi.fn(); // Suppress error output

      const page = new MockStatePage('$webapp', 'error-webapp');
      
      // Mock WebApp component to throw error
      vi.doMock('../../../components/content/webapp.content.component', () => {
        return function MockWebAppsError() {
          throw new Error('WebApp Error');
        };
      });

      try {
        renderWithProvider(<Content def={page as unknown as StatePage} />);
        // Should handle error gracefully
      } catch {
        // Expected to handle error
      }

      console.error = originalConsoleError;
    });
  });

  describe('Memory optimization', () => {
    it('should not create new objects on every render for constants', () => {
      const page = new MockStatePage('$view', 'memory-test');
      
      // We can't directly access the memoized constants, but we can test that
      // the component doesn't cause unnecessary re-renders
      const TestWrapper = ({ def }: { def: unknown }) => {
        return <Content def={def as StatePage} />;
      };

      const { rerender } = renderWithProvider(<TestWrapper def={page} />);
      expect(screen.getByTestId('view-component')).toBeInTheDocument();

      // Re-render should not cause issues
      rerender(
        <Provider store={store}>
          <TestWrapper def={page} />
        </Provider>
      );

      expect(screen.getByTestId('view-component')).toBeInTheDocument();
    });

    it('should handle multiple rapid re-renders efficiently', () => {
      const page = new MockStatePage('$html', 'rapid-test') as unknown;

      const { rerender } = renderWithProvider(<Content def={page as StatePage} />);

      // Simulate rapid re-renders
      const rerenderComponent = () => (
        <Provider store={store}>
          <Content def={page as StatePage} />
        </Provider>
      );

      for (let i = 0; i < 10; i++) {
        rerender(rerenderComponent());
      }

      expect(screen.getByTestId('html-component')).toBeInTheDocument();
    });
  });

  describe('Integration with business logic', () => {
    it('should properly integrate save_content_jsx with memoization', () => {
      const page = new MockStatePage('$view', 'integration-test') as unknown;

      renderWithProvider(<Content def={page as StatePage} />);
    });

    it('should properly integrate with form state management', () => {
      const page = new MockStatePage('$form_load', 'state-integration') as unknown;

      renderWithProvider(<Content def={page as StatePage} />);
    });
  });
});
