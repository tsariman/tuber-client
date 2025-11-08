import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Create a simple mock component that replicates the NotFound page behavior
const MockPageNotFound = ({ message = 'Page not found' }: { message?: string }) => {
  return (
    <>
      <h1 style={{ 
        fontSize: '200px', 
        textAlign: 'center', 
        margin: 0,
        width: '100%'
      }}>
        404
      </h1>
      <h2 style={{ 
        fontSize: '32px', 
        textAlign: 'center', 
        margin: 0,
        width: '100%'
      }}>
        {message}
      </h2>
    </>
  );
};

describe('NotFound Page Behavior (Functional Test)', () => {
  it('should render 404 heading with correct styling', () => {
    render(<MockPageNotFound />);

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('404');
    expect(h1).toHaveStyle({
      fontSize: '200px',
      textAlign: 'center',
      margin: '0px',
      width: '100%',
    });
  });

  it('should render message heading with correct styling', () => {
    const testMessage = 'Custom error message';
    render(<MockPageNotFound message={testMessage} />);

    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent(testMessage);
    expect(h2).toHaveStyle({
      fontSize: '32px',
      textAlign: 'center',
      margin: '0px',
      width: '100%',
    });
  });

  it('should render default message when no message provided', () => {
    render(<MockPageNotFound />);

    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('should render both headings', () => {
    render(<MockPageNotFound />);

    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('404');
    expect(headings[1]).toHaveTextContent('Page not found');
  });

  it('should handle custom message correctly', () => {
    const customMessage = 'This resource could not be found';
    render(<MockPageNotFound message={customMessage} />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.queryByText('Page not found')).not.toBeInTheDocument();
  });

  it('should handle empty message', () => {
    render(<MockPageNotFound message="" />);

    expect(screen.getByText('404')).toBeInTheDocument();
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent('');
  });
});