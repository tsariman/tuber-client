/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { PropsWithChildren, ReactElement } from 'react';
import type { RootState } from '../state';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

// Create a default theme for testing
const theme = createTheme();

// Create a minimal mock reducer setup
const createMockStore = (preloadedState?: any) => configureStore({
  reducer: {
    app: (state = {
      status: 'idle',
      showSpinner: false,
      spinnerDisabled: false,
      fetchingStateAllowed: true,
      title: 'Test App',
    }, action) => {
      switch (action.type) {
        default:
          return state;
      }
    },
    forms: (state = {}, action) => {
      switch (action.type) {
        default:
          return state;
      }
    },
    pagesData: (state = {}, action) => {
      switch (action.type) {
        default:
          return state;
      }
    },
    icons: (state = { 
      menu: {},
      close: {
        svg: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
        pathData: ['M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z']
      }
    }, action) => {
      switch (action.type) {
        default:
          return state;
      }
    },
    dialog: (state = { open: false }, action) => {
      switch (action.type) {
        case 'dialog/dialogClose':
          return { ...state, open: false };
        default:
          return state;
      }
    },
    pathnames: (state = {
      forms: 'state/forms',
      pages: 'state/pages',
      dialogs: 'state/dialogs'
    }, action) => {
      switch (action.type) {
        default:
          return state;
      }
    },
    // Add other reducers as needed
  },
  ...(preloadedState && { preloadedState }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable for testing
    }),
});

type MockStoreType = ReturnType<typeof createMockStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: MockStoreType;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createMockStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
): ReturnType<typeof render> & { store: MockStoreType } {
  function Wrapper({ children }: PropsWithChildren<object>) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Mock data generators
export const createMockStateApp = (overrides = {}) => ({
  page: 'landing',
  ...overrides,
});

export const createMockStatePage = (overrides = {}) => ({
  _type: 'generic' as const,
  title: 'Test Page',
  content: {},
  ...overrides,
});

export const createMockStateForm = (overrides = {}) => ({
  items: [],
  ...overrides,
});

// Re-export specific testing utilities
export { screen, waitFor, within } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';