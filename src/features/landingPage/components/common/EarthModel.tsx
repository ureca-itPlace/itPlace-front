import { FC, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, Mesh, BackSide, AdditiveBlending } from 'three';

const EarthModel: FC = () => {
  const earthTexture = useLoader(
    TextureLoader,
    '../../../../../public/images/landing/textures/earth-map.png'
  );
  const cloudsTexture = useLoader(
    TextureLoader,
    '../../../../../public/images/landing/textures/earth-cloud.png'
  );
  const backgroundTexture = useLoader(
    TextureLoader,
    '../../../../../public/images/landing/bg-earth.png'
  );

  const cloudsRef = useRef<Mesh>(null);
  const earthRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0005;
    }
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0002;
    }
    if (glowRef.current) {
      glowRef.current.layers.set(1);
    }
    camera.layers.enable(1);
  });

  return (
    <>
      {/* 우주 배경 */}
      <mesh>
        <sphereGeometry args={[90, 64, 64]} />
        <meshBasicMaterial map={backgroundTexture} side={BackSide} />
      </mesh>
      {/* 실제 지구 */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial map={earthTexture} emissiveIntensity={0.5} roughness={0.4} />
      </mesh>
      {/* 구름 */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.51, 64, 64]} />
        <meshStandardMaterial
          map={cloudsTexture}
          transparent={true}
          opacity={0.7}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* 글로우 쉘 */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.52, 64, 64]} />
        <meshBasicMaterial
          color={0x00aaff}
          transparent={true}
          opacity={0.3}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
};

export default EarthModel;
