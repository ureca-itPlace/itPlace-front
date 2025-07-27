import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useHeaderThemeObserver = (setTheme: (theme: string) => void) => {
  useEffect(() => {
    const sections = document.querySelectorAll('[data-theme]');

    sections.forEach((section) => {
      const theme = section.getAttribute('data-theme');

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setTheme(theme || 'light'),
        onEnterBack: () => setTheme(theme || 'light'),
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [setTheme]);
};
