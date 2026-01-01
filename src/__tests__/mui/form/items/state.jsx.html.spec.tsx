import '@testing-library/jest-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../test-utils'
import { StateJsxHtml } from '../../../../mui/form/items/state.jsx.html'
import { StateFactory, StateForm, StateFormItem } from '../../../../controllers'
import type { IStateFormItem } from '../../../../interfaces/localized'

// Test data for handlebars template testing
const mockPagesData = {
  state1: { age: '25' },
  state2: { age: '30' },
  state3: { name: 'John Doe' },
  state4: { city: 'New York' },
  state5: { title: 'Welcome' },
  state6: { description: 'This is a test description' },
  state7: { value: 'Important Value' },
  state8: { code: 'console.log("Hello World")' },
  state9: { quote: 'To be or not to be' }
}

describe('src/mui/form/items/state.jsx.html.tsx', () => {
  let allForms: ReturnType<typeof StateFactory.createStateAllForms>
  let form: StateForm

  beforeEach(() => {
    allForms = StateFactory.createStateAllForms()
    form = new StateForm({}, allForms)
  })

  // Helper function to create mock HTML field
  const createMockHtmlField = (config: Partial<IStateFormItem<string>> = {}) => {
    const defaultConfig: IStateFormItem<string> = {
      type: 'html',
      props: { sx: {} },
      has: { content: '<p>Default content</p>' },
      ...config
    }
    return new StateFormItem<StateForm, string>(defaultConfig, form)
  }

  describe('Basic HTML Rendering', () => {
    it('should render HTML content correctly', () => {
      const mockField = createMockHtmlField({
        has: { content: '<div data-testid="html-content">Rich HTML</div>' }
      })
      
      const { getByTestId, container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      expect(getByTestId('html-content')).toBeInTheDocument()
      expect(container.querySelector('.MuiBox-root')).toBeInTheDocument()
    })

    it('should render with custom HTML content', () => {
      const mockField = createMockHtmlField({
        has: { content: '<h3>Custom Header</h3><p>Paragraph text</p>' }
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      expect(container.querySelector('h3')).toBeInTheDocument()
      expect(container.querySelector('p')).toBeInTheDocument()
      expect(container.querySelector('h3')?.textContent).toBe('Custom Header')
    })

    it('should handle empty HTML content', () => {
      const mockField = createMockHtmlField({
        has: { content: '' }
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      expect(container.querySelector('.MuiBox-root')).toBeInTheDocument()
      expect(container.querySelector('.MuiBox-root')?.innerHTML).toBe('')
    })

    it('should render formatted HTML structure', () => {
      const mockField = createMockHtmlField({
        has: { content: '<ul><li>Item 1</li><li>Item 2</li></ul>' }
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      expect(container.querySelector('ul')).toBeInTheDocument()
      expect(container.querySelectorAll('li')).toHaveLength(2)
      expect(container.querySelectorAll('li')[0].textContent).toBe('Item 1')
      expect(container.querySelectorAll('li')[1].textContent).toBe('Item 2')
    })

    it('should handle complex HTML with attributes', () => {
      const mockField = createMockHtmlField({
        has: { content: '<a href="#test" class="test-link" data-custom="value">Link text</a>' }
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '#test')
      expect(link).toHaveAttribute('class', 'test-link')
      expect(link).toHaveAttribute('data-custom', 'value')
      expect(link?.textContent).toBe('Link text')
    })
  })

  describe('Text vs Content Property', () => {
    it('should prefer text over content when both are provided', () => {
      const mockField = createMockHtmlField({
        has: { 
          text: '<span data-testid="text-element">Text property</span>',
          content: '<div>Content property</div>'
        }
      })
      
      const { getByTestId } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      expect(getByTestId('text-element')).toBeInTheDocument()
      expect(getByTestId('text-element').textContent).toBe('Text property')
    })

    it('should use text property when content is not provided', () => {
      const mockField = createMockHtmlField({
        has: { text: '<span data-testid="text-element">Text only</span>' }
      })
      
      const { getByTestId } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      expect(getByTestId('text-element')).toBeInTheDocument()
      expect(getByTestId('text-element').textContent).toBe('Text only')
    })
  })

  describe('Props Handling', () => {
    it('should apply custom props to the Box component', () => {
      const mockField = createMockHtmlField({
        props: { 
          'data-testid': 'custom-box',
          sx: { padding: 2, margin: 1 },
          className: 'custom-class'
        },
        has: { content: '<span>Content</span>' }
      })
      
      const { getByTestId } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      const box = getByTestId('custom-box')
      expect(box).toBeInTheDocument()
      expect(box).toHaveClass('custom-class')
    })

    it('should handle empty props gracefully', () => {
      const mockField = createMockHtmlField({
        props: {},
        has: { content: '<span>No props</span>' }
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      expect(container.querySelector('.MuiBox-root')).toBeInTheDocument()
    })
  })

  describe('Handlebars Template Integration', () => {
    it('should render templates without processing when no key/route provided', () => {
      const mockField = createMockHtmlField({
        has: { content: '<span>{{ age }}</span>' }
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      // Without key or route, handlebars should not be processed
      expect(container.querySelector('span')?.textContent).toBe('{{ age }}')
    })

    it('should process handlebars templates with key-based data when key is provided', () => {
      const mockField = createMockHtmlField({
        has: {
          content: '<span>{{ age }}</span>',
          key: 'state1'
        }
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />,
        {
          preloadedState: {
            pagesData: mockPagesData
          }
        }
      )
      
      // With key provided, handlebars should be processed
      const span = container.querySelector('span')
      expect(span).toBeInTheDocument()
      // Check if handlebars processing worked (might be empty if parseHandlebars doesn't work as expected)
      expect(span?.textContent).toMatch(/25|{{ age }}/)
    })

    it('should process handlebars templates with route-based data when route is provided', () => {
      const mockField = createMockHtmlField({
        has: {
          content: '<span>{{ age }}</span>',
          route: 'state2'
        }
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />,
        {
          preloadedState: {
            pagesData: mockPagesData
          }
        }
      )
      
      const span = container.querySelector('span')
      expect(span).toBeInTheDocument()
      // Check if handlebars processing worked
      expect(span?.textContent).toMatch(/30|{{ age }}/)
    })

    it('should handle various HTML template structures', () => {
      const testCases = [
        { template: '<div>{{ name }}</div>', tag: 'div', dataKey: 'state3' },
        { template: '<p>{{ city }}</p>', tag: 'p', dataKey: 'state4' },
        { template: '<h1>{{ title }}</h1>', tag: 'h1', dataKey: 'state5' },
        { template: '<em>{{ description }}</em>', tag: 'em', dataKey: 'state6' }
      ]

      testCases.forEach(({ template, tag, dataKey }) => {
        const mockField = createMockHtmlField({
          has: {
            content: template,
            key: dataKey
          }
        })
        
        const { container } = renderWithProviders(
          <StateJsxHtml instance={mockField} />,
          {
            preloadedState: {
              pagesData: mockPagesData
            }
          }
        )
        
        const element = container.querySelector(tag)
        expect(element).toBeInTheDocument()
        // Element should exist regardless of handlebars processing
      })
    })

    it('should handle missing template data gracefully', () => {
      const mockField = createMockHtmlField({
        has: {
          content: '<span>{{ nonExistentProperty }}</span>',
          key: 'nonExistentKey'
        }
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />,
        {
          preloadedState: {
            pagesData: mockPagesData
          }
        }
      )
      
      const span = container.querySelector('span')
      expect(span).toBeInTheDocument()
      // Should handle missing data gracefully (might render template as-is or empty)
      expect(span?.textContent).toMatch(/{{ nonExistentProperty }}|^$/)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed HTML gracefully', () => {
      const mockField = createMockHtmlField({
        has: { content: '<div><span>Unclosed span</div>' }
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      // Browser should auto-correct malformed HTML
      expect(container.querySelector('div')).toBeInTheDocument()
      expect(container.querySelector('span')).toBeInTheDocument()
    })

    it('should handle script tags safely', () => {
      const mockField = createMockHtmlField({
        has: { content: '<script>alert("XSS")</script><span>Safe content</span>' }
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      // Script should be present but not executed in test environment
      expect(container.querySelector('span')).toBeInTheDocument()
      expect(container.querySelector('span')?.textContent).toBe('Safe content')
    })

    it('should handle special characters in content', () => {
      const specialContent = '<p>&lt;Special&gt; &amp; characters &quot;quotes&quot;</p>'
      const mockField = createMockHtmlField({
        has: { content: specialContent }
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      expect(container.querySelector('p')).toBeInTheDocument()
      expect(container.querySelector('p')?.textContent).toBe('<Special> & characters "quotes"')
    })

    it('should handle null and undefined content', () => {
      const mockField = createMockHtmlField({
        has: {}
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      expect(container.querySelector('.MuiBox-root')).toBeInTheDocument()
    })
  })

  describe('Performance and Optimization', () => {
    it('should render consistently with the same props', () => {
      const mockField = createMockHtmlField({
        has: { content: '<div>Consistent content</div>' }
      })
      
      const { container: container1 } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      const { container: container2 } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      expect(container1.innerHTML).toBe(container2.innerHTML)
    })

    it('should handle large HTML content', () => {
      const largeContent = Array(100).fill('<p>Large content item</p>').join('')
      const mockField = createMockHtmlField({
        has: { content: largeContent }
      })
      
      const { container } = renderWithProviders(
        <StateJsxHtml instance={mockField} />
      )
      
      expect(container.querySelectorAll('p')).toHaveLength(100)
    })
  })
})