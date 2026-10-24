import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Compass, Star, Eye, Layers, CheckCircle2, Loader2, Search, Filter } from 'lucide-react';
import { placeService } from '../services/api';

// Các nguồn cung cấp Tile bản đồ tương thích 100% tại Việt Nam
const TILE_PROVIDERS = {
  googleRoadmap: {
    id: 'googleRoadmap',
    name: 'Google Maps (Đường phố)',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    options: {
      attribution: '&copy; Google Maps',
      maxZoom: 20,
      subdomains: ['0', '1', '2', '3']
    }
  },
  esriStreet: {
    id: 'esriStreet',
    name: 'Esri World Street',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    options: {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19
    }
  },
  googleSatellite: {
    id: 'googleSatellite',
    name: 'Google Vệ tinh',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    options: {
      attribution: '&copy; Google Maps Satellite',
      maxZoom: 20,
      subdomains: ['0', '1', '2', '3']
    }
  }
};

export default function MapView({ places = [], onSelectPlace, onAddToTrip }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const activeTileLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const radiusCircleRef = useRef(null);

  // Vị trí người dùng
  const [userLocation, setUserLocation] = useState({ lat: 10.7769, lng: 106.7009 });
  const [locationStatus, setLocationStatus] = useState('Đang tự động nhận diện vị trí GPS...');
  const [isLocating, setIsLocating] = useState(false);
  const [viewScope, setViewScope] = useState('all'); // 'all' (Tất cả 40+ địa điểm) hoặc 'nearby' (Gần tôi)
  const [searchRadius, setSearchRadius] = useState(5000); // 5km
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTileStyle, setActiveTileStyle] = useState('googleRoadmap');
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState(null);

  // 1. Khởi tạo Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [10.7769, 106.7009],
        zoom: 12,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile Google Maps mặc định
      const baseProvider = TILE_PROVIDERS.googleRoadmap;
      const tileLayer = L.tileLayer(baseProvider.url, baseProvider.options).addTo(map);
      activeTileLayerRef.current = tileLayer;

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Invalidate size để tile render mượt mà
      setTimeout(() => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 150);
      setTimeout(() => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 500);

      // Tự động nhận diện GPS
      autoDetectLocation(map);
    }

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Nhận diện vị trí người dùng
  const autoDetectLocation = (targetMap) => {
    const map = targetMap || mapInstanceRef.current;
    setIsLocating(true);
    setLocationStatus('Đang xác định tọa độ GPS...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const loc = { lat: latitude, lng: longitude };
          setUserLocation(loc);
          setLocationStatus('Đã nhận diện tọa độ GPS của bạn');
          setIsLocating(false);
          renderUserPin(map, loc);
        },
        () => {
          // Fallback mặc định Quận 1
          const defaultLoc = { lat: 10.7769, lng: 106.7009 };
          setUserLocation(defaultLoc);
          setLocationStatus('Vị trí trung tâm: Quận 1, TP.HCM');
          setIsLocating(false);
          renderUserPin(map, defaultLoc);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      const defaultLoc = { lat: 10.7769, lng: 106.7009 };
      setUserLocation(defaultLoc);
      setLocationStatus('Vị trí trung tâm: Quận 1, TP.HCM');
      setIsLocating(false);
      renderUserPin(map, defaultLoc);
    }
  };

  const renderUserPin = (map, loc) => {
    if (!map) return;
    const userIcon = L.divIcon({
      className: 'user-location-pin',
      html: `
        <div style="position:relative; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:34px; height:34px; border-radius:50%; background:rgba(2, 132, 199, 0.35); animation:pulse 2s infinite;"></div>
          <div style="width:16px; height:16px; border-radius:50%; background:#0284c7; border:3px solid #ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }
    const userMarker = L.marker([loc.lat, loc.lng], {
      icon: userIcon,
      draggable: false
    });

    userMarker.bindPopup(`
      <div style="padding:6px; font-family:var(--aj-font-family); font-size:12px; min-width:180px;">
        <strong style="color:#0284c7; font-size:13px;">📍 Vị trí hiện tại của bạn</strong><br/>
        <span style="color:#475569;">Tọa độ: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</span>
      </div>
    `);

    userMarker.addTo(map);
    userMarkerRef.current = userMarker;
  };

  // Tính khoảng cách Haversine giữa 2 tọa độ (mét)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 3. Lọc danh sách địa điểm theo Scope, Category và Keyword
  const displayedPlaces = useMemo(() => {
    return places.filter(place => {
      // Keyword
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchName = place.name?.toLowerCase().includes(kw);
        const matchAddr = place.address?.district?.toLowerCase().includes(kw) || place.address?.city?.toLowerCase().includes(kw);
        if (!matchName && !matchAddr) return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        const catName = place.categoryName || '';
        const catSlug = place.catSlug || '';
        if (catName !== selectedCategory && catSlug !== selectedCategory) return false;
      }

      // Scope: Nearby
      if (viewScope === 'nearby' && userLocation) {
        const coords = place.location?.coordinates;
        if (!coords || coords.length < 2) return false;
        const [pLng, pLat] = coords;
        const dist = calculateDistance(userLocation.lat, userLocation.lng, pLat, pLng);
        if (dist > searchRadius) return false;
      }

      return true;
    });
  }, [places, searchKeyword, selectedCategory, viewScope, userLocation, searchRadius]);

  // 4. Render Markers trên bản đồ mỗi khi displayedPlaces thay đổi
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Vòng tròn bán kính nếu ở chế độ Nearby
    if (radiusCircleRef.current) {
      map.removeLayer(radiusCircleRef.current);
      radiusCircleRef.current = null;
    }

    if (viewScope === 'nearby' && userLocation) {
      radiusCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
        radius: searchRadius,
        color: '#0284c7',
        fillColor: '#0284c7',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 4'
      }).addTo(map);
    }

    const bounds = L.latLngBounds([]);

    displayedPlaces.forEach(place => {
      const coords = place.location?.coordinates;
      if (!coords || coords.length < 2) return;

      const [pLng, pLat] = coords;
      bounds.extend([pLat, pLng]);

      const rating = place.ratingAverage || place.googleRating || 4.5;
      const isTop = rating >= 4.8;

      // Pin thiết kế theo hệ thống LonGo / Al Jazeera
      const placeIcon = L.divIcon({
        className: 'longo-map-pin',
        html: `
          <div style="
            background: ${isTop ? '#000000' : '#ffffff'};
            color: ${isTop ? '#ffffff' : '#000000'};
            border: 1.5px solid #000000;
            border-radius: 9999px;
            padding: 4px 10px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.18);
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            <span>📍 ${place.name.length > 20 ? place.name.slice(0, 20) + '...' : place.name}</span>
            <span style="color: ${isTop ? '#facc15' : '#ca8a04'}; font-weight: 800;">★ ${Number(rating).toFixed(1)}</span>
          </div>
        `,
        iconSize: [140, 26],
        iconAnchor: [70, 13]
      });

      const marker = L.marker([pLat, pLng], { icon: placeIcon });

      const popupDiv = document.createElement('div');
      popupDiv.style.width = '260px';
      popupDiv.style.fontFamily = 'inherit';
      popupDiv.innerHTML = `
        <div style="margin-bottom:8px; border-radius:6px; overflow:hidden; height:120px; background:#f1f5f9; position:relative;">
          <img src="${place.images?.[0]?.url || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'}" 
               style="width:100%; height:100%; object-fit:cover;" />
          <div style="position:absolute; top:6px; right:6px; background:#000000; color:#ffffff; font-size:10px; font-weight:800; padding:2px 6px; border-radius:4px;">
            ★ ${Number(rating).toFixed(1)}
          </div>
        </div>
        <div style="font-weight:800; font-size:13px; color:#000000; margin-bottom:4px; line-height:1.3;">
          ${place.name}
        </div>
        <div style="font-size:11px; color:#64748b; margin-bottom:6px;">
          📍 ${place.address?.street ? place.address.street + ', ' : ''}${place.address?.district || 'TP.HCM'}
        </div>
        ${place.openingHours ? `
          <div style="font-size:11px; color:#334155; margin-bottom:4px;">
            🕒 <strong>Giờ mở cửa:</strong> ${place.openingHours}
          </div>
        ` : ''}
        ${place.ticketPrice ? `
          <div style="font-size:11px; color:#334155; margin-bottom:8px;">
            🎟️ <strong>Giá vé:</strong> ${place.ticketPrice}
          </div>
        ` : ''}
        <div style="display:flex; gap:6px; margin-top:8px;">
          <button id="btn-detail-${place.id || place._id || place.slug}" style="
            flex:1; background:#000000; color:#ffffff; border:none; padding:7px 0; border-radius:9999px; font-size:11px; font-weight:700; cursor:pointer;
          ">
            Xem chi tiết & Đánh giá
          </button>
          <button id="btn-trip-${place.id || place._id || place.slug}" style="
            flex:1; background:#ffffff; color:#000000; border:1px solid #000000; padding:7px 0; border-radius:9999px; font-size:11px; font-weight:700; cursor:pointer;
          ">
            + Kế hoạch
          </button>
        </div>
      `;

      marker.bindPopup(popupDiv);
      marker.on('popupopen', () => {
        setSelectedPlaceInfo(place);
        const pKey = place.id || place._id || place.slug;
        const btnDetail = document.getElementById(`btn-detail-${pKey}`);
        if (btnDetail) {
          btnDetail.onclick = (e) => {
            e.stopPropagation();
            if (onSelectPlace) onSelectPlace(place);
          };
        }
        const btnTrip = document.getElementById(`btn-trip-${pKey}`);
        if (btnTrip) {
          btnTrip.onclick = (e) => {
            e.stopPropagation();
            if (onAddToTrip) onAddToTrip(place);
          };
        }
      });

      marker.addTo(markersLayer);
    });

    // Tự động căn khung hình nếu có địa điểm
    if (bounds.isValid() && displayedPlaces.length > 0) {
      if (viewScope === 'nearby') {
        map.setView([userLocation.lat, userLocation.lng], 13);
      } else if (displayedPlaces.length <= 3) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
      }
    }
  }, [displayedPlaces, viewScope, userLocation, searchRadius]);

  // Đổi kiểu hiển thị bản đồ
  const handleSwitchTileStyle = (styleKey) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const provider = TILE_PROVIDERS[styleKey];
    if (!provider) return;

    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(provider.url, provider.options).addTo(map);
    activeTileLayerRef.current = newTileLayer;
    setActiveTileStyle(styleKey);

    if (markersLayerRef.current) {
      markersLayerRef.current.bringToFront();
    }
  };

  const handleQuickJumpToCity = (coords, zoom = 13) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, zoom, { duration: 1.2 });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Thanh điều khiển tối giản LonGo (Al Jazeera Design) */}
      <div style={{
        background: 'var(--aj-surface, #ffffff)',
        border: '1px solid var(--aj-hairline, #e2e8f0)',
        borderRadius: 'var(--aj-rounded-md, 8px)',
        padding: '14px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}>
        {/* Nhóm chọn chế độ xem */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => {
              setViewScope('all');
              handleQuickJumpToCity([10.7769, 106.7009], 11);
            }}
            className={viewScope === 'all' ? 'aj-pill-active' : 'aj-pill-inactive'}
            style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Compass size={14} />
            Tất cả địa điểm ({places.length})
          </button>
          <button
            onClick={() => {
              setViewScope('nearby');
              handleQuickJumpToCity([userLocation.lat, userLocation.lng], 13);
            }}
            className={viewScope === 'nearby' ? 'aj-pill-active' : 'aj-pill-inactive'}
            style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Navigation size={14} />
            Gần vị trí của tôi
          </button>

          {viewScope === 'nearby' && (
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--aj-rounded-sm, 4px)',
                border: '1px solid var(--aj-hairline, #cbd5e1)',
                fontSize: 12,
                fontWeight: 600,
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <option value={3000}>Bán kính 3 km</option>
              <option value={5000}>Bán kính 5 km</option>
              <option value={10000}>Bán kính 10 km</option>
              <option value={20000}>Bán kính 20 km</option>
            </select>
          )}
        </div>

        {/* Nhóm tìm kiếm nhanh & Đổi Tile map */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 300px', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Tìm tên địa điểm, quận huyện..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                borderRadius: 'var(--aj-rounded-sm, 4px)',
                border: '1px solid var(--aj-hairline, #cbd5e1)',
                fontSize: 12
              }}
            />
          </div>

          <div style={{ display: 'flex', border: '1px solid var(--aj-hairline, #cbd5e1)', borderRadius: 'var(--aj-rounded-sm, 4px)', overflow: 'hidden' }}>
            <button
              onClick={() => handleSwitchTileStyle('googleRoadmap')}
              style={{
                padding: '6px 10px',
                border: 'none',
                background: activeTileStyle === 'googleRoadmap' ? '#000000' : '#ffffff',
                color: activeTileStyle === 'googleRoadmap' ? '#ffffff' : '#000000',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Đường phố
            </button>
            <button
              onClick={() => handleSwitchTileStyle('googleSatellite')}
              style={{
                padding: '6px 10px',
                border: 'none',
                borderLeft: '1px solid var(--aj-hairline, #cbd5e1)',
                background: activeTileStyle === 'googleSatellite' ? '#000000' : '#ffffff',
                color: activeTileStyle === 'googleSatellite' ? '#ffffff' : '#000000',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Vệ tinh
            </button>
          </div>
        </div>
      </div>

      {/* Bộ lọc nhanh theo Khu vực trọng điểm */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', whiteSpace: 'nowrap', marginRight: 4 }}>
          Khu vực:
        </span>
        <button
          onClick={() => handleQuickJumpToCity([10.7769, 106.7009], 13)}
          style={{ padding: '4px 10px', borderRadius: 9999, border: '1px solid #cbd5e1', background: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Quận 1 & Trung tâm
        </button>
        <button
          onClick={() => handleQuickJumpToCity([10.8711, 106.8406], 12)}
          style={{ padding: '4px 10px', borderRadius: 9999, border: '1px solid #cbd5e1', background: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          TP. Thủ Đức
        </button>
        <button
          onClick={() => handleQuickJumpToCity([11.1432, 106.4632], 11)}
          style={{ padding: '4px 10px', borderRadius: 9999, border: '1px solid #cbd5e1', background: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Củ Chi & Cần Giờ
        </button>
        <button
          onClick={() => handleQuickJumpToCity([10.3385, 107.0912], 12)}
          style={{ padding: '4px 10px', borderRadius: 9999, border: '1px solid #cbd5e1', background: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Vũng Tàu (Biển)
        </button>
        <button
          onClick={() => handleQuickJumpToCity([11.3789, 106.1712], 11)}
          style={{ padding: '4px 10px', borderRadius: 9999, border: '1px solid #cbd5e1', background: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Tây Ninh (Núi Bà Đen)
        </button>
        <button
          onClick={() => handleQuickJumpToCity([10.9805, 106.6521], 11)}
          style={{ padding: '4px 10px', borderRadius: 9999, border: '1px solid #cbd5e1', background: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Bình Dương & Đồng Nai
        </button>
        <button
          onClick={() => handleQuickJumpToCity([10.3625, 106.3754], 11)}
          style={{ padding: '4px 10px', borderRadius: 9999, border: '1px solid #cbd5e1', background: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Tiền Giang (Mỹ Tho)
        </button>
      </div>

      {/* Bản đồ Leaflet Container */}
      <div style={{ position: 'relative', width: '100%', height: '560px', borderRadius: 'var(--aj-rounded-md, 8px)', overflow: 'hidden', border: '1px solid var(--aj-hairline, #cbd5e1)' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Badge đếm số lượng địa điểm đang hiển thị */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 14,
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.85)',
          color: '#ffffff',
          padding: '6px 14px',
          borderRadius: 9999,
          fontSize: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          backdropFilter: 'blur(4px)'
        }}>
          <span>📍 Đang hiển thị: {displayedPlaces.length} địa điểm trên bản đồ</span>
        </div>

        {/* Trạng thái vị trí */}
        <div style={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#0f172a',
          padding: '5px 12px',
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 600,
          border: '1px solid #cbd5e1',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          {isLocating ? '⏳ ' + locationStatus : '✅ ' + locationStatus}
        </div>
      </div>
    </div>
  );
}
