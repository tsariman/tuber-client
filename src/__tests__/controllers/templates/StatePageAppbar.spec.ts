import { describe, it, expect, vi } from 'vitest'
// Mock to avoid runtime evaluation issues with StateAppbarDefault
vi.mock('../../../controllers/templates/StateAppbarDefault', () => ({
	default: class {}
}))
import StatePageAppbar from '../../../controllers/templates/StatePageAppbar'
import StatePage from '../../../controllers/StatePage'
import StateAllPages from '../../../controllers/StateAllPages'
import type { IStateAppbar, IStateAllPages } from '../../../interfaces/localized'
import type { IStateApp } from '@tuber/shared'

// Helper to build a minimal root state for State
// Build default/app mocks to avoid importing State/StateAppbarDefault
const mkDefaultMock = (defaultAppbarState?: IStateAppbar) => ({
	props: defaultAppbarState?.props ?? { position: 'fixed' },
	appbarStyle: defaultAppbarState?.appbarStyle ?? 'basic',
	state: {
		typography: defaultAppbarState?.typography ?? { color: 'purple', fontFamily: 'Inter' },
	},
	menuId: defaultAppbarState?.menuId ?? 'primary-search-account-menu',
	mobileMenuId: defaultAppbarState?.mobileMenuId ?? 'primary-menu-mobile',
	mobileMenu2Id: defaultAppbarState?.mobileMenu2Id ?? 'primary-menu2-mobile',
	toolbarProps: defaultAppbarState?.toolbarProps ?? {},
	mobileMenuProps: {
		anchorOrigin: { vertical: 'top', horizontal: 'right' },
		keepMounted: true,
		transformOrigin: { vertical: 'top', horizontal: 'right' },
		open: false,
		...(defaultAppbarState?.mobileMenuProps ?? {})
	},
	mobileMenu2Props: {
		anchorOrigin: { vertical: 'top', horizontal: 'right' },
		keepMounted: true,
		transformOrigin: { vertical: 'top', horizontal: 'right' },
		open: false,
		...(defaultAppbarState?.mobileMenu2Props ?? {})
	},
	menuIconProps: defaultAppbarState?.menuIconProps ?? {},
	menuItemsSx: defaultAppbarState?.menuItemsSx ?? { fontSize: 13 },
	textLogoProps: defaultAppbarState?.textLogoProps ?? { component: 'div' },
	logoContainerProps: defaultAppbarState?.logoContainerProps ?? { id: 'logo-container' },
	searchContainerProps: defaultAppbarState?.searchContainerProps ?? { id: 'search-container' },
	desktopMenuItemsProps: { sx: { display: { xs: 'none', md: 'flex' } } },
	mobileMenuItemsProps: { sx: { display: { xs: 'flex', md: 'none' } } },
	background: defaultAppbarState?.background ?? { color: '#abc' },
})

const mkAppMock = (appState?: Partial<IStateApp>) => ({
	logoTag: appState?.logoTag ?? 'img',
	logoUri: appState?.logoUri ?? 'https://example.com/logo.png',
	state: {
		logoWidth: appState?.logoWidth ?? 100,
		logoHeight: appState?.logoHeight ?? 24,
	}
})

// Create a configured StatePageAppbar instance for a given page route
const mkConfiguredPageAppbar = (opts?: {
	pageRoute?: string,
	appbarState?: IStateAppbar,
	defaultAppbarState?: IStateAppbar,
	appState?: IStateApp,
	pagesState?: IStateAllPages,
}) => {
	const pageRoute = opts?.pageRoute ?? '/home'
	const appbarState = opts?.appbarState ?? {}
	const defaultAppbarState = opts?.defaultAppbarState ?? {
		props: { position: 'fixed' },
		appbarStyle: 'basic',
		typography: { color: 'purple', fontFamily: 'Inter' },
		menuItemsSx: { fontSize: 13 },
		logoProps: { 'aria-label': 'logo' },
		textLogoProps: { component: 'div' },
		logoContainerProps: { id: 'logo-container' },
		searchContainerProps: { id: 'search-container' },
	}
	const appState = opts?.appState ?? {
		route: '/home',
		homepage: '/home',
		logoUri: 'https://example.com/logo.png',
		logoTag: 'img',
		logoWidth: 100,
		logoHeight: 24,
	}
    const pagesState = opts?.pagesState ?? {
		'/home': {
			title: 'Home',
			appbar: {
				background: { color: '#00f' },
			},
			typography: { color: '#0f0', fontFamily: 'Arial' },
		},
		'/inherited': {
			title: 'Inherited',
			appbar: {
				background: { color: '#123456' },
				typography: { color: '#654321' },
			},
		},
	}

	const defaultMock = mkDefaultMock(defaultAppbarState)
	const appMock = mkAppMock(appState)
	const allPages = new StateAllPages(pagesState)
	const page = new StatePage(pagesState[pageRoute] ?? { title: 'X' }, allPages)
	const pageAppbar = new StatePageAppbar(appbarState, page)
	pageAppbar.configure({
		$default: defaultMock as unknown as any,
		app: appMock as unknown as any,
		allPages: allPages,
	})
	return { pageAppbar, pagesState, appState, defaultAppbarState }
}

