import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import PageLanding from '../../../components/pages/landing.cpn';

describe('PageLanding Component', () => {
  const mockPage = {} as unknown;

  it('should render null', () => {
    const { container } = renderWithProviders(
      <PageLanding def={mockPage as Parameters<typeof PageLanding>[0]['def']} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should accept def prop without errors', () => {
    expect(() => {
      renderWithProviders(
        <PageLanding def={mockPage as Parameters<typeof PageLanding>[0]['def']} />
      );
    }).not.toThrow();
  });
});