import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Trash2, ArrowUp, ArrowDown, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export default function TripPlanner({ customStops, onRemoveStop, onSelectPlace, onClearTrip, onAddStopsFromPreset }) {
  const [selectedPresetId, setSelectedPresetId] = useState('preset-1');

  // Các lịch trình mẫu chuẩn bị sẵn cho du khách đến TP.HCM
  const presetItineraries = [
    {
      id: 'preset-1',
      title: '1 Ngày Dấu Ấn Lịch Sử & Cà Phê Specialty',
      description: 'Lộ trình tối ưu cho du khách lần đầu đến TP.HCM, kết hợp các di tích biểu tượng và trải nghiệm cà phê văn hóa.',
      stops: [
        {
          time: '08:30 - 10:30',
          title: 'Dinh Độc Lập (Hội trường Thống Nhất)',
          district: 'Quận 1',
          desc: 'Khởi đầu ngày mới tìm hiểu lịch sử hào hùng và kiến trúc thời kỳ 1960 độc đáo.',
          category: 'Du lịch & Di tích'
        },
        {
          time: '11:00 - 12:30',
          title: 'Phở Hòa Pasteur',
          district: 'Quận 3',
          desc: 'Thưởng thức tô phở Nam truyền thống đậm đà với quẩy nóng giòn.',
          category: 'Ẩm thực & Nhà hàng'
        },
        {
          time: '13:00 - 14:30',
          title: 'Bưu Điện Trung Tâm & Nhà Thờ Đức Bà',
          district: 'Quận 1',
          desc: 'Check-in kiến trúc Phục Hưng Pháp và gửi một tấm bưu thiếp lưu niệm.',
          category: 'Du lịch & Di tích'
        },
        {
          time: '15:00 - 16:30',
          title: 'The Workshop Coffee',
          district: 'Quận 1',
          desc: 'Thư giãn thưởng thức cà phê Pour-over thủ công tại chung cư cổ Ngô Đức Kế.',
          category: 'Cà phê & Trà'
        },
        {
          time: '17:30 - 20:30',
          title: 'Phố Đi Bộ Nguyễn Huệ & Chợ Bến Thành',
          district: 'Quận 1',
          desc: 'Dạo phố đêm sôi động, ngắm nhìn ánh sáng thành phố và thưởng thức quà vặt.',
          category: 'Vui chơi & Giải trí'
        }
      ]
    },
    {
      id: 'preset-2',
      title: 'Food Tour & Khám Phá Ẩm Thực Michelin',
      description: 'Lộ trình dành riêng cho tín đồ ẩm thực muốn thử trọn vẹn những món ăn nức tiếng Sài Gòn trong một ngày.',
      stops: [
        {
          time: '08:00 - 09:00',
          title: 'Bánh Mì Huỳnh Hoa',
          district: 'Quận 1',
          desc: 'Bữa sáng no nê với ổ bánh mì pate ngập tràn chả lụa và thịt nguội.',
          category: 'Ẩm thực & Nhà hàng'
        },
        {
          time: '11:30 - 13:00',
          title: 'Cơm Tấm Ba Ghiền (Michelin Guide)',
          district: 'Phú Nhuận',
          desc: 'Đĩa cơm sườn nướng mỡ hành khổng lồ trứ danh chuẩn vị miền Nam.',
          category: 'Ẩm thực & Nhà hàng'
        },
        {
          time: '14:30 - 16:00',
          title: 'Okkio Caffe — Lê Lợi',
          district: 'Quận 1',
          desc: 'Nghỉ chân với ly Cold Brew mát lạnh trong không gian tone đỏ đất ấm áp.',
          category: 'Cà phê & Trà'
        },
        {
          time: '18:00 - 20:00',
          title: 'Pizza 4P\'s Bến Thành',
          district: 'Quận 1',
          desc: 'Bữa tối phô mai Burrata tươi và pizza nướng củi phong cách Nhật.',
          category: 'Ẩm thực & Nhà hàng'
        },
        {
          time: '20:30 - khuya',
          title: 'Phố Tây Bùi Viện',
          district: 'Quận 1',
          desc: 'Hòa mình vào không khí đêm sôi động, thưởng thức bia và âm nhạc đường phố.',
          category: 'Vui chơi & Giải trí'
        }
      ]
    },
    {
      id: 'preset-3',
      title: 'Check-in Sài Gòn Hiện Đại & Skyline',
      description: 'Ngắm nhìn sự chuyển mình ngoạn mục của TP.HCM từ tòa tháp cao nhất Việt Nam đến bán đảo ven sông.',
      stops: [
        {
          time: '09:00 - 11:30',
          title: 'Thảo Cầm Viên Sài Gòn',
          district: 'Quận 1',
          desc: 'Dạo bộ dưới bóng cây cổ thụ hơn trăm năm tuổi và không gian xanh thanh bình.',
          category: 'Vui chơi & Giải trí'
        },
        {
          time: '14:00 - 17:00',
          title: 'Landmark 81 SkyView',
          district: 'Bình Thạnh',
          desc: 'Lên tầng 81 ngắm trọn vẹn toàn cảnh sông Sài Gòn và thành phố từ trên cao.',
          category: 'Vui chơi & Giải trí'
        },
        {
          time: '18:00 - 21:00',
          title: 'The Reverie Saigon / Bến Bạch Đằng',
          district: 'Quận 1',
          desc: 'Bữa tối sang trọng bên bờ sông và ngắm tàu thuyền du lịch lộng lẫy về đêm.',
          category: 'Khách sạn & Nghỉ dưỡng'
        }
      ]
    }
  ];

  const currentPreset = presetItineraries.find(p => p.id === selectedPresetId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Lập Kế Hoạch Du Lịch TP.HCM</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Tối ưu hóa thời gian và lộ trình di chuyển giữa các điểm tham quan, ẩm thực và cà phê tại thành phố
        </p>
      </div>

      {/* 1. Lịch trình tự tạo của bạn (Custom stops) */}
      <div style={{ background: '#ffffff', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>Lịch trình cá nhân của bạn</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              ({customStops.length} địa điểm đã chọn từ bản đồ hoặc danh sách)
            </span>
          </div>

          {customStops.length > 0 && (
            <button onClick={onClearTrip} className="btn-clean-ghost" style={{ color: '#ef4444', fontSize: '0.85rem' }}>
              <Trash2 size={14} /> Xóa lịch trình
            </button>
          )}
        </div>

        {customStops.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {customStops.map((stop, index) => (
              <div 
                key={stop.id || stop._id || index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#0f172a',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{stop.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {stop.address?.district || 'TP.HCM'} • {stop.categoryName || 'Địa điểm'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button 
                    onClick={() => onSelectPlace(stop)} 
                    className="btn-clean-ghost" 
                    style={{ fontSize: '0.8rem' }}
                  >
                    Xem chi tiết
                  </button>
                  <button 
                    onClick={() => onRemoveStop(index)} 
                    className="btn-clean-ghost" 
                    style={{ color: '#ef4444', padding: 6 }}
                    title="Xóa khỏi lịch trình"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 12, padding: '10px 14px', background: '#ecfdf5', borderRadius: 'var(--radius-sm)', color: '#065f46', fontSize: '0.85rem' }}>
              ✓ Lộ trình gợi ý di chuyển: Bắt đầu từ <strong>{customStops[0]?.name}</strong> đến <strong>{customStops[customStops.length - 1]?.name}</strong>.
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Bạn chưa thêm địa điểm nào vào lịch trình. Hãy vào tab <strong>Bản đồ</strong> hoặc <strong>Khám phá</strong> và bấm <strong>+ Thêm vào kế hoạch</strong>, hoặc chọn nhanh các lịch trình mẫu gợi ý bên dưới!
          </div>
        )}
      </div>

      {/* 2. Lịch trình mẫu tuyển chọn (Curated Presets) */}
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Gợi Ý Lịch Trình Tiêu Biểu Cho Du Khách</h3>
        
        {/* Preset Selector Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
          {presetItineraries.map(preset => (
            <button
              key={preset.id}
              onClick={() => setSelectedPresetId(preset.id)}
              className={selectedPresetId === preset.id ? 'btn-clean-primary' : 'btn-clean-outline'}
              style={{ fontSize: '0.85rem' }}
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* Selected Preset Details */}
        {currentPreset && (
          <div style={{ background: '#ffffff', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{currentPreset.title}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{currentPreset.description}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', paddingLeft: 24, borderLeft: '2px solid #e2e8f0', marginLeft: 12 }}>
              {currentPreset.stops.map((stop, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute',
                    left: -31,
                    top: 2,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#0284c7',
                    border: '2px solid #ffffff'
                  }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#0284c7', fontWeight: 600, marginBottom: 2 }}>
                    <Clock size={13} />
                    <span>{stop.time}</span>
                  </div>

                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{stop.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>{stop.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
