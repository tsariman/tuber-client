import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderWithProviders, screen } from '../../test-utils';
import HtmlContent from '../../../mui/content/html.cpn';

// Mock StatePage
const mockPage = {
  contentName: 'test-element',
  typography: {
    fontFamily: 'Arial, sans-serif',
    color: '#333333',
  },
} as unknown;

describe('HtmlContent Component', () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    // Create a mock DOM element
    mockElement = document.createElement('div');
    mockElement.id = 'test-element';
    mockElement.innerHTML = '<p>Test HTML content</p><span>More content</span>';
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    // Clean up the mock element
    if (mockElement && mockElement.parentNode) {
      mockElement.parentNode.removeChild(mockElement);
    }
  });

  it('should render HTML content when element exists', () => {
    renderWithProviders(
      <HtmlContent def={mockPage as Parameters<typeof HtmlContent>[0]['def']} />
    );

    expect(screen.getByText('Test HTML content')).toBeInTheDocument();
    expect(screen.getByText('More content')).toBeInTheDocument();
  });

  it('should apply typography styles', () => {
    const { container } = renderWithProviders(
      <HtmlContent def={mockPage as Parameters<typeof HtmlContent>[0]['def']} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({
      fontFamily: 'Arial, sans-serif',
      color: '#333333',
    });
  });

  it('should have full width styling', () => {
    const { container } = renderWithProviders(
      <HtmlContent def={mockPage as Parameters<typeof HtmlContent>[0]['def']} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: '100%' });
  });

  it('should return null when element does not exist', () => {
    const mockPageWithMissingElement = {
      contentName: 'non-existent-element',
      typography: {
        fontFamily: 'Arial, sans-serif',
        color: '#333333',
      },
    } as unknown;

    const { container } = renderWithProviders(
      <HtmlContent def={mockPageWithMissingElement as Parameters<typeof HtmlContent>[0]['def']} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle empty element content', () => {
    const emptyElement = document.createElement('div');
    emptyElement.id = 'empty-element';
    emptyElement.innerHTML = '';
    document.body.appendChild(emptyElement);

    const mockPageWithEmptyElement = {
      contentName: 'empty-element',
      typography: {
        fontFamily: 'Arial, sans-serif',
        color: '#333333',
      },
    } as unknown;

    const { container } = renderWithProviders(
      <HtmlContent def={mockPageWithEmptyElement as Parameters<typeof HtmlContent>[0]['def']} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toBeEmptyDOMElement();

    // Clean up
    document.body.removeChild(emptyElement);
  });

  it('should use dangerouslySetInnerHTML correctly', () => {
    const { container } = renderWithProviders(
      <HtmlContent def={mockPage as Parameters<typeof HtmlContent>[0]['def']} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.innerHTML).toBe('<p>Test HTML content</p><span>More content</span>');
  });

  it('should handle HTML with special characters', () => {
    const specialElement = document.createElement('div');
    specialElement.id = 'special-element';
    specialElement.innerHTML = '<p>Content with &amp; special &lt;characters&gt;</p>';
    document.body.appendChild(specialElement);

    const mockPageWithSpecialContent = {
      contentName: 'special-element',
      typography: {
        fontFamily: 'Arial, sans-serif',
        color: '#333333',
      },
    } as unknown;

    renderWithProviders(
      <HtmlContent def={mockPageWithSpecialContent as Parameters<typeof HtmlContent>[0]['def']} />
    );

    expect(screen.getByText('Content with & special <characters>')).toBeInTheDocument();

    // Clean up
    document.body.removeChild(specialElement);
  });
});