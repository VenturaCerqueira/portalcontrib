import { useState, useEffect } from 'react';

const useTypewriter = ({ text, speed = 120, loop = false, delayStart = 0, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let index = 0;
    let timeoutId;
    let cursorInterval;

    const startTyping = () => {
      setIsTyping(true);
      setDisplayText('');

      const typeNextChar = () => {
        if (index < text.length) {
          setDisplayText(text.substring(0, index + 1));
          index++;
          timeoutId = setTimeout(typeNextChar, speed);
        } else {
          setIsTyping(false);
          if (onComplete) onComplete();
          if (loop) {
            index = 0;
            setTimeout(startTyping, 2000); // Pause before loop
          }
        }
      };

      setTimeout(typeNextChar, delayStart);
    };

    // Cursor blink effect
    cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 400);

    // Start typing
    startTyping();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (cursorInterval) clearInterval(cursorInterval);
    };
  }, [text, speed, loop, delayStart, onComplete]);

  return { displayText, isTyping, cursorVisible };
};

export default useTypewriter;

