import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Layout from '../../../mui/layout'
import { LayoutCenteredNoScroll, LayoutCentered } from '../../../mui/layout/layouts'
import {
	LAYOUT_CENTERED,
	LAYOUT_CENTERED_NO_SCROLL,
	LAYOUT_DEFAULT,
	LAYOUT_MD,
	LAYOUT_SM,
	LAYOUT_XL,
	LAYOUT_XS,
	LAYOUT_TABLE_VIRTUALIZED,
	LAYOUT_NONE,
	LAYOUT_NONE_NO_APPBAR
} from '@tuber/shared'
import type StatePage from '../../../controllers/StatePage'

/**
 * Basic integration tests for the Layout entry module using the real components.
 * Focus is on verifying children rendering and selection logic across known layouts.
 */

const createMockPage = (layout: string, hasAppbar = false): StatePage => (
	{ layout, hasAppbar } as unknown as StatePage
)

const child = (<div data-testid="content">Hello Layout</div>)

describe('mui/layout index', () => {
	it('renders children in LayoutCenteredNoScroll', () => {
		const page = createMockPage(LAYOUT_CENTERED_NO_SCROLL)
		const { container } = render(<Layout instance={page}>{child}</Layout>)
		expect(screen.getByTestId('content')).toBeInTheDocument()
		// LayoutCenteredNoScroll uses a Grid container; ensure an element wrapper exists
		expect(container.firstElementChild).toBeTruthy()
	})

	it('renders children in LayoutCentered', () => {
		const page = createMockPage(LAYOUT_CENTERED)
		const { container } = render(<Layout instance={page}>{child}</Layout>)
		expect(screen.getByTestId('content')).toBeInTheDocument()
		expect(container.firstElementChild).toBeTruthy()
	})

	it('renders children in default Container layout', () => {
		const page = createMockPage(LAYOUT_DEFAULT)
		render(<Layout instance={page}>{child}</Layout>)
		expect(screen.getByTestId('content')).toBeInTheDocument()
	})

	it('renders children in md/sm/xl/xs Container layouts', () => {
		for (const layout of [LAYOUT_MD, LAYOUT_SM, LAYOUT_XL, LAYOUT_XS]) {
			const page = createMockPage(layout)
			render(<Layout instance={page}>{child}</Layout>)
			expect(screen.getAllByTestId('content').length).toBeGreaterThan(0)
		}
	})

	it('renders children in VirtualizedTableLayout', () => {
		const page = createMockPage(LAYOUT_TABLE_VIRTUALIZED)
		render(<Layout instance={page}>{child}</Layout>)
		expect(screen.getByTestId('content')).toBeInTheDocument()
	})

	it('applies toolbar wrapper for layout_none when page has appbar', () => {
		const page = createMockPage(LAYOUT_NONE, true)
		const { container } = render(<Layout instance={page}>{child}</Layout>)
		// With appbar, DefaultLayoutToolbared wraps children and inserts toolbar as a sibling
		const outer = container.firstElementChild as HTMLElement | null
		expect(outer?.childElementCount).toBeGreaterThanOrEqual(2)
		expect(outer?.lastElementChild).toBe(screen.getByTestId('content'))
	})

	it('falls back to fragment for layout_none when no appbar', () => {
		const page = createMockPage(LAYOUT_NONE, false)
		const { container } = render(<Layout instance={page}>{child}</Layout>)
		// Fragment renders child as the top element
		const outer = container.firstElementChild as HTMLElement | null
		expect(outer).toBe(screen.getByTestId('content'))
	})

	it('renders fragment for layout_none_no_appbar', () => {
		const page = createMockPage(LAYOUT_NONE_NO_APPBAR)
		const { container } = render(<Layout instance={page}>{child}</Layout>)
		const outer = container.firstElementChild as HTMLElement | null
		expect(outer).toBe(screen.getByTestId('content'))
	})

	it('handles uppercase and extra spaces in layout string', () => {
		const page = createMockPage(`  ${LAYOUT_CENTERED.toUpperCase()}   `)
		render(<Layout instance={page}>{child}</Layout>)
		expect(screen.getByTestId('content')).toBeInTheDocument()
	})

	it('gracefully falls back for empty layout', () => {
		const page = createMockPage('')
		const { container } = render(<Layout instance={page}>{child}</Layout>)
		const outer = container.firstElementChild as HTMLElement | null
		expect(outer).toBe(screen.getByTestId('content'))
	})
})