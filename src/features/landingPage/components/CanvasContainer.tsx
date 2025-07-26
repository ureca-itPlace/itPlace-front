import { TextureLoader } from 'three';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import Model from './Earth';
import LoadingScreen from './LoadingScreen';

const CanvasContainer = ({ onLoaded }: { onLoaded: () => void }) => {
  const BackgroundSetter = () => {
    const { scene } = useThree();
    const texture = useLoader(TextureLoader, '/images/landing/bg-earth.webp');

    useEffect(() => {
      scene.background = texture;
    }, [scene, texture]);

    return null;
  };
  return (
    <div className="canvas-wrapper fixed inset-0 z-20 transition-opacity duration-500 h-full">
      {/* three.js 로딩 */}
      <LoadingScreen onFinish={onLoaded} />
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} color="#e0d5ff" />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#b48bff" castShadow />
        <pointLight position={[-5, 0, 5]} intensity={0.8} color="#9b59b6" distance={20} />
        {/* 우주 배경 */}
        <BackgroundSetter />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <Model modelPath="/models/earth.glb" />
        </Suspense>
        <OrbitControls enableRotate={false} enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default CanvasContainer;
