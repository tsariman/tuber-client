import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { renderWithProviders, screen } from '../../test-utils'
import StatePage from '../../../controllers/StatePage'
import StateAllPages from '../../../controllers/StateAllPages'
import { APP_CONTENT_VIEW } from '@tuber/shared'

// Hoisted mocks to avoid factory hoisting issues
const { mockSaveContentJsx, mockGetLastContentJsx, mockErrorIdRemember, mockDispatch, mockPostReqState } = vi.hoisted(() => ({
	mockSaveContentJsx: vi.fn(),
	mockGetLastContentJsx: vi.fn(() => (<div data-testid="last-content">LastContent</div>)),
	mockErrorIdRemember: vi.fn(),
	mockDispatch: vi.fn(),
	mockPostReqState: vi.fn(() => ({ type: 'TEST_POST_REQ_STATE' }))
}))

// Mock child content components to simple identifiable elements
vi.mock('../../../components/content/form.cpn', () => ({
	default: () => (<div data-testid="form-content">FormContent</div>)
}))

vi.mock('../../../components/content/view.cpn', () => ({
	default: () => (<div data-testid="view-content">ViewContent</div>)
}))

vi.mock('../../../components/content/webapp.cpn', () => ({
	default: () => (<div data-testid="webapp-content">WebappContent</div>)
}))

vi.mock('../../../mui/content/html.cpn', () => ({
	default: () => (<div data-testid="html-content">HtmlContent</div>)
}))

vi.mock('../../../mui/page/notfound.cpn', () => ({
	default: () => (<div data-testid="page-notfound">PageNotFound</div>)
}))

// Mock business logic utilities used by the content switcher
vi.mock('../../../business.logic', () => ({
	error_id: vi.fn(() => ({ remember_exception: mockErrorIdRemember })),
	get_last_content_jsx: mockGetLastContentJsx,
	get_state_form_name: vi.fn((name: string) => name.endsWith('Form') ? name : `${name}Form`),
	ler: vi.fn(),
	save_content_jsx: mockSaveContentJsx,
}))

// Mock net actions and dispatch
vi.mock('../../../state/net.actions', () => ({
	post_req_state: mockPostReqState
}))

vi.mock('../../../state', () => ({
	dispatch: mockDispatch
}))

// Helper to create a minimal StatePage instance with parsed content
const createPage = (content: string, overrides: Partial<ConstructorParameters<typeof StatePage>[0]> = {}) => {
	const mockAllPages = {} as StateAllPages
	const baseState = {
		_id: 'test-page',
		_type: 'generic' as const,
		_key: 'test',
		title: 'Test Page',
		typography: { color: '#333' },
		content,
		...overrides,
	}
	return new StatePage(baseState as any, mockAllPages)
}

// Import the module under test after mocks are defined
import Content from '../../../components/content'

describe('ContentSwitch (components/content/index.tsx)', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders FormContent and caches JSX for $form', () => {
		const page = createPage('$form:testForm:endpoint')

		renderWithProviders(<Content instance={page} />)

		expect(screen.getByTestId('form-content')).toBeInTheDocument()
		expect(mockSaveContentJsx).toHaveBeenCalled()
	})

	it('renders ViewContent and caches JSX for APP_CONTENT_VIEW', () => {
		const page = createPage(`${APP_CONTENT_VIEW}:default_success_page_view`)

		renderWithProviders(<Content instance={page} />)

		expect(screen.getByTestId('view-content')).toBeInTheDocument()
		expect(mockSaveContentJsx).toHaveBeenCalled()
	})

	it('renders WebappContent and caches JSX for $webapp', () => {
		const page = createPage('$webapp:tubeResearcher')

		renderWithProviders(<Content instance={page} />)

		expect(screen.getByTestId('webapp-content')).toBeInTheDocument()
		expect(mockSaveContentJsx).toHaveBeenCalled()
	})

	it('renders HtmlContent and caches JSX for $html', () => {
		const page = createPage('$html:someElementId')

		renderWithProviders(<Content instance={page} />)

		expect(screen.getByTestId('html-content')).toBeInTheDocument()
		expect(mockSaveContentJsx).toHaveBeenCalled()
	})

	it('renders PageNotFound for unknown content type', () => {
		const page = createPage('$unknown:whatever')

		renderWithProviders(<Content instance={page} />)

		expect(screen.getByTestId('page-notfound')).toBeInTheDocument()
	})

	it('dispatches form load and returns null for $form_load', () => {
		const page = createPage('$form_load:Login')

		const { container } = renderWithProviders(<Content instance={page} />)

		// Should render nothing for load types
		expect(container.firstChild).toBeNull()
		// Cache should save null
		expect(mockSaveContentJsx).toHaveBeenCalledWith(null)
		// Should compute form key and dispatch post request
		expect(mockPostReqState).toHaveBeenCalled()
		expect(mockDispatch).toHaveBeenCalled()
	})

	it('returns null and caches null for $html_load', () => {
		const page = createPage('$html_load:Header')

		const { container } = renderWithProviders(<Content instance={page} />)

		expect(container.firstChild).toBeNull()
		expect(mockSaveContentJsx).toHaveBeenCalledWith(null)
	})
})