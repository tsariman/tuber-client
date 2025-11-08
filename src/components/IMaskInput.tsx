import { forwardRef } from 'react';

interface IMaskInputProps {
  mask?: string;
  value?: string;
  onChange?: (event: { target: { value: string } }) => void;
  onAccept?: (value: string) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  definitions?: Record<string, RegExp>;
  overwrite?: boolean;
  [key: string]: unknown;
}

const IMaskInput = forwardRef<HTMLInputElement, IMaskInputProps>(
  ({ value, onChange, onAccept, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (typeof onChange === 'function') {
        onChange({ target: { value: newValue } });
      }
      if (typeof onAccept === 'function') {
        onAccept(newValue);
      }
    };

    return (
      <input
        ref={ref}
        value={value as string}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

IMaskInput.displayName = 'IMaskInput';

export { IMaskInput };