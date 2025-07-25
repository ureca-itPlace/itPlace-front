import { useRef, useEffect, useState } from 'react';
import EarthScene from '../components/EarthScene';

const EarthSection = () => {
  const earthSectionRef = useRef<HTMLDivElement>(null);
  const [triggerReady, setTriggerReady] = useState(false);

  useEffect(() => {
    if (earthSectionRef.current) {
      setTriggerReady(true);
      console.log('지구 섹션 준비 완료');
    }
  }, []);

  return (
    <div ref={earthSectionRef} className="h-[100dvh] w-full bg-white overflow-hidden relative">
      {triggerReady && <EarthScene earthAnimationTrigger={earthSectionRef} />}
    </div>
  );
};

export default EarthSection;
