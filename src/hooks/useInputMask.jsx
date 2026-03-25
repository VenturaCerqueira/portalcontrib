import React from 'react';
import { useMask } from './useMask.jsx';
import { masks } from './useMask.jsx';

const MaskedField = React.forwardRef(({ 
  mask = masks.cpf, 
  field, 
  value: externalValue, 
  onChange: externalOnChange, 
  ...props 
}, ref) => {
  // React Hook Form field support
  const fieldValue = field?.value ?? externalValue ?? '';
  const fieldOnChange = field?.onChange;
  const fieldOnBlur = field?.onBlur;
  
  // Pass fieldOnChange as onValueChange (string => void)
  const [value, onChangeInternal, setValue] = useMask(mask, fieldValue, fieldOnChange);
  
  React.useEffect(() => {
    setValue(fieldValue);
  }, [fieldValue, setValue]);
  
  const handleChange = (e) => {
    onChangeInternal(e);
    // No extra calls needed - useMask now calls fieldOnChange(maskedValue) internally
  };
  
  const handleBlur = (e) => {
    fieldOnBlur?.(e);
    props.onBlur?.(e);
  };
  
  return (
    <input 
      ref={ref ?? field.ref}
      {...props}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
});

// Backward compatibility
export const useInputMask = (mask) => useMask(mask);

export { masks };
export { MaskedField as default, MaskedField };

