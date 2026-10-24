import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Star, MapPin, Share2, Plus, Info, RefreshCw } from 'lucide-react';
import { recommendationService } from '../services/api';

export default function GraphRecommendations({ places, onSelectPlace, onAddToTrip }) {
  // Điểm xuất phát người dùng đang quan tâm hoặc vừa ghé thăm
  const [selectedOriginSlug, setSelectedOriginSlug] = useState('dinh-doc-lap');
  const [liveFlow, setLiveFlow] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mạng lưới đề xuất liên kết dựa trên hành trình và trải nghiệm thực tế của du khách
  const graphBehaviorRules = {
    'Dinh Độc Lập (Hội trường Thống Nhất)': {
      category: 'Du lịch & Di tích',
      nextStops: [
        {
          name: 'The Workshop Coffee',
          reason: '88% du khách chọn quán cà phê specialty cổ điển này để nghỉ chân sau khi đi bộ tham quan khuôn viên Dinh.',
          probability: '88%',
          distance: '650m',
          slug: 'the-workshop-coffee'
        },
        {
          name: 'Nhà Thờ Đức Bà Sài Gòn',
          reason: 'Điểm tham quan kế cận chỉ cách 5 phút đi bộ qua công viên 30/4 rợp bóng cây.',
          probability: '94%',
          distance: '450m',
          slug: 'nha-tho-duc-ba-sai-gon'
        },
        {
          name: 'Phở Hòa Pasteur',
          reason: 'Lựa chọn ăn trưa phổ biến nhất được du khách đề xuất trong cùng buổi sáng.',
          probability: '76%',
          distance: '1.2km',
          slug: 'pho-hoa-pasteur'
        }
      ]
    },
    'Chợ Bến Thành': {
      category: 'Du lịch & Di tích',
      nextStops: [
        {
          name: 'Bánh Mì Huỳnh Hoa',
          reason: '92% du khách ghé mua bánh mì nổi tiếng sau khi dạo mua sắm tại chợ Bến Thành.',
          probability: '92%',
          distance: '500m',
          slug: 'banh-mi-huynh-hoa'
        },
        {
          name: 'Phố Đi Bộ Nguyễn Huệ',
          reason: 'Hành trình dạo bộ tiếp nối ra quảng trường trung tâm ngắm thành phố về đêm.',
          probability: '89%',
          distance: '600m',
          slug: 'pho-di-bo-nguyen-hue'
        }
      ]
    },
    'Nhà Thờ Đức Bà Sài Gòn': {
      category: 'Du lịch & Di tích',
      nextStops: [
        {
          name: 'Bưu Điện Trung Tâm Sài Gòn',
          reason: 'Nằm ngay liền kề quảng trường Công Xã Paris, 98% du khách check-in cặp đôi địa danh này cùng lúc.',
          probability: '98%',
          distance: '50m',
          slug: 'buu-dien-trung-tam'
        },
        {
          name: 'The Workshop Coffee',
          reason: 'Điểm dừng chân thưởng thức cà phê và ngắm phố phường thanh lịch chỉ cách 700m.',
          probability: '81%',
          distance: '700m',
          slug: 'the-workshop-coffee'
        }
      ]
    }
  };

  const originOptions = [
    { slug: 'dinh-doc-lap', name: 'Dinh Độc Lập' },
    { slug: 'cho-ben-thanh', name: 'Chợ Bến Thành' },
    { slug: 'nha-tho-duc-ba-sai-gon', name: 'Nhà Thờ Đức Bà' }
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    recommendationService.getTouristFlow(selectedOriginSlug)
      .then(res => {
        if (isMounted && res.data) {
          setLiveFlow(res.data);
        }
      })
      .catch(() => {
        // Fallback gracefully
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [selectedOriginSlug]);

  const currentBehavior = liveFlow || (
    selectedOriginSlug === 'cho-ben-thanh' ? graphBehaviorRules['Chợ Bến Thành'] :
    selectedOriginSlug === 'nha-tho-duc-ba-sai-gon' ? graphBehaviorRules['Nhà Thờ Đức Bà Sài Gòn'] :
    graphBehaviorRules['Dinh Độc Lập (Hội trường Thống Nhất)']
  );

  const getPlaceBySlug = (slug) => {
    return places.find(p => p.slug === slug || (p.id || p._id) === slug || p.name.toLowerCase().includes(slug.replace(/-/g, ' ')));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div className="aj-eyebrow-lockup">
          <span className="aj-eyebrow-bar" />
          <span className="aj-eyebrow-text">GỢI Ý THEO HÀNH TRÌNH DU KHÁCH</span>
        </div>
        <h2 className="aj-headline-md" style={{ marginTop: 4, marginBottom: 4 }}>
          Điểm Dừng Chân Tiếp Theo Cho Chuyến Đi Của Bạn
        </h2>
        <p className="aj-body-sm">
          Gợi ý thông minh dựa trên thói quen di chuyển và đánh giá thực tế từ cộng đồng du khách
        </p>
      </div>

      {/* Selector: Chọn địa điểm du khách vừa ghé thăm */}
      <div style={{ background: '#ffffff', padding: 18, borderRadius: 'var(--aj-rounded-md)', border: '1px solid var(--aj-hairline)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--aj-charcoal)' }}>
            📍 Bạn đang ở hoặc quan tâm đến điểm tham quan nào?
          </label>
          {loading && (
            <span style={{ fontSize: '12px', color: 'var(--aj-slate)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <RefreshCw size={12} className="spin" /> Đang cập nhật gợi ý...
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {originOptions.map(opt => (
            <button
              key={opt.slug}
              onClick={() => setSelectedOriginSlug(opt.slug)}
              className={selectedOriginSlug === opt.slug ? 'aj-button-pill-dark' : 'aj-button-pill-outline'}
              style={{ fontSize: '13px', padding: '6px 14px' }}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Trực quan hóa gợi ý tiếp theo */}
      <div style={{ background: '#ffffff', padding: 20, borderRadius: 'var(--aj-rounded-md)', border: '1px solid var(--aj-hairline)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <Sparkles size={16} color="var(--aj-primary)" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--aj-ink)' }}>
            Lộ trình tiếp nối được du khách đánh giá cao nhất:
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {currentBehavior.nextStops.map((stop, idx) => {
            const matchedPlace = getPlaceBySlug(stop.slug);

            return (
              <div 
                key={idx}
                style={{
                  padding: 16,
                  border: '1px solid var(--aj-hairline)',
                  borderRadius: 'var(--aj-rounded-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'var(--aj-soft)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#065f46',
                      background: '#ecfdf5',
                      padding: '2px 8px',
                      borderRadius: '9999px'
                    }}>
                      Khuyên chọn: {stop.probability} du khách
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--aj-slate)' }}>
                      Cách {stop.distance}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: 6, color: 'var(--aj-ink)' }}>
                    {stop.name}
                  </h4>

                  <p style={{ fontSize: '13px', color: 'var(--aj-charcoal)', lineHeight: 1.45, marginBottom: 14 }}>
                    {stop.reason}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {matchedPlace && (
                    <button 
                      onClick={() => onSelectPlace(matchedPlace)}
                      className="aj-button-pill-dark" 
                      style={{ flex: 1, padding: '7px 0', fontSize: '13px' }}
                    >
                      Xem chi tiết
                    </button>
                  )}
                  {matchedPlace && (
                    <button 
                      onClick={() => onAddToTrip(matchedPlace)}
                      className="aj-button-pill-outline"
                      style={{ flex: 1, padding: '7px 0', fontSize: '13px' }}
                    >
                      + Kế hoạch
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
