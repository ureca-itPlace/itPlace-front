import { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Mesh, AdditiveBlending, Group, Color } from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const EarthModel = ({ trigger }: { trigger: HTMLElement | null }) => {
  const earthTexture = useLoader(TextureLoader, '/images/landing/textures/earth-map.png');
  const cloudsTexture = useLoader(TextureLoader, '/images/landing/textures/earth-cloud.png');

  const groupRef = useRef<Group>(null);
  const cloudsRef = useRef<Mesh>(null);
  const earthRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const outerGlowRef = useRef<Mesh>(null);
  const auraRef = useRef<Mesh>(null);

  useEffect(() => {
    if (groupRef.current) {
      gsap.set(groupRef.current.scale, { x: 0, y: 0, z: 0 });

      gsap.to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 2,
        ease: 'power2.out',
      });
    }
  }, []);

  useGSAP(() => {
    if (!groupRef.current || !trigger) return;

    const animation = gsap.to(groupRef.current.scale, {
      x: 2.5,
      y: 2.5,
      z: 2.5,
      scrollTrigger: {
        trigger,
        start: 'center center',
        end: '+=600',
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        refreshPriority: 1, // 지구 애니메이션이 최우선
        markers: true,
      },
      duration: 2,
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

    // 글로우 레이어 설정
    if (glowRef.current) {
      glowRef.current.layers.set(1);
    }
    if (outerGlowRef.current) {
      outerGlowRef.current.layers.set(1);
    }
    if (auraRef.current) {
      auraRef.current.layers.set(1);
      auraRef.current.rotation.z += 0.0003;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 실제 지구 */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          emissive={new Color(0x001133)}
          emissiveIntensity={0.3}
          roughness={0.6}
        />
      </mesh>

      {/* 구름 */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.51, 64, 64]} />
        <meshStandardMaterial
          map={cloudsTexture}
          transparent={true}
          opacity={1}
          blending={AdditiveBlending}
          depthWrite={false}
          emissive={new Color(0x003366)}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* 메인 글로우 */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.53, 64, 64]} />
        <meshBasicMaterial
          color={new Color(0x00ffff)}
          transparent={true}
          opacity={0.5}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 외부 글로우 */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[1.55, 32, 32]} />
        <meshBasicMaterial
          color={new Color(0x0088ff)}
          transparent={true}
          opacity={0.3}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 아우라 */}
      <mesh ref={auraRef}>
        <sphereGeometry args={[1.58, 16, 16]} />
        <meshBasicMaterial
          color={new Color(0x0066ff)}
          transparent={true}
          opacity={0.2}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default EarthModel;
