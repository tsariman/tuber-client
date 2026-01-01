import StateJsxBadgedIcon, {
    StateJsxIcon,
    StateJsxUnifiedIconProvider
} from '../../../mui/icon/index'
import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '../../test-utils'

// Minimal `has` object to simulate StateFormItemCustom for icon components
const mkHas = (overrides: Partial<Record<string, unknown>> = {}) => ({
    icon: 'close',
    badge: undefined,
    svgIconProps: {},
    iconProps: {},
    muiIcon: undefined,
    svgIcon: undefined,
    faIcon: undefined,
    ...overrides,
})

describe('Icon Components', () => {
    describe('StateJsxIcon', () => {
        it('renders SVG path for a known icon', () => {
            const { container } = renderWithProviders(<StateJsxIcon name="close" />)
            const path = container.querySelector('path')
            expect(path).toBeTruthy()
            // Close icon path starts with 'M19', validate prefix
            expect(path?.getAttribute('d')?.startsWith('M19')).toBe(true)
        })

        it('applies SvgIcon props via config', () => {
            const { container } = renderWithProviders(
                <StateJsxIcon name="close" config={{ fontSize: 'large', color: 'primary' }} />
            )
            // Ensure the SvgIcon exists
            const svgIcon = container.querySelector('svg')
            expect(svgIcon).toBeTruthy()
            // Should have the proper viewBox applied
            expect(svgIcon?.getAttribute('viewBox')).toBe('0 0 24 24')
        })
    })

    describe('StateJsxUnifiedIconProvider', () => {
        it('renders using svgIcon when provided (priority)', () => {
            const has = mkHas({ svgIcon: 'home' })
            renderWithProviders(<StateJsxUnifiedIconProvider instance={has as any} />)
            // MUI Icon renders text child when using LocalSvgIconSelection
            expect(screen.getByText('home')).toBeInTheDocument()
        })

        it('renders using icon when svgIcon is none', () => {
            const has = mkHas({ svgIcon: 'none', icon: 'close' })
            const { container } = renderWithProviders(<StateJsxUnifiedIconProvider instance={has as any} />)
            const path = container.querySelector('path')
            expect(path).toBeTruthy()
            expect(path?.getAttribute('d')?.startsWith('M19')).toBe(true)
        })

        it('renders none when no providers available', () => {
            const has = mkHas({ icon: undefined, svgIcon: undefined, faIcon: undefined })
            const { container } = renderWithProviders(<StateJsxUnifiedIconProvider instance={has as any} />)
            expect(container.textContent).toContain('❌')
        })

        it('faIcon path logs and renders empty fragment', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
            const has = mkHas({ icon: undefined, svgIcon: undefined, faIcon: 'fa-something' })
            const { container } = renderWithProviders(<StateJsxUnifiedIconProvider instance={has as any} />)
            expect(spy).toHaveBeenCalled()
            expect(container.textContent).toBe('')
            spy.mockRestore()
        })
    })

    describe('StateJsxBadgedIcon', () => {
        it('renders a badged SVG icon when badge is present', () => {
            const has = mkHas({ badge: { color: 'primary' } })
            const { container } = renderWithProviders(<StateJsxBadgedIcon instance={has as any} />)
            // Badge content default is '-'
            expect(container.textContent).toContain('-')
            const path = container.querySelector('path')
            expect(path?.getAttribute('d')?.startsWith('M19')).toBe(true)
        })

        it('renders plain SVG icon when badge is absent', () => {
            const has = mkHas({ badge: undefined })
            const { container } = renderWithProviders(<StateJsxBadgedIcon instance={has as any} />)
            // No badge content
            expect(container.textContent).not.toContain('-')
            const path = container.querySelector('path')
            expect(path).toBeTruthy()
        })
    })
})
