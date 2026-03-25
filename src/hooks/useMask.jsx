import { useState, useCallback, useRef, useEffect } from 'react';

export const useMask = (mask, initialValue = '', onValueChange = () => {}) => {
  const [value, setValue] = useState(initialValue);
  const valueRef = useRef(initialValue);

  const onChange = useCallback((e) => {
    if (e.nativeEvent.isComposing || e.inputType === 'insertCompositionText') return;
    
    const el = e.target;
    const cursorPos = el.selectionStart;
    const inputValue = e.target.value;
    const rawDigits = inputValue.replace(/\D/g, '');
    const digitsBeforeCursor = inputValue.slice(0, cursorPos).replace(/\D/g, '').length;
    
    // Build masked - stop at mask capacity or input digits
    let masked = '';
    let digitIndex = 0;
    for (let i = 0; i < mask.length && digitIndex < rawDigits.length; i++) {
      if (/\d/.test(mask[i])) {
        masked += rawDigits[digitIndex++] || '';
      } else {
        masked += mask[i];
      }
    }
    
    valueRef.current = masked;
    setValue(masked);
    onValueChange({ target: { name: '', value: masked } });
    
    // Improved cursor: place after same # digits
    let newCursorDigits = 0;
    let newCursorPos = masked.length; // default end
    for (let i = 0; i < masked.length; i++) {
      if (/\d/.test(masked[i])) {
        if (newCursorDigits === digitsBeforeCursor) {
          newCursorPos = i + 1;
          break;
        }
        newCursorDigits++;
      }
    }
    
    requestAnimationFrame(() => el.setSelectionRange(newCursorPos, newCursorPos));
  }, [mask, onValueChange]);

  return [value, onChange, setValue];
};

// Masks for Brazilian formats
export const masks = {
  cpf: '000.000.000-00',
  cep: '00000-000',
  tel: '(00) 0000-0000',  // Fixed: 10 digits landline (area 2 + 8)
  cel: '(00) 90000-0000', // 11 digits mobile (area 2 + 9 + 8)
  rg: '00.000.000-X',
  pis: '000.00000-00'
};

