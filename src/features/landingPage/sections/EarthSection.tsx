import CanvasContainer from '../components/CanvasContainer';
import CustomCursor from '../components/CustomCursor';

const EarthSection = ({ onLoaded }: { onLoaded: () => void }) => {
  return (
    <div data-theme="dark" className="earth-section relative h-[100vh]">
      <div className="sticky top-0 h-full w-full bg-white">
        <CanvasContainer onLoaded={onLoaded} />
        <CustomCursor />
      </div>
    </div>
  );
};

export default EarthSection;
