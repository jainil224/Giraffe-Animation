import React, { useEffect, useState, useRef } from "react";

interface ScrambleInProps {
  text: string;
  delay: number; // in ms
  triggered: boolean;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><";

export const ScrambleIn: React.FC<ScrambleInProps> = ({ text, delay, triggered }) => {
  const [displayText, setDisplayText] = useState<string>("");
  const [isStarted, setIsStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!triggered) {
      setDisplayText("");
      setIsStarted(false);
      return;
    }

    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [triggered, delay]);

  useEffect(() => {
    if (!isStarted) return;

    let frame = 0;
    
    intervalRef.current = setInterval(() => {
      const c = frame * 0.5;
      
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
        } else if (i < c + 3) {
          const randChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          result += randChar;
        } else {
          // characters beyond are empty
          break;
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
  }, [isStarted, text]);

  if (!triggered || !isStarted) {
    return <span>&nbsp;</span>;
  }

  return <span>{displayText}</span>;
};
