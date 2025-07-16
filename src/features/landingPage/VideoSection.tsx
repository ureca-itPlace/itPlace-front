type VideoSectionProps = {
  onVideoEnd: () => void;
};

const VideoSection = ({ onVideoEnd }: VideoSectionProps) => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <video
        src="/videos/hero-rabbit.mp4"
        muted
        autoPlay
        playsInline
        onEnded={onVideoEnd}
        className="object-cover w-full h-full"
      />
    </div>
  );
};

export default VideoSection;
