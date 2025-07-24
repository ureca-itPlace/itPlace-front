import { Canvas, useLoader } from '@react-three/fiber';
import EarthModel from './EarthModel';
import { OrbitControls } from '@react-three/drei';
import { TextureLoader, BackSide } from 'three';
import LoadingScreen from './LoadingScreen';
import React, { Suspense, useRef } from 'react';
import Cloud from './Cloud';

type EarthSceneProps = {
  earthAnimationTrigger: React.RefObject<HTMLElement | null>;
};

const EarthScene = ({ earthAnimationTrigger }: EarthSceneProps) => {
  const backgroundTexture = useLoader(TextureLoader, '/images/landing/earth-bg.webp');
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const cloud1Ref = useRef<HTMLImageElement>(null);

  return (
    <>
      <LoadingScreen />
      <div
        ref={canvasWrapperRef}
        className="relative w-full h-screen max-sm:h-[100dvh] overflow-hidden flex justify-center items-center"
      >
        <Cloud className="right-[20%] top-[-20%]" ref={cloud1Ref} />
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: false }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[-2, 0.5, 1.5]} intensity={2} color={0xffffff} />
          <Suspense fallback={null}>
            {/* 우주 배경 */}
            <mesh>
              <sphereGeometry args={[80, 64, 64]} />
              <meshBasicMaterial map={backgroundTexture} side={BackSide} />
            </mesh>
            <EarthModel
              trigger={earthAnimationTrigger.current}
              canvasWrapperRef={canvasWrapperRef}
              earthCloud1Ref={cloud1Ref}
            />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={true} />
        </Canvas>
      </div>
    </>
  );
};

export default EarthScene;
