import React, { useState, useMemo } from 'react';
import { 
  Calendar, CheckCircle2, AlertTriangle, XCircle, 
  Sparkles, ChevronRight, MapPin, Compass, Info, ArrowRight,
  Filter, Check, Layers
} from 'lucide-react';
import { TRAVEL_CALENDAR_2026 } from '../data/travelCalendarData';

export default function SeasonalTravelCalendar({ onSelectMonthForExplore }) {
  const [activeMonth, setActiveMonth] = useState(1); // Mặc định Tháng 1
  const [viewMode, setViewMode] = useState('detail'); // 'detail' | 'matrix'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'recommended' | 'consider' | 'avoid'
  const [regionFilter, setRegionFilter] = useState('all'); // 'all' | 'bac' | 'trung' | 'tay-nguyen' | 'nam'

  const currentMonthData = useMemo(() => {
    return TRAVEL_CALENDAR_2026.find(m => m.month === activeMonth) || TRAVEL_CALENDAR_2026[0];
  }, [activeMonth]);

  // Thống kê số lượng điểm đến theo từng nhóm trạng thái
  const counts = useMemo(() => {
    if (!currentMonthData) return { total: 0, recommended: 0, consider: 0, avoid: 0 };
    const list = currentMonthData.destinations || [];
    return {
      total: list.length,
      recommended: list.filter(d => d.status === 'recommended').length,
      consider: list.filter(d => d.status === 'consider').length,
      avoid: list.filter(d => d.status === 'avoid').length
    };
  }, [currentMonthData]);

  // Lọc điểm đến theo trạng thái và vùng miền
  const filteredDestinations = useMemo(() => {
    if (!currentMonthData) return [];
    return (currentMonthData.destinations || []).filter(item => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (regionFilter !== 'all' && item.macroRegion !== regionFilter) return false;
      return true;
    });
  }, [currentMonthData, statusFilter, regionFilter]);

  // Phân chia theo nhóm trạng thái khi hiển thị "Tất cả"
  const recommendedList = useMemo(() => 
    filteredDestinations.filter(d => d.status === 'recommended'), 
    [filteredDestinations]
  );
  const considerList = useMemo(() => 
    filteredDestinations.filter(d => d.status === 'consider'), 
    [filteredDestinations]
  );
  const avoidList = useMemo(() => 
    filteredDestinations.filter(d => d.status === 'avoid'), 
    [filteredDestinations]
  );

  const getRegionName = (macroRegion) => {
    switch (macroRegion) {
      case 'bac': return 'Bắc Bộ';
      case 'trung': return 'Miền Trung';
      case 'tay-nguyen': return 'Tây Nguyên';
      case 'nam': return 'Nam Bộ & Biển Đảo';
      default: return 'Việt Nam';
    }
  };

  const renderDestinationCard = (dest, idx) => {
    const isRec = dest.status === 'recommended';
    const isCon = dest.status === 'consider';
    const isAvo = dest.status === 'avoid';

    const borderColor = isRec ? '#22c55e' : isCon ? '#eab308' : '#ef4444';
    const badgeBg = isRec ? '#dcfce7' : isCon ? '#fef9c3' : '#fee2e2';
    const badgeColor = isRec ? '#166534' : isCon ? '#854d0e' : '#991b1b';
    const Icon = isRec ? CheckCircle2 : isCon ? AlertTriangle : XCircle;

    return (
      <div
        key={idx}
        style={{
          background: '#ffffff',
          border: '1px solid var(--aj-hairline)',
          borderLeft: `5px solid ${borderColor}`,
          borderRadius: 'var(--aj-rounded-md)',
          padding: '22px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease'
        }}
      >
        <div>
          {/* Header Vùng & Trạng thái */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 10 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '11.5px', fontWeight: 700, color: 'var(--aj-slate)', marginBottom: 4 }}>
                <MapPin size={12} color="var(--aj-slate)" />
                <span>{getRegionName(dest.macroRegion)}</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--aj-ink)', margin: 0, lineHeight: 1.3 }}>
                {dest.region}
              </h3>
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: badgeBg,
              color: badgeColor,
              padding: '5px 12px',
              borderRadius: '16px',
              fontSize: '12.5px',
              fontWeight: 800,
              whiteSpace: 'nowrap'
            }}>
              <Icon size={14} />
              <span>{dest.statusLabel}</span>
            </span>
          </div>

          {/* Mô tả thời tiết & Cảnh sắc */}
          <p style={{ fontSize: '14.5px', color: 'var(--aj-charcoal)', lineHeight: 1.6, marginBottom: 16 }}>
            {dest.description}
          </p>

          {/* Tags nổi bật */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {dest.tags.map((t, ti) => (
              <span
                key={ti}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  padding: '3px 9px',
                  borderRadius: '4px',
                  background: isRec ? '#f0fdf4' : isCon ? '#fefce8' : '#fef2f2',
                  color: isRec ? '#15803d' : isCon ? '#a16207' : '#b91c1c',
                  border: `1px solid ${isRec ? '#bbf7d0' : isCon ? '#fef08a' : '#fecaca'}`
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Nguồn đối soát uy tín */}
        <div style={{ borderTop: '1px solid var(--aj-hairline)', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <span style={{ fontSize: '12px', color: 'var(--aj-slate)', lineHeight: 1.4 }}>
            Nguồn đối soát: <strong style={{ color: 'var(--aj-charcoal)' }}>{dest.source}</strong>
          </span>
          <Info size={14} color="var(--aj-slate)" style={{ flexShrink: 0 }} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '32px 20px 80px 20px' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          HEADER CẨM NĂNG LỊCH DU LỊCH 2026
          ───────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28, borderBottom: '1px solid var(--aj-hairline)', paddingBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: '#000000', color: '#ffffff', borderRadius: '20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              <Calendar size={14} color="#38bdf8" />
              <span>Gợi Ý Theo Mùa • Lịch Du Lịch Việt Nam 2026</span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--aj-ink)', margin: '0 0 10px 0', letterSpacing: '-0.03em' }}>
              Cẩm Nang Du Lịch 12 Tháng Theo Mùa & Thời Tiết Toàn Quốc
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--aj-slate)', margin: 0, maxWidth: 840, lineHeight: 1.6 }}>
              Bản đồ thời tiết và du lịch 2026 phân tích toàn diện <strong>Bắc Bộ, Miền Trung, Tây Nguyên và Nam Bộ</strong>. Đối soát dữ liệu cùng Traveloka và Tổng cục Du lịch Việt Nam, giúp bạn biết rõ tháng này nơi nào <strong>Nên đi</strong>, nơi nào cần <strong>Cân nhắc</strong>, và vùng nào <strong>Nên tránh</strong> để bảo đảm an toàn.
            </p>
          </div>

          {/* Toggle Chế độ xem */}
          <div style={{ display: 'flex', gap: 6, background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
            <button
              onClick={() => setViewMode('detail')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: viewMode === 'detail' ? '#ffffff' : 'transparent',
                color: viewMode === 'detail' ? '#000000' : 'var(--aj-slate)',
                boxShadow: viewMode === 'detail' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Chi tiết theo tháng
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: viewMode === 'matrix' ? '#ffffff' : 'transparent',
                color: viewMode === 'matrix' ? '#000000' : 'var(--aj-slate)',
                boxShadow: viewMode === 'matrix' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Ma trận 12 tháng (Bảng tổng quan 15 vùng)
            </button>
          </div>
        </div>

        {/* Chú giải trạng thái chuẩn 3 cấp độ */}
        <div style={{ display: 'flex', gap: 24, marginTop: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--aj-slate)', textTransform: 'uppercase' }}>
            Quy ước khuyến nghị:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '13.5px', fontWeight: 700, color: '#166534' }}>
            <span style={{ width: 14, height: 14, borderRadius: '4px', backgroundColor: '#22c55e', display: 'inline-block' }} />
            <span>Nên đi (Thời tiết đẹp nhất, biển êm, mùa hoa/lễ hội nở rộ)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '13.5px', fontWeight: 700, color: '#854d0e' }}>
            <span style={{ width: 14, height: 14, borderRadius: '4px', backgroundColor: '#eab308', display: 'inline-block' }} />
            <span>Cân nhắc (Se lạnh, sương mù ẩm hoặc mưa rải rác)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '13.5px', fontWeight: 700, color: '#991b1b' }}>
            <span style={{ width: 14, height: 14, borderRadius: '4px', backgroundColor: '#ef4444', display: 'inline-block' }} />
            <span>Nên tránh (Cao điểm bão lũ, mưa dầm, đường đèo trơn trượt hoặc cấm biển)</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          THANH CHỌN 12 THÁNG (NAV TABS)
          ───────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 8,
        marginBottom: 28,
        overflowX: 'auto',
        paddingBottom: 4
      }}>
        {TRAVEL_CALENDAR_2026.map(item => {
          const isActive = item.month === activeMonth;
          return (
            <button
              key={item.month}
              onClick={() => { setActiveMonth(item.month); setViewMode('detail'); }}
              style={{
                padding: '12px 6px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isActive ? '#000000' : 'var(--aj-hairline)',
                backgroundColor: isActive ? '#000000' : '#ffffff',
                color: isActive ? '#ffffff' : 'var(--aj-ink)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 600, color: isActive ? '#cbd5e1' : 'var(--aj-slate)' }}>
                T{item.month}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 900 }}>
                Tháng {item.month}
              </span>
              {item.month === 1 && (
                <span style={{ fontSize: '9px', fontWeight: 800, color: isActive ? '#38bdf8' : '#0284c7' }}>
                  Đầu Xuân
                </span>
              )}
              {item.month === 11 && (
                <span style={{ fontSize: '9px', fontWeight: 800, color: isActive ? '#38bdf8' : '#0284c7' }}>
                  Hiện tại
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CHẾ ĐỘ 1: CHI TIẾT THEO THÁNG ĐƯỢC CHỌN
          ───────────────────────────────────────────────────────────── */}
      {viewMode === 'detail' && currentMonthData && (
        <div>
          {/* Banner Tổng quan tháng & Thống kê nhanh */}
          <div style={{
            background: 'var(--aj-soft)',
            border: '1px solid var(--aj-hairline)',
            borderRadius: 'var(--aj-rounded-md)',
            padding: '24px 28px',
            marginBottom: 24
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ flex: '1 1 600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                  <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--aj-ink)', margin: 0 }}>
                    {currentMonthData.title}
                  </h2>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: '#e0f2fe',
                    color: '#0369a1'
                  }}>
                    {currentMonthData.destinations?.length || 0} Vùng khảo sát đầy đủ
                  </span>
                </div>

                <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0284c7', marginBottom: 10 }}>
                  ✦ {currentMonthData.seasonName}
                </div>
                <p style={{ fontSize: '15px', color: 'var(--aj-charcoal)', margin: 0, lineHeight: 1.6 }}>
                  {currentMonthData.generalAdvice}
                </p>
              </div>

              {onSelectMonthForExplore && (
                <button
                  onClick={() => onSelectMonthForExplore(currentMonthData.month)}
                  className="aj-button-pill-dark"
                  style={{ fontSize: '13.5px', padding: '10px 20px', whiteSpace: 'nowrap' }}
                >
                  <span>Khám phá điểm đến Tháng {currentMonthData.month}</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>

            {/* Thanh thống kê 3 nhóm trạng thái trong tháng */}
            <div style={{
              display: 'flex',
              gap: 12,
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid rgba(0,0,0,0.06)',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', padding: '8px 14px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#166534' }}>
                  {counts.recommended} Vùng nên đi
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', padding: '8px 14px', borderRadius: '8px', border: '1px solid #fef08a' }}>
                <AlertTriangle size={16} color="#ca8a04" />
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#854d0e' }}>
                  {counts.consider} Vùng cân nhắc
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', padding: '8px 14px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <XCircle size={16} color="#dc2626" />
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#991b1b' }}>
                  {counts.avoid} Vùng nên tránh
                </span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              BỘ LỌC TRẠNG THÁI & VÙNG MIỀN CHO THÁNG NÀY
              ───────────────────────────────────────────────────────────── */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 24,
            background: '#f8fafc',
            padding: '12px 18px',
            borderRadius: '10px',
            border: '1px solid var(--aj-hairline)'
          }}>
            {/* Lọc theo Trạng thái khuyến nghị */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--aj-slate)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Filter size={13} /> Khuyến nghị:
              </span>
              <button
                onClick={() => setStatusFilter('all')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: statusFilter === 'all' ? '1px solid #000' : '1px solid var(--aj-hairline)',
                  background: statusFilter === 'all' ? '#000000' : '#ffffff',
                  color: statusFilter === 'all' ? '#ffffff' : 'var(--aj-charcoal)',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Tất cả ({counts.total})
              </button>
              <button
                onClick={() => setStatusFilter('recommended')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: statusFilter === 'recommended' ? '1px solid #16a34a' : '1px solid var(--aj-hairline)',
                  background: statusFilter === 'recommended' ? '#16a34a' : '#ffffff',
                  color: statusFilter === 'recommended' ? '#ffffff' : '#166534',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🟢 Nên đi ({counts.recommended})
              </button>
              <button
                onClick={() => setStatusFilter('consider')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: statusFilter === 'consider' ? '1px solid #ca8a04' : '1px solid var(--aj-hairline)',
                  background: statusFilter === 'consider' ? '#ca8a04' : '#ffffff',
                  color: statusFilter === 'consider' ? '#ffffff' : '#854d0e',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🟡 Cân nhắc ({counts.consider})
              </button>
              <button
                onClick={() => setStatusFilter('avoid')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: statusFilter === 'avoid' ? '1px solid #dc2626' : '1px solid var(--aj-hairline)',
                  background: statusFilter === 'avoid' ? '#dc2626' : '#ffffff',
                  color: statusFilter === 'avoid' ? '#ffffff' : '#991b1b',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🔴 Nên tránh ({counts.avoid})
              </button>
            </div>

            {/* Lọc theo Vùng miền */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--aj-slate)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Layers size={13} /> Miền:
              </span>
              {[
                { id: 'all', label: 'Cả nước' },
                { id: 'bac', label: 'Bắc Bộ' },
                { id: 'trung', label: 'Miền Trung' },
                { id: 'tay-nguyen', label: 'Tây Nguyên' },
                { id: 'nam', label: 'Nam Bộ & Đảo' },
              ].map(rf => (
                <button
                  key={rf.id}
                  onClick={() => setRegionFilter(rf.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: regionFilter === rf.id ? '#0284c7' : 'transparent',
                    background: regionFilter === rf.id ? '#e0f2fe' : 'transparent',
                    color: regionFilter === rf.id ? '#0369a1' : 'var(--aj-slate)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {rf.label}
                </button>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              HIỂN THỊ CÁC NHÓM ĐỊA DANH
              ───────────────────────────────────────────────────────────── */}
          {statusFilter === 'all' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              {/* NHÓM 1: NÊN ĐI */}
              {recommendedList.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 12, height: 24, borderRadius: '4px', backgroundColor: '#22c55e' }} />
                    <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#166534', margin: 0 }}>
                      ĐIỂM ĐẾN LÝ TƯỞNG NHẤT THÁNG {currentMonthData.month} (NÊN ĐI • {recommendedList.length} VÙNG)
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
                    {recommendedList.map((dest, idx) => renderDestinationCard(dest, idx))}
                  </div>
                </div>
              )}

              {/* NHÓM 2: CÂN NHẮC */}
              {considerList.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 12, height: 24, borderRadius: '4px', backgroundColor: '#eab308' }} />
                    <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#854d0e', margin: 0 }}>
                      ĐIỂM ĐẾN CẦN CÂN NHẮC / CÓ LƯU Ý THỜI TIẾT ({considerList.length} VÙNG)
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
                    {considerList.map((dest, idx) => renderDestinationCard(dest, idx))}
                  </div>
                </div>
              )}

              {/* NHÓM 3: NÊN TRÁNH */}
              {avoidList.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 12, height: 24, borderRadius: '4px', backgroundColor: '#ef4444' }} />
                    <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#991b1b', margin: 0 }}>
                      VÙNG NÊN TRÁNH TRONG THÁNG {currentMonthData.month} (MƯA BÃO / BIỂN ĐỘNG / ĐƯỜNG NGUY HIỂM • {avoidList.length} VÙNG)
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
                    {avoidList.map((dest, idx) => renderDestinationCard(dest, idx))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 18, fontSize: '16px', fontWeight: 800, color: 'var(--aj-ink)' }}>
                Hiển thị {filteredDestinations.length} điểm đến phù hợp với bộ lọc:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
                {filteredDestinations.map((dest, idx) => renderDestinationCard(dest, idx))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CHẾ ĐỘ 2: MA TRẬN 12 THÁNG (BẢNG TRUY VẤN TỔNG THỂ 15 VÙNG)
          ───────────────────────────────────────────────────────────── */}
      {viewMode === 'matrix' && (
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--aj-hairline)',
          borderRadius: 'var(--aj-rounded-md)',
          padding: '24px',
          overflowX: 'auto',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--aj-ink)', margin: '0 0 6px 0' }}>
              Bảng Ma Trận Thời Tiết & Khuyến Nghị 12 Tháng Toàn Diện 2026
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--aj-slate)', margin: 0 }}>
              Đối soát nhanh 15 vùng du lịch trọng điểm Việt Nam qua 12 tháng. Nhấp vào bất kỳ ô tháng nào để chuyển sang xem chi tiết.
            </p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 960, fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--aj-hairline)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 800, color: 'var(--aj-ink)', width: '28%' }}>
                  Địa Danh / Vùng Trọng Điểm
                </th>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                  <th key={m} style={{ padding: '12px 6px', textAlign: 'center', fontWeight: 800, width: '6%' }}>
                    T{m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: '1. Lào Cai (Sa Pa, Fansipan)', region: 'Bắc Bộ', statuses: ['green', 'green', 'green', 'green', 'green', 'green', 'red', 'yellow', 'green', 'green', 'yellow', 'yellow'] },
                { name: '2. Hà Giang (Đồng Văn, Lũng Cú)', region: 'Bắc Bộ', statuses: ['green', 'green', 'green', 'green', 'yellow', 'yellow', 'red', 'yellow', 'green', 'green', 'green', 'green'] },
                { name: '3. Sơn La (Mộc Châu) & Điện Biên', region: 'Bắc Bộ', statuses: ['green', 'green', 'green', 'green', 'yellow', 'yellow', 'red', 'yellow', 'green', 'green', 'green', 'green'] },
                { name: '4. Hà Nội & Vùng Thủ Đô', region: 'Bắc Bộ', statuses: ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'green', 'green', 'green', 'green', 'green'] },
                { name: '5. Ninh Bình (Tràng An, Bái Đính)', region: 'Bắc Bộ', statuses: ['yellow', 'green', 'green', 'green', 'green', 'green', 'yellow', 'green', 'green', 'yellow', 'yellow', 'green'] },
                { name: '6. Quảng Ninh (Vịnh Hạ Long, Cô Tô)', region: 'Bắc Bộ', statuses: ['yellow', 'yellow', 'yellow', 'green', 'green', 'green', 'green', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'] },
                { name: '7. Bắc Trung Bộ (Quảng Bình, Nghệ An)', region: 'Miền Trung', statuses: ['yellow', 'yellow', 'yellow', 'yellow', 'green', 'green', 'green', 'yellow', 'red', 'red', 'yellow', 'yellow'] },
                { name: '8. Thừa Thiên Huế (Cố đô, Lăng Cô)', region: 'Miền Trung', statuses: ['red', 'green', 'green', 'green', 'yellow', 'yellow', 'yellow', 'yellow', 'red', 'red', 'yellow', 'yellow'] },
                { name: '9. Đà Nẵng & Quảng Nam (Hội An)', region: 'Miền Trung', statuses: ['red', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'red', 'red', 'yellow', 'yellow'] },
                { name: '10. Nam Trung Bộ (Nha Trang, Quy Nhơn, Mũi Né)', region: 'Miền Trung', statuses: ['yellow', 'yellow', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'red', 'yellow', 'yellow'] },
                { name: '11. Tây Nguyên (Đà Lạt, Buôn Ma Thuột)', region: 'Tây Nguyên', statuses: ['green', 'green', 'green', 'green', 'yellow', 'green', 'green', 'green', 'yellow', 'yellow', 'green', 'green'] },
                { name: '12. TP. Hồ Chí Minh & Tây Ninh', region: 'Nam Bộ', statuses: ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'] },
                { name: '13. Bà Rịa - Vũng Tàu & Cần Giờ', region: 'Nam Bộ', statuses: ['green', 'green', 'green', 'green', 'green', 'yellow', 'yellow', 'yellow', 'green', 'green', 'green', 'green'] },
                { name: '14. Kiên Giang (Phú Quốc & Quần đảo Nam Du)', region: 'Hải Đảo', statuses: ['green', 'green', 'green', 'green', 'red', 'red', 'red', 'red', 'yellow', 'green', 'green', 'green'] },
                { name: '15. Đồng bằng Sông Cửu Long (Cần Thơ, Bến Tre)', region: 'Nam Bộ', statuses: ['green', 'green', 'yellow', 'yellow', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'] },
              ].map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid var(--aj-hairline)', backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--aj-ink)' }}>
                    <div>{row.name}</div>
                    <span style={{ fontSize: '11px', color: 'var(--aj-slate)', fontWeight: 600 }}>{row.region}</span>
                  </td>
                  {row.statuses.map((st, cIdx) => {
                    const bgColor = st === 'green' ? '#22c55e' : st === 'yellow' ? '#eab308' : '#ef4444';
                    const label = st === 'green' ? 'Nên đi' : st === 'yellow' ? 'Cân nhắc' : 'Nên tránh';
                    return (
                      <td key={cIdx} style={{ padding: '6px', textAlign: 'center' }}>
                        <div
                          title={`${row.name} - Tháng ${cIdx + 1}: ${label}`}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: '5px',
                            backgroundColor: bgColor,
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }}
                          onClick={() => { setActiveMonth(cIdx + 1); setViewMode('detail'); }}
                        >
                          {st === 'green' ? '✓' : st === 'yellow' ? '!' : '✕'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
