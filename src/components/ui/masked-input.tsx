import { Input } from "./input";
import { InputHTMLAttributes, forwardRef } from "react";

type MaskedInputProps = InputHTMLAttributes<HTMLInputElement> & {
  mask: string;
  maskChar?: string | null;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

function applyMask(value: string, mask: string): string {
  let maskedValue = '';
  let valueIndex = 0;
  
  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    if (mask[i] === '9') {
      if (/\d/.test(value[valueIndex])) {
        maskedValue += value[valueIndex];
        valueIndex++;
      }
    } else {
      maskedValue += mask[i];
      if (value[valueIndex] === mask[i]) {
        valueIndex++;
      }
    }
  }
  
  return maskedValue;
}

function unmaskedValue(value: string): string {
  return value.replace(/\D/g, '');
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  function MaskedInput({ mask, value = '', onChange, onBlur, type = "text", ...props }, ref) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const unmasked = unmaskedValue(e.target.value);
      const masked = applyMask(unmasked, mask);

      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: masked,
          },
        };
        onChange(syntheticEvent);
      }
    };

    return (
      <Input
        ref={ref}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        {...props}
      />
    );
  }
); 