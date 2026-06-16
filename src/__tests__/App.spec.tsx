import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import appReducer from '../slices/app.slice'
import App from '../App'

vi.mock('../mui/app.generic.cpn', () => ({
	default: () => <div data-testid="app-generic">GenericApp</div>
}))

vi.mock('../mui/spinner.cpn', () => ({
	default: () => null
}))

vi.mock('../mui/spinner.cpn.bootstrap', () => ({
	default: () => null
}))

vi.mock('../state', async () => {
	const actual = await vi.importActual<typeof import('../state')>('../state')
	return {
		...actual,
		initialize: vi.fn(),
		bootstrap_app: vi.fn(() => ({ type: 'bootstrap/mock' })),
	}
})

describe('App theme bootstrap', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		window.history.replaceState(null, '', '/')
		document.cookie = 'theme_mode=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
	})

	it('persists the OS theme mode when no cookie has been saved yet', async () => {
		const rootReducer = combineReducers({
			app: appReducer,
			theme: (state = {}) => state,
		})

		const store = configureStore({
			reducer: rootReducer,
			preloadedState: {
				app: {
					fetchingStateAllowed: false,
					inDebugMode: false,
					inDevelMode: false,
					origin: 'http://localhost:3000',
					route: '/',
					showSpinner: false,
					spinnerDisabled: false,
					status: 'ready',
					title: 'Test App',
					logoUri: '/logo.png',
					logoTag: 'img',
					lastRoute: '/',
					homepage: '/',
					isBootstrapped: true,
					fetchMessage: '',
					themeMode: 'light',
				},
			} as any,
		})

		render(
			<Provider store={store}>
				<App />
			</Provider>
		)

		await waitFor(() => {
			expect(document.cookie).toContain('theme_mode=light')
		})
	})
})
