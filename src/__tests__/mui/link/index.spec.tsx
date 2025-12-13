import { describe, it, expect, vi } from 'vitest'
import { StateLink } from '../../../controllers'
import type { IStateLink } from '../../../interfaces/localized'

// Mock the redux state utilities for StateLink controller
vi.mock('../../../state', () => ({
  default_handler: vi.fn(() => () => {}),
}))

/**
 * Test suite for StateJsxLink component and StateLink controller
 * 
 * This test focuses on the StateLink controller logic rather than
 * rendering tests to avoid complex MUI styling recursion issues.
 * The tests verify that:
 * - StateLink instances are created correctly
 * - Different link types are handled properly  
 * - State properties are accessible and correct
 * - Props and handlers are passed through correctly
 */
describe('src/mui/link/index.tsx', () => {
  describe('StateJsxLink', () => {
    /**
     * Helper function to create mock link state objects for testing.
     * This provides a consistent base state that can be overridden as needed.
     */
    const createMockLinkState = (overrides: Partial<IStateLink> = {}): IStateLink => ({
      type: 'text',
      has: {
        text: 'Test Link',
        label: 'Test Link Label'
      },
      props: {},
      ...overrides,
    })

    it('should create StateLink instance', () => {
      const linkState = createMockLinkState()
      const stateLink = new StateLink(linkState)
      expect(stateLink).toBeDefined()
      expect(stateLink.type).toBe('text')
    })

    it('should handle text property in has state', () => {
      const linkState = createMockLinkState({
        type: 'text',
        has: {
          text: 'Home',
          label: 'Home Link'
        }
      })
      const stateLink = new StateLink(linkState)
      
      expect(stateLink.has.text).toBe('Home')
      expect(stateLink.has.label).toBe('Home Link')
    })

    it('should handle link type configuration', () => {
      const linkState = createMockLinkState({
        type: 'link',
        has: {
          text: 'External Link',
          label: 'External Link Label'
        }
      })
      const stateLink = new StateLink(linkState)
      
      expect(stateLink.type).toBe('link')
      expect(stateLink.has.text).toBe('External Link')
    })

    it('should have correct state properties', () => {
      const linkState = createMockLinkState({
        type: 'icon',
        has: {
          text: 'Icon Link',
          label: 'Icon Link Label',
          icon: 'home'
        }
      })
      const stateLink = new StateLink(linkState)
      
      expect(stateLink.type).toBe('icon')
      expect(stateLink.has.text).toBe('Icon Link')
      expect(stateLink.has.label).toBe('Icon Link Label')
    })

    it('should handle undefined type correctly', () => {
      const linkState = createMockLinkState({
        type: undefined,
        has: {
          text: 'Default Link',
          label: 'Default Link Label'
        }
      })
      const stateLink = new StateLink(linkState)
      
      // StateLink should default to 'text' type when not specified
      expect(stateLink.type).toBe('text')
    })

    it('should handle href property', () => {
      const linkState = createMockLinkState({
        type: 'link',
        href: '/test-route',
        has: {
          text: 'Route Link',
          label: 'Route Link Label'
        }
      })
      const stateLink = new StateLink(linkState)
      
      expect(stateLink.state.href).toBe('/test-route')
    })

    it('should handle onClick handler property', () => {
      const mockHandler = vi.fn()
      const linkState = createMockLinkState({
        type: 'text',
        onClick: mockHandler,
        has: {
          text: 'Clickable Link',
          label: 'Clickable Link Label'
        }
      })
      const stateLink = new StateLink(linkState)
      
      expect(stateLink.state.onClick).toBe(mockHandler)
    })

    it('should handle props correctly', () => {
      const customProps = {
        'data-testid': 'custom-link',
        className: 'custom-class'
      }
      const linkState = createMockLinkState({
        type: 'text',
        props: customProps,
        has: {
          text: 'Custom Props Link',
          label: 'Custom Props Link Label'
        }
      })
      const stateLink = new StateLink(linkState)
      
      expect(stateLink.props).toEqual(customProps)
    })

    it('should handle different link types', () => {
      const types = ['text', 'textlogo', 'icon', 'hybrid', 'link', 'svg', 'svg_right', 'svg_left'] as const
      
      types.forEach(type => {
        const linkState = createMockLinkState({
          type,
          has: {
            text: `${type} Link`,
            label: `${type} Link Label`
          }
        })
        const stateLink = new StateLink(linkState)
        
        expect(stateLink.type).toBe(type)
      })
    })
  })
})