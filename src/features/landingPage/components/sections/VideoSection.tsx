import { forwardRef } from 'react';
import { VideoSectionProps } from '../../types/landing.types.ts';

const VideoSection = forwardRef<HTMLVideoElement, VideoSectionProps>(
  ({ onVideoEnd, videoBoxRef }, ref) => {
    return (
      <section className="w-full h-screen overflow-hidden absolute z-30 flex items-center justify-center">
        <div
          ref={videoBoxRef}
          className="w-full h-screen absolute flex items-center justify-center"
          style={{ clipPath: 'circle(0% at 50% 50%)' }}
        >
          <video
            ref={ref}
            src="/videos/hero-rabbit.mp4"
            muted
            loop={false}
            autoPlay={false}
            playsInline
            onEnded={onVideoEnd}
            className="w-full h-screen inset-0 object-cover"
          />
        </div>
      </section>
    );
  }
);

export default VideoSection;
