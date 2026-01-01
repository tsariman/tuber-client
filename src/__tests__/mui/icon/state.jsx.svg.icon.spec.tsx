import StateJsxSvgIcon from '../../../mui/icon/state.jsx.svg.icon'
import StateIcon from '../../../controllers/StateIcon'
import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../test-utils'

describe('StateJsxSvgIcon', () => {
	it('returns null when icon has no content', () => {
		const emptyIcon = new StateIcon({
			viewBox: '0 0 24 24',
			width: 24,
			height: 24,
			paths: [],
			rects: [],
			polygons: [],
			groups: [],
		})
		const { container } = renderWithProviders(
			<StateJsxSvgIcon svgDef={emptyIcon} />
		)
		expect(container.firstChild).toBeNull()
	})

	it('renders default path element when only svg string is provided', () => {
		const pathD = 'M10 10 L 20 20'
		const icon = new StateIcon({ svg: pathD })
		const { container } = renderWithProviders(
			<StateJsxSvgIcon svgDef={icon} />
		)
		const svg = container.querySelector('svg') as SVGElement
		const path = container.querySelector('path')
		expect(svg).toBeTruthy()
		expect(path).toBeTruthy()
		expect(path?.getAttribute('d')).toBe(pathD)
		// Has default viewBox and path rendered
		expect(svg.getAttribute('viewBox')).toBe('0 0 24 24')
	})

	it('does not apply explicit width/height when fontSize is provided', () => {
		const pathD = 'M0 0 H 10 V 10 Z'
		const icon = new StateIcon({ svg: pathD })
		const { container } = renderWithProviders(
			<StateJsxSvgIcon svgDef={icon} def={{ svgIconProps: { fontSize: 'large', color: 'primary' } }} />
		)
		const svg = container.querySelector('svg') as SVGElement
		const path = container.querySelector('path')
		expect(path?.getAttribute('d')).toBe(pathD)
		// Width/height omitted when fontSize is set
		expect(svg.style.width).toBe('')
		expect(svg.style.height).toBe('')
		// ViewBox defaults to 0 0 24 24
		expect(svg.getAttribute('viewBox')).toBe('0 0 24 24')
	})

	it('renders groups and nested elements along with direct shapes', () => {
		const group = {
			children: [
				{ type: 'path', props: { d: 'M1 1 H 5', opacity: 0.5 } },
				{ type: 'rect', props: { width: 2, height: 3, x: 1, y: 1, rx: 0, ry: 0 } },
				{ type: 'polygon', props: { points: '0,0 2,0 1,2', strokeWidth: 1 } },
				{ type: 'group', props: { children: [ { type: 'path', props: { d: 'M2 2 H 4' } } ] } },
			]
		}
		const icon = new StateIcon({
			fill: 'green',
			paths: [ { d: 'M3 3 H 6' } ],
			rects: [ { width: 1, height: 1, x: 0, y: 0 } ],
			polygons: [ { points: '0,0 1,0 0,1' } ],
			groups: [ group as any ],
		})
		const { container } = renderWithProviders(<StateJsxSvgIcon svgDef={icon} />)
		const paths = container.querySelectorAll('path')
		const rects = container.querySelectorAll('rect')
		const polys = container.querySelectorAll('polygon')
		// Paths: 1 (group) + 1 (nested group) + 1 (direct paths)
		expect(paths.length).toBe(3)
		// Rects: 1 (group) + 1 (direct rects)
		expect(rects.length).toBe(2)
		// Polygons: 1 (group) + 1 (direct polygons)
		expect(polys.length).toBe(2)
	})
})