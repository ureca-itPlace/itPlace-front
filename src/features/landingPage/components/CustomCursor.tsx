import React, { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import glitter1 from '../../../assets/landingPage/glitter-1.svg';
import glitter2 from '../../../assets/landingPage/glitter-2.svg';
import glitter3 from '../../../assets/landingPage/glitter-3.svg';

const CustomCursor = () => {
  const trailContainer = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);

  useGSAP(() => {
    const imgs = [glitter1, glitter2, glitter3];

    const createTrail = (x: number, y: number) => {
      const img = document.createElement('img');
      img.src = imgs[currentIndex.current];
      currentIndex.current = (currentIndex.current + 1) % imgs.length;

      img.classList.add('trail-img');
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;

      trailContainer.current?.appendChild(img);

      gsap.fromTo(
        img,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 2,
          duration: 0.3,
          ease: 'power2.out',
        }
      );

      gsap.to(img, {
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          img.remove();
        },
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 180) {
        createTrail(e.clientX, e.clientY);
        lastX.current = e.clientX;
        lastY.current = e.clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  });

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[1000] pointer-events-none">
      <div ref={trailContainer} className="w-full h-full"></div>
    </div>
  );
};

export default CustomCursor;
