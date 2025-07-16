import { useState } from 'react';
import StartCTASection from '../features/landingPage/StartCTASection';
import VideoSection from '../features/landingPage/VideoSection';

const LandingPage = () => {
  const [videoEnded, setVideoEnded] = useState(false);
  return (
    <div className="h-full">
      {videoEnded ? <StartCTASection /> : <VideoSection onVideoEnd={() => setVideoEnded(true)} />}
    </div>
  );
};

export default LandingPage;
