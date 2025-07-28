import { useMediaQuery } from 'react-responsive';

export const useResponsive = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 500px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });
  const isLaptop = useMediaQuery({ query: '(max-width: 1535px ' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1536px)' });

  return { isMobile, isTablet, isLaptop, isDesktop };
};
