import { useRef, forwardRef, useImperativeHandle } from 'react';

type VideoSectionProps = {
  onVideoEnd: () => void;
};

const VideoSection = forwardRef<HTMLVideoElement, VideoSectionProps>(({ onVideoEnd }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // ref를 landingPage로 전달
  useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement);

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
});

export default VideoSection;
