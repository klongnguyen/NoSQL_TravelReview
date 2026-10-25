import React, { useState, useMemo, useRef } from 'react';
import { 
  Compass, Search, MapPin, Calendar, Award, 
  ExternalLink, X, Sparkles, CheckCircle2, ChevronRight,
  Plus, Minus, RotateCcw, Info, ZoomIn
} from 'lucide-react';
import { 
  VIETNAM_MAP_VIEWBOX, 
  VIETNAM_PROVINCES_DATA, 
  VIETNAM_SPECIAL_ISLANDS 
} from '../data/vietnamProvincesMapData';

export default function VietnamInteractiveMap({ onExploreProvince, onProposePlace }) {
  // Mặc định chọn TP. Hồ Chí Minh
  const defaultProv = VIETNAM_PROVINCES_DATA.find(p => p.id === 'vn-hc') || VIETNAM_PROVINCES_DATA[0];
  const [selectedProvince, setSelectedProvince] = useState(defaultProv);
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [activeRegionTab, setActiveRegionTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Điều khiển ViewBox thông minh cho 3 vùng miền
  const REGION_VIEWBOXES = {
    'all': '0 0 8800 11000',
    'bac': '0 0 5500 4500',
    'trung': '1000 3000 6800 5500',
    'nam': '500 7600 4500 3400'
  };

  const [currentViewBox, setCurrentViewBox] = useState(REGION_VIEWBOXES['all']);
  const mapContainerRef = useRef(null);

  // Bộ lọc đúng 3 vùng miền theo yêu cầu
  const REGION_TABS = [
    { key: 'all', label: 'Toàn quốc (63 Tỉnh)' },
    { key: 'bac', label: 'Miền Bắc' },
    { key: 'trung', label: 'Miền Trung' },
    { key: 'nam', label: 'Miền Nam' }
  ];

  // Danh sách toàn bộ lãnh thổ gồm 63 tỉnh thành và 2 quần đảo Hoàng Sa, Trường Sa
  const allTerritories = useMemo(() => {
    return [...VIETNAM_PROVINCES_DATA, ...VIETNAM_SPECIAL_ISLANDS];
  }, []);

  // Hàm kiểm tra tỉnh thuộc miền nào
  const isProvinceInRegion = (prov, regionKey) => {
    if (regionKey === 'all') return true;
    const r = (prov.region || '').toLowerCase();
    if (regionKey === 'bac') {
      return r.includes('bắc') || r.includes('sông hồng') || r.includes('hà nội');
    }
    if (regionKey === 'trung') {
      return r.includes('trung') || r.includes('tây nguyên') || prov.regionKey === 'bien-dong' || r.includes('biển đông');
    }
    if (regionKey === 'nam') {
      return r.includes('nam') || r.includes('cửu long') || r.includes('sài gòn') || r.includes('hồ chí minh');
    }
    return true;
  };

  // Danh sách gợi ý tìm kiếm tức thì
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();
    return allTerritories.filter(prov => 
      prov.name.toLowerCase().includes(term) ||
      (prov.fullName && prov.fullName.toLowerCase().includes(term)) ||
      (prov.famousLandmarks && prov.famousLandmarks.some(l => l.toLowerCase().includes(term)))
    ).slice(0, 6);
  }, [allTerritories, searchTerm]);

  // Lọc danh sách tỉnh thành dựa theo tab 3 vùng miền
  const filteredProvinces = useMemo(() => {
    return allTerritories.filter(prov => isProvinceInRegion(prov, activeRegionTab));
  }, [allTerritories, activeRegionTab]);

  // Xử lý chuyển tab vùng miền: Tự động zoom bản đồ vào vùng đó
  const handleTabChange = (key) => {
    setActiveRegionTab(key);
    setCurrentViewBox(REGION_VIEWBOXES[key] || REGION_VIEWBOXES['all']);
  };

  // Xử lý chọn tỉnh: bôi đen và mở thông tin
  const handleSelectProvince = (prov) => {
    setSelectedProvince(prov);
  };

  // Chọn tỉnh từ kết quả tìm kiếm: highlight + zoom bản đồ
  const handleSelectFromSearch = (prov) => {
    setSelectedProvince(prov);
    setSearchTerm('');
    if (isProvinceInRegion(prov, 'bac')) {
      setActiveRegionTab('bac');
      setCurrentViewBox(REGION_VIEWBOXES['bac']);
    } else if (isProvinceInRegion(prov, 'trung')) {
      setActiveRegionTab('trung');
      setCurrentViewBox(REGION_VIEWBOXES['trung']);
    } else {
      setActiveRegionTab('nam');
      setCurrentViewBox(REGION_VIEWBOXES['nam']);
    }
  };

  // Zoom thủ công (+, -, Reset)
  const handleZoom = (direction) => {
    const parts = currentViewBox.split(' ').map(Number);
    let [x, y, w, h] = parts;
    if (direction === 'reset') {
      setCurrentViewBox(REGION_VIEWBOXES[activeRegionTab] || REGION_VIEWBOXES['all']);
      return;
    }
    const factor = direction === 'in' ? 0.75 : 1.33;
    const newW = Math.round(w * factor);
    const newH = Math.round(h * factor);
    const newX = Math.round(x + (w - newW) / 2);
    const newY = Math.round(y + (h - newH) / 2);
    setCurrentViewBox(`${newX} ${newY} ${newW} ${newH}`);
  };

  // Bắt tọa độ chuột để hiện tooltip trôi nổi mượt mà
  const handleMouseMove = (e) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          TIÊU ĐỀ CHUẨN AL JAZEERA & GIẢI THÍCH TƯƠNG TÁC
          ───────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28, borderBottom: '1px solid var(--aj-hairline)', paddingBottom: 20 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: '#000000', color: '#ffffff', borderRadius: '20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          <Compass size={14} color="#38bdf8" />
          <span>Bản Đồ Địa Lý Wikipedia Locator Map • Việt Nam 63 Tỉnh Thành</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--aj-ink)', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>
          Bản Đồ Địa Lý & Vùng Du Lịch Việt Nam
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--aj-slate)', margin: 0, maxWidth: 880, lineHeight: 1.6 }}>
          Bản đồ địa giới hành chính tối giản theo tiêu chuẩn <strong>Wikipedia Locator Map</strong>. Khi nhấp chọn vào bất kỳ vùng miền hay tỉnh thành nào, khu vực đó sẽ được <strong>bôi đen tương phản</strong> và hiển thị ngay <strong>popup thông tin bách khoa</strong> (Wikipedia), hình ảnh tiêu biểu và danh lam thắng cảnh nổi tiếng.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BỘ CÔNG CỤ TÌM KIẾM TỈNH & BỘ LỌC VÙNG MIỀN
          ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        {/* THANH TÌM KIẾM NHANH */}
        <div style={{ position: 'relative', minWidth: 280, flex: '1 1 320px', maxWidth: 440 }}>
          <Search size={16} color="var(--aj-slate)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tỉnh thành (Hà Nội, Sa Pa, Đà Nẵng, Vũng Tàu...)"
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              border: '1px solid var(--aj-hairline)',
              borderRadius: '24px',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              color: 'var(--aj-ink)',
              outline: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--aj-slate)' }}
            >
              <X size={15} />
            </button>
          )}

          {/* DROPDOWN GỢI Ý TỈNH THÀNH KHI GÕ TÌM KIẾM */}
          {searchSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 6,
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid var(--aj-hairline)',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
              zIndex: 100,
              overflow: 'hidden'
            }}>
              {searchSuggestions.map((prov) => (
                <div
                  key={prov.id}
                  onClick={() => handleSelectFromSearch(prov)}
                  style={{
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '13px',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <div>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{prov.fullName || prov.name}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', marginLeft: 8 }}>• {prov.region}</span>
                  </div>
                  <ChevronRight size={14} color="#94a3b8" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CÁC NÚT TAB VÙNG MIỀN (TỰ ĐỘNG ZOOM VÀO VÙNG ĐÓ) */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {REGION_TABS.map(tab => {
            const isActive = activeRegionTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  backgroundColor: isActive ? '#000000' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--aj-charcoal)',
                  borderColor: isActive ? '#000000' : 'var(--aj-hairline)',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          KHUNG BẢN ĐỒ CHÍNH (SVG LOCATOR MAP + POPUP THÔNG TIN)
          ───────────────────────────────────────────────────────────── */}
      <div 
        ref={mapContainerRef}
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          background: '#ffffff',
          border: '1px solid var(--aj-hairline)',
          borderRadius: 'var(--aj-rounded-md)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(380px, 1.15fr) minmax(360px, 460px)',
          minHeight: 780
        }}
      >
        
        {/* CỘT TRÁI: BẢN ĐỒ VECTOR SVG TOÀN BỘ 63 TỈNH THÀNH (WIKIPEDIA STYLE) */}
        <div style={{
          position: 'relative',
          background: '#f8fafc',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: '1px solid var(--aj-hairline)',
          userSelect: 'none'
        }}>
          {/* CHÚ THÍCH HƯỚNG DẪN BẢN ĐỒ */}
          <div style={{
            position: 'absolute',
            top: 16,
            left: 18,
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            border: '1px solid var(--aj-hairline)',
            borderRadius: '8px',
            padding: '8px 14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '11px', fontWeight: 700, color: 'var(--aj-charcoal)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ display: 'inline-block', width: 14, height: 14, background: '#d8e2ea', border: '1px solid #ffffff', borderRadius: 2 }} />
                <span>63 Tỉnh thành</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ display: 'inline-block', width: 14, height: 14, background: '#0f172a', borderRadius: 2 }} />
                <span style={{ color: '#0f172a', fontWeight: 800 }}>Khu vực được bôi đen</span>
              </div>
            </div>
          </div>

          {/* CÁC NÚT ZOOM THỦ CÔNG (+, -, RESET) */}
          <div style={{
            position: 'absolute',
            top: 16,
            right: 18,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            padding: 4,
            borderRadius: '8px',
            border: '1px solid var(--aj-hairline)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <button
              onClick={() => handleZoom('in')}
              title="Phóng to"
              style={{ width: 30, height: 30, border: 'none', background: '#f8fafc', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Plus size={16} color="#0f172a" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              title="Thu nhỏ"
              style={{ width: 30, height: 30, border: 'none', background: '#f8fafc', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Minus size={16} color="#0f172a" />
            </button>
            <button
              onClick={() => handleZoom('reset')}
              title="Toàn cảnh"
              style={{ width: 30, height: 30, border: 'none', background: '#f8fafc', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <RotateCcw size={14} color="#0f172a" />
            </button>
          </div>

          {/* SVG BẢN ĐỒ VIỆT NAM CHUẨN XÁC 63 TỈNH */}
          <div style={{ width: '100%', height: '100%', minHeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <svg
              viewBox={currentViewBox}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: 740,
                transition: 'all 0.4s ease-out',
                filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.06))'
              }}
            >
              <defs>
                <filter id="selectedShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#000000" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* ─────────────────────────────────────────────────────────────
                  RENDER 63 TỈNH THÀNH (WIKIPEDIA LOCATOR MAP STYLE)
                  ───────────────────────────────────────────────────────────── */}
              {VIETNAM_PROVINCES_DATA.map(prov => {
                const isSelected = selectedProvince?.id === prov.id;
                const isHovered = hoveredProvince?.id === prov.id;

                // NỀN BÌNH THƯỜNG: #d8e2ea (Xám nhạt Wikipedia)
                // KHI CHỌN: #0f172a (Bôi đen tương phản mạnh chuẩn theo yêu cầu)
                // KHI RÊ CHUỘT: #334155 (Đậm nhẹ)
                const fillColor = isSelected 
                  ? '#0f172a' 
                  : isHovered 
                    ? '#334155' 
                    : '#d8e2ea';

                const strokeColor = isSelected ? '#000000' : '#ffffff';
                const strokeWidth = isSelected ? 32 : 12;

                return (
                  <path
                    key={prov.id}
                    id={prov.id}
                    d={prov.svgPath}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    filter={isSelected ? 'url(#selectedShadow)' : 'none'}
                    style={{
                      cursor: 'pointer',
                      transition: 'fill 0.15s ease, stroke 0.15s ease'
                    }}
                    onMouseEnter={() => setHoveredProvince(prov)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    onClick={() => handleSelectProvince(prov)}
                  />
                );
              })}

              {/* ─────────────────────────────────────────────────────────────
                  QUẦN ĐẢO HOÀNG SA & TRƯỜNG SA (CHỦ QUYỀN THIÊNG LIÊNG TRÊN BIỂN ĐÔNG)
                  ───────────────────────────────────────────────────────────── */}
              {/* QUẦN ĐẢO HOÀNG SA (THUỘC TP. ĐÀ NẴNG) - TỌA ĐỘ NGOÀI BIỂN ĐÔNG PHÍA ĐÔNG ĐÀ NẴNG */}
              <g 
                transform="translate(6700, 4400)"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelectProvince(VIETNAM_SPECIAL_ISLANDS[0])}
                onMouseEnter={() => setHoveredProvince(VIETNAM_SPECIAL_ISLANDS[0])}
                onMouseLeave={() => setHoveredProvince(null)}
              >
                <circle cx="0" cy="0" r="160" fill={selectedProvince?.id === 'hoang-sa' ? '#0f172a' : '#d8e2ea'} stroke="#ffffff" strokeWidth="16" />
                <circle cx="-50" cy="-40" r="45" fill={selectedProvince?.id === 'hoang-sa' ? '#38bdf8' : '#0284c7'} />
                <circle cx="40" cy="20" r="35" fill={selectedProvince?.id === 'hoang-sa' ? '#38bdf8' : '#0284c7'} />
                <circle cx="20" cy="-60" r="30" fill={selectedProvince?.id === 'hoang-sa' ? '#38bdf8' : '#0284c7'} />
                <text x="210" y="40" fontSize="130" fontWeight="900" fill="#0f172a">QĐ. Hoàng Sa</text>
                <text x="210" y="190" fontSize="100" fontWeight="700" fill="#64748b">(TP. Đà Nẵng)</text>
              </g>

              {/* QUẦN ĐẢO TRƯỜNG SA (THUỘC TỈNH KHÁNH HÒA) - TỌA ĐỘ NGOÀI BIỂN ĐÔNG PHÍA ĐÔNG NAM KHÁNH HÒA */}
              <g 
                transform="translate(7400, 8800)"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelectProvince(VIETNAM_SPECIAL_ISLANDS[1])}
                onMouseEnter={() => setHoveredProvince(VIETNAM_SPECIAL_ISLANDS[1])}
                onMouseLeave={() => setHoveredProvince(null)}
              >
                <circle cx="0" cy="0" r="190" fill={selectedProvince?.id === 'truong-sa' ? '#0f172a' : '#d8e2ea'} stroke="#ffffff" strokeWidth="16" />
                <circle cx="-60" cy="-45" r="45" fill={selectedProvince?.id === 'truong-sa' ? '#38bdf8' : '#0284c7'} />
                <circle cx="55" cy="50" r="40" fill={selectedProvince?.id === 'truong-sa' ? '#38bdf8' : '#0284c7'} />
                <circle cx="45" cy="-70" r="35" fill={selectedProvince?.id === 'truong-sa' ? '#38bdf8' : '#0284c7'} />
                <circle cx="-50" cy="70" r="30" fill={selectedProvince?.id === 'truong-sa' ? '#38bdf8' : '#0284c7'} />
                <text x="240" y="40" fontSize="130" fontWeight="900" fill="#0f172a">QĐ. Trường Sa</text>
                <text x="240" y="190" fontSize="100" fontWeight="700" fill="#64748b">(Khánh Hòa)</text>
              </g>

              {/* ĐẢO PHÚ QUỐC (KIÊN GIANG) - TỌA ĐỘ VỊNH THÁI LAN TÂY NAM */}
              <g 
                transform="translate(950, 9600)"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const kg = VIETNAM_PROVINCES_DATA.find(p => p.id === 'vn-kg');
                  if (kg) handleSelectProvince(kg);
                }}
              >
                <ellipse cx="0" cy="0" rx="100" ry="160" fill={selectedProvince?.id === 'vn-kg' ? '#0f172a' : '#d8e2ea'} stroke="#ffffff" strokeWidth="14" />
                <text x="-160" y="240" fontSize="110" fontWeight="800" fill="#0f172a">Đ. Phú Quốc</text>
              </g>

              {/* ─────────────────────────────────────────────────────────────
                  PIN CALLOUT NGAY TRÊN BẢN ĐỒ CHO TỈNH ĐANG ĐƯỢC CHỌN
                  ───────────────────────────────────────────────────────────── */}
              {selectedProvince && selectedProvince.centroid && (
                <g 
                  transform={`translate(${selectedProvince.centroid.x}, ${selectedProvince.centroid.y})`}
                  style={{ pointerEvents: 'none' }}
                >
                  <circle cx="0" cy="0" r="65" fill="#38bdf8" stroke="#ffffff" strokeWidth="16" />
                  <circle cx="0" cy="0" r="30" fill="#0f172a" />
                </g>
              )}
            </svg>
          </div>

          {/* TOOLTIP TRÔI NỔI KHI RÊ CHUỘT QUA TỈNH */}
          {hoveredProvince && hoveredProvince.id !== selectedProvince?.id && (
            <div style={{
              position: 'absolute',
              left: mousePos.x + 14,
              top: mousePos.y + 14,
              pointerEvents: 'none',
              background: '#0f172a',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              zIndex: 30,
              whiteSpace: 'nowrap'
            }}>
              {hoveredProvince.name} • {hoveredProvince.region}
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CỘT PHẢI: POPUP THÔNG TIN KHU VỰC ĐƯỢC CHỌN (POPUP / CARD)
            ───────────────────────────────────────────────────────────── */}
        <div style={{
          padding: '24px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          overflowY: 'auto',
          maxHeight: 780
        }}>
          {selectedProvince ? (
            <div>
              {/* HEADER POPUP KHU VỰC ĐƯỢC BÔI ĐEN */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    <MapPin size={13} />
                    <span>{selectedProvince.region}</span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--aj-ink)', margin: 0, letterSpacing: '-0.02em' }}>
                    {selectedProvince.fullName || selectedProvince.name}
                  </h2>
                </div>

                <div style={{
                  padding: '4px 10px',
                  background: '#f1f5f9',
                  color: '#0f172a',
                  border: '1px solid var(--aj-hairline)',
                  fontSize: '11px',
                  fontWeight: 800,
                  borderRadius: '16px',
                  textTransform: 'uppercase'
                }}>
                  {selectedProvince.region || 'Việt Nam'}
                </div>
              </div>

              {/* HÌNH ẢNH TIÊU BIỂU CỦA TỈNH (WIKIPEDIA / UNSPLASH) */}
              <div style={{
                width: '100%',
                height: 195,
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: 18,
                position: 'relative',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
              }}>
                <img
                  src={selectedProvince.thumbnail}
                  alt={selectedProvince.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 10,
                  background: 'rgba(0,0,0,0.7)',
                  color: '#ffffff',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 600,
                  backdropFilter: 'blur(4px)'
                }}>
                  Nguồn: Wikipedia & Tổng cục Du lịch
                </div>
              </div>

              {/* THÔNG TIN TỔNG QUAN TỪ WIKIPEDIA */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Info size={14} color="var(--aj-slate)" />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--aj-slate)', letterSpacing: '0.04em' }}>
                    Giới thiệu bách khoa (Wikipedia)
                  </span>
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--aj-charcoal)', margin: 0 }}>
                  {selectedProvince.wikiSummary}
                </p>
              </div>

              {/* DIỆN TÍCH & DÂN SỐ */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid var(--aj-hairline)',
                marginBottom: 18
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--aj-slate)', fontWeight: 600 }}>Diện tích tự nhiên</div>
                  <div style={{ fontSize: '13px', color: 'var(--aj-ink)', fontWeight: 800 }}>{selectedProvince.area}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--aj-slate)', fontWeight: 600 }}>Quy mô dân số</div>
                  <div style={{ fontSize: '13px', color: 'var(--aj-ink)', fontWeight: 800 }}>{selectedProvince.population}</div>
                </div>
              </div>

              {/* DANH THẮNG NỔI TIẾNG CỦA TỈNH */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Award size={14} color="#0284c7" />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--aj-ink)', letterSpacing: '0.04em' }}>
                    Địa danh & danh thắng nổi tiếng
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(selectedProvince.famousLandmarks || []).map((landmark, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 9px',
                        background: '#f1f5f9',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: 'var(--aj-charcoal)',
                        fontWeight: 600,
                        border: '1px solid var(--aj-hairline)'
                      }}
                    >
                      {landmark}
                    </span>
                  ))}
                </div>
              </div>

              {/* MÙA DU LỊCH ĐẸP NHẤT */}
              <div style={{
                padding: '12px 14px',
                background: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #bbf7d0',
                marginBottom: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Calendar size={14} color="#16a34a" />
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#166534' }}>
                    Thời điểm lý tưởng du lịch
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#14532d', fontWeight: 600, lineHeight: 1.5 }}>
                  {selectedProvince.bestSeason}
                </div>
              </div>

              {/* NÚT HÀNH ĐỘNG: KHÁM PHÁ ĐỊA ĐIỂM TẠI TỈNH TRÊN LONGO */}
              <button
                onClick={() => {
                  if (onExploreProvince) {
                    onExploreProvince(selectedProvince);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
              >
                <span>Khám phá các địa điểm tại {selectedProvince.name} trên LonGo</span>
                <ChevronRight size={16} />
              </button>

              {onProposePlace && (
                <button
                  onClick={() => onProposePlace(selectedProvince)}
                  style={{
                    width: '100%',
                    marginTop: 8,
                    padding: '11px 18px',
                    background: '#ffffff',
                    color: '#000000',
                    border: '1px solid var(--aj-hairline)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <Plus size={14} />
                  <span>Đề xuất địa điểm mới tại {selectedProvince.name}</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--aj-slate)' }}>
              <Compass size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <div style={{ fontSize: '15px', fontWeight: 700 }}>Chạm vào bất kỳ tỉnh nào trên bản đồ</div>
              <div style={{ fontSize: '13px', marginTop: 6 }}>Khu vực được chọn sẽ bôi đen và hiển thị thông tin chi tiết tại đây.</div>
            </div>
          )}
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          DANH SÁCH LƯỚI NHANH 63 TỈNH THÀNH (ĐỂ NGƯỜI DÙNG DUYỆT TÙY Ý)
          ───────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--aj-ink)', margin: 0 }}>
            Danh mục tra cứu nhanh ({filteredProvinces.length} địa phương)
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--aj-slate)' }}>
            Nhấp vào để bôi đen trực tiếp trên bản đồ
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: 8,
          maxHeight: 220,
          overflowY: 'auto',
          padding: '12px',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid var(--aj-hairline)'
        }}>
          {filteredProvinces.map(prov => {
            const isSelected = selectedProvince?.id === prov.id;
            return (
              <button
                key={prov.id}
                onClick={() => handleSelectProvince(prov)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: isSelected ? '1px solid #0f172a' : '1px solid var(--aj-hairline)',
                  backgroundColor: isSelected ? '#0f172a' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--aj-charcoal)',
                  fontSize: '12px',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {prov.name}
                </span>
                {isSelected && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} />}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
