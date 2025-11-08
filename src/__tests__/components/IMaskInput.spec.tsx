import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { IMaskInput } from '../../components/IMaskInput';

describe('IMaskInput Component', () => {
  it('should render input element', () => {
    render(<IMaskInput />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should display initial value', () => {
    const testValue = 'test value';
    render(<IMaskInput value={testValue} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe(testValue);
  });

  it('should call onChange when input value changes', () => {
    const onChange = vi.fn();
    render(<IMaskInput onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(onChange).toHaveBeenCalledWith({
      target: { value: 'new value' }
    });
  });

  it('should call onAccept when input value changes', () => {
    const onAccept = vi.fn();
    render(<IMaskInput onAccept={onAccept} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'accepted value' } });
    
    expect(onAccept).toHaveBeenCalledWith('accepted value');
  });

  it('should call both onChange and onAccept when both are provided', () => {
    const onChange = vi.fn();
    const onAccept = vi.fn();
    render(<IMaskInput onChange={onChange} onAccept={onAccept} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(onChange).toHaveBeenCalledWith({
      target: { value: 'test' }
    });
    expect(onAccept).toHaveBeenCalledWith('test');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<IMaskInput ref={ref} />);
    
    expect(ref).toHaveBeenCalled();
  });

  it('should pass through additional props', () => {
    render(
      <IMaskInput 
        placeholder="Enter text"
        data-testid="custom-input"
        className="custom-class"
      />
    );
    
    const input = screen.getByTestId('custom-input');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveClass('custom-class');
  });

  it('should handle case when onChange is not a function', () => {
    // This shouldn't throw an error
    render(<IMaskInput onChange={undefined} />);
    
    const input = screen.getByRole('textbox');
    expect(() => {
      fireEvent.change(input, { target: { value: 'test' } });
    }).not.toThrow();
  });

  it('should handle case when onAccept is not a function', () => {
    // This shouldn't throw an error
    render(<IMaskInput onAccept={undefined} />);
    
    const input = screen.getByRole('textbox');
    expect(() => {
      fireEvent.change(input, { target: { value: 'test' } });
    }).not.toThrow();
  });

  it('should have correct display name', () => {
    expect(IMaskInput.displayName).toBe('IMaskInput');
  });

  it('should work with controlled input pattern', () => {
    const TestComponent = () => {
      const [value, setValue] = useState('');
      
      return (
        <IMaskInput 
          value={value}
          onChange={(e: { target: { value: string } }) => setValue(e.target.value)}
          data-testid="controlled-input"
        />
      );
    };

    render(<TestComponent />);
    
    const input = screen.getByTestId('controlled-input') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'controlled' } });
    expect(input.value).toBe('controlled');
  });
});