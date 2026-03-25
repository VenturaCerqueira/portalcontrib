import { useState, useCallback, useRef, useEffect } from 'react';

export const useMask = (mask, initialValue = '', onValueChange = () => {}) => {
  const [value, setValue] = useState(initialValue);
  const valueRef = useRef(initialValue);

  const onChange = useCallback((e) => {
    // Prevent recursive calls from setSelectionRange
    if (e.nativeEvent.isComposing || e.inputType === 'insertCompositionText') {
      return;
    }
    const el = e.target;
    
    // Get precise cursor position before any state changes
    const cursorPos = el.selectionStart;
    
    const inputValue = e.target.value;
    const rawDigits = inputValue.replace(/\D/g, '');
    
    // Count digits BEFORE cursor in input (stable reference)
    const digitsBeforeCursor = inputValue.slice(0, cursorPos).replace(/\D/g, '').length;
    
    // Build new masked value
    let masked = '';
    let digitIndex = 0;
    for (let i = 0; i < mask.length && digitIndex < rawDigits.length; i++) {
      if (/\d/.test(mask[i])) {
        masked += rawDigits[digitIndex] || '';
        digitIndex++;
      } else {
        masked += mask[i];
      }
    }
    
    valueRef.current = masked;
    setValue(masked);
    
    // Notify parent of new masked value (safe default prevents crash)
    onValueChange(masked);
    
    // Position cursor at same digit count from input cursor
    let newCursorDigits = 0;
    let newCursorPos = 0;
    for (let i = 0; i < masked.length; i++) {
      if (/\d/.test(masked[i])) {
        if (newCursorDigits === digitsBeforeCursor) {
          newCursorPos = i + 1;
          break;
        }
        newCursorDigits++;
      }
    }
    
    // Fallback to end
    if (newCursorPos === 0) newCursorPos = masked.length;
    
    // Set cursor synchronously AFTER state (stable)
    requestAnimationFrame(() => {
      el.setSelectionRange(newCursorPos, newCursorPos);
    });
  }, [mask, onValueChange]);

  return [value, onChange, setValue];
};

// Masks
export const masks = {
  cpf: '000.000.000-00',
  cep: '00000-000',
  tel: '(00) 00000-0000',
  cel: '(00) 90000-0000',
  rg: '00.000.000-X',
  pis: '000.00000-00'
};

