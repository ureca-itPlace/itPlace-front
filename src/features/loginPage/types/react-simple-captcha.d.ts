declare module 'react-simple-captcha' {
  export function loadCaptchaEnginge(length: number): void;
  export function validateCaptcha(input: string): boolean;
  export const LoadCanvasTemplate: React.FC;
  export const LoadCanvasTemplateNoReload: React.FC<{ reloadColor?: string }>;
}
