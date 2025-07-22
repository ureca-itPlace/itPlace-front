import { useRef, useEffect, useState } from 'react';
import EarthScene from '../common/EarthScene';

const EarthSection = () => {
  const earthSectionRef = useRef<HTMLDivElement>(null);
  const [triggerReady, setTriggerReady] = useState(false);

  useEffect(() => {
    if (earthSectionRef.current) {
      setTriggerReady(true);
      console.log('지구 섹션 렌더링 완료');
    }
  }, []);

  return (
    <div ref={earthSectionRef} className="h-screen w-full bg-black overflow-hidden">
      {triggerReady && <EarthScene earthAnimationTrigger={earthSectionRef} />}
    </div>
  );
};

export default EarthSection;
