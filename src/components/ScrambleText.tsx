import React, { useEffect, useState, useRef } from "react";

interface ScrambleTextProps {
  text: string;
  isHovered: boolean;
  className?: string;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><";

export const ScrambleText: React.FC<ScrambleTextProps> = ({ text, isHovered, className = "" }) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    let frame = 0;
    
    intervalRef.current = setInterval(() => {
      const c = frame / 4; // 4 frames/char (reveal rate: 0.25 chars per frame)

      if (c >= text.length) {
        setDisplayText(text);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < c) {
          result += text[i];
        } else {
          const randChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          result += randChar;
        }
      }

      setDisplayText(result);
      frame++;
    }, 25);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, text]);

  return <span className={className}>{displayText}</span>;
};
