import { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Mesh, AdditiveBlending, Group } from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EarthModel = ({ trigger }: { trigger: HTMLElement | null }) => {
  const earthTexture = useLoader(
    TextureLoader,
    '../../../../../public/images/landing/textures/earth-map.png'
  );
  const cloudsTexture = useLoader(
    TextureLoader,
    '../../../../../public/images/landing/textures/earth-cloud.png'
  );

  const groupRef = useRef<Group>(null);
  const cloudsRef = useRef<Mesh>(null);
  const earthRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  useEffect(() => {
    if (!groupRef.current || !trigger) return;

    gsap.set(groupRef.current.scale, { x: 1, y: 1, z: 1 });

    const animation = gsap.to(groupRef.current.scale, {
      x: 2.5,
      y: 2.5,
      z: 2.5,
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: '+=800',
        scrub: 0.5,
        pin: true,
        markers: true,
      },
      ease: 'none',
    });

    return () => {
      animation.kill();
    };
  }, [trigger]);

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
  });

  return (
    <group ref={groupRef}>
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
    </group>
  );
};

export default EarthModel;
