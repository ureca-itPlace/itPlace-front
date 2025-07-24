import { Text } from '@react-three/drei';
import { Group } from 'three';
import { forwardRef } from 'react';

interface CurvedTextProps {
  text: string;
  radius?: number;
  fontSize?: number;
  color?: string;
}

const CurveText = forwardRef<Group, CurvedTextProps>(
  ({ text, radius = 1.2, fontSize = 0.2, color = 'white' }, ref) => {
    const letters = text.split('').reverse();
    const total = letters.length;

    return (
      <group ref={ref}>
        {letters.map((char, i) => {
          const theta = ((i - total / 2) / total) * Math.PI * 0.5;

          const x = Math.cos(theta) * radius;
          const z = Math.sin(theta) * radius;
          const y = 0;

          return (
            <Text
              key={i}
              font="/font/Anton-Regular.ttf"
              position={[x, y, z]}
              fontSize={fontSize}
              color={color}
              anchorX="center"
              anchorY="middle"
              rotation={[0, -theta + Math.PI / 2, 0]}
            >
              {char}
            </Text>
          );
        })}
      </group>
    );
  }
);

export default CurveText;