describe('StatePageAppbar', () => {
	it('throws if default-dependent getters used without configure()', () => {
		const allPages = new StateAllPages({ '/home': { title: 'Home' } })
		const page = new StatePage({ title: 'Home' }, allPages)
		const pageAppbar = new StatePageAppbar({}, page)
		expect(() => pageAppbar.props).toThrow(/Did you call `configure\(\)`\?/)
	})

	it('returns default props and styles when not set in page appbar', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({ appbarState: {} })
		expect(pageAppbar.props.position).toBe('fixed')
		expect(pageAppbar._type).toBe('basic')
		expect(pageAppbar.appbarStyle).toBe('basic')
	})

	it('prefers page appbar props over defaults when provided', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({
			appbarState: { props: { position: 'static' }, appbarStyle: 'responsive', _type: 'mini' }
		})
		expect(pageAppbar.props.position).toBe('static')
		expect(pageAppbar._type).toBe('mini')
		expect(pageAppbar.appbarStyle).toBe('responsive')
	})

	it('provides menu ids with default fallbacks', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({ appbarState: {} })
		expect(pageAppbar.menuId).toBe('primary-search-account-menu')
		expect(pageAppbar.mobileMenuId).toBe('primary-menu-mobile')
		expect(pageAppbar.mobileMenu2Id).toBe('primary-menu2-mobile')
	})

	it('merges toolbar and mobile menu props correctly', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({
			appbarState: {
				toolbarProps: { role: 'toolbar' },
				mobileMenuProps: { open: true },
				mobileMenu2Props: { open: true },
			}
		})
		expect(pageAppbar.toolbarProps.role).toBe('toolbar')
		expect(pageAppbar.mobileMenuProps.open).toBe(true)
		expect(pageAppbar.mobileMenu2Props.open).toBe(true)
	})

	it('returns menuItemsProps and menuItemsSx with sensible defaults', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({ appbarState: {} })
		expect(pageAppbar.menuItemsProps).toEqual({})
		expect(pageAppbar.menuItemsSx).toEqual({ fontSize: 13 })
	})

	it('uses app logoTag when available', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({})
		expect(pageAppbar.logoTag).toBe('img')
	})

	it('computes logoProps with img tag and logoUri', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({
			appState: { route: '/home', homepage: '/home', logoUri: 'https://x/logo.png', logoTag: 'img' }
		})
		const lp = pageAppbar.logoProps as Record<string, unknown>
		expect(lp['src']).toBe('https://x/logo.png')
	})

	it('computes logoProps with div tag and app dimensions', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({
			appState: {
				route: '/home', homepage: '/home', logoUri: 'https://x/logo.png', logoTag: 'div',
				logoWidth: 111, logoHeight: 22,
			}
		})
		const lp = pageAppbar.logoProps as { sx?: Record<string, unknown> }
		expect(String(lp.sx?.['backgroundImage'])).toContain('https://x/logo.png')
		expect(lp.sx?.['width']).toBe(111)
		expect(lp.sx?.['height']).toBe(22)
	})

	it('hasLogo is true when logoUri exists or logoProps not empty', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({})
		expect(pageAppbar.hasLogo).toBe(true)
		const { pageAppbar: noLogo } = mkConfiguredPageAppbar({
			appState: { route: '/home', homepage: '/home', logoUri: '', logoTag: 'img' },
			appbarState: { logoProps: { title: 'X' } }
		})
		expect(noLogo.hasLogo).toBe(true)
	})

	it('merges textLogoProps, logoContainerProps, searchContainerProps', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({
			appbarState: {
				textLogoProps: { id: 'text-logo' },
				logoContainerProps: { title: 'lc' },
				searchContainerProps: { title: 'sc' },
			}
		})
		const tlp = pageAppbar.textLogoProps as Record<string, unknown>
		const lcp = pageAppbar.logoContainerProps as Record<string, unknown>
		const scp = pageAppbar.searchContainerProps as Record<string, unknown>
		expect(tlp['id']).toBe('text-logo')
		expect(lcp['title']).toBe('lc')
		expect(scp['title']).toBe('sc')
	})

	it('merges desktop/mobile menu items and icons props', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({
			appbarState: {
				desktopMenuItemsProps: { sx: { color: 'red' } },
				desktopMenuItems2Props: { sx: { color: 'blue' } },
				mobileMenuItemsProps: { sx: { color: 'green' } },
				mobileMenuItems2Props: { sx: { color: 'black' } },
				mobileMenuIconProps: { 'aria-label': 'menu' },
				mobileMenuIcon2Props: { 'aria-label': 'menu2' },
			}
		})
		const d1 = pageAppbar.desktopMenuItemsProps as { sx?: Record<string, unknown> }
		const d2 = pageAppbar.desktopMenuItems2Props as { sx?: Record<string, unknown> }
		const m1 = pageAppbar.mobileMenuItemsProps as { sx?: Record<string, unknown> }
		const m2 = pageAppbar.mobileMenuItems2Props as { sx?: Record<string, unknown> }
		const mi1 = pageAppbar.mobileMenuIconProps as Record<string, unknown>
		const mi2 = pageAppbar.mobileMenuIcon2Props as Record<string, unknown>
		expect(d1.sx?.['color']).toBe('red')
		expect(d2.sx?.['color']).toBe('blue')
		expect(m1.sx?.['color']).toBe('green')
		expect(m2.sx?.['color']).toBe('black')
		expect(mi1['aria-label']).toBe('menu')
		expect(mi2['aria-label']).toBe('menu2')
	})

	it('handleMouseDown prevents default', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({})
		let called = 0
		const event = { preventDefault: () => { called++ } }
		pageAppbar['handleMouseDown'](event as unknown as React.MouseEvent<HTMLButtonElement>)
		expect(called).toBe(1)
	})

	// Background inheritance path is covered by dedicated background tests

	it('uses default typography when flagged and available', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({
			appbarState: { useDefaultTypography: true }
		})
		const ty = pageAppbar.typography
		expect(ty.state.color).toBe('purple')
		expect(ty.state.fontFamily).toBe('Inter')
	})

	it('inherits typography from specified route', () => {
		const { pageAppbar } = mkConfiguredPageAppbar({
			appbarState: { typographyInherited: '/home' }
		})
		const ty = pageAppbar.typography
		expect(ty.state.color).toBe('#0f0')
	})
})

