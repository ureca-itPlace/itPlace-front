import { useEffect, useState } from 'react';
import { Header } from '../components';
import EarthSection from '../features/landingPage/sections/EarthSection';
import MapSection from '../features/landingPage/sections/MapSection';
import { useResponsive } from '../hooks/useResponsive';
import MobileHeader from '../components/MobileHeader';

const TestPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  // 새로 고침 시 최상단으로 이동
  useEffect(() => {
    window.onbeforeunload = function pushRefresh() {
      window.scrollTo(0, 0);
    };
  }, []);

  return (
    <>
      <div className="relative bg-white">
        {/* 지구 */}
        <EarthSection onLoaded={() => setIsLoaded(true)} />

        <div className="relative z-20">
          {/* 헤더 */}
          {isLoaded && (isMobile && isTablet ? <MobileHeader /> : <Header variant="glass" />)}
          <div className="h-screen border-4 border-red-500" />
          {/* 지도 */}
          <MapSection />
          {/* 기능 설명 */}
          {/* CTA */}
        </div>
      </div>
    </>
  );
};

export default TestPage;
