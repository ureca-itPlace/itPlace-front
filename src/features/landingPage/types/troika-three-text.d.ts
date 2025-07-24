declare module 'troika-three-text' {
  import { Mesh } from 'three';

  export class Text extends Mesh {
    text: string;
    font: string;
    fontSize: number;
    maxWidth: number;
    lineHeight: number;
    letterSpacing: number;
    textAlign: 'left' | 'center' | 'right';
    anchorX: 'left' | 'center' | 'right' | number;
    anchorY: 'top' | 'middle' | 'bottom' | number;
    color: string;
    sync: () => void;
  }
}
