import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Mesh, AdditiveBlending, Group, Color } from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { EarthModelProps } from '../types/landing.types';

gsap.registerPlugin(ScrollTrigger);

const EarthModel = ({ trigger, canvasWrapperRef, earthCloud1Ref }: EarthModelProps) => {
  const earthTexture = useLoader(TextureLoader, '/images/landing/textures/earth-map.webp');
  const cloudsTexture = useLoader(TextureLoader, '/images/landing/textures/earth-cloud.webp');

  const groupRef = useRef<Group>(null);
  const earthCloudRef = useRef<Mesh>(null);
  const earthRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const outerGlowRef = useRef<Mesh>(null);
  const auraRef = useRef<Mesh>(null);

  useGSAP(() => {
    if (!groupRef.current || !trigger || !canvasWrapperRef.current || !earthCloud1Ref.current)
      return;

    gsap.set(earthCloud1Ref.current, { opacity: 0.8, x: '-100%', scale: 1 });

    // 타임라인 생성
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: '+=1500',
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        refreshPriority: 1, // 지구 애니메이션이 최우선
      },
    });

    // 1. 지구 확대
    tl.to(
      groupRef.current.scale,
      {
        x: 2.5,
        y: 2.5,
        z: 2.5,
        duration: 3,
        ease: 'power1.out',
      },
      0
    );

    // 2. 캔버스 페이드 아웃 (지구 확대가 끝난 후 시작)
    tl.to(
      canvasWrapperRef.current,
      {
        opacity: 0,
        duration: 7,
        ease: 'none',
      },
      1.2
    );

    // 3. 구름 등장 (페이드아웃 중간 시점에 시작)
    tl.to(
      earthCloud1Ref.current,
      {
        x: '0%',
        scale: 2.4,
        opacity: 1,
        duration: 5,
        ease: 'power2.out',
      },
      2.7
    );

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [trigger]);

  useFrame(() => {
    if (earthCloudRef.current) {
      earthCloudRef.current.rotation.y += 0.0008;
    }
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
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
      <mesh ref={earthCloudRef}>
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
