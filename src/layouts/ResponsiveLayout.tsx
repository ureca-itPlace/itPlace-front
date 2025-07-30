import { useMediaQuery } from 'react-responsive';
import MobileLayout from './MobileLayout';
import DefaultLayout from './DefaultLayout';
import ScrollToTop from '../components/ScrollToTop';

const ResponsiveLayout = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' }); // Tailwind max-md
  return (
    <>
      <ScrollToTop />
      {isMobile ? <MobileLayout /> : <DefaultLayout />}
    </>
  );
};

export default ResponsiveLayout;
