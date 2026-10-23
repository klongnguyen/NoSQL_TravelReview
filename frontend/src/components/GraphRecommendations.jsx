import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, ArrowRight, Star, MapPin, Share2, Plus, Info, RefreshCw } from 'lucide-react';
import { recommendationService } from '../services/api';

export default function GraphRecommendations({ places, onSelectPlace, onAddToTrip }) {
  // Điểm xuất phát người dùng đang quan tâm hoặc vừa ghé thăm
  const [selectedOriginSlug, setSelectedOriginSlug] = useState('dinh-doc-lap');
  const [liveFlow, setLiveFlow] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mô phỏng mạng lưới đồ thị hành vi du khách thực tế tại TP.HCM
  const graphBehaviorRules = {
    'Dinh Độc Lập (Hội trường Thống Nhất)': {
      category: 'Du lịch & Di tích',
      nextStops: [
        {
          name: 'The Workshop Coffee',
          reason: '88% du khách chọn quán specialty coffee cổ điển này để nghỉ chân sau khi đi bộ tham quan khuôn viên Dinh.',
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
          name: 'Pizza 4P\'s — Bến Thành',
          reason: 'Điểm hẹn ẩm thực cao cấp ngay góc đường Thủ Khoa Huân đối diện chợ.',
          probability: '85%',
          distance: '200m',
          slug: 'pizza-4ps-ben-thanh'
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
          slug: 'buu-dien-trung-tam-sai-gon'
        },
        {
          name: 'Okkio Caffe — Lê Lợi',
          reason: 'Điểm dừng chân thưởng thức cà phê và ngắm phố phường thanh lịch.',
          probability: '81%',
          distance: '700m',
          slug: 'okkio-caffe-le-loi'
        }
      ]
    },
    'Landmark 81 SkyView': {
      category: 'Vui chơi & Giải trí',
      nextStops: [
        {
          name: 'Caravelle Saigon',
          reason: 'Du khách thường quay về trung tâm Quận 1 thưởng thức tiệc tối và ngắm sông Sài Gòn.',
          probability: '84%',
          distance: '3.5km',
          slug: 'caravelle-saigon'
        },
        {
          name: 'The Workshop Coffee',
          reason: 'Thư giãn trò chuyện sau chuyến ngắm cảnh toàn thành phố từ tầng cao.',
          probability: '79%',
          distance: '3.2km',
          slug: 'the-workshop-coffee'
        }
      ]
    }
  };

  const originOptions = [
    { slug: 'dinh-doc-lap', name: 'Dinh Độc Lập' },
    { slug: 'cho-ben-thanh', name: 'Chợ Bến Thành' },
    { slug: 'nha-tho-duc-ba-sai-gon', name: 'Nhà Thờ Đức Bà' },
    { slug: 'landmark-81-skyview', name: 'Landmark 81 SkyView' },
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
        // Fallback gracefully to offline simulation
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [selectedOriginSlug]);

  const currentBehavior = liveFlow || (
    selectedOriginSlug === 'cho-ben-thanh' ? graphBehaviorRules['Chợ Bến Thành'] :
    selectedOriginSlug === 'nha-tho-duc-ba-sai-gon' ? graphBehaviorRules['Nhà Thờ Đức Bà Sài Gòn'] :
    selectedOriginSlug === 'landmark-81-skyview' ? graphBehaviorRules['Landmark 81 SkyView'] :
    graphBehaviorRules['Dinh Độc Lập (Hội trường Thống Nhất)']
  );

  // Tìm chi tiết địa điểm tương ứng từ danh sách places đã tải từ Atlas
  const getPlaceBySlug = (slug) => {
    return places.find(p => p.slug === slug || p.name.toLowerCase().includes(slug.replace(/-/g, ' ')));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Gợi Ý Điểm Đến Tiếp Theo (Neo4j Graph Engine)</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Mô phỏng chuỗi hành vi của hàng ngàn du khách khi khám phá TP.HCM để gợi ý địa điểm tiếp theo phù hợp nhất
        </p>
      </div>

      {/* Selector: Chọn địa điểm du khách vừa ghé thăm */}
      <div style={{ background: '#ffffff', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            📍 Giả định bạn đang ở hoặc vừa tham quan xong:
          </label>
          {loading && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <RefreshCw size={12} className="spin" /> Đang tính toán đồ thị...
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {originOptions.map(opt => (
            <button
              key={opt.slug}
              onClick={() => setSelectedOriginSlug(opt.slug)}
              className={selectedOriginSlug === opt.slug ? 'btn-clean-primary' : 'btn-clean-outline'}
              style={{ fontSize: '0.85rem' }}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Trực quan hóa quan hệ đồ thị (Graph Transition Diagram) */}
      <div style={{ background: '#ffffff', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <Sparkles size={16} color="#0284c7" />
          <h3 style={{ fontSize: '1.1rem' }}>Mô hình liên kết hành vi (Collaborative Graph Traversal)</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {currentBehavior.nextStops.map((stop, idx) => {
            const matchedPlace = getPlaceBySlug(stop.slug);

            return (
              <div 
                key={idx}
                style={{
                  padding: 16,
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'var(--bg-subtle)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#065f46',
                      background: '#ecfdf5',
                      padding: '2px 8px',
                      borderRadius: 9999
                    }}>
                      Xác suất chọn: {stop.probability}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Khoảng cách: {stop.distance}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', marginBottom: 6 }}>
                    {stop.name}
                  </h4>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 12 }}>
                    {stop.reason}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {matchedPlace && (
                    <button 
                      onClick={() => onSelectPlace(matchedPlace)}
                      className="btn-clean-primary" 
                      style={{ flex: 1, padding: '6px 0', fontSize: '0.8rem' }}
                    >
                      Xem chi tiết
                    </button>
                  )}
                  {matchedPlace && (
                    <button 
                      onClick={() => onAddToTrip(matchedPlace)}
                      className="btn-clean-outline"
                      style={{ flex: 1, padding: '6px 0', fontSize: '0.8rem' }}
                    >
                      + Kế hoạch
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Giải thích kỹ thuật Neo4j Cypher query */}
        <div style={{
          marginTop: 20,
          padding: '12px 16px',
          background: '#0f172a',
          color: '#e2e8f0',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          fontFamily: 'monospace'
        }}>
          <div style={{ color: '#38bdf8', marginBottom: 4 }}>// Truy vấn Cypher tương ứng trên Neo4j AuraDB:</div>
          <div>MATCH (p1:Place &#123;slug: "{selectedOriginSlug}"&#125;)&lt;-[:VISITED]-(u:User)-[:VISITED]-&gt;(p2:Place)</div>
          <div>WHERE p1 &lt;&gt; p2</div>
          <div>RETURN p2.name, count(u) AS frequency ORDER BY frequency DESC LIMIT 3;</div>
        </div>
      </div>
    </div>
  );
}
