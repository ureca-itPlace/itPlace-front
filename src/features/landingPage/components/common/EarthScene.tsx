import { Canvas } from '@react-three/fiber';
import EarthModel from './EarthModel';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
// import { EffectComposer, Bloom } from '@react-three/postprocessing';

const Earth = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[-2, 0.5, 1.5]} intensity={2} />
      <Suspense fallback={null}>
        <EarthModel />
        {/* <EffectComposer>
          <Bloom intensity={1} luminanceThreshold={0} luminanceSmoothing={0.1} mipmapBlur />
        </EffectComposer> */}
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={true} />
    </Canvas>
  );
};

export default Earth;
