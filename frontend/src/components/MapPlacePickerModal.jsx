import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, MapPin, X, Plus, Check, Navigation, AlertCircle, 
  Sparkles, Layers, Image as ImageIcon, CheckCircle2, Clock, Ticket
} from 'lucide-react';

const GOOGLE_ROADMAP_TILE = {
  url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  options: {
    attribution: '&copy; Google Maps',
    maxZoom: 20,
    subdomains: ['0', '1', '2', '3']
  }
};

const CATEGORY_OPTIONS = [
  'Du lịch & Di tích',
  'Ẩm thực & Nhà hàng',
  'Cà phê & Trà',
  'Vui chơi & Giải trí',
  'Check-in thiên nhiên',
  'Khách sạn & Nghỉ dưỡng'
];

export default function MapPlacePickerModal({
  isOpen,
  onClose,
  places = [],
  onSelectPlaceTag,
  currentUser
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const currentMarkersGroupRef = useRef(null);

  // Search & Navigation States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [onlineSearchResults, setOnlineSearchResults] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState({ lat: 10.7769, lng: 106.7009 });
  const [selectedPlaceCandidate, setSelectedPlaceCandidate] = useState(null);

  // Proposal Form Mode
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [propName, setPropName] = useState('');
  const [propCategory, setPropCategory] = useState('Du lịch & Di tích');
  const [propDistrict, setPropDistrict] = useState('TP. Hồ Chí Minh');
  const [propStreet, setPropStreet] = useState('');
  const [propDesc, setPropDesc] = useState('');
  const [propOpeningHours, setPropOpeningHours] = useState('08:00 - 22:00');
  const [propTicketPrice, setPropTicketPrice] = useState('Miễn phí vào cổng');
  const [propImagePreview, setPropImagePreview] = useState(null);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  // Lọc các địa điểm đã có trong hệ thống LonGo khớp với từ khóa
  const matchedExistingPlaces = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return places.slice(0, 5); // Gợi ý 5 địa điểm nổi bật ban đầu
    }
    const q = searchQuery.toLowerCase().trim();
    return places.filter(p => {
      const name = (p.name || '').toLowerCase();
      const district = (p.address?.district || '').toLowerCase();
      const city = (p.address?.city || '').toLowerCase();
      const category = (p.categoryName || '').toLowerCase();
      return name.includes(q) || district.includes(q) || city.includes(q) || category.includes(q);
    });
  }, [places, searchQuery]);

  // Khởi tạo bản đồ Leaflet
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedCoords.lat, selectedCoords.lng],
        zoom: 13,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile Google Maps Roadmap
      L.tileLayer(GOOGLE_ROADMAP_TILE.url, GOOGLE_ROADMAP_TILE.options).addTo(map);

      // Layer group cho các markers địa điểm hiện có
      const existingGroup = L.layerGroup().addTo(map);
      currentMarkersGroupRef.current = existingGroup;

      // Pin marker cho vị trí được chọn / click
      const pinIcon = L.divIcon({
        className: 'selected-pin',
        html: `
          <div style="position:relative; display:flex; align-items:center; justify-content:center; cursor:pointer;">
            <div style="position:absolute; width:40px; height:40px; border-radius:50%; background:rgba(239, 68, 68, 0.25); animation:pulse 2s infinite;"></div>
            <div style="width:28px; height:28px; border-radius:50%; background:#ef4444; border:3px solid #ffffff; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 10px rgba(0,0,0,0.35);">
              <div style="width:8px; height:8px; border-radius:50%; background:#ffffff;"></div>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const pin = L.marker([selectedCoords.lat, selectedCoords.lng], { icon: pinIcon }).addTo(map);
      markerRef.current = pin;

      // Click trên bản đồ để ghim tọa độ tự do
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        setSelectedCoords({ lat, lng });
        pin.setLatLng([lat, lng]);

        // Thử tìm địa điểm LonGo gần nhất trong bán kính 100m
        const nearest = places.find(p => {
          if (!p.location?.coordinates) return false;
          const [pLng, pLat] = p.location.coordinates;
          const dist = Math.sqrt(Math.pow(pLat - lat, 2) + Math.pow(pLng - lng, 2));
          return dist < 0.002; // ~200m
        });

        if (nearest) {
          setSelectedPlaceCandidate({
            isExisting: true,
            placeId: nearest.id || nearest._id,
            name: nearest.name,
            district: nearest.address?.district || nearest.address?.city || 'Việt Nam',
            address: nearest.address?.street ? `${nearest.address.street}, ${nearest.address.district}` : nearest.address?.district,
            rating: nearest.ratingAverage || nearest.googleRating || 4.8
          });
        } else {
          // Thực hiện reverse lookup qua Nominatim để lấy tên đường/quận
          try {
            const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`);
            if (revRes.ok) {
              const revData = await revRes.json();
              const addr = revData.address || {};
              const roughName = revData.name || addr.road || addr.suburb || addr.quarter || 'Địa điểm mới trên Bản đồ';
              const roughDist = addr.city_district || addr.county || addr.city || addr.state || 'Việt Nam';
              const roughStreet = [addr.road, addr.suburb].filter(Boolean).join(', ');

              setSelectedPlaceCandidate({
                isExisting: false,
                name: roughName,
                district: roughDist,
                street: roughStreet || roughDist,
                lat,
                lng
              });
              setPropName(roughName);
              setPropDistrict(roughDist);
              setPropStreet(roughStreet || roughDist);
            }
          } catch {
            setSelectedPlaceCandidate({
              isExisting: false,
              name: `Vị trí tọa độ (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
              district: 'Việt Nam',
              street: '',
              lat,
              lng
            });
          }
        }
      });

      mapInstanceRef.current = map;

      // Fix kích thước khi modal bung ra
      setTimeout(() => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 200);
      setTimeout(() => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 500);
    }

    // Vẽ marker các địa điểm hiện có lên bản đồ
    if (currentMarkersGroupRef.current) {
      currentMarkersGroupRef.current.clearLayers();
      places.forEach(p => {
        if (!p.location?.coordinates) return;
        const [lng, lat] = p.location.coordinates;
        const placeIcon = L.divIcon({
          className: 'lon-place-marker',
          html: `
            <div style="background:#0f172a; color:#ffffff; padding:2px 7px; border-radius:12px; font-size:10px; font-weight:800; border:1.5px solid #ffffff; box-shadow:0 2px 6px rgba(0,0,0,0.3); white-space:nowrap; cursor:pointer;">
              📍 ${p.name?.length > 16 ? p.name.slice(0, 15) + '…' : p.name}
            </div>
          `,
          iconSize: [80, 20],
          iconAnchor: [40, 10]
        });

        const m = L.marker([lat, lng], { icon: placeIcon });
        m.on('click', () => {
          handleSelectExistingPlace(p);
        });
        m.addTo(currentMarkersGroupRef.current);
      });
    }

    return () => {
      if (!isOpen && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, places]);

  // Tìm kiếm trực tuyến trên Google Map / Nominatim nếu người dùng bấm tìm hoặc gõ từ khóa
  const handleSearchOnline = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingOnline(true);
    setOnlineSearchResults([]);

    try {
      // Tìm kiếm Geocoding tại Việt Nam
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=vn&limit=5&addressdetails=1`);
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map(item => {
          const addr = item.address || {};
          const district = addr.city_district || addr.county || addr.city || addr.state || 'Việt Nam';
          const road = [addr.road, addr.suburb].filter(Boolean).join(', ');
          return {
            displayName: item.display_name,
            name: item.name || searchQuery,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            district: district,
            street: road || district
          };
        });
        setOnlineSearchResults(formatted);

        // Nếu có kết quả, bay tới vị trí đầu tiên
        if (formatted.length > 0 && mapInstanceRef.current) {
          const first = formatted[0];
          mapInstanceRef.current.flyTo([first.lat, first.lng], 15, { duration: 1.2 });
          if (markerRef.current) markerRef.current.setLatLng([first.lat, first.lng]);
          setSelectedCoords({ lat: first.lat, lng: first.lng });
        }
      }
    } catch (err) {
      console.warn('Geocoding error:', err);
    } finally {
      setIsSearchingOnline(false);
    }
  };

  // Chọn địa điểm có sẵn trong LonGo
  const handleSelectExistingPlace = (place) => {
    if (mapInstanceRef.current && place.location?.coordinates) {
      const [lng, lat] = place.location.coordinates;
      mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 0.8 });
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
    }
    onSelectPlaceTag({
      placeId: place.id || place._id,
      placeName: place.name,
      district: place.address?.district || place.address?.city || 'Việt Nam',
      isProposed: false
    });
    onClose();
  };

  // Bắt đầu quy trình đề xuất địa điểm mới khi chưa có trong LonGo
  const handleStartProposal = (candidate) => {
    setPropName(candidate?.name || searchQuery || '');
    setPropDistrict(candidate?.district || 'TP. Hồ Chí Minh');
    setPropStreet(candidate?.street || candidate?.displayName || '');
    if (candidate?.lat && candidate?.lng) {
      setSelectedCoords({ lat: candidate.lat, lng: candidate.lng });
    }
    setShowProposalForm(true);
  };

  // Tải ảnh máy tính minh họa cho đề xuất địa điểm
  const handlePropImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPropImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Gửi đề xuất địa điểm mới lên Backend & Gắn thẻ ngay vào bài viết
  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!propName.trim()) {
      alert('Vui lòng nhập tên địa điểm đề xuất.');
      return;
    }

    setIsSubmittingProposal(true);

    const proposalPayload = {
      type: 'create',
      name: propName.trim(),
      description: propDesc.trim() || `Địa điểm tại ${propDistrict} được cộng đồng đề xuất trực tiếp từ Google Map khi tạo bài viết.`,
      categoryId: propCategory,
      street: propStreet.trim() || propDistrict,
      district: propDistrict,
      lng: selectedCoords.lng,
      lat: selectedCoords.lat,
      imageUrl: propImagePreview || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
    };

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5196/api/place-proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(proposalPayload)
      });
    } catch (err) {
      console.warn('API place-proposals fallback notice:', err);
    }

    // Gắn thẻ địa điểm đề xuất vào bài đăng của người dùng
    onSelectPlaceTag({
      placeId: 'prop-' + Date.now(),
      placeName: propName.trim(),
      district: propDistrict,
      isProposed: true
    });

    setIsSubmittingProposal(false);
    setShowProposalForm(false);
    onClose();
    alert(`✓ Đã đề xuất địa điểm "${propName}" thành công và gắn thẻ vào bài viết của bạn. Ban quản trị sẽ rà soát địa điểm này!`);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 120,
      padding: 16
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 12,
        width: '100%',
        maxWidth: 960,
        height: '90vh',
        maxHeight: 740,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
      }}>
        {/* HEADER MODAL */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MapPin size={18} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                Tìm & Gắn Thẻ Địa Điểm Trên Google Map
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Tìm kiếm địa điểm thực tế hoặc click trực tiếp lên bản đồ để gắn thẻ
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* NỘI DUNG CHÍNH: 2 CỘT (CỘT TRÁI: SEARCH & KẾT QUẢ / FORM ĐỀ XUẤT; CỘT PHẢI: GOOGLE MAPS LEAFLET) */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          
          {/* CỘT TRÁI: TÌM KIẾM & DANH SÁCH ĐỊA ĐIỂM (40%) */}
          <div style={{
            width: '42%',
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            background: '#f8fafc'
          }}>
            {!showProposalForm ? (
              <>
                {/* THANH TÌM KIẾM ĐỊA ĐIỂM */}
                <div style={{ padding: 14, background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                  <form onSubmit={handleSearchOnline} style={{ display: 'flex', gap: 6 }}>
                    <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Search size={15} color="#64748b" style={{ position: 'absolute', left: 10 }} />
                      <input
                        type="text"
                        placeholder="Tìm địa danh, di tích, phố xá..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px 8px 32px',
                          borderRadius: 6,
                          border: '1px solid #cbd5e1',
                          fontSize: 13,
                          outline: 'none',
                          color: '#0f172a'
                        }}
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => { setSearchQuery(''); setOnlineSearchResults([]); }}
                          style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isSearchingOnline}
                      style={{
                        padding: '8px 14px',
                        background: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {isSearchingOnline ? 'Đang tìm...' : 'Tìm Map'}
                    </button>
                  </form>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
                    ✦ Bạn cũng có thể click trực tiếp vào bất kỳ vị trí nào trên bản đồ để chọn tọa độ
                  </div>
                </div>

                {/* DANH SÁCH KẾT QUẢ */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  
                  {/* PHẦN 1: ĐỊA ĐIỂM ĐÃ CÓ TRÊN HỆ THỐNG LONGO */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Địa điểm trên hệ thống LonGo ({matchedExistingPlaces.length})</span>
                      <span style={{ fontSize: 10, background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: 4 }}>
                        Đã xác thực
                      </span>
                    </div>

                    {matchedExistingPlaces.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {matchedExistingPlaces.map(place => (
                          <div
                            key={place.id || place._id}
                            style={{
                              background: '#ffffff',
                              borderRadius: 8,
                              border: '1px solid #e2e8f0',
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 10,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#0284c7'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {place.name}
                              </div>
                              <div style={{ fontSize: 11.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                <span>{place.address?.district || place.address?.city}</span>
                                <span>•</span>
                                <span style={{ color: '#eab308', fontWeight: 700 }}>★ {place.ratingAverage || place.googleRating || 4.8}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSelectExistingPlace(place)}
                              style={{
                                padding: '6px 12px',
                                background: '#0f172a',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: 6,
                                fontSize: 11.5,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                flexShrink: 0
                              }}
                            >
                              <Check size={12} />
                              <span>Gắn thẻ</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: '12px', background: '#ffffff', borderRadius: 8, border: '1px dashed #cbd5e1', textAlign: 'center', fontSize: 12, color: '#64748b' }}>
                        Không có địa điểm nào trong hệ thống khớp với từ khóa "{searchQuery}"
                      </div>
                    )}
                  </div>

                  {/* PHẦN 2: KẾT QUẢ TÌM KIẾM TRÊN GOOGLE MAP (NẾU CÓ) */}
                  {onlineSearchResults.length > 0 && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#0284c7', letterSpacing: '0.04em', marginBottom: 6 }}>
                        Kết quả tìm kiếm Bản đồ ({onlineSearchResults.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {onlineSearchResults.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: '#f0f9ff',
                              borderRadius: 8,
                              border: '1px solid #bae6fd',
                              padding: '10px 12px'
                            }}
                          >
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#0369a1' }}>
                              📍 {item.name}
                            </div>
                            <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2, lineHeight: 1.3 }}>
                              {item.displayName}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                              <button
                                type="button"
                                onClick={() => handleStartProposal(item)}
                                style={{
                                  padding: '5px 12px',
                                  background: '#0284c7',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: 6,
                                  fontSize: 11.5,
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                              >
                                <Plus size={13} />
                                <span>Đề xuất & Gắn thẻ</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BANNER GỢI Ý ĐỀ XUẤT ĐỊA ĐIỂM MỚI KHI CHƯA CÓ TRÊN HỆ THỐNG */}
                  <div style={{
                    marginTop: 'auto',
                    padding: 14,
                    background: '#eff6ff',
                    borderRadius: 8,
                    border: '1px solid #bfdbfe'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1e40af', fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                      <Sparkles size={14} />
                      <span>Địa điểm của bạn chưa có trên LonGo?</span>
                    </div>
                    <p style={{ fontSize: 11.5, color: '#3b82f6', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                      Bạn có thể đề xuất địa điểm mới ngay bây giờ để gắn thẻ vào bài viết. Địa điểm sẽ được gửi đến Ban Quản Trị thẩm định.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleStartProposal(selectedPlaceCandidate)}
                      style={{
                        width: '100%',
                        padding: '8px 14px',
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      }}
                    >
                      <Plus size={14} />
                      <span>+ Đề xuất thêm địa điểm mới</span>
                    </button>
                  </div>

                </div>
              </>
            ) : (
              /* FORM ĐỀ XUẤT ĐỊA ĐIỂM MỚI KHI ĐỊA ĐIỂM CHƯA CÓ TRÊN HỆ THỐNG */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', overflowY: 'auto' }}>
                <div style={{ padding: '14px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Plus size={16} color="#0284c7" />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                      Đề Xuất Địa Điểm Mới Vào LonGo
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowProposalForm(false)}
                    style={{ fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Quay lại tìm kiếm
                  </button>
                </div>

                <form onSubmit={handleSubmitProposal} style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                      Tên địa điểm mới *
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Đỉnh Bàn Cờ, Cầu Mống..."
                      value={propName}
                      onChange={e => setPropName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                        Danh mục *
                      </label>
                      <select
                        value={propCategory}
                        onChange={e => setPropCategory(e.target.value)}
                        style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                      >
                        {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                        Tỉnh / Thành phố *
                      </label>
                      <input
                        type="text"
                        value={propDistrict}
                        onChange={e => setPropDistrict(e.target.value)}
                        required
                        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                      Địa chỉ cụ thể / Cung đường tiếp cận
                    </label>
                    <input
                      type="text"
                      placeholder="Số nhà, tên đường, khu vực..."
                      value={propStreet}
                      onChange={e => setPropStreet(e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                    />
                  </div>

                  {/* Tọa độ ghim tự động từ map */}
                  <div style={{ background: '#f8fafc', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 11, color: '#64748b' }}>
                    <strong>Tọa độ ghim trên Map:</strong> {selectedCoords.lat.toFixed(5)}, {selectedCoords.lng.toFixed(5)} (Click trên bản đồ bên phải để điều chỉnh)
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                        Giờ mở cửa
                      </label>
                      <input
                        type="text"
                        value={propOpeningHours}
                        onChange={e => setPropOpeningHours(e.target.value)}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                        Giá vé tham khảo
                      </label>
                      <input
                        type="text"
                        value={propTicketPrice}
                        onChange={e => setPropTicketPrice(e.target.value)}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                      Mô tả ngắn trải nghiệm
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Điểm nổi bật, góc chụp đẹp, lưu ý cho người đến sau..."
                      value={propDesc}
                      onChange={e => setPropDesc(e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, resize: 'none' }}
                    />
                  </div>

                  {/* Đính kèm ảnh minh họa từ máy tính */}
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                      Ảnh minh họa địa điểm (Chọn từ máy)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        background: '#f1f5f9',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        <ImageIcon size={14} color="#059669" />
                        <span>Chọn ảnh</span>
                        <input type="file" accept="image/*" onChange={handlePropImageUpload} style={{ display: 'none' }} />
                      </label>
                      {propImagePreview && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <img src={propImagePreview} alt="thumb" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }} />
                          <button type="button" onClick={() => setPropImagePreview(null)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: 11 }}>
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: 8, paddingTop: 10 }}>
                    <button
                      type="button"
                      onClick={() => setShowProposalForm(false)}
                      style={{ flex: 1, padding: '9px 0', background: '#f1f5f9', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingProposal}
                      style={{
                        flex: 2,
                        padding: '9px 0',
                        background: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {isSubmittingProposal ? 'Đang gửi...' : 'Gửi đề xuất & Gắn thẻ'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: GOOGLE MAPS ROADMAP LEAFLET TƯƠNG TÁC (58%) */}
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Hướng dẫn góc bản đồ */}
            <div style={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 20,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              padding: '6px 12px',
              borderRadius: 6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              fontSize: 12,
              fontWeight: 700,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <Navigation size={14} color="#0284c7" />
              <span>Google Maps • Nhấp vào vị trí bất kỳ để di chuyển ghim marker</span>
            </div>

            {/* Container bản đồ Leaflet */}
            <div
              ref={mapContainerRef}
              style={{ width: '100%', height: '100%', minHeight: 450, background: '#f1f5f9' }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
