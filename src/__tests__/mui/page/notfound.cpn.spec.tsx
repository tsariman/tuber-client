import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../../test-utils';
import PageNotFound from '../../../mui/page/notfound.cpn';

describe('PageNotFound Component', () => {
  const createMockPage = (message = 'Default not found message') => ({
    parent: {
      parent: {
        tmp: {
          get: () => message,
        },
        app: {
          route: 'test-route',
        },
      },
    },
    data: {
      message: 'Page data message',
    },
  } as unknown);

  it('should render 404 heading', () => {
    const mockPage = createMockPage();

    renderWithProviders(
      <PageNotFound def={mockPage as Parameters<typeof PageNotFound>[0]['def']} />
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404');
  });

  it('should render message from tmp.get', () => {
    const testMessage = 'Custom error message';
    const mockPage = createMockPage(testMessage);

    renderWithProviders(
      <PageNotFound def={mockPage as Parameters<typeof PageNotFound>[0]['def']} />
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(testMessage);
  });

  it('should have correct styling for 404 heading', () => {
    const mockPage = createMockPage();

    renderWithProviders(
      <PageNotFound def={mockPage as Parameters<typeof PageNotFound>[0]['def']} />
    );

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveStyle({
      fontSize: '200px',
      textAlign: 'center',
      margin: '0px',
    });
  });

  it('should have correct styling for message heading', () => {
    const mockPage = createMockPage();

    renderWithProviders(
      <PageNotFound def={mockPage as Parameters<typeof PageNotFound>[0]['def']} />
    );

    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveStyle({
      fontSize: '32px',
      textAlign: 'center',
      margin: '0px',
    });
  });

  it('should render both headings', () => {
    const mockPage = createMockPage();

    renderWithProviders(
      <PageNotFound def={mockPage as Parameters<typeof PageNotFound>[0]['def']} />
    );

    expect(screen.getAllByRole('heading')).toHaveLength(2);
  });
});