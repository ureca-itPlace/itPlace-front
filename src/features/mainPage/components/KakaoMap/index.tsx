import React, { useEffect, useRef, useState } from 'react';
import { Platform, MapLocation } from '../../types';
import { createCustomMarkerHTML } from './markerUtils';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  platforms: Platform[];
  selectedPlatform?: Platform | null;
  onPlatformSelect: (platform: Platform) => void;
  onLocationChange?: (location: MapLocation) => void;
  onMapCenterChange?: (location: MapLocation) => void;
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  platforms,
  selectedPlatform,
  onPlatformSelect,
  onLocationChange,
  onMapCenterChange,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const clustererRef = useRef<any>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);
  const [currentZoomLevel, setCurrentZoomLevel] = useState<number>(5);

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
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
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
    if (!userLocation || !mapContainer.current) return;

    const initializeMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error('카카오맵 API가 로드되지 않았습니다.');
        return;
      }

      const options = {
        center: new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude),
        level: 5,
      };

      const map = new window.kakao.maps.Map(mapContainer.current, options);
      mapRef.current = map;

      // 클러스터러 초기화
      if (window.kakao.maps.MarkerClusterer) {
        const clusterer = new window.kakao.maps.MarkerClusterer({
          map: map,
          averageCenter: true,
          minLevel: 8, // 줌 레벨 8 이상에서 클러스터링 해제
          disableClickZoom: false,
          styles: [
            {
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
          ],
        });
        clustererRef.current = clusterer;
      }

      // 줌 변경 이벤트 리스너
      window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
        const level = map.getLevel();
        setCurrentZoomLevel(level);
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

      // 사용자 위치 마커
      const userMarkerPosition = new window.kakao.maps.LatLng(
        userLocation.latitude,
        userLocation.longitude
      );

      const userMarker = new window.kakao.maps.Marker({
        position: userMarkerPosition,
        map: map,
      });

      // 사용자 위치 정보창
      const userInfoWindow = new window.kakao.maps.InfoWindow({
        content: '<div style="padding:5px;">현재 위치</div>',
      });
      userInfoWindow.open(map, userMarker);
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
  }, [userLocation]);

  // 플랫폼 마커 표시
  useEffect(() => {
    if (!mapRef.current || !platforms.length) return;

    // 기존 마커 제거
    if (clustererRef.current) {
      clustererRef.current.clear();
    }
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const newMarkers: any[] = [];

    platforms.forEach((platform) => {
      // 좌표가 없는 가맹점은 마커 표시 안함
      if (
        !platform.latitude ||
        !platform.longitude ||
        platform.latitude === 0 ||
        platform.longitude === 0
      ) {
        console.log(`마커 제외 (좌표 없음): ${platform.name}`);
        return;
      }

      console.log(
        `마커 생성: ${platform.name} - 위도: ${platform.latitude}, 경도: ${platform.longitude}`
      );
      const markerPosition = new window.kakao.maps.LatLng(platform.latitude, platform.longitude);
      const isSelected = selectedPlatform?.id === platform.id;

      // 커스텀 마커 HTML 생성
      const markerHTML = createCustomMarkerHTML(platform.imageUrl, platform.name, isSelected);

      // 커스텀 오버레이로 마커 생성
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: markerPosition,
        content: markerHTML,
        yAnchor: 1, // 삼각형 끝부분이 좌표 위치가 되도록
      });

      // 마커 클릭 이벤트 (HTML 요소에 직접 이벤트 추가)
      const markerElement = document.createElement('div');
      markerElement.innerHTML = markerHTML;
      markerElement.addEventListener('click', () => {
        onPlatformSelect(platform);
      });

      customOverlay.setContent(markerElement);

      // 줌 레벨에 따라 클러스터링 또는 개별 표시
      if (currentZoomLevel <= 7 && clustererRef.current) {
        // 클러스터링용 일반 마커 생성
        const clusterMarker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        // 클러스터 마커 클릭 이벤트
        window.kakao.maps.event.addListener(clusterMarker, 'click', () => {
          onPlatformSelect(platform);
        });

        newMarkers.push(clusterMarker);
      } else {
        // 개별 커스텀 마커 표시
        customOverlay.setMap(mapRef.current);
        markersRef.current.push(customOverlay);
      }
    });

    // 클러스터링 적용
    if (currentZoomLevel <= 7 && clustererRef.current && newMarkers.length > 0) {
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

  return (
    <div
      ref={mapContainer}
      className="overflow-hidden w-[1385px] h-[891px] rounded-[18px] min-h-[891px]"
    />
  );
};

export default KakaoMap;
