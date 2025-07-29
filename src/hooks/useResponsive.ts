import { useMediaQuery } from 'react-responsive';

export const useResponsive = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 500px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 501px) and (max-width: 1023px)' });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px) and (max-width: 1535px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1536px)' });

  return { isMobile, isTablet, isLaptop, isDesktop };
};
