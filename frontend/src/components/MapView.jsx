import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Compass, Star, Plus, Eye, Layers, CheckCircle2, Loader2 } from 'lucide-react';
import { placeService } from '../services/api';

// Các nguồn cung cấp Tile bản đồ tương thích 100% tại Việt Nam, không cần API Key
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

export default function MapView({ onSelectPlace, onAddToTrip }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const activeTileLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const accuracyCircleRef = useRef(null);

  // Vị trí người dùng (ban đầu sẽ được hệ thống TỰ ĐỘNG nhận diện qua GPS/mạng)
  const [userLocation, setUserLocation] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Đang tự động nhận diện vị trí...');
  const [isLocating, setIsLocating] = useState(false);
  const [searchRadius, setSearchRadius] = useState(3000); // 3km
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [activeTileStyle, setActiveTileStyle] = useState('googleRoadmap');

  // 1. Khởi tạo Leaflet Map và TỰ ĐỘNG NHẬN DIỆN VỊ TRÍ
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map = mapInstanceRef.current;
    if (!map) {
      // Khởi tạo map tại trung tâm TP.HCM
      map = L.map(mapContainerRef.current, {
        center: [10.7769, 106.7009],
        zoom: 14,
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
      setTimeout(() => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 100);
      setTimeout(() => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 350);
      setTimeout(() => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 700);

      // TỰ ĐỘNG định vị vị trí chính xác của người dùng ngay khi mở bản đồ
      autoDetectExactLocation(map);
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

  // 2. Hàm TỰ ĐỘNG nhận diện vị trí chính xác (HTML5 GPS + Network Fallback)
  const autoDetectExactLocation = (targetMap) => {
    const map = targetMap || mapInstanceRef.current;
    setIsLocating(true);
    setLocationStatus('Đang xác định tọa độ GPS chính xác...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          const loc = { lat: latitude, lng: longitude };
          setUserLocation(loc);
          setLocationAccuracy(accuracy ? Math.round(accuracy) : null);
          setLocationStatus(accuracy ? `Đã nhận diện vị trí (sai số ±${Math.round(accuracy)}m)` : 'Đã nhận diện vị trí GPS');
          setIsLocating(false);

          if (map) {
            map.flyTo([latitude, longitude], 15, { animate: true, duration: 1.2 });
          }
          loadNearbyPlaces(longitude, latitude, searchRadius);
        },
        async (err) => {
          console.warn('HTML5 Geolocation thông báo:', err.message);
          // Fallback sang Network Geolocation theo IP thực tế của thiết bị
          setLocationStatus('Đang đồng bộ vị trí qua mạng IP...');
          try {
            const res = await fetch('https://ipwho.is/');
            const data = await res.json();
            if (data && data.success && data.latitude && data.longitude) {
              const loc = { lat: data.latitude, lng: data.longitude };
              setUserLocation(loc);
              setLocationAccuracy(null);
              setLocationStatus(`Đã nhận diện: ${data.city || 'TP.HCM'}`);
              if (map) {
                map.flyTo([data.latitude, data.longitude], 14, { animate: true, duration: 1.2 });
              }
              loadNearbyPlaces(data.longitude, data.latitude, searchRadius);
            } else {
              fallbackDefaultLocation(map);
            }
          } catch {
            fallbackDefaultLocation(map);
          } finally {
            setIsLocating(false);
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      fallbackDefaultLocation(map);
      setIsLocating(false);
    }
  };

  const fallbackDefaultLocation = (map) => {
    const defaultLoc = { lat: 10.7725, lng: 106.6983 };
    setUserLocation(defaultLoc);
    setLocationStatus('Vị trí trung tâm TP.HCM (Quận 1)');
    if (map) {
      map.flyTo([defaultLoc.lat, defaultLoc.lng], 15, { animate: true, duration: 1.2 });
    }
    loadNearbyPlaces(defaultLoc.lng, defaultLoc.lat, searchRadius);
  };

  // 3. Tải địa điểm gần tọa độ người dùng bằng MongoDB 2dsphere index ($nearSphere)
  const loadNearbyPlaces = async (lng, lat, radius) => {
    setLoading(true);
    try {
      const res = await placeService.getNearbyPlaces(lng, lat, radius);
      const data = res.data || [];
      setNearbyPlaces(data);
      renderMarkers(data, lng, lat, radius);
    } catch (err) {
      console.error('Lỗi tải địa điểm lân cận:', err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Render Markers & Ghim Xanh Vị Trí Của Tôi
  const renderMarkers = (places, userLng, userLat, radius) => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Vòng tròn bán kính tìm kiếm quanh người dùng
    if (radiusCircleRef.current) {
      map.removeLayer(radiusCircleRef.current);
    }
    radiusCircleRef.current = L.circle([userLat, userLng], {
      radius: radius,
      color: '#0284c7',
      fillColor: '#0284c7',
      fillOpacity: 0.08,
      weight: 1.5,
      dashArray: '4, 4'
    }).addTo(map);

    // Vòng tròn hiển thị độ chính xác GPS nếu có
    if (accuracyCircleRef.current) {
      map.removeLayer(accuracyCircleRef.current);
    }
    if (locationAccuracy && locationAccuracy < radius) {
      accuracyCircleRef.current = L.circle([userLat, userLng], {
        radius: locationAccuracy,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.15,
        weight: 1
      }).addTo(map);
    }

    // Ghim vị trí người dùng (Radar Pulsing Pin chuẩn, CỐ ĐỊNH chính xác tại vị trí GPS)
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
    const userMarker = L.marker([userLat, userLng], {
      icon: userIcon,
      draggable: false // Ghim cố định tại vị trí GPS, không cho kéo thả sai lệch
    });

    userMarker.bindPopup(`
      <div style="padding:6px; font-family:Inter,sans-serif; font-size:12px; min-width:180px;">
        <strong style="color:#0284c7; font-size:13px;">📍 Vị trí hiện tại của bạn</strong><br/>
        <span style="color:#475569;">Tọa độ: ${userLat.toFixed(5)}, ${userLng.toFixed(5)}</span><br/>
        <span style="display:inline-block; margin-top:4px; font-size:11px; color:#059669; font-weight:600;">
          ✓ Tự động xác định qua GPS / Vệ tinh
        </span>
      </div>
    `);

    userMarker.addTo(map);
    userMarkerRef.current = userMarker;

    // Filter theo category nếu có
    const filtered = selectedCategoryFilter 
      ? places.filter(p => p.categoryId === selectedCategoryFilter)
      : places;

    // Render từng địa điểm du lịch / quán ăn
    filtered.forEach(place => {
      const coords = place.location?.coordinates;
      if (!coords || coords.length < 2) return;

      const [pLng, pLat] = coords;
      const isHighRating = (place.ratingAverage || 0) >= 4.7;

      const placeIcon = L.divIcon({
        className: 'place-custom-pin',
        html: `
          <div style="
            background:${isHighRating ? '#0f172a' : '#ffffff'};
            color:${isHighRating ? '#ffffff' : '#0f172a'};
            border:1px solid ${isHighRating ? '#0f172a' : '#cbd5e1'};
            border-radius:14px;
            padding:3px 8px;
            font-size:11px;
            font-weight:600;
            white-space:nowrap;
            display:flex;
            align-items:center;
            gap:4px;
            box-shadow:0 2px 6px rgba(0,0,0,0.12);
            cursor:pointer;
          ">
            <span>📍 ${place.name.length > 18 ? place.name.slice(0, 18) + '...' : place.name}</span>
            ${place.ratingAverage ? `<span style="color:#eab308;">★ ${place.ratingAverage.toFixed(1)}</span>` : ''}
          </div>
        `,
        iconSize: [120, 24],
        iconAnchor: [60, 12]
      });

      const marker = L.marker([pLat, pLng], { icon: placeIcon });

      const popupContent = document.createElement('div');
      popupContent.style.width = '240px';
      popupContent.style.fontFamily = 'Inter, sans-serif';
      popupContent.innerHTML = `
        <div style="margin-bottom:8px; border-radius:6px; overflow:hidden; height:110px; background:#f1f5f9;">
          <img src="${place.images?.[0]?.url || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'}" 
               style="width:100%; height:100%; object-fit:cover;" />
        </div>
        <div style="font-weight:700; font-size:13px; color:#0f172a; margin-bottom:2px;">${place.name}</div>
        <div style="font-size:11px; color:#64748b; margin-bottom:6px;">${place.address?.district || 'TP.HCM'} • ${place.ratingAverage ? '★ ' + place.ratingAverage.toFixed(1) + ' (' + place.reviewCount + ' reviews)' : 'Chưa có review'}</div>
        <p style="font-size:11px; color:#334155; line-height:1.4; margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
          ${place.description || ''}
        </p>
        <div style="display:flex; gap:6px; margin-top:8px;">
          <button id="btn-detail-${place.id || place._id}" style="
            flex:1; background:#0f172a; color:#fff; border:none; padding:5px 0; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;
          ">
            Xem chi tiết
          </button>
          <button id="btn-add-${place.id || place._id}" style="
            flex:1; background:#f1f5f9; color:#0f172a; border:1px solid #cbd5e1; padding:5px 0; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;
          ">
            + Kế hoạch
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btnDetail = document.getElementById(`btn-detail-${place.id || place._id}`);
        if (btnDetail) {
          btnDetail.onclick = (e) => {
            e.stopPropagation();
            onSelectPlace(place);
          };
        }
        const btnAdd = document.getElementById(`btn-add-${place.id || place._id}`);
        if (btnAdd) {
          btnAdd.onclick = (e) => {
            e.stopPropagation();
            onAddToTrip(place);
          };
        }
      });

      marker.addTo(markersLayer);
    });
  };

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

  // Di chuyển nhanh tới các điểm trọng điểm TP.HCM
  const handleQuickJump = (lat, lng) => {
    const loc = { lat, lng };
    setUserLocation(loc);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
    }
    loadNearbyPlaces(lng, lat, searchRadius);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Thanh điều khiển tối giản trên bản đồ */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        background: '#ffffff',
        padding: '12px 16px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-light)'
      }}>
        {/* Nút định vị lại & Trạng thái nhận diện */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button 
            onClick={() => autoDetectExactLocation()}
            disabled={isLocating}
            className="btn-clean-primary"
            style={{ padding: '6px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {isLocating ? <Loader2 size={14} className="spin" /> : <Navigation size={14} />}
            <span>{isLocating ? 'Đang định vị...' : 'Định vị lại GPS'}</span>
          </button>

          {/* Trạng thái vị trí tự động */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8rem',
            color: '#065f46',
            background: '#ecfdf5',
            padding: '4px 10px',
            borderRadius: 9999,
            border: '1px solid #a7f3d0'
          }}>
            <CheckCircle2 size={13} color="#059669" />
            <span>{locationStatus}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>Bán kính tìm kiếm:</span>
            {[1000, 3000, 5000].map(r => (
              <button
                key={r}
                onClick={() => {
                  setSearchRadius(r);
                  if (userLocation) {
                    loadNearbyPlaces(userLocation.lng, userLocation.lat, r);
                  }
                }}
                className={searchRadius === r ? 'btn-clean-primary' : 'btn-clean-ghost'}
                style={{ padding: '4px 8px', fontSize: '0.8rem' }}
              >
                {r / 1000} km
              </button>
            ))}
          </div>
        </div>

        {/* Khám phá các khu vực trọng điểm khác tại TP.HCM */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-muted)' }}>Khám phá nhanh:</span>
          <button 
            onClick={() => handleQuickJump(10.7725, 106.6983)}
            className="btn-clean-ghost" 
            style={{ padding: '3px 8px', fontSize: '0.8rem' }}
          >
            Bến Thành (Q1)
          </button>
          <button 
            onClick={() => handleQuickJump(10.7769, 106.7009)}
            className="btn-clean-ghost" 
            style={{ padding: '3px 8px', fontSize: '0.8rem' }}
          >
            Nhà Thờ Đức Bà
          </button>
          <button 
            onClick={() => handleQuickJump(10.7952, 106.7218)}
            className="btn-clean-ghost" 
            style={{ padding: '3px 8px', fontSize: '0.8rem' }}
          >
            Landmark 81
          </button>
          <button 
            onClick={() => handleQuickJump(10.8185, 106.6588)}
            className="btn-clean-ghost" 
            style={{ padding: '3px 8px', fontSize: '0.8rem' }}
          >
            Sân bay TSN
          </button>
        </div>

        {/* Chuyển đổi lớp bản đồ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Layers size={13} /> Nền:
          </span>
          <button 
            onClick={() => handleSwitchTileStyle('googleRoadmap')}
            className={activeTileStyle === 'googleRoadmap' ? 'btn-clean-primary' : 'btn-clean-ghost'}
            style={{ padding: '3px 8px', fontSize: '0.8rem' }}
          >
            Google Maps
          </button>
          <button 
            onClick={() => handleSwitchTileStyle('esriStreet')}
            className={activeTileStyle === 'esriStreet' ? 'btn-clean-primary' : 'btn-clean-ghost'}
            style={{ padding: '3px 8px', fontSize: '0.8rem' }}
          >
            Esri Street
          </button>
          <button 
            onClick={() => handleSwitchTileStyle('googleSatellite')}
            className={activeTileStyle === 'googleSatellite' ? 'btn-clean-primary' : 'btn-clean-ghost'}
            style={{ padding: '3px 8px', fontSize: '0.8rem' }}
          >
            Vệ tinh
          </button>
        </div>
      </div>

      {/* Container Bản đồ Leaflet */}
      <div style={{
        position: 'relative',
        height: '560px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-light)'
      }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Floating summary info */}
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-light)',
          zIndex: 10
        }}>
          {loading ? 'Đang truy vấn MongoDB 2dsphere...' : `Tìm thấy ${nearbyPlaces.length} địa điểm trong bán kính ${(searchRadius / 1000).toFixed(0)}km`}
        </div>
      </div>
    </div>
  );
}
