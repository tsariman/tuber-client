import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'
import type { IJsonapiResponseResource } from '@tuber/shared'
import FormContent from '../../../components/content/form.cpn'
import appReducer from '../../../slices/app.slice'
import dataReducer from '../../../slices/data.slice'
import formsReducer from '../../../slices/forms.slice'
import formsDataReducer, {
  FORMS_DATA_HYDRATED_FLAG,
  FORMS_DATA_HYDRATION_KEY
} from '../../../slices/formsData.slice'
import pathnamesReducer from '../../../slices/pathnames.slice'

const {
  mockConfigRead,
  mockConfigWrite,
  mockGetReqState,
  mockGetStateFormName,
  mockPostReqState,
} = vi.hoisted(() => ({
  mockConfigRead: vi.fn(),
  mockConfigWrite: vi.fn(),
  mockGetReqState: vi.fn((endpoint: string) => ({
    type: 'test/get_req_state',
    payload: endpoint,
  })),
  mockGetStateFormName: vi.fn(),
  mockPostReqState: vi.fn((endpoint: string, args: unknown) => ({
    type: 'test/post_req_state',
    payload: { endpoint, args },
  })),
}))

const theme = createTheme()

const testReducer = combineReducers({
  app: appReducer,
  data: dataReducer,
  forms: formsReducer,
  formsData: formsDataReducer,
  pathnames: pathnamesReducer,
})

vi.mock('../../../mui/form/items', () => ({
  default: () => <div data-testid="form-items">Form Items Component</div>,
}))

vi.mock('../../../mui/form', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <form data-testid="form-wrapper">{children}</form>
  ),
}))

vi.mock('../../../config', () => ({
  default: {
    read: mockConfigRead,
    write: mockConfigWrite,
  },
}))

vi.mock('../../../state/net.actions', () => ({
  get_req_state: mockGetReqState,
  post_req_state: mockPostReqState,
}))

vi.mock('../../../business.logic/parsing', async () => {
  const actual = await vi.importActual('../../../business.logic/parsing')
  return {
    ...actual,
    get_state_form_name: mockGetStateFormName,
  }
})

type TestStore = ReturnType<typeof createTestStore>

function createTestStore(preloadedState?: Record<string, unknown>) {
  return configureStore({
    reducer: testReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }),
  })
}

function renderFormContent(
  ui: React.ReactElement,
  preloadedState?: Record<string, unknown>
): { store: TestStore } {
  const store = createTestStore(preloadedState)
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </Provider>
  )
  return { store }
}

function createHydrationForm(overrides: Record<string, unknown> = {}) {
  return {
    disableOnHydration: false,
    endpoint: '',
    hydrateFromServer: true,
    hydrationEndpoint: '/forms/account',
    items: [
      { name: 'email' },
      { name: 'display_name' },
    ],
    name: 'account_edit',
    ...overrides,
  } as Parameters<typeof FormContent>[0]['instance']
}

describe('FormContent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockConfigRead.mockImplementation((_: string, fallback?: unknown) => fallback)
    mockGetStateFormName.mockImplementation((formName: string) => formName)
  })

  it('should render Form with FormItems when type is page', () => {
    const mockDef = {} as Parameters<typeof FormContent>[0]['instance']

    renderFormContent(
      <FormContent instance={mockDef} type="page" />
    )

    expect(screen.getByTestId('form-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('form-items')).toBeInTheDocument()
  })

  it('should render only FormItems when type is dialog', () => {
    const mockDef = {} as Parameters<typeof FormContent>[0]['instance']

    renderFormContent(
      <FormContent instance={mockDef} type="dialog" />
    )

    expect(screen.queryByTestId('form-wrapper')).not.toBeInTheDocument()
    expect(screen.getByTestId('form-items')).toBeInTheDocument()
  })

  it('should default to page type when type is not specified', () => {
    const mockDef = {} as Parameters<typeof FormContent>[0]['instance']

    renderFormContent(
      <FormContent instance={mockDef} />
    )

    expect(screen.getByTestId('form-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('form-items')).toBeInTheDocument()
  })

  it('should create new StateForm when def is null', () => {
    renderFormContent(
      <FormContent instance={null} type="page" />
    )

    expect(screen.getByTestId('form-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('form-items')).toBeInTheDocument()
  })

  it('should handle formName parameter', () => {
    renderFormContent(
      <FormContent instance={null} formName="testForm" type="page" />
    )

    expect(mockGetStateFormName).toHaveBeenCalledWith('testForm')
  })

  it('should not request form definition when fetchingStateAllowed is false', () => {
    renderFormContent(
      <FormContent instance={null} formName="testForm" type="page" />,
      {
        app: {
          fetchingStateAllowed: false,
        },
      }
    )

    expect(mockPostReqState).not.toHaveBeenCalled()
  })

  it('should not request form definition when def is provided', () => {
    const mockDef = {} as Parameters<typeof FormContent>[0]['instance']

    renderFormContent(
      <FormContent instance={mockDef} formName="testForm" type="page" />
    )

    expect(mockPostReqState).not.toHaveBeenCalled()
  })

  it('should not request form definition when formName is not provided', () => {
    renderFormContent(
      <FormContent instance={null} type="page" />
    )

    expect(mockPostReqState).not.toHaveBeenCalled()
  })

  it('should skip hydration when the stored hydration key matches the current record', async () => {
    const resource = {
      attributes: {
        display_name: 'Server Name',
        email: 'server@example.com',
      },
      id: '1',
      type: 'users',
    } as IJsonapiResponseResource

    const { store } = renderFormContent(
      <FormContent instance={createHydrationForm()} type="page" />,
      {
        app: {
          fetchingStateAllowed: true,
          status: 'idle',
        },
        data: {
          '/forms/account': [resource],
        },
        forms: {},
        formsData: {
          account_edit: {
            [FORMS_DATA_HYDRATED_FLAG]: true,
            [FORMS_DATA_HYDRATION_KEY]: '/forms/account:users:1',
            email: 'local@example.com',
          },
        },
        pathnames: {
          forms: '/forms',
        },
      }
    )

    await waitFor(() => {
      expect(store.getState().formsData).toEqual({
        account_edit: {
          [FORMS_DATA_HYDRATED_FLAG]: true,
          [FORMS_DATA_HYDRATION_KEY]: '/forms/account:users:1',
          email: 'local@example.com',
        },
      })
    })
  })

  it('should clear stale data and rehydrate when the hydration key changes', async () => {
    const resource = {
      attributes: {
        display_name: 'New Name',
        email: 'new@example.com',
      },
      id: '2',
      type: 'users',
    } as IJsonapiResponseResource

    const { store } = renderFormContent(
      <FormContent instance={createHydrationForm()} type="page" />,
      {
        app: {
          fetchingStateAllowed: true,
          status: 'idle',
        },
        data: {
          '/forms/account': [resource],
        },
        forms: {},
        formsData: {
          account_edit: {
            [FORMS_DATA_HYDRATED_FLAG]: true,
            [FORMS_DATA_HYDRATION_KEY]: '/forms/account:users:1',
            display_name: 'Old Name',
            email: 'old@example.com',
          },
        },
        pathnames: {
          forms: '/forms',
        },
      }
    )

    await waitFor(() => {
      expect(store.getState().formsData).toEqual({
        account_edit: {
          [FORMS_DATA_HYDRATED_FLAG]: true,
          [FORMS_DATA_HYDRATION_KEY]: '/forms/account:users:2',
          display_name: 'New Name',
          email: 'new@example.com',
        },
      })
    })
  })
})