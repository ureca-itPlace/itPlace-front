import { TextureLoader, BackSide } from 'three';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import { EarthSceneProps } from '../types/landing.types';
import LoadingScreen from './LoadingScreen';
import EarthModel from './EarthModel';
import { useResponsive } from '../../../hooks/useResponsive';

const EarthScene = ({ earthAnimationTrigger }: EarthSceneProps) => {
  const backgroundTexture = useLoader(TextureLoader, '/images/landing/earth-bg.webp');
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const { isMobile, isTablet } = useResponsive();

  const memoizedEarthModel = useMemo(
    () => (
      <EarthModel trigger={earthAnimationTrigger.current} canvasWrapperRef={canvasWrapperRef} />
    ),
    [earthAnimationTrigger]
  );

  return (
    <>
      {/* three.js 로딩 */}
      <LoadingScreen />
      <div
        ref={canvasWrapperRef}
        className="relative w-full h-screen max-sm:h-[100dvh] overflow-hidden flex justify-center items-center"
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: false }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[-2, 0.5, 1.5]} intensity={2} color={0xffffff} />
          <Suspense fallback={null}>
            {/* 우주 배경 */}
            <mesh>
              <sphereGeometry args={[80, 64, 64]} />
              <meshBasicMaterial map={backgroundTexture} side={BackSide} />
            </mesh>
            {/* 지구 모델 */}
            {memoizedEarthModel}
          </Suspense>
          {/* 3D 요소 통제 (자체 확대 X -> 스크롤 시 확대) */}
          <OrbitControls
            enableZoom={false}
            enablePan={true}
            autoRotate
            autoRotateSpeed={0.5}
            enableRotate={!(isMobile || isTablet)}
          />
        </Canvas>
      </div>
    </>
  );
};

export default EarthScene;
