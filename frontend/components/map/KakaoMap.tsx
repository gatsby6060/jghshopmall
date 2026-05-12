'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: {
          center: { lat: number; lng: number };
          level: number;
        }) => unknown;
        LatLng: new (lat: number, lng: number) => { lat: number; lng: number };
        Marker: new (options: { position: unknown }) => {
          setMap: (map: unknown) => void;
        };
        InfoWindow: new (options: { content: string }) => {
          open: (map: unknown, marker: unknown) => void;
        };
      };
    };
  }
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.kakao?.maps) return;

      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(37.5012743, 127.0396548),
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);
      const markerPosition = new window.kakao.maps.LatLng(37.5012743, 127.0396548);
      const marker = new window.kakao.maps.Marker({ position: markerPosition });
      marker.setMap(map);

      const infowindow = new window.kakao.maps.InfoWindow({
        content: '<div style="padding:5px;font-size:12px;">ShopMall 본사<br>서울시 강남구 테헤란로 123</div>',
      });
      infowindow.open(map, marker);
    };

    if (window.kakao?.maps) {
      window.kakao.maps.load(initMap);
    } else {
      // SDK가 로드될 때까지 대기
      const checkKakao = setInterval(() => {
        if (window.kakao?.maps) {
          clearInterval(checkKakao);
          window.kakao.maps.load(initMap);
        }
      }, 500);

      return () => clearInterval(checkKakao);
    }
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 rounded-lg bg-gray-200"
      aria-label="회사 위치 지도"
    />
  );
}
