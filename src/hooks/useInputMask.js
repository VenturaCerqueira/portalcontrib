import React from 'react';
import { useMask, masks } from './useMask.js';

const CpfMaskedField = React.forwardRef(({ value: externalValue, onChange: externalOnChange, ...props }, ref) => {
  const [value, onChange, setValue] = useMask(masks.cpf);
  
  React.useEffect(() => {
    if (externalValue !== value) {
      setValue(externalValue || '');
    }
  }, [externalValue, setValue, value]);
  
  const handleChange = (e) => {
    onChange(e);
    externalOnChange?.({
      ...e,
      target: { ...e.target, value: value }
    });
  };
  
  return (
    <input 
      ref={ref}
      {...props}
      value={value}
      onChange={handleChange}
    />
  );
});

// Backward compatibility
export const useInputMask = (mask) => {
  return [value || '', CpfMaskedField];
};

export const masks = masks;
export default CpfMaskedField;

