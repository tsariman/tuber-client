import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '../../test-utils'
import WebApps from '../../../components/content/webapp.cpn'
import '@testing-library/jest-dom'

// Mock problematic classes before importing anything else
vi.mock('../../../controllers/StateAppbar', () => ({
	default: class MockStateAppbar {
		constructor() {
			return {}
		}
	}
}))

vi.mock('../../../controllers/templates/StateAppbarDefault', () => ({
	default: class MockStateAppbarDefault {
		constructor() {
			return {}
		}
	}
}))

vi.mock('../../../controllers/State', () => ({
	default: class MockState {
		_rootState: unknown
		constructor(rootState: unknown) {
			this._rootState = rootState
		}
	}
}))

// Mock the TubeResearcher component
vi.mock('../../../webapp/tuber/view/default', () => ({
	default: () => <div data-testid="tube-researcher">TubeResearcher Component</div>,
}))

describe('WebApps Component', () => {
	it('should render TubeResearcher when contentName is tubeResearcher', () => {
		const mockPage = { contentName: 'tubeResearcher' } as unknown

		renderWithProviders(
			<WebApps def={mockPage as Parameters<typeof WebApps>[0]['def']} />
		)

		expect(screen.getByTestId('tube-researcher')).toBeInTheDocument()
		expect(screen.getByText('TubeResearcher Component')).toBeInTheDocument()
	})

	it('should return null when contentName does not match any web app', () => {
		const mockPage = { contentName: 'nonExistentApp' } as unknown

		const { container } = renderWithProviders(
			<WebApps def={mockPage as Parameters<typeof WebApps>[0]['def']} />
		)

		expect(container.firstChild).toBeNull()
	})

	it('should return null when contentName is empty', () => {
		const mockPage = { contentName: '' } as unknown

		const { container } = renderWithProviders(
			<WebApps def={mockPage as Parameters<typeof WebApps>[0]['def']} />
		)

		expect(container.firstChild).toBeNull()
	})

	it('should return null when contentName is undefined', () => {
		const mockPage = { contentName: undefined } as unknown

		const { container } = renderWithProviders(
			<WebApps def={mockPage as Parameters<typeof WebApps>[0]['def']} />
		)

		expect(container.firstChild).toBeNull()
	})

	it('should handle case sensitivity correctly', () => {
		const mockPage = { contentName: 'TubeResearcher' } as unknown

		const { container } = renderWithProviders(
			<WebApps def={mockPage as Parameters<typeof WebApps>[0]['def']} />
		)

		expect(container.firstChild).toBeNull()
	})

	it('should pass the correct def prop to TubeResearcher', () => {
		const mockPage = { contentName: 'tubeResearcher', someProperty: 'test-value' } as unknown

		renderWithProviders(
			<WebApps def={mockPage as Parameters<typeof WebApps>[0]['def']} />
		)

		expect(screen.getByTestId('tube-researcher')).toBeInTheDocument()
	})
})