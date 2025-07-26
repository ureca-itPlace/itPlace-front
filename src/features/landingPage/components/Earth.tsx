import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useEffect, useLayoutEffect } from 'react';
import CurveText from './CurvedText';

gsap.registerPlugin(ScrollTrigger);

interface ModelProps {
  modelPath: string;
}

const Model: React.FC<ModelProps> = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    const introTl = gsap.timeline({
      defaults: { ease: 'power2.out' },
    });

    // 1. 줌인
    introTl.to(camera.position, {
      z: 3,
      duration: 2,
    });

    // 2. 줌아웃
    introTl.to(
      camera.position,
      {
        z: 3.5,
        duration: 2,
        ease: 'sine.inOut',
      },
      '+=1.2'
    );

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.earth-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        pinSpacing: true,
        markers: true,
        onUpdate: (self) => {
          const canvasWrapper = document.querySelector('.canvas-wrapper');
          if (canvasWrapper) {
            const fadeStart = 0.7; // 70% 스크롤 진행 후부터 페이드
            const fadeRange = 1 - fadeStart;
            const fadeProgress = (self.progress - fadeStart) / fadeRange;

            gsap.set(canvasWrapper, {
              opacity: fadeProgress < 0 ? 1 : 1 - fadeProgress,
            });
          }
        },
      },
    });

    // 3. 스크롤 시 확대
    scrollTl.fromTo(
      groupRef.current.scale,
      { x: 1, y: 1, z: 1 },
      { x: 1.3, y: 1.3, z: 1.3, duration: 7, ease: 'expo.out' },
      0
    );
    // 4. 동시에 스크롤 시 줌인
    scrollTl.fromTo(camera.position, { z: 3.5 }, { z: 2, duration: 7, ease: 'none' }, 0);

    // 5. 하얀색 배경으로 변경
    scrollTl.to(
      '.earth-section',
      {
        backgroundColor: '#ffffff',
        opacity: 0,
        duration: 2,
        ease: 'power1.out',
      },
      '>-1'
    );

    scrollTl.to({}, { duration: 5 });

    return () => {
      scrollTl.kill();
      introTl.kill();
    };
  }, [camera]);

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());

      // 모델을 중심으로 이동
      scene.position.sub(center);
    }
  }, [scene]);

  // 자동 회전
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
    if (textRef.current) textRef.current.rotation.y -= 0.01;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1}>
      <primitive object={scene} />
      <CurveText text="IT:PLACE" ref={textRef} />
    </group>
  );
};

export default Model;
