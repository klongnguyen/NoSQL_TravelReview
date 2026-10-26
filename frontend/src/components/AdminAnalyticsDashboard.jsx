import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, PieChart, Star, Compass, 
  MapPin, CheckCircle2, AlertTriangle, RefreshCw, Filter, 
  ThumbsUp, ThumbsDown, MessageSquare, Shield, Activity, Users, Eye, ArrowDownRight, ArrowUpRight
} from 'lucide-react';

export default function AdminAnalyticsDashboard({ places = [], userCount, onRefreshData }) {
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendStats, setBackendStats] = useState(null);

  // Fetch admin stats từ API backend
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5196/api/admin/dashboard', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setBackendStats(data);
      }
    } catch (err) {
      console.warn('Lỗi khi lấy admin stats từ backend:', err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Lọc địa điểm theo vùng nếu có filter
  const filteredPlaces = useMemo(() => {
    if (selectedRegionFilter === 'all') return places;
    return places.filter(p => {
      const city = p.address?.city || '';
      const district = p.address?.district || '';
      if (selectedRegionFilter === 'hcm') return city.includes('Hồ Chí Minh') || district.includes('Quận') || district.includes('Thủ Đức') || district.includes('Củ Chi') || district.includes('Cần Giờ');
      if (selectedRegionFilter === 'vungtau') return city.includes('Vũng Tàu') || district.includes('Vũng Tàu');
      if (selectedRegionFilter === 'tayninh') return city.includes('Tây Ninh');
      if (selectedRegionFilter === 'dongnai_binhduong') return city.includes('Bình Dương') || city.includes('Đồng Nai');
      if (selectedRegionFilter === 'mientay') return city.includes('Tiền Giang') || city.includes('Bến Tre');
      return true;
    });
  }, [places, selectedRegionFilter]);

  // Phân tích dữ liệu Data Analyst
  const analytics = useMemo(() => {
    let totalReviews = 0;
    let totalVisits = 0;
    const categoryCounts = {};

    filteredPlaces.forEach(p => {
      const pReviews = p.reviews || [];
      totalReviews += pReviews.length;
      totalVisits += (p.visitCount || 0);

      // Phân tích category
      const cat = p.categoryName || 'Khác';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // 1. TOP 5 ĐỊA ĐIỂM CÓ LƯỢNG TRUY CẬP (CLICK THỰC TẾ) CAO NHẤT
    const topVisited = [...filteredPlaces]
      .sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0))
      .slice(0, 5);

    // 2. TOP 5 ĐỊA ĐIỂM BỊ ĐÁNH GIÁ THẤP NHẤT (Cần cải thiện chất lượng)
    const lowestRated = [...filteredPlaces]
      .filter(p => (p.reviews && p.reviews.length > 0) || p.ratingAverage != null)
      .sort((a, b) => (a.ratingAverage || 5) - (b.ratingAverage || 5))
      .slice(0, 5);

    return {
      totalPlaces: filteredPlaces.length,
      totalReviews,
      totalVisits,
      categoryCounts,
      topVisited,
      lowestRated
    };
  }, [filteredPlaces]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardStats();
    if (onRefreshData) {
      await onRefreshData();
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const highestVisit = analytics.topVisited[0]?.visitCount || 1;

  // Làm sạch trích dẫn nhận xét (bỏ lặp lại tên địa điểm ở đầu)
  const cleanReviewSnippet = (content, placeName) => {
    if (!content) return '';
    let text = content.trim();
    if (placeName) {
      const prefixWithColon = `${placeName}:`;
      if (text.startsWith(prefixWithColon)) {
        text = text.substring(prefixWithColon.length).trim();
      } else if (text.startsWith(placeName)) {
        text = text.substring(placeName.length).trim();
      }
    }
    return text;
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* 1. Header Báo Cáo Phân Tích */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--aj-hairline, #e2e8f0)',
        borderRadius: 'var(--aj-rounded-md, 8px)',
        padding: '24px 28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>
        <div>
          <div className="aj-eyebrow-lockup">
            <span className="aj-eyebrow-bar" />
            <span className="aj-eyebrow-text">BÁO CÁO PHÂN TÍCH QUẢN TRỊ & DATA ANALYST</span>
          </div>
          <h1 className="aj-headline-md" style={{ margin: '4px 0 6px 0', fontSize: '26px' }}>
            Bảng Chỉ Số Vận Hành & Đo Lường Hành Vi Người Dùng LonGo
          </h1>
          <p className="aj-body-sm" style={{ color: 'var(--aj-slate, #64748b)' }}>
            Dữ liệu tổng hợp từ <strong>{places.length} địa điểm</strong> trên toàn quốc.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="aj-button-pill-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
            title="Đồng bộ dữ liệu mới nhất"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Đang cập nhật...' : 'Làm mới số liệu'}</span>
          </button>
        </div>
      </div>

      {/* 2. Bộ lọc vùng nghiên cứu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginRight: 4 }}>
          Phạm vi phân tích:
        </span>
        <button
          onClick={() => setSelectedRegionFilter('all')}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: selectedRegionFilter === 'all' ? '1px solid #090d16' : '1px solid #e2e8f0',
            background: selectedRegionFilter === 'all' ? '#090d16' : '#ffffff',
            color: selectedRegionFilter === 'all' ? '#ffffff' : '#090d16',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Toàn bộ địa bàn ({places.length})
        </button>
        <button
          onClick={() => setSelectedRegionFilter('hcm')}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: selectedRegionFilter === 'hcm' ? '1px solid #090d16' : '1px solid #e2e8f0',
            background: selectedRegionFilter === 'hcm' ? '#090d16' : '#ffffff',
            color: selectedRegionFilter === 'hcm' ? '#ffffff' : '#090d16',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          TP. Hồ Chí Minh
        </button>
        <button
          onClick={() => setSelectedRegionFilter('vungtau')}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: selectedRegionFilter === 'vungtau' ? '1px solid #090d16' : '1px solid #e2e8f0',
            background: selectedRegionFilter === 'vungtau' ? '#090d16' : '#ffffff',
            color: selectedRegionFilter === 'vungtau' ? '#ffffff' : '#090d16',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Bà Rịa - Vũng Tàu
        </button>
        <button
          onClick={() => setSelectedRegionFilter('tayninh')}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: selectedRegionFilter === 'tayninh' ? '1px solid #090d16' : '1px solid #e2e8f0',
            background: selectedRegionFilter === 'tayninh' ? '#090d16' : '#ffffff',
            color: selectedRegionFilter === 'tayninh' ? '#ffffff' : '#090d16',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Tây Ninh
        </button>
        <button
          onClick={() => setSelectedRegionFilter('dongnai_binhduong')}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: selectedRegionFilter === 'dongnai_binhduong' ? '1px solid #090d16' : '1px solid #e2e8f0',
            background: selectedRegionFilter === 'dongnai_binhduong' ? '#090d16' : '#ffffff',
            color: selectedRegionFilter === 'dongnai_binhduong' ? '#ffffff' : '#090d16',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Bình Dương & Đồng Nai
        </button>
        <button
          onClick={() => setSelectedRegionFilter('mientay')}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: selectedRegionFilter === 'mientay' ? '1px solid #090d16' : '1px solid #e2e8f0',
            background: selectedRegionFilter === 'mientay' ? '#090d16' : '#ffffff',
            color: selectedRegionFilter === 'mientay' ? '#ffffff' : '#090d16',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Tiền Giang (Mỹ Tho)
        </button>
      </div>

      {/* 3. Thẻ Chỉ Số KPI Trọng Điểm Đã Được Chuẩn Hóa */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16
      }}>
        {/* KPI 1: TỔNG ĐỊA ĐIỂM */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>TỔNG ĐỊA ĐIỂM</span>
            <Compass size={18} color="#090d16" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8, color: '#090d16' }}>
            {analytics.totalPlaces}
          </div>
        </div>

        {/* KPI 2: SỐ LƯỢNG NGƯỜI DÙNG */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>SỐ LƯỢNG NGƯỜI DÙNG</span>
            <Users size={18} color="#090d16" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8, color: '#090d16' }}>
            {userCount || backendStats?.totalUsers || 24}
          </div>
        </div>

        {/* KPI 3: TỔNG LƯỢT TRUY CẬP */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>TỔNG LƯỢT TRUY CẬP</span>
            <Eye size={18} color="#090d16" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8, color: '#090d16' }}>
            {(backendStats?.totalVisits ? Number(backendStats.totalVisits) : analytics.totalVisits).toLocaleString('vi-VN')}
          </div>
        </div>

        {/* KPI 4: TỔNG BÀI VIẾT CỘNG ĐỒNG */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>BÀI VIẾT CỘNG ĐỒNG</span>
            <MessageSquare size={18} color="#090d16" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8, color: '#090d16' }}>
            {backendStats?.totalPosts || 18}
          </div>
        </div>
      </div>

      {/* 4. HAI KHỐI PHÂN TÍCH TRỌNG TÂM: TOP TRUY CẬP NHIỀU NHẤT & TOP ĐÁNH GIÁ THẤP NHẤT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', gap: 20 }}>
        
        {/* KHỐI 1: TOP 5 ĐỊA ĐIỂM CÓ LƯỢNG TRUY CẬP CAO NHẤT */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <TrendingUp size={18} color="#090d16" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#090d16', margin: 0 }}>
              Top 5 Địa Điểm Có Lượng Truy Cập Cao Nhất
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {analytics.topVisited.map((p, idx) => {
              const visit = p.visitCount || 0;
              const pct = highestVisit > 0 ? Math.min(100, Math.round((visit / highestVisit) * 100)) : 0;
              const rankColor = idx === 0 ? '#ca8a04' : (idx === 1 ? '#94a3b8' : (idx === 2 ? '#b45309' : '#090d16'));

              return (
                <div key={p.id || p._id || idx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ 
                        width: 22, height: 22, borderRadius: '50%', 
                        background: rankColor, 
                        color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: 11, fontWeight: 900 
                      }}>
                        {idx + 1}
                      </span>
                      <strong style={{ color: '#090d16' }}>{p.name}</strong>
                      <span style={{ fontSize: 11, color: '#64748b' }}>({p.categoryName || 'Di tích'})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 800, color: '#090d16' }}>
                      <Eye size={13} />
                      <span>{visit.toLocaleString('vi-VN')} clicks</span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.max(pct, 5)}%`, height: '100%', background: '#090d16', borderRadius: 9999, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KHỐI 2: TOP 5 ĐỊA ĐIỂM BỊ ĐÁNH GIÁ THẤP NHẤT */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <AlertTriangle size={18} color="#090d16" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#090d16', margin: 0 }}>
              Top 5 Địa Điểm Bị Đánh Giá Thấp Nhất
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {analytics.lowestRated.map((p, idx) => {
              const rating = p.ratingAverage ? Number(p.ratingAverage).toFixed(1) : (p.rating ? Number(p.rating).toFixed(1) : 'Chưa có');
              const pReviews = p.reviews || [];
              const lowestReview = pReviews.find(r => r.rating <= 3) || pReviews[0];
              const cleanedSnippet = cleanReviewSnippet(lowestReview?.content, p.name);
              const rankColor = idx === 0 ? '#ca8a04' : (idx === 1 ? '#94a3b8' : (idx === 2 ? '#b45309' : '#090d16'));

              return (
                <div key={p.id || p._id || idx} style={{ 
                  padding: '12px 14px', 
                  borderRadius: 6, 
                  background: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ 
                        width: 22, height: 22, borderRadius: '50%', 
                        background: rankColor, 
                        color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: 11, fontWeight: 900 
                      }}>
                        {idx + 1}
                      </span>
                      <strong style={{ fontSize: 13, color: '#090d16' }}>{p.name}</strong>
                    </div>

                    <span style={{ 
                      background: '#090d16', color: '#ffffff', 
                      padding: '2px 8px', borderRadius: 4, 
                      fontSize: 11, fontWeight: 800 
                    }}>
                      ★ {rating} ({pReviews.length} đánh giá)
                    </span>
                  </div>

                  {cleanedSnippet && (
                    <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginTop: 3 }}>
                      💬 "{cleanedSnippet.length > 95 ? cleanedSnippet.slice(0, 95) + '...' : cleanedSnippet}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 5. Cơ Cấu Địa Điểm Theo Danh Mục */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#090d16', margin: 0 }}>
            Cơ Cấu Địa Điểm Theo Danh Mục Du Lịch / Ăn Uống
          </h3>
          <PieChart size={20} color="#090d16" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {Object.entries(analytics.categoryCounts).map(([cat, count]) => {
            const pct = Number(((count / Math.max(1, analytics.totalPlaces)) * 100).toFixed(1));
            return (
              <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 14px', background: '#f8fafc', borderRadius: 6, border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
                  <span>{cat}</span>
                  <span style={{ fontWeight: 800, color: '#090d16' }}>{count} địa điểm ({pct}%)</span>
                </div>
                <div style={{ width: '100%', background: '#e2e8f0', height: 6, borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: '#090d16', borderRadius: 9999 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
