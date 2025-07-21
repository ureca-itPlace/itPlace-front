import React from 'react';
import SearchInMapButton from './SearchInMapButton';
import CurrentLocationButton from './CurrentLocationButton';

interface MapControlsProps {
  onLocationMove: (latitude: number, longitude: number) => void;
  onMapCenterMove?: (latitude: number, longitude: number) => void;
  onSearchInMap?: () => void;
  showSearchButton?: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  onLocationMove,
  onMapCenterMove,
  onSearchInMap,
  showSearchButton = false,
}) => {
  return (
    <>
      {/* 현재 지도에서 검색 버튼 */}
      {showSearchButton && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <SearchInMapButton onClick={onSearchInMap} />
          </div>
        </div>
      )}

      {/* 현재 위치로 이동 버튼 */}
      <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <CurrentLocationButton
            onLocationMove={onLocationMove}
            onMapCenterMove={onMapCenterMove}
          />
        </div>
      </div>
    </>
  );
};

export default MapControls;
