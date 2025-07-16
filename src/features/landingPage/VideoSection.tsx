import { useEffect, useRef } from 'react';

type VideoSectionProps = {
  onVideoEnd: () => void;
  shouldPlay: boolean;
};

const VideoSection = ({ onVideoEnd, shouldPlay }: VideoSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (shouldPlay && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error('비디오 재생 실패:', err);
      });
    }
  }, [shouldPlay]);

  return (
    <div className="w-full h-screen overflow-hidden z-40">
      <video
        ref={videoRef}
        src="/videos/hero-rabbit.mp4"
        muted
        playsInline
        onEnded={onVideoEnd}
        className="object-cover w-full h-full"
      />
    </div>
  );
};

export default VideoSection;
