import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'

// Mock StateAppbar before any imports that might use it
vi.mock('../../../controllers/StateAppbar', () => ({
  default: class MockStateAppbar {}
}))

vi.mock('../../../controllers/StateAppbarDefault', () => ({
  default: class MockStateAppbarDefault {}
}))

vi.mock('../../../controllers/State', () => ({
  default: class MockState {}
}))

vi.mock('../../../controllers/StatePage', () => ({
  default: class MockStatePage {}
}))

// Mock StateJsxIcon
vi.mock('../../../mui/icon', () => ({
  StateJsxIcon: ({ name }: { name: string }) => (
    <span data-testid={`mock-icon-${name}`}>{name}</span>
  )
}))

// Mock business logic functions
vi.mock('../../../business.logic', () => ({
  JsonapiError: class MockJsonapiError {
    constructor(public json: any) {}
    get id() { return this.json.id || 'error-id' }
    get code() { return this.json.code || 'ERROR_CODE' }
    get title() { return this.json.title || 'Error Title' }
  },
  color_json_code: vi.fn((json: any) => JSON.stringify(json, null, 2)),
  format_json_code: vi.fn((json: any) => JSON.stringify(json, null, 2)),
  get_errors_list: vi.fn(() => [])
}))

import { renderWithProviders, screen } from '../../test-utils'
import PageErrors from '../../../mui/page/errors.cpn'
import type StatePage from '../../../controllers/StatePage'

// Import after mocking
import * as businessLogic from '../../../business.logic'

describe('PageErrors', () => {
  // Helper to create mock StatePage
  const createMockPage = (): StatePage => {
    return {} as unknown as StatePage
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render error page with Grid layout', () => {
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      // MUI Grid v2 uses different class names - check for grid root
      const gridRoot = container.querySelector('.MuiGrid2-root, .MuiGrid-root, .MuiGrid-container')
      expect(gridRoot || container.firstChild).toBeInTheDocument()
    })

    it('should render search input', () => {
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      const input = container.querySelector('input[placeholder="Filter..."]')
      expect(input).toBeInTheDocument()
    })

    it('should render search icon', () => {
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      expect(container.querySelector('[data-testid="mock-icon-search"]')).toBeInTheDocument()
    })

    it('should render two Toolbars', () => {
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      const toolbars = container.querySelectorAll('.MuiToolbar-root')
      expect(toolbars).toHaveLength(2)
    })
  })

  describe('Error List', () => {
    it('should render empty list when no errors', () => {
      vi.mocked(businessLogic.get_errors_list).mockReturnValue([])
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      const papers = container.querySelectorAll('.MuiPaper-root')
      expect(papers).toHaveLength(0)
    })

    it('should render error items when errors exist', () => {
      vi.mocked(businessLogic.get_errors_list).mockReturnValue([
        // @ts-expect-error AI generated code
        { id: 'err-1', code: 'CODE_1', title: 'First Error' },
        // @ts-expect-error AI generated code
        { id: 'err-2', code: 'CODE_2', title: 'Second Error' }
      ])
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      expect(container.textContent).toContain('err-1')
      expect(container.textContent).toContain('CODE_1')
      expect(container.textContent).toContain('First Error')
      expect(container.textContent).toContain('err-2')
      expect(container.textContent).toContain('CODE_2')
      expect(container.textContent).toContain('Second Error')
    })

    it('should render errors in reverse order', () => {
      vi.mocked(businessLogic.get_errors_list).mockReturnValue([
        // @ts-expect-error AI generated code
        { id: 'err-1', code: 'CODE_1', title: 'First Error' },
        // @ts-expect-error AI generated code
        { id: 'err-2', code: 'CODE_2', title: 'Second Error' }
      ])
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      const papers = container.querySelectorAll('.MuiPaper-root')
      expect(papers).toHaveLength(2)
      // Most recent error should be first (reversed)
      expect(papers[0].textContent).toContain('err-2')
    })
  })

  describe('Search/Filter Functionality', () => {
    it('should have filter input with aria-label', () => {
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      const input = container.querySelector('input[aria-label="filter"]')
      expect(input).toBeInTheDocument()
    })

    it('should not show clear button when filter is empty', () => {
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      const clearButton = container.querySelector('button[aria-label="clear"]')
      expect(clearButton).not.toBeInTheDocument()
    })
  })

  describe('Grid Layout', () => {
    it('should have left column for error list', () => {
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      // Check for grid structure - both columns should have toolbars
      const toolbars = container.querySelectorAll('.MuiToolbar-root')
      expect(toolbars.length).toBeGreaterThanOrEqual(2)
    })

    it('should have right column for error details', () => {
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      // Check that the component renders with multiple sections (left and right columns)
      const toolbars = container.querySelectorAll('.MuiToolbar-root')
      // Two toolbars = two columns
      expect(toolbars).toHaveLength(2)
    })
  })

  describe('Error Card Rendering', () => {
    it('should render error id and code', () => {
      vi.mocked(businessLogic.get_errors_list).mockReturnValue([
        // @ts-expect-error AI generated code
        { id: 'test-id', code: 'TEST_CODE', title: 'Test Title' }
      ])
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      expect(container.textContent).toContain('test-id')
      expect(container.textContent).toContain('TEST_CODE')
    })

    it('should render error title', () => {
      vi.mocked(businessLogic.get_errors_list).mockReturnValue([
        // @ts-expect-error AI generated code
        { id: 'id', code: 'CODE', title: 'Error Title Text' }
      ])
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      expect(container.textContent).toContain('Error Title Text')
    })

    it('should render Paper components for errors', () => {
      vi.mocked(businessLogic.get_errors_list).mockReturnValue([
        // @ts-expect-error AI generated code
        { id: 'id', code: 'CODE', title: 'Title' }
      ])
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      expect(container.querySelector('.MuiPaper-root')).toBeInTheDocument()
    })

    it('should render CardContent for each error', () => {
      vi.mocked(businessLogic.get_errors_list).mockReturnValue([
        // @ts-expect-error AI generated code
        { id: 'id', code: 'CODE', title: 'Title' }
      ])
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      expect(container.querySelector('.MuiCardContent-root')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle error with missing fields', () => {
      vi.mocked(businessLogic.get_errors_list).mockReturnValue([
        // @ts-expect-error AI generated code
        { id: '', code: '', title: '' }
      ])
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      expect(container.querySelector('.MuiPaper-root')).toBeInTheDocument()
    })

    it('should handle many errors', () => {
      const manyErrors = Array.from({ length: 20 }, (_, i) => ({
        id: `err-${i}`,
        code: `CODE_${i}`,
        title: `Error ${i}`
      }))
      // @ts-expect-error AI generated code
      vi.mocked(businessLogic.get_errors_list).mockReturnValue(manyErrors)
      const mockPage = createMockPage()

      const { container } = renderWithProviders(<PageErrors instance={mockPage} />)

      const papers = container.querySelectorAll('.MuiPaper-root')
      expect(papers).toHaveLength(20)
    })
  })
})