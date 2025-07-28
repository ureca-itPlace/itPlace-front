import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useHeaderThemeObserver = (setTheme: (theme: 'light' | 'dark') => void) => {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-theme]');
    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const theme = section.getAttribute('data-theme') as 'light' | 'dark';

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setTheme(theme || 'light'),
        onEnterBack: () => setTheme(theme || 'light'),
      });

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [setTheme]);
};
