import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { renderWithProviders, screen } from '../../test-utils'
import FormContent from '../../../components/content/form.cpn'

// Mock the dependencies
vi.mock('../../../mui/form/items', () => ({
  default: () => <div data-testid="form-items">Form Items Component</div>,
}))

vi.mock('../../../mui/form', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <form data-testid="form-wrapper">{children}</form>
  ),
}))

const mockConfigRead = vi.fn()
const mockConfigWrite = vi.fn()
vi.mock('../../../config', () => ({
  default: {
    read: mockConfigRead,
    write: mockConfigWrite,
  },
}))

vi.mock('../../../state/net.actions', () => ({
  post_req_state: vi.fn(),
}))

const mockGetStateFormName = vi.fn()
vi.mock('../../../business.logic/parsing', () => ({
  get_state_form_name: mockGetStateFormName,
}))

vi.mock('../../../controllers/StateForm', () => ({
  default: class MockStateForm {
    constructor() {}
  },
}))

vi.mock('../../../controllers/StateAllForms', () => ({
  default: class MockStateAllForms {
    parent = {
      pathnames: {
        FORMS: '/forms',
      },
    }
  },
}))

describe('FormContent Component', () => {
  const mockDispatch = vi.fn()
  const mockUseSelector = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock useDispatch
    vi.doMock('react-redux', async () => {
      const actual = await vi.importActual('react-redux')
      return {
        ...actual,
        useDispatch: () => mockDispatch,
        useSelector: mockUseSelector,
      }
    })

    // Default selector mock
    mockUseSelector.mockImplementation((selector) => {
      const mockState = {
        app: {
          fetchingStateAllowed: true,
        },
        forms: {},
      }
      return selector(mockState)
    })

    mockConfigRead.mockReturnValue('light')
    mockGetStateFormName.mockReturnValue('test_form')
  })

  it('should render Form with FormItems when type is page', () => {
    const mockDef = {} as unknown

    renderWithProviders(
      <FormContent instance={mockDef as Parameters<typeof FormContent>[0]['instance']} type="page" />
    )

    expect(screen.getByTestId('form-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('form-items')).toBeInTheDocument()
  })

  it('should render only FormItems when type is dialog', () => {
    const mockDef = {} as unknown

    renderWithProviders(
      <FormContent instance={mockDef as Parameters<typeof FormContent>[0]['instance']} type="dialog" />
    )

    expect(screen.queryByTestId('form-wrapper')).not.toBeInTheDocument()
    expect(screen.getByTestId('form-items')).toBeInTheDocument()
  })

  it('should default to page type when type is not specified', () => {
    const mockDef = {} as unknown

    renderWithProviders(
      <FormContent instance={mockDef as Parameters<typeof FormContent>[0]['instance']} />
    )

    expect(screen.getByTestId('form-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('form-items')).toBeInTheDocument()
  })

  it('should create new StateForm when def is null', () => {
    renderWithProviders(
      <FormContent instance={null} type="page" />
    )

    expect(screen.getByTestId('form-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('form-items')).toBeInTheDocument()
  })

  it('should handle formName parameter', () => {
    mockUseSelector.mockImplementation((selector) => {
      const mockState = {
        app: {
          fetchingStateAllowed: true,
        },
        forms: {},
      }
      return selector(mockState)
    })

    renderWithProviders(
      <FormContent instance={null} formName="testForm" type="page" />
    )

    expect(mockGetStateFormName).toHaveBeenCalledWith('testForm')
  })

  it('should not dispatch when fetchingStateAllowed is false', () => {
    mockUseSelector.mockImplementation((selector) => {
      const mockState = {
        app: {
          fetchingStateAllowed: false,
        },
        forms: {},
      }
      return selector(mockState)
    })

    renderWithProviders(
      <FormContent instance={null} formName="testForm" type="page" />
    )

    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('should not dispatch when def is provided', () => {
    const mockDef = {} as unknown

    renderWithProviders(
      <FormContent instance={mockDef as Parameters<typeof FormContent>[0]['instance']} formName="testForm" type="page" />
    )

    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('should not dispatch when formName is not provided', () => {
    renderWithProviders(
      <FormContent instance={null} type="page" />
    )

    expect(mockDispatch).not.toHaveBeenCalled()
  })
})