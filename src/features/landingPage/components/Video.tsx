import { forwardRef } from 'react';
import { VideoProps } from '../types/landing.types.ts';

const Video = forwardRef<HTMLVideoElement, VideoProps>(({ onVideoEnd, videoBoxRef }, ref) => {
  return (
    <div
      ref={videoBoxRef}
      className="w-full h-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 bg-white"
      style={{ clipPath: 'circle(0% at 50% 50%)' }}
    >
      <video
        ref={ref}
        src="/videos/hero-rabbit.mp4"
        muted
        loop={false}
        autoPlay={false}
        playsInline
        preload="metadata"
        poster="/images/landing/video/video-thumbnail.png"
        onEnded={onVideoEnd}
        className="w-full h-screen object-cover"
      />
    </div>
  );
});

export default Video;
