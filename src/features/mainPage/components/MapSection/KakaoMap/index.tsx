import React, { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { Platform, MapLocation } from '../../../types';
import CustomMarker from './CustomMarker';

interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoMap {
  getLevel(): number;
  setCenter(latlng: KakaoLatLng): void;
  getCenter(): KakaoLatLng;
  relayout(): void;
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
}

interface KakaoMarkerClusterer {
  clear(): void;
  addMarkers(markers: KakaoMarker[]): void;
  setMinClusterSize(size: number): void;
}

interface KakaoCustomOverlay {
  setContent(content: HTMLElement): void;
  setMap(map: KakaoMap | null): void;
}

interface KakaoInfoWindow {
  open(map: KakaoMap, marker: KakaoMarker): void;
}

interface KakaoMaps {
  maps: {
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
    Marker: new (options: { position: KakaoLatLng; map?: KakaoMap }) => KakaoMarker;
    MarkerClusterer?: new (options: {
      map: KakaoMap;
      averageCenter: boolean;
      minLevel: number;
      disableClickZoom: boolean;
      styles: Array<{
        width: string;
        height: string;
        background: string;
        borderRadius: string;
        color: string;
        textAlign: string;
        lineHeight: string;
        fontSize: string;
        fontWeight: string;
      }>;
    }) => KakaoMarkerClusterer;
    CustomOverlay: new (options: {
      position: KakaoLatLng;
      content: string;
      yAnchor: number;
      zIndex?: number;
    }) => KakaoCustomOverlay;
    InfoWindow: new (options: { content: string }) => KakaoInfoWindow;
    event: {
      addListener(target: KakaoMap | KakaoMarker, type: string, handler: () => void): void;
    };
  };
}

declare global {
  interface Window {
    kakao: KakaoMaps;
  }
}

interface KakaoMapProps {
  platforms: Platform[];
  selectedPlatform?: Platform | null;
  onPlatformSelect: (platform: Platform) => void;
  onLocationChange?: (location: MapLocation) => void;
  onMapCenterChange?: (location: MapLocation) => void;
  centerLocation?: { latitude: number; longitude: number } | null;
  onMapLevelChange?: (mapLevel: number) => void;
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  platforms,
  selectedPlatform,
  onPlatformSelect,
  onLocationChange,
  onMapCenterChange,
  centerLocation,
  onMapLevelChange,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoCustomOverlay[]>([]);
  const clustererRef = useRef<KakaoMarkerClusterer | null>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);
  const [currentZoomLevel, setCurrentZoomLevel] = useState<number>(5);
  const [isMapInitialized, setIsMapInitialized] = useState<boolean>(false);

  // 사용자 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(location);
          onLocationChange?.(location);
        },
        () => {
          // 기본 위치 (서울시청)
          const defaultLocation = { latitude: 37.5665, longitude: 126.978 };
          setUserLocation(defaultLocation);
          onLocationChange?.(defaultLocation);
        }
      );
    }
  }, [onLocationChange]);

  // 카카오맵 초기화
  useEffect(() => {
    if (!userLocation || !mapContainer.current || isMapInitialized) return;

    const initializeMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        return;
      }

      // 컨테이너 크기가 확정될 때까지 대기
      const containerWidth = mapContainer.current?.offsetWidth;
      const containerHeight = mapContainer.current?.offsetHeight;

      if (!containerWidth || !containerHeight) {
        setTimeout(initializeMap, 100);
        return;
      }

      const options = {
        center: new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude),
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapContainer.current!, options);
      mapRef.current = map;

      // 클러스터러 초기화
      if (window.kakao.maps.MarkerClusterer) {
        const clusterer = new window.kakao.maps.MarkerClusterer({
          map: map,
          averageCenter: true,
          minLevel: 7, // 줌 레벨 7 이하에서만 클러스터링 적용 (축소된 상태)
          disableClickZoom: false,
          styles: [
            {
              // 1-9개 마커 (작은 크기)
              width: '40px',
              height: '40px',
              background: 'rgba(118, 56, 250, 0.8)',
              borderRadius: '20px',
              color: '#fff',
              textAlign: 'center',
              lineHeight: '40px',
              fontSize: '12px',
              fontWeight: 'bold',
            },
            {
              // 50-60개 마커 (중간 크기)
              width: '50px',
              height: '50px',
              background: 'rgba(118, 56, 250, 0.8)',
              borderRadius: '25px',
              color: '#fff',
              textAlign: 'center',
              lineHeight: '50px',
              fontSize: '14px',
              fontWeight: 'bold',
            },
            {
              // 60개 이상 마커 (큰 크기)
              width: '70px',
              height: '70px',
              background: 'rgba(118, 56, 250, 0.8)',
              borderRadius: '30px',
              color: '#fff',
              textAlign: 'center',
              lineHeight: '60px',
              fontSize: '16px',
              fontWeight: 'bold',
            },
            {
              // 100개 이상 마커 (큰 크기)
              width: '90px',
              height: '90px',
              background: 'rgba(118, 56, 250, 0.8)',
              borderRadius: '30px',
              color: '#fff',
              textAlign: 'center',
              lineHeight: '60px',
              fontSize: '16px',
              fontWeight: 'bold',
            },
          ],
        });

        // minClusterSize 설정 (1개부터 클러스터링)
        clusterer.setMinClusterSize(1);
        clustererRef.current = clusterer;
      }

      // 줌 변경 이벤트 리스너
      window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
        const level = map.getLevel();
        setCurrentZoomLevel(level);
        // 부모 컴포넌트에 맵 레벨 변경 알림
        onMapLevelChange?.(level);
      });

      // 지도 드래그 시작 이벤트 (즉시 버튼 표시용)
      window.kakao.maps.event.addListener(map, 'dragstart', () => {
        if (onMapCenterChange) {
          const center = map.getCenter();
          const centerLocation: MapLocation = {
            latitude: center.getLat(),
            longitude: center.getLng(),
          };
          onMapCenterChange(centerLocation);
        }
      });

      // 지도 드래그 종료 이벤트 리스너 추가 (디바운싱 적용)
      window.kakao.maps.event.addListener(map, 'dragend', () => {
        if (onMapCenterChange) {
          // 기존 타이머가 있으면 취소
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }

          // 500ms 후에 실행 (디바운싱)
          debounceTimerRef.current = setTimeout(() => {
            const center = map.getCenter();
            const centerLocation: MapLocation = {
              latitude: center.getLat(),
              longitude: center.getLng(),
            };
            onMapCenterChange(centerLocation);
          }, 500);
        }
      });

      // 지도 초기화 완료 표시
      setIsMapInitialized(true);

      // 초기화 후 크기 재조정
      setTimeout(() => {
        if (map && map.relayout) {
          map.relayout();
        }
      }, 100);
    };

    // 카카오맵 API가 이미 로드되어 있으면 바로 초기화
    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      // 카카오맵 API 로드 대기
      const checkKakaoMaps = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakaoMaps);
          initializeMap();
        }
      }, 100);

      return () => clearInterval(checkKakaoMaps);
    }
  }, [userLocation, onMapCenterChange, onMapLevelChange, isMapInitialized]);

  // 플랫폼 마커 표시
  useEffect(() => {
    if (!mapRef.current) return;

    // 기존 마커 제거
    if (clustererRef.current) {
      clustererRef.current.clear();
    }
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 플랫폼이 없으면 마커 표시 안함
    if (!platforms.length) {
      return;
    }

    const newMarkers: KakaoMarker[] = [];

    // 클러스터링 활성화 여부 확인
    const isClusteringActive = currentZoomLevel >= 7 && clustererRef.current;

    platforms.forEach((platform) => {
      // 좌표가 없는 가맹점은 마커 표시 안함
      if (
        !platform.latitude ||
        !platform.longitude ||
        platform.latitude === 0 ||
        platform.longitude === 0
      ) {
        return;
      }

      const markerPosition = new window.kakao.maps.LatLng(platform.latitude, platform.longitude);

      // 줌 레벨에 따라 클러스터링 또는 개별 표시
      if (isClusteringActive) {
        // 클러스터링용 일반 마커 생성 (지도에 표시하지 않음)
        const clusterMarker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        // 클러스터 마커 클릭 이벤트
        window.kakao.maps.event.addListener(clusterMarker, 'click', () => {
          onPlatformSelect(platform);
        });

        newMarkers.push(clusterMarker);
      } else {
        // 개별 커스텀 마커만 표시 (클러스터링 비활성화 시에만)
        const isSelected = selectedPlatform?.id === platform.id;

        // React 컴포넌트를 HTML로 렌더링
        const markerHTML = renderToString(
          <CustomMarker imageUrl={platform.imageUrl} name={platform.name} isSelected={isSelected} />
        );

        // 개별 커스텀 마커 표시
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: markerHTML,
          yAnchor: 1, // 삼각형 끝부분이 좌표 위치가 되도록
          zIndex: isSelected ? 1000 : 1, // 선택된 마커가 가장 위에
        });

        // 마커 클릭 이벤트 (HTML 요소에 직접 이벤트 추가)
        const markerElement = document.createElement('div');
        markerElement.innerHTML = markerHTML;
        markerElement.addEventListener('click', () => {
          onPlatformSelect(platform);
        });

        customOverlay.setContent(markerElement);
        customOverlay.setMap(mapRef.current);
        markersRef.current.push(customOverlay);
      }
    });

    // 클러스터링 적용
    if (currentZoomLevel >= 7 && clustererRef.current && newMarkers.length > 0) {
      clustererRef.current.addMarkers(newMarkers);
    }
  }, [platforms, onPlatformSelect, selectedPlatform, currentZoomLevel]);

  // 선택된 플랫폼으로 지도 중심 이동
  useEffect(() => {
    if (!mapRef.current || !selectedPlatform) return;

    const moveLatLon = new window.kakao.maps.LatLng(
      selectedPlatform.latitude,
      selectedPlatform.longitude
    );
    mapRef.current.setCenter(moveLatLon);
  }, [selectedPlatform]);

  // centerLocation prop이 변경되면 지도 중심 이동
  useEffect(() => {
    if (!mapRef.current || !centerLocation) return;

    const moveLatLon = new window.kakao.maps.LatLng(
      centerLocation.latitude,
      centerLocation.longitude
    );
    mapRef.current.setCenter(moveLatLon);
  }, [centerLocation]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-[18px]" style={{}} />
    </div>
  );
};

export default KakaoMap;
