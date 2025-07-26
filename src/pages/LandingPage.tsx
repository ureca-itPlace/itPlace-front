import { useEffect, useState } from 'react';
import { Header } from '../components';
import EarthSection from '../features/landingPage/sections/EarthSection';
import MapSection from '../features/landingPage/sections/MapSection';
import { useResponsive } from '../hooks/useResponsive';
import MobileHeader from '../components/MobileHeader';

const TestPage = () => {
  // 지구 로드 상태
  const [isLoaded, setIsLoaded] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  // 새로 고침 시 최상단으로 이동
  useEffect(() => {
    window.onbeforeunload = function pushRefresh() {
      window.scrollTo(0, 0);
    };
  }, []);

  return (
    <div className="relative bg-white z-20 overflow-x-hidden">
      {/* 지구 */}
      <EarthSection onLoaded={() => setIsLoaded(true)} />

      {/* 헤더 */}
      {isLoaded && (isMobile && isTablet ? <MobileHeader /> : <Header variant="glass" />)}
      {/* 더미 박스 */}
      <div className="h-[65vh]" />
      {/* 지도 */}
      <MapSection />
      {/* 더미 박스 */}
      <div className="h-[100vh]" />
      {/* 기능 설명 */}
      {/* 비디오 */}
      {/* CTA */}
    </div>
  );
};

export default TestPage;
