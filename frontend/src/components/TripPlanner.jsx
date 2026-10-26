import React from 'react';
import { 
  Calendar, Clock, MapPin, Trash2, ArrowUp, ArrowDown, 
  Sparkles, CheckCircle2, ChevronRight, Navigation, ExternalLink,
  Compass, PlusCircle, Share2
} from 'lucide-react';

export default function TripPlanner({ 
  customStops = [], 
  onRemoveStop, 
  onSelectPlace, 
  onClearTrip, 
  onMoveStop,
  onNavigateExplore 
}) {

  // Tạo liên kết chỉ đường nhiều chặng trên Google Maps
  const googleMapsRouteUrl = React.useMemo(() => {
    if (!customStops || customStops.length === 0) return '';
    const points = customStops.map(s => {
      const addr = typeof s.address === 'string' ? s.address : (s.address?.street ? `${s.name}, ${s.address.street}, ${s.address.city || ''}` : s.name);
      return encodeURIComponent(addr.trim());
    });
    return `https://www.google.com/maps/dir/${points.join('/')}`;
  }, [customStops]);

  // Các quận/huyện nằm trong lộ trình
  const coveredDistricts = React.useMemo(() => {
    const districts = new Set();
    customStops.forEach(s => {
      if (s.address?.district) districts.add(s.address.district);
    });
    return Array.from(districts);
  }, [customStops]);

  const handleMoveUp = (index) => {
    if (index > 0 && onMoveStop) {
      onMoveStop(index, index - 1);
    }
  };

  const handleMoveDown = (index) => {
    if (index < customStops.length - 1 && onMoveStop) {
      onMoveStop(index, index + 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 4, height: 18, backgroundColor: '#fa9000', borderRadius: 2 }} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Kế Hoạch Hành Trình Du Lịch Cá Nhân
            </h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            Tự do sắp xếp thứ tự các điểm dừng, tối ưu lộ trình di chuyển và xuất bản đồ chỉ đường Google Maps
          </p>
        </div>

        {customStops.length > 0 && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <a
              href={googleMapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '10px 18px',
                borderRadius: 8,
                fontSize: '13.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Navigation size={16} />
              <span>Chỉ Đường Lộ Trình (Google Maps)</span>
            </a>

            <button 
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ các điểm dừng trong lịch trình này?')) {
                  onClearTrip();
                }
              }} 
              style={{
                backgroundColor: '#ffffff',
                color: '#ef4444',
                border: '1px solid #fecaca',
                padding: '10px 16px',
                borderRadius: 8,
                fontSize: '13.5px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer'
              }}
            >
              <Trash2 size={15} />
              <span>Xóa tất cả</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Itinerary Container */}
      <div style={{ 
        background: '#ffffff', 
        padding: '24px 28px', 
        borderRadius: 16, 
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        
        {/* Statistics Bar when stops exist */}
        {customStops.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 18,
            marginBottom: 20,
            borderBottom: '1px solid #f1f5f9',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                <span style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  {customStops.length}
                </span>
                <span>Điểm dừng trong hành trình</span>
              </div>

              {coveredDistricts.length > 0 && (
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Khu vực: <strong style={{ color: '#334155' }}>{coveredDistricts.join(', ')}</strong>
                </div>
              )}

              <div style={{ fontSize: '13px', color: '#059669', fontWeight: 600 }}>
                ⏱️ Ước tính: {customStops.length * 1.5} - {customStops.length * 2.5} tiếng trải nghiệm
              </div>
            </div>

            <div style={{ fontSize: '12.5px', color: '#64748b' }}>
              Dùng mũi tên ▲ ▼ để đổi thứ tự các điểm dừng
            </div>
          </div>
        )}

        {/* Stops List */}
        {customStops.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
            {customStops.map((stop, index) => {
              const stopImg = stop.images?.[0]?.url || (typeof stop.images?.[0] === 'string' ? stop.images[0] : null);
              const stopAddress = typeof stop.address === 'string' ? stop.address : (stop.address?.street || stop.address?.district || '');

              return (
                <div 
                  key={stop.id || stop._id || index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    background: '#f8fafc',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.15s ease',
                    flexWrap: 'wrap',
                    gap: 12
                  }}
                >
                  {/* Left: Number + Thumbnail + Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 260 }}>
                    {/* Index Badge */}
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: index === 0 ? '#2563eb' : index === customStops.length - 1 ? '#059669' : '#0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                      flexShrink: 0
                    }}>
                      <span>{index + 1}</span>
                    </div>

                    {/* Thumbnail if available */}
                    {stopImg && (
                      <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                        <img 
                          src={stopImg} 
                          alt={stop.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                    )}

                    {/* Titles */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>
                          {stop.name}
                        </span>
                        {index === 0 && (
                          <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                            Điểm xuất phát
                          </span>
                        )}
                        {index === customStops.length - 1 && customStops.length > 1 && (
                          <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                            Điểm kết thúc
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: 3, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span>📍 {stopAddress || stop.address?.district || 'TP.HCM'}</span>
                        <span>•</span>
                        <span style={{ color: '#2563eb', fontWeight: 600 }}>{stop.categoryName || 'Địa điểm'}</span>
                        {stop.ticketPrice && (
                          <>
                            <span>•</span>
                            <span>{stop.ticketPrice.split('/')[0]}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Order reordering + Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Reordering Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        style={{
                          background: index === 0 ? '#f1f5f9' : '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: 4,
                          padding: '3px 6px',
                          cursor: index === 0 ? 'not-allowed' : 'pointer',
                          color: index === 0 ? '#cbd5e1' : '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Di chuyển lên trước"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === customStops.length - 1}
                        style={{
                          background: index === customStops.length - 1 ? '#f1f5f9' : '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: 4,
                          padding: '3px 6px',
                          cursor: index === customStops.length - 1 ? 'not-allowed' : 'pointer',
                          color: index === customStops.length - 1 ? '#cbd5e1' : '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Di chuyển xuống sau"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    {/* View Details Button */}
                    <button 
                      onClick={() => onSelectPlace(stop)} 
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: 6,
                        padding: '6px 12px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#0f172a',
                        cursor: 'pointer'
                      }}
                    >
                      Xem chi tiết
                    </button>

                    {/* Remove Stop Button */}
                    <button 
                      onClick={() => onRemoveStop(index)} 
                      style={{
                        backgroundColor: '#fee2e2',
                        border: '1px solid #fecaca',
                        borderRadius: 6,
                        padding: '6px 10px',
                        color: '#dc2626',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Xóa điểm này khỏi lịch trình"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Route Summary Notification */}
            <div style={{
              marginTop: 10,
              padding: '12px 18px',
              backgroundColor: '#ecfdf5',
              borderRadius: 10,
              border: '1px solid #a7f3d0',
              color: '#065f46',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>
                  Lộ trình di chuyển liên tục: Bắt đầu từ <strong>{customStops[0]?.name}</strong> qua <strong>{customStops.length - 2 > 0 ? `${customStops.length - 2} điểm trung gian` : 'chặng kế tiếp'}</strong> đến điểm kết thúc <strong>{customStops[customStops.length - 1]?.name}</strong>.
                </span>
              </div>

              <a
                href={googleMapsRouteUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#047857',
                  fontWeight: 700,
                  textDecoration: 'underline',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>Mở lộ trình GPS</span>
                <ExternalLink size={13} />
              </a>
            </div>

          </div>
        ) : (
          /* Empty State when no stops added */
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <Compass size={28} color="#94a3b8" />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
              Chưa có địa điểm nào trong kế hoạch lịch trình
            </h3>

            <p style={{ fontSize: '13.5px', color: '#64748b', maxWidth: 520, margin: '0 auto 20px auto', lineHeight: 1.6 }}>
              Bạn có thể dễ dàng thêm địa điểm bằng cách mở bất kỳ địa điểm nào trong tab <strong>Khám phá</strong> hoặc <strong>Bản đồ</strong> và bấm nút <strong>"+ Thêm vào kế hoạch"</strong>.
            </p>

            {onNavigateExplore && (
              <button
                onClick={onNavigateExplore}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: 20,
                  fontSize: '13.5px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer'
                }}
              >
                <Compass size={15} />
                <span>Khám phá địa điểm ngay</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
