import React, { useState, useMemo } from 'react';
import { 
  Trophy, Star, MapPin, Award, Clock, Calendar, 
  ExternalLink, Heart, ChevronRight, Filter, Sparkles, CheckCircle2 
} from 'lucide-react';
import { getPlaceTimingDetails } from '../utils/placeTimingHelper';

export default function RankingLeaderboard({ places = [], onSelectPlace, onToggleFavorite, favoritePlaceIds = [] }) {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all'); // 'all', 1..12

  // Các tùy chọn bộ lọc khu vực / tỉnh thành lớn
  const REGION_OPTIONS = [
    { id: 'all', label: 'Toàn quốc (Tất cả điểm đến)' },
    { id: 'hcm', label: 'TP. Hồ Chí Minh', filter: p => (p.address?.city || '').toLowerCase().includes('hồ chí minh') || (p.address?.city || '').toLowerCase().includes('hcm') || (p.address?.district || '').includes('Quận') || (p.address?.district || '').includes('Củ Chi') || (p.address?.district || '').includes('Cần Giờ') || (p.address?.district || '').includes('Thủ Đức') },
    { id: 'hanoi', label: 'Hà Nội', filter: p => (p.address?.city || '').toLowerCase().includes('hà nội') },
    { id: 'danang', label: 'Đà Nẵng', filter: p => (p.address?.city || '').toLowerCase().includes('đà nẵng') },
    { id: 'quangnam', label: 'Quảng Nam (Hội An)', filter: p => (p.address?.city || '').toLowerCase().includes('quảng nam') || (p.name || '').toLowerCase().includes('hội an') },
    { id: 'hue', label: 'Thừa Thiên Huế', filter: p => (p.address?.city || '').toLowerCase().includes('huế') },
    { id: 'dalat', label: 'Lâm Đồng (Đà Lạt)', filter: p => (p.address?.city || '').toLowerCase().includes('lâm đồng') || (p.name || '').toLowerCase().includes('đà lạt') },
    { id: 'quangninh', label: 'Quảng Ninh (Hạ Long)', filter: p => (p.address?.city || '').toLowerCase().includes('quảng ninh') || (p.name || '').toLowerCase().includes('hạ long') },
    { id: 'ninhbinh', label: 'Ninh Bình', filter: p => (p.address?.city || '').toLowerCase().includes('ninh bình') },
    { id: 'sapa', label: 'Lào Cai (Sa Pa)', filter: p => (p.address?.city || '').toLowerCase().includes('lào cai') || (p.name || '').toLowerCase().includes('fansipan') },
    { id: 'hagiang', label: 'Hà Giang', filter: p => (p.address?.city || '').toLowerCase().includes('hà giang') },
    { id: 'nhatrang', label: 'Khánh Hòa (Nha Trang)', filter: p => (p.address?.city || '').toLowerCase().includes('khánh hòa') || (p.name || '').toLowerCase().includes('nha trang') },
    { id: 'phuquoc', label: 'Kiên Giang (Phú Quốc)', filter: p => (p.address?.city || '').toLowerCase().includes('kiên giang') || (p.name || '').toLowerCase().includes('phú quốc') },
    { id: 'vungtau', label: 'Bà Rịa - Vũng Tàu', filter: p => (p.address?.city || '').toLowerCase().includes('vũng tàu') || (p.address?.city || '').toLowerCase().includes('bà rịa') },
    { id: 'tayninh', label: 'Tây Ninh', filter: p => (p.address?.city || '').toLowerCase().includes('tây ninh') || (p.name || '').toLowerCase().includes('bà đen') },
    { id: 'binhthuan', label: 'Bình Thuận (Mũi Né)', filter: p => (p.address?.city || '').toLowerCase().includes('bình thuận') || (p.name || '').toLowerCase().includes('mũi né') },
    { id: 'cantho', label: 'Cần Thơ', filter: p => (p.address?.city || '').toLowerCase().includes('cần thơ') },
    { id: 'tiengiang', label: 'Tiền Giang & Miền Tây', filter: p => (p.address?.city || '').toLowerCase().includes('tiền giang') || (p.address?.city || '').toLowerCase().includes('bến tre') }
  ];

  // Tính toán bảng xếp hạng
  const rankedPlaces = useMemo(() => {
    let list = [...places];

    // Lọc theo khu vực
    if (selectedRegion !== 'all') {
      const regionObj = REGION_OPTIONS.find(r => r.id === selectedRegion);
      if (regionObj?.filter) {
        list = list.filter(regionObj.filter);
      }
    }

    // Lọc theo danh mục
    if (selectedCategory !== 'all') {
      list = list.filter(p => (p.categoryName || '').toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    // Gắn thông tin thời điểm du lịch và tính điểm trọng số
    const scoredList = list.map(p => {
      const timing = getPlaceTimingDetails(p);
      const rating = p.ratingAverage || 4.5;
      const count = p.reviewCount || (p.reviews ? p.reviews.length : 10);
      
      // Kiểm tra độ phù hợp theo tháng được chọn (CHỈ cộng điểm mùa cho địa điểm du lịch/di tích)
      let monthBonus = 0;
      let isSeasonMatch = false;
      if (selectedMonth !== 'all' && timing.hasSeasonalRecommendation) {
        const m = parseInt(selectedMonth, 10);
        if (timing.bestMonths.includes(m)) {
          monthBonus = 0.4;
          isSeasonMatch = true;
        }
      }

      // Điểm chuẩn hóa xếp hạng: Kết hợp Rating + log(ReviewCount) + Ưu tiên mùa
      const compositeScore = rating * 0.8 + Math.min(Math.log10(count + 1) * 0.4, 1.0) + monthBonus;

      return {
        ...p,
        timing,
        compositeScore,
        isSeasonMatch
      };
    });

    // Sắp xếp điểm từ cao xuống thấp
    scoredList.sort((a, b) => b.compositeScore - a.compositeScore);

    return scoredList;
  }, [places, selectedRegion, selectedCategory, selectedMonth]);

  const top1Place = rankedPlaces[0];
  const otherRankedPlaces = rankedPlaces.slice(1);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 80px 20px' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          HEADER BẢNG XẾP HẠNG (Al Jazeera Minimalist Style)
          ───────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28, borderBottom: '1px solid var(--aj-hairline)', paddingBottom: 24 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: '#000000', color: '#ffffff', borderRadius: '20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          <Trophy size={14} color="#f59e0b" />
          <span>Highly Recommended Leaderboard 2026</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--aj-ink)', margin: '0 0 10px 0', letterSpacing: '-0.03em' }}>
          Bảng Xếp Hạng Địa Điểm Được Đánh Giá Cao Nhất
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--aj-slate)', margin: 0, maxWidth: 760, lineHeight: 1.6 }}>
          Xếp hạng dựa trên dữ liệu đánh giá thực tế từ cộng đồng du khách và Google Maps. Dễ dàng lọc theo từng khu vực và lựa chọn tháng du lịch phù hợp nhất để xem gợi ý chuẩn xác.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BỘ LỌC TƯƠNG TÁC (KHU VỰC & THÁNG KHỞI HÀNH)
          ───────────────────────────────────────────────────────────── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--aj-hairline)',
        borderRadius: 'var(--aj-rounded-md)',
        padding: '18px 20px',
        marginBottom: 32,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Lọc theo Khu vực */}
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--aj-slate)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={14} color="var(--aj-ink)" />
              <span>1. Chọn khu vực muốn khám phá:</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {REGION_OPTIONS.map(reg => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  style={{
                    padding: '7px 15px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: '1px solid',
                    backgroundColor: selectedRegion === reg.id ? '#000000' : '#ffffff',
                    color: selectedRegion === reg.id ? '#ffffff' : 'var(--aj-charcoal)',
                    borderColor: selectedRegion === reg.id ? '#000000' : 'var(--aj-hairline)'
                  }}
                >
                  {reg.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: 'var(--aj-hairline)' }} />

          {/* Lọc theo Tháng khởi hành */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--aj-slate)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} color="var(--aj-ink)" />
                <span>2. Tháng bạn dự định đi:</span>
              </div>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--aj-rounded-sm)',
                  border: '1px solid var(--aj-hairline)',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  color: 'var(--aj-ink)',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Tất cả các tháng trong năm</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                  <option key={m} value={m}>Tháng {m} {m === 11 ? '(Tháng hiện tại - Mùa khô đẹp)' : ''}</option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--aj-slate)' }}>
              Đang hiển thị <strong>{rankedPlaces.length}</strong> địa điểm xếp hạng cao
            </div>
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          QUÁN QUÂN TOP #1 ĐẶC BIỆT
          ───────────────────────────────────────────────────────────── */}
      {top1Place && (
        <div style={{
          background: '#ffffff',
          border: '2px solid #000000',
          borderRadius: 'var(--aj-rounded-md)',
          padding: '24px',
          marginBottom: 32,
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{
              background: '#f59e0b',
              color: '#ffffff',
              padding: '4px 12px',
              borderRadius: '20px',
              fontWeight: 900,
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}>
              <Trophy size={16} color="#ffffff" />
              <span>HẠNG QUÁN QUÂN #1</span>
            </div>
            <span style={{ fontSize: '12.5px', color: 'var(--aj-slate)', fontWeight: 600 }}>
              Địa điểm đề xuất hàng đầu của khu vực được chọn
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 420px) 1fr', gap: 28, alignItems: 'center' }}>
            <div style={{ position: 'relative', borderRadius: 'var(--aj-rounded-sm)', overflow: 'hidden', height: 260 }}>
              <img 
                src={top1Place.images?.[0]?.url || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800'} 
                alt={top1Place.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 12,
                left: 12,
                background: 'rgba(0,0,0,0.85)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700
              }}>
                {top1Place.categoryName || 'Di tích & Thắng cảnh'}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--aj-ink)', margin: 0 }}>
                  {top1Place.name}
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={18} fill="#eab308" color="#eab308" />
                  <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--aj-ink)' }}>
                    {top1Place.ratingAverage || 4.9}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--aj-slate)' }}>
                    ({top1Place.reviewCount || (top1Place.reviews?.length || 10)} đánh giá thật)
                  </span>
                </div>

                <span style={{ color: 'var(--aj-hairline)' }}>•</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13.5px', color: 'var(--aj-slate)' }}>
                  <MapPin size={15} color="var(--aj-ink)" />
                  <span>{top1Place.address?.street || ''}, {top1Place.address?.district || ''}</span>
                </div>
              </div>

              <p style={{ fontSize: '14.5px', color: 'var(--aj-charcoal)', lineHeight: 1.6, marginBottom: 18 }}>
                {top1Place.description}
              </p>

              {/* Thông tin cẩm nang thời điểm (Du lịch) hoặc Khung giờ phục vụ (Ẩm thực & Cafe) */}
              {top1Place.timing?.hasSeasonalRecommendation ? (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid var(--aj-hairline)',
                  borderRadius: 'var(--aj-rounded-sm)',
                  padding: '12px 16px',
                  marginBottom: 20
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    <Calendar size={14} color="#0284c7" />
                    <span>Thời điểm lý tưởng nhất: {top1Place.timing?.bestSeasonText}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12.5px', color: 'var(--aj-slate)' }}>
                    <Clock size={13} />
                    <span>Khung giờ vàng tham quan: {top1Place.timing?.idealTimeOfDay}</span>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 'var(--aj-rounded-sm)',
                  padding: '12px 16px',
                  marginBottom: 20
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: '13px', fontWeight: 700, color: '#166534' }}>
                    <Clock size={14} color="#166534" />
                    <span>Phục vụ quanh năm • Khung giờ thưởng thức ngon nhất: {top1Place.timing?.idealTimeOfDay}</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#15803d' }}>
                    {top1Place.timing?.practicalTip}
                  </div>
                </div>
              )}

              {/* Nút hành động */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button
                  onClick={() => onSelectPlace && onSelectPlace(top1Place)}
                  className="aj-button-pill-dark"
                  style={{ fontSize: '14px', padding: '9px 20px' }}
                >
                  <span>Xem chi tiết & Đánh giá</span>
                  <ChevronRight size={15} />
                </button>

                <button
                  onClick={() => onToggleFavorite && onToggleFavorite(top1Place.id || top1Place._id)}
                  className="aj-button-pill-outline"
                  style={{ fontSize: '14px', padding: '9px 18px' }}
                >
                  <Heart 
                    size={15} 
                    fill={favoritePlaceIds.includes(top1Place.id || top1Place._id) ? '#ef4444' : 'none'} 
                    color={favoritePlaceIds.includes(top1Place.id || top1Place._id) ? '#ef4444' : 'currentColor'} 
                  />
                  <span>{favoritePlaceIds.includes(top1Place.id || top1Place._id) ? 'Đã lưu' : 'Lưu yêu thích'}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          DANH SÁCH BẢNG XẾP HẠNG #2, #3, #4...
          ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {otherRankedPlaces.map((place, index) => {
          const rank = index + 2;
          const isTop3 = rank <= 3;
          const isFav = favoritePlaceIds.includes(place.id || place._id);

          return (
            <div
              key={place.id || place.slug || index}
              style={{
                background: '#ffffff',
                border: '1px solid var(--aj-hairline)',
                borderRadius: 'var(--aj-rounded-md)',
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: '50px 140px 1fr auto',
                gap: 20,
                alignItems: 'center',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#000000';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--aj-hairline)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Thứ hạng Rank */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: rank === 2 ? '#64748b' : rank === 3 ? '#b45309' : '#f1f5f9',
                  color: rank <= 3 ? '#ffffff' : '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: 900,
                  margin: '0 auto'
                }}>
                  #{rank}
                </div>
                {isTop3 && (
                  <div style={{ fontSize: '10px', fontWeight: 800, color: rank === 2 ? '#64748b' : '#b45309', marginTop: 4 }}>
                    {rank === 2 ? 'TOP 2' : 'TOP 3'}
                  </div>
                )}
              </div>

              {/* Ảnh thu nhỏ */}
              <div style={{ width: 140, height: 95, borderRadius: 'var(--aj-rounded-sm)', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={place.images?.[0]?.url || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800'} 
                  alt={place.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {place.isSeasonMatch && (
                  <div style={{
                    position: 'absolute',
                    bottom: 4,
                    left: 4,
                    background: '#16a34a',
                    color: '#ffffff',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: 3
                  }}>
                    Đẹp T{selectedMonth}
                  </div>
                )}
              </div>

              {/* Thông tin địa điểm & Tag thời điểm */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {place.categoryName || 'Di tích & Thắng cảnh'}
                  </span>
                  <span style={{ color: 'var(--aj-hairline)' }}>•</span>
                  <span style={{ fontSize: '12px', color: 'var(--aj-slate)' }}>
                    {place.address?.district || place.address?.city}
                  </span>
                </div>

                <h3 
                  onClick={() => onSelectPlace && onSelectPlace(place)}
                  style={{
                    fontSize: '17px',
                    fontWeight: 800,
                    color: 'var(--aj-ink)',
                    margin: '0 0 6px 0',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  {place.name}
                </h3>

                {/* Rating & Review Count */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={14} fill="#eab308" color="#eab308" />
                    <span style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--aj-ink)' }}>
                      {place.ratingAverage || 4.5}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--aj-slate)' }}>
                      ({place.reviewCount || (place.reviews?.length || 10)} đánh giá)
                    </span>
                  </div>

                  <span style={{ color: 'var(--aj-hairline)' }}>•</span>

                  <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 600 }}>
                    {place.ticketPrice || 'Miễn phí vé vào cổng'}
                  </span>
                </div>

                {/* Tags gợi ý thời điểm thực tế */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {place.timing?.hasSeasonalRecommendation ? (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: '#f1f5f9',
                      color: '#334155'
                    }}>
                      🗓️ {place.timing?.bestSeasonText}
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: '#f0fdf4',
                      color: '#166534'
                    }}>
                      {place.timing?.badgeText || '🍲 Phục vụ quanh năm'}
                    </span>
                  )}
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: '#f8fafc',
                    color: '#475569',
                    border: '1px solid var(--aj-hairline)'
                  }}>
                    ⏰ {place.timing?.idealTimeOfDay}
                  </span>
                </div>
              </div>

              {/* Nút thao tác */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 140 }}>
                <button
                  onClick={() => onSelectPlace && onSelectPlace(place)}
                  className="aj-button-pill-dark"
                  style={{ width: '100%', fontSize: '12.5px', padding: '7px 12px', justifyContent: 'center' }}
                >
                  <span>Xem chi tiết</span>
                  <ChevronRight size={13} />
                </button>

                <button
                  onClick={() => onToggleFavorite && onToggleFavorite(place.id || place._id)}
                  className="aj-button-pill-outline"
                  style={{ width: '100%', fontSize: '12px', padding: '6px 10px', justifyContent: 'center' }}
                >
                  <Heart 
                    size={13} 
                    fill={isFav ? '#ef4444' : 'none'} 
                    color={isFav ? '#ef4444' : 'currentColor'} 
                  />
                  <span>{isFav ? 'Đã lưu' : 'Lưu'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
