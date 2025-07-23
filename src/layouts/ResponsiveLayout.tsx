import { useMediaQuery } from 'react-responsive';
import MobileLayout from './MobileLayout';
import DefaultLayout from './DefaultLayout';

const ResponsiveLayout = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' }); // Tailwind max-md
  return isMobile ? <MobileLayout /> : <DefaultLayout />;
};

export default ResponsiveLayout;
