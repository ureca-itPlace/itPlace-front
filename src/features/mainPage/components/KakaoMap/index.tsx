import React, { useEffect, useRef, useState } from 'react';
import { Platform, MapLocation } from '../../types';

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
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);

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
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    platforms.forEach((platform) => {
      const markerPosition = new window.kakao.maps.LatLng(platform.latitude, platform.longitude);

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: mapRef.current,
      });

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding:10px; min-width:200px;">
            <h4 style="margin:0 0 5px 0; font-weight:bold;">${platform.name}</h4>
            <p style="margin:0; color:#666; font-size:12px;">${platform.category}</p>
            <p style="margin:5px 0 0 0; color:#333; font-size:11px;">${platform.address}</p>
          </div>
        `,
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(mapRef.current, marker);
        onPlatformSelect(platform);
      });

      markersRef.current.push(marker);
    });
  }, [platforms, onPlatformSelect]);

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
