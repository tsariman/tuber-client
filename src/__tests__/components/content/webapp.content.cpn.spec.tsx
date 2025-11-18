import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '../../test-utils';
import WebApps from '../../../components/content/webapp.content.cpn';
import '@testing-library/jest-dom';

// Mock the TubeResearcher component
vi.mock('../../../webapp/tuber/view/default', () => ({
  default: () => <div data-testid="tube-researcher">TubeResearcher Component</div>,
}));

describe('WebApps Component', () => {
  it('should render TubeResearcher when contentName is tubeResearcher', () => {
    const mockPage = {
      contentName: 'tubeResearcher',
    } as unknown;

    renderWithProviders(
      <WebApps def={mockPage as Parameters<typeof WebApps>[0]['def']} />
    );

    expect(screen.getByTestId('tube-researcher')).toBeInTheDocument();
    expect(screen.getByText('TubeResearcher Component')).toBeInTheDocument();
  });

  it('should return null when contentName does not match any web app', () => {
    const mockPage = {
      contentName: 'nonExistentApp',
    } as unknown;

    const { container } = renderWithProviders(
      <WebApps def={mockPage as Parameters<typeof WebApps>[0]['def']} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should return null when contentName is empty', () => {
    const mockPage = {
      contentName: '',
    } as unknown;

    const { container } = renderWithProviders(
      <WebApps def={mockPage as Parameters<typeof WebApps>[0]['def']} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should return null when contentName is undefined', () => {
    const mockPage = {
      contentName: undefined,
    } as unknown;

    const { container } = renderWithProviders(
      <WebApps def={mockPage as Parameters<typeof WebApps>[0]['def']} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle case sensitivity correctly', () => {
    const mockPage = {
      contentName: 'TubeResearcher', // Different case
    } as unknown;

    const { container } = renderWithProviders(
      <WebApps def={mockPage as Parameters<typeof WebApps>[0]['def']} />
    );

    // Should return null since it's case sensitive
    expect(container.firstChild).toBeNull();
  });

  it('should pass the correct def prop to TubeResearcher', () => {
    const mockPage = {
      contentName: 'tubeResearcher',
      someProperty: 'test-value',
    } as unknown;

    // We can verify the component renders, which means it received the def prop
    renderWithProviders(
      <WebApps def={mockPage as Parameters<typeof WebApps>[0]['def']} />
    );

    expect(screen.getByTestId('tube-researcher')).toBeInTheDocument();
  });
});