import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface SearchInMapButtonProps {
  onClick?: () => void;
}

const SearchInMapButton: React.FC<SearchInMapButtonProps> = ({ onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      // 초기 상태 설정 (작고 투명하게)
      gsap.set(buttonRef.current, {
        scale: 0,
        opacity: 0,
        y: 20,
      });

      // 애니메이션
      gsap.to(buttonRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 0,
      });
    }
  }, []);

  const handleClick = () => {
    if (buttonRef.current) {
      // 클릭시 작은 펄스 애니메이션
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });
    }
    onClick?.();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="bg-purple04 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple05 transition-colors duration-200 flex items-center space-x-2"
    >
      <span>🔍</span>
      <span>현 지도에서 검색</span>
    </button>
  );
};

export default SearchInMapButton;
