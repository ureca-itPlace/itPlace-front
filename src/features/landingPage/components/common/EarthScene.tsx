import { Canvas, useLoader } from '@react-three/fiber';
import EarthModel from '../common/EarthModel';
import { OrbitControls } from '@react-three/drei';
import { TextureLoader, BackSide } from 'three';
import LoadingScreen from './LoadingScreen';

type EarthSceneProps = {
  earthAnimationTrigger: React.RefObject<HTMLElement | null>;
};

const EarthScene = ({ earthAnimationTrigger }: EarthSceneProps) => {
  const backgroundTexture = useLoader(TextureLoader, '/images/landing/bg-earth.png');

  return (
    <>
      <LoadingScreen />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[-2, 0.5, 1.5]} intensity={2} color={0xffffff} />
        {/* 우주 배경 */}
        <mesh>
          <sphereGeometry args={[80, 64, 64]} />
          <meshBasicMaterial map={backgroundTexture} side={BackSide} />
        </mesh>
        <EarthModel trigger={earthAnimationTrigger.current} />
        <OrbitControls enableZoom={false} enablePan={true} />
      </Canvas>
    </>
  );
};

export default EarthScene;
