import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('Simple Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should render a basic div', () => {
    const { container } = render(<div>Hello World</div>);
    expect(container.firstChild).toHaveTextContent('Hello World');
  });
});