import { useState, useEffect } from 'react';

interface UseAnimatedLoadingTextProps {
  messages: string[];
  interval?: number;
}

export const useAnimatedLoadingText = ({
  messages,
  interval = 3000,
}: UseAnimatedLoadingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex(() => Math.floor(Math.random() * messages.length));
        setIsVisible(true);
      }, 500);
    }, interval);

    return () => clearInterval(fadeInterval);
  }, [messages.length, interval]);

  const getTextColor = () => {
    return currentIndex % 2 === 0 ? 'text-purple03' : 'text-pink03';
  };

  return {
    currentMessage: messages[currentIndex],
    isVisible,
    textColorClass: getTextColor(),
  };
};
