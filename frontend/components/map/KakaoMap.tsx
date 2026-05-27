'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: {
          center: unknown;
          level: number;
        }) => unknown;
        LatLng: new (lat: number, lng: number) => unknown;
        Marker: new (options: { position: unknown }) => {
          setMap: (map: unknown) => void;
        };
        InfoWindow: new (options: { content: string }) => {
          open: (map: unknown, marker: unknown) => void;
        };
        services: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (result: Array<{ y: string; x: string }>, status: string) => void
            ) => void;
          };
          Status: {
            OK: string;
          };
        };
      };
    };
  }
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const initMap = () => {
    console.log('[KakaoMap] initMap called');
    if (!mapRef.current) {
      console.log('[KakaoMap] mapRef.current is null');
      return;
    }
    if (!window.kakao?.maps) {
      console.log('[KakaoMap] window.kakao.maps is undefined');
      return;
    }

    const container = mapRef.current;

    try {
      console.log('[KakaoMap] Initializing LatLng...');
      // 주소 검색 API(Geocoder)를 거치지 않고, 100% 무조건 로드되도록 정확한 위경도 좌표로 즉각 지도를 생성합니다.
      const coords = new window.kakao.maps.LatLng(37.406486, 126.678294);

      const options = {
        center: coords,
        level: 3,
      };

      console.log('[KakaoMap] Creating Map object...');
      const map = new window.kakao.maps.Map(container, options);

      console.log('[KakaoMap] Creating Marker object...');
      // 결과값 위치에 마커를 표시합니다
      const marker = new window.kakao.maps.Marker({
        position: coords,
      });
      marker.setMap(map);

      console.log('[KakaoMap] Creating InfoWindow...');
      // 인포윈도우로 장소에 대한 설명을 표시합니다
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding:8px 12px; font-size:13px; font-family:sans-serif; color:#333; line-height:1.4; border-radius:4px; min-width:200px;">
            <strong>ShopMall 본사</strong><br/>
            <span style="font-size:11px; color:#666;">인천광역시 연수구 동춘동 원인재로 88</span>
          </div>
        `,
      });
      infowindow.open(map, marker);
      console.log('[KakaoMap] Map initialization complete!');
    } catch (error) {
      console.error('[KakaoMap] Failed to load Kakao Map', error);
      setMapError(error instanceof Error ? error.message : String(error));
    }
  };

  // 페이지 전환 등으로 이미 window.kakao가 메모리에 존재하는 경우 마운트 즉시 지도를 그립니다.
  useEffect(() => {
    console.log('[KakaoMap] Mounted, window.kakao status:', {
      kakao: !!window.kakao,
      maps: !!window.kakao?.maps,
    });
    if (window.kakao?.maps) {
      window.kakao.maps.load(() => {
        console.log('[KakaoMap] window.kakao.maps.load callback (useEffect)');
        initMap();
      });
    }
  }, []);

  // next/script가 성공적으로 SDK를 가져온 시점(onLoad)에 지도 로드 핸들러를 작동합니다.
  const handleScriptLoad = () => {
    console.log('[KakaoMap] Script onLoad fired, window.kakao status:', {
      kakao: !!window.kakao,
      maps: !!window.kakao?.maps,
    });
    if (window.kakao?.maps) {
      window.kakao.maps.load(() => {
        console.log('[KakaoMap] window.kakao.maps.load callback (handleScriptLoad)');
        initMap();
      });
    }
  };

  // 스크립트 로드가 실패했을 때(401, 403, 네트워크 장애 등) 에러를 처리하고 UI에 노출합니다.
  const handleScriptError = (e: unknown) => {
    console.error('[KakaoMap] Script load error:', e);
    setMapError(
      '카카오 지도 SDK 로드에 실패했습니다. Kakao Developers 콘솔에서 이 앱(jgh_shoppy)의 [지도/로컬] 서비스 사용 설정이 활성화(ON)되어 있는지 확인해 주세요.'
    );
  };

  // Docker 빌드 시점에 환경변수가 'dummy' 등의 문자열로 고정되어 주입되었을 경우를 완벽하게 방어합니다.
  let apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
  console.log('[KakaoMap] Raw NEXT_PUBLIC_KAKAO_MAP_API_KEY:', apiKey);
  if (!apiKey || apiKey === 'dummy' || apiKey === 'your_kakao_map_api_key' || apiKey.trim().length !== 32) {
    apiKey = 'b96c6141d2f29d0372af24cf6d7c15c2';
    console.log('[KakaoMap] API Key fell back to default:', apiKey);
  }

  return (
    <div className="w-full">
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
      {mapError ? (
        <div className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500 border border-gray-200 p-4 text-center">
          <div>
            <p className="font-bold text-red-500 mb-1">지도 로드 실패</p>
            <p className="text-xs text-gray-400">{mapError}</p>
          </div>
        </div>
      ) : (
        <div
          ref={mapRef}
          className="rounded-lg border border-gray-200 shadow-sm"
          style={{ width: '100%', height: '280px', backgroundColor: '#f3f4f6' }}
          aria-label="회사 위치 지도"
        />
      )}
    </div>
  );
}


