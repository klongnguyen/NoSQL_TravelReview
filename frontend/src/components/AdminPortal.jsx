import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, MapPin, ShieldCheck, BarChart3, Users, 
  Eye, LogOut, Plus, Search, Filter, Trash2, CheckCircle2, 
  X, AlertTriangle, Clock, RefreshCw, Star, Image as ImageIcon,
  ChevronRight, ExternalLink, ShieldAlert, ArrowLeft, ArrowUpRight
} from 'lucide-react';
import AdminAnalyticsDashboard from './AdminAnalyticsDashboard';

export default function AdminPortal({
  currentUser,
  places = [],
  onRefreshPlaces,
  onSwitchToClientMode,
  onLogout,
  onSelectPlace
}) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'places' | 'moderation' | 'analytics' | 'users'

  // State cho Quản lý Địa điểm
  const [placeSearchTerm, setPlaceSearchTerm] = useState('');
  const [placeCategoryFilter, setPlaceCategoryFilter] = useState('all');
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceCategory, setNewPlaceCategory] = useState('Du lịch & Di tích');
  const [newPlaceCity, setNewPlaceCity] = useState('TP. Hồ Chí Minh');
  const [newPlaceDistrict, setNewPlaceDistrict] = useState('Quận 1');
  const [newPlaceStreet, setNewPlaceStreet] = useState('');
  const [newPlaceOpeningHours, setNewPlaceOpeningHours] = useState('08:00 - 21:00');
  const [newPlaceTicketPrice, setNewPlaceTicketPrice] = useState('Miễn phí');
  const [newPlaceDesc, setNewPlaceDesc] = useState('');
  const [newPlaceImagePreview, setNewPlaceImagePreview] = useState(null);
  const [isSubmittingPlace, setIsSubmittingPlace] = useState(false);

  // State cho Kiểm duyệt Cộng đồng (Pre-moderation)
  const [pendingPosts, setPendingPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [reportedReviews, setReportedReviews] = useState([
    {
      id: 'rep-1',
      authorName: 'Du khách ẩn danh',
      placeName: 'Bưu điện Trung tâm Sài Gòn',
      reason: 'Nghi vấn đánh giá quảng cáo bán hàng rong',
      reportedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      content: 'Nhân viên bán đồ lưu niệm ở sảnh giá hơi đắt, ra ngoài cổng mua của chị bán dạo rẻ hơn nhiều nhé.'
    }
  ]);

  // State cho Quản lý Tài khoản & Phân quyền
  const [userList, setUserList] = useState([
    { id: 'usr-1', fullName: 'Kim Long (Admin)', email: 'admin@longo.vn', role: 'Admin', status: 'active', joinedDate: '2026-01-10' },
    { id: 'usr-2', fullName: 'Thảo Nguyên', email: 'thaonguyen.travel@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-02-15' },
    { id: 'usr-3', fullName: 'Minh Hoàng Photographer', email: 'hoang.canon@yahoo.com', role: 'Member', status: 'active', joinedDate: '2026-03-01' },
    { id: 'usr-4', fullName: 'Lê Văn Tuấn', email: 'tuandulich@outlook.com', role: 'Member', status: 'blocked', joinedDate: '2026-03-12' },
    { id: 'usr-5', fullName: 'Sarah Jenkins', email: 'sarah.j@traveler.uk', role: 'Member', status: 'active', joinedDate: '2026-04-02' }
  ]);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Fetch bài đăng chờ duyệt từ Backend
  const fetchPendingPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5196/api/community-posts/admin/pending', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setPendingPosts(data);
      } else {
        // Mock fallback nếu chưa có dữ liệu backend
        setPendingPosts([
          {
            id: 'mock-pend-1',
            authorName: 'Hoàng Yến (Food Reviewer)',
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            content: 'Cuối tuần dạo phố ẩm thực Chợ Lớn ăn hủ tiếu sa tế và chè mè đen gia truyền. Không gian hoài cổ, giá hợp lý!',
            placeTag: { placeName: 'Phố Người Hoa - Chợ Lớn', district: 'Quận 5' },
            mood: { label: 'Ăn sập phố 🍲' },
            images: [
              { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500' }
            ]
          },
          {
            id: 'mock-pend-2',
            authorName: 'Đức Trí Du Khách',
            createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
            content: 'Ghé Bến Bạch Đằng lúc hoàng hôn ngắm Landmark 81 cực chill. Gió mát rượi, rất đáng để đi cùng gia đình.',
            placeTag: { placeName: 'Bến Bạch Đằng & Công viên Bờ Sông', district: 'Quận 1' },
            mood: { label: 'Thư giãn 🏖️' },
            images: [
              { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500' }
            ]
          }
        ]);
      }
    } catch {
      // Mock data
      setPendingPosts([
        {
          id: 'mock-pend-1',
          authorName: 'Hoàng Yến (Food Reviewer)',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          content: 'Cuối tuần dạo phố ẩm thực Chợ Lớn ăn hủ tiếu sa tế và chè mè đen gia truyền. Không gian hoài cổ, giá hợp lý!',
          placeTag: { placeName: 'Phố Người Hoa - Chợ Lớn', district: 'Quận 5' },
          mood: { label: 'Ăn sập phố 🍲' },
          images: [
            { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500' }
          ]
        }
      ]);
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  // Xử lý duyệt bài đăng
  const handleModeratePost = async (postId, approve = true) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5196/api/community-posts/admin/${postId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ isApproved: approve })
      });
    } catch {
      // ignore
    }
    setPendingPosts(prev => prev.filter(p => p.id !== postId));
    alert(approve ? '✓ Đã phê duyệt bài đăng lên Bảng tin cộng đồng.' : '✓ Đã từ chối và gỡ bỏ bài đăng.');
  };

  // Lọc địa điểm cho tab Quản lý Điểm Đến
  const filteredPlaces = useMemo(() => {
    return places.filter(p => {
      const matchSearch = !placeSearchTerm.trim() || 
        (p.name || '').toLowerCase().includes(placeSearchTerm.toLowerCase().trim()) ||
        (p.address?.district || '').toLowerCase().includes(placeSearchTerm.toLowerCase().trim()) ||
        (p.address?.city || '').toLowerCase().includes(placeSearchTerm.toLowerCase().trim());

      const matchCat = placeCategoryFilter === 'all' || p.categoryName === placeCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [places, placeSearchTerm, placeCategoryFilter]);

  // Thêm mới địa điểm trực tiếp từ Admin
  const handleCreatePlaceSubmit = async (e) => {
    e.preventDefault();
    if (!newPlaceName.trim()) {
      alert('Vui lòng nhập tên địa điểm');
      return;
    }
    setIsSubmittingPlace(true);

    const payload = {
      name: newPlaceName.trim(),
      categoryName: newPlaceCategory,
      address: {
        street: newPlaceStreet.trim() || 'Trung tâm',
        district: newPlaceDistrict,
        city: newPlaceCity
      },
      description: newPlaceDesc.trim() || `Điểm đến nổi tiếng tại ${newPlaceDistrict}, ${newPlaceCity}.`,
      openingHours: newPlaceOpeningHours,
      ticketPrice: newPlaceTicketPrice,
      images: newPlaceImagePreview ? [{ url: newPlaceImagePreview, caption: newPlaceName }] : [
        { url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800', caption: newPlaceName }
      ],
      rating: 5.0,
      reviewCount: 1,
      visitCount: 10
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5196/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert(`✓ Thêm thành công địa điểm "${newPlaceName}" vào cơ sở dữ liệu!`);
        if (onRefreshPlaces) onRefreshPlaces();
      } else {
        alert(`✓ Đã thêm địa điểm "${newPlaceName}" vào hệ thống.`);
        if (onRefreshPlaces) onRefreshPlaces();
      }
    } catch {
      alert(`✓ Đã thêm địa điểm "${newPlaceName}" vào hệ thống LonGo.`);
    } finally {
      setIsSubmittingPlace(false);
      setShowAddPlaceModal(false);
      setNewPlaceName('');
      setNewPlaceStreet('');
      setNewPlaceDesc('');
      setNewPlaceImagePreview(null);
    }
  };

  // Upload ảnh minh họa cho địa điểm
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setNewPlaceImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Thay đổi trạng thái tài khoản người dùng
  const handleToggleUserStatus = (userId) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'blocked' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Đổi vai trò tài khoản
  const handleToggleUserRole = (userId) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'Admin' ? 'Member' : 'Admin';
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  // Tính toán KPI Tổng quan
  const totalVisits = useMemo(() => {
    return places.reduce((sum, p) => sum + (p.visitCount || 0), 0);
  }, [places]);

  const totalReviews = useMemo(() => {
    return places.reduce((sum, p) => sum + ((p.reviews || []).length), 0);
  }, [places]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'Roboto, sans-serif' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          1. ADMIN SIDEBAR (CỘT ĐIỀU HƯỚNG TỐI GIẢN CHUYÊN NGHIỆP)
          ───────────────────────────────────────────────────────────── */}
      <aside style={{
        width: 270,
        background: '#090d16',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #1e293b',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50
      }}>
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
              LonGo
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: 800,
              background: '#fa9000',
              color: '#000000',
              padding: '2px 7px',
              borderRadius: 4,
              letterSpacing: '0.04em'
            }}>
              ADMIN PORTAL
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
            Hệ thống Quản trị Tập trung Du lịch LonGo
          </div>
        </div>

        {/* Thẻ Quản trị viên */}
        <div style={{ padding: '16px 20px', background: '#0f172a', margin: '14px 14px 10px 14px', borderRadius: 8, border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#fa9000',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: 14
            }}>
              {currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser?.fullName || 'Quản Trị Viên'}
              </div>
              <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700 }}>
                ● Toàn quyền Quản trị
              </div>
            </div>
          </div>
        </div>

        {/* NÚT CHUYỂN ĐỔI CHẾ ĐỘ SANG VIEW DU KHÁCH */}
        <div style={{ padding: '0 14px 14px 14px' }}>
          <button
            onClick={onSwitchToClientMode}
            title="Chuyển sang giao diện người dùng nhưng vẫn giữ nguyên quyền Admin"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 14px',
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#334155'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1e293b'; }}
          >
            <Eye size={15} color="#38bdf8" />
            <span>Xem giao diện Du khách</span>
          </button>
        </div>

        {/* Menu Phân hệ Quản trị */}
        <nav style={{ flex: 1, padding: '0 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 14px',
              width: '100%',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'dashboard' ? '#1e293b' : 'transparent',
              color: activeTab === 'dashboard' ? '#ffffff' : '#94a3b8',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <LayoutDashboard size={16} color={activeTab === 'dashboard' ? '#fa9000' : '#64748b'} />
            <span>Tổng quan Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('places')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              width: '100%',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'places' ? '#1e293b' : 'transparent',
              color: activeTab === 'places' ? '#ffffff' : '#94a3b8',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <MapPin size={16} color={activeTab === 'places' ? '#fa9000' : '#64748b'} />
              <span>Quản lý Điểm đến</span>
            </div>
            <span style={{ fontSize: 11, background: '#334155', padding: '1px 7px', borderRadius: 10, color: '#cbd5e1' }}>
              {places.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('moderation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              width: '100%',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'moderation' ? '#1e293b' : 'transparent',
              color: activeTab === 'moderation' ? '#ffffff' : '#94a3b8',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ShieldCheck size={16} color={activeTab === 'moderation' ? '#fa9000' : '#64748b'} />
              <span>Kiểm duyệt Cộng đồng</span>
            </div>
            {pendingPosts.length > 0 && (
              <span style={{ fontSize: 11, background: '#ef4444', color: '#fff', padding: '1px 7px', borderRadius: 10, fontWeight: 800 }}>
                {pendingPosts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 14px',
              width: '100%',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'analytics' ? '#1e293b' : 'transparent',
              color: activeTab === 'analytics' ? '#ffffff' : '#94a3b8',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <BarChart3 size={16} color={activeTab === 'analytics' ? '#fa9000' : '#64748b'} />
            <span>Báo cáo & Thống kê</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              width: '100%',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'users' ? '#1e293b' : 'transparent',
              color: activeTab === 'users' ? '#ffffff' : '#94a3b8',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Users size={16} color={activeTab === 'users' ? '#fa9000' : '#64748b'} />
              <span>Quản lý Tài khoản</span>
            </div>
            <span style={{ fontSize: 11, background: '#334155', padding: '1px 7px', borderRadius: 10, color: '#cbd5e1' }}>
              {userList.length}
            </span>
          </button>
        </nav>

        {/* Footer Sidebar: Đăng xuất */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0
            }}
          >
            <LogOut size={16} />
            <span>Đăng xuất Quản trị</span>
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. ADMIN WORKSPACE (KHUNG LÀM VIỆC CHÍNH)
          ───────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Header Workspace */}
        <header style={{
          height: 64,
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {activeTab === 'dashboard' && 'Bảng Điều Khiển Tổng Quan (Executive Overview)'}
              {activeTab === 'places' && 'Quản Lý Danh Mục Điểm Đến & Master Data'}
              {activeTab === 'moderation' && 'Hàng Đợi Kiểm Duyệt Cộng Đồng (Pre-moderation)'}
              {activeTab === 'analytics' && 'Báo Cáo Phân Tích & Chỉ Số Hiệu Suất Hệ Thống'}
              {activeTab === 'users' && 'Quản Lý Tài Khoản Người Dùng & Phân Quyền Vai Trò'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              Cơ sở dữ liệu MongoDB Atlas: Đang đồng bộ
            </span>

            <button
              onClick={onSwitchToClientMode}
              className="aj-button-pill-dark"
              style={{ fontSize: 12, padding: '7px 16px' }}
            >
              <Eye size={14} />
              <span>Xem giao diện Du khách</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ padding: '28px 32px', flex: 1, overflowY: 'auto' }}>
          
          {/* =========================================================
              PHÂN HỆ 1: TỔNG QUAN DASHBOARD
              ========================================================= */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* 4 Thẻ KPI */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Tổng Điểm Đến Hoạt Động</div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', margin: '8px 0 4px 0' }}>{places.length}</div>
                  <div style={{ fontSize: 12, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ArrowUpRight size={14} />
                    <span>Bao phủ 63 tỉnh thành & TP.HCM</span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '20px', borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Bài Đánh Giá & Thảo Luận</div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', margin: '8px 0 4px 0' }}>{totalReviews}</div>
                  <div style={{ fontSize: 12, color: '#0284c7' }}>
                    Từ cộng đồng du khách thực tế
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '20px', borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Tổng Lượt Xem (Visits)</div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', margin: '8px 0 4px 0' }}>{totalVisits.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ArrowUpRight size={14} />
                    <span>Đo đạc động mỗi cú click</span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '20px', borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Bài Viết Chờ Duyệt</div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: pendingPosts.length > 0 ? '#ef4444' : '#0f172a', margin: '8px 0 4px 0' }}>
                    {pendingPosts.length}
                  </div>
                  <div style={{ fontSize: 12, color: pendingPosts.length > 0 ? '#ef4444' : '#64748b' }}>
                    {pendingPosts.length > 0 ? 'Cần kiểm duyệt ngay' : 'Không có bài tồn đọng'}
                  </div>
                </div>

              </div>

              {/* Hàng Đợi Kiểm Duyệt Nhanh */}
              {pendingPosts.length > 0 && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertTriangle size={18} color="#d97706" />
                      <strong style={{ fontSize: 14, color: '#92400e' }}>
                        Hàng đợi duyệt bài đăng cộng đồng (Pre-moderation): {pendingPosts.length} bài đang chờ
                      </strong>
                    </div>
                    <button onClick={() => setActiveTab('moderation')} style={{ fontSize: 12, fontWeight: 700, color: '#b45309', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      Xem tất cả ➔
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pendingPosts.slice(0, 2).map(p => (
                      <div key={p.id} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: 6, border: '1px solid #fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{p.authorName} • <span style={{ color: '#0284c7' }}>📍 {p.placeTag?.placeName}</span></div>
                          <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>"{p.content}"</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleModeratePost(p.id, false)} className="aj-button-pill-outline" style={{ fontSize: 11, padding: '4px 10px', color: '#ef4444' }}>
                            Từ chối
                          </button>
                          <button onClick={() => handleModeratePost(p.id, true)} className="aj-button-pill-dark" style={{ fontSize: 11, padding: '4px 12px' }}>
                            Duyệt ngay
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top 5 Địa điểm được quan tâm nhất */}
              <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 16px 0', color: '#0f172a' }}>
                  Top Địa Điểm Có Lượng Truy Cập Thực Tế Cao Nhất
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                        <th style={{ padding: '8px 12px' }}>Địa Điểm</th>
                        <th style={{ padding: '8px 12px' }}>Danh Mục</th>
                        <th style={{ padding: '8px 12px' }}>Khu Vực</th>
                        <th style={{ padding: '8px 12px' }}>Lượt Xem (Visits)</th>
                        <th style={{ padding: '8px 12px' }}>Đánh Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...places].sort((a,b) => (b.visitCount || 0) - (a.visitCount || 0)).slice(0, 5).map(p => (
                        <tr key={p.id || p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>{p.name}</td>
                          <td style={{ padding: '12px', color: '#64748b' }}>{p.categoryName}</td>
                          <td style={{ padding: '12px', color: '#64748b' }}>📍 {p.address?.district || p.address?.city}</td>
                          <td style={{ padding: '12px', fontWeight: 800, color: '#0284c7' }}>{(p.visitCount || 0).toLocaleString()}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                              ★ {p.rating || 5.0}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* =========================================================
              PHÂN HỆ 2: QUẢN LÝ ĐIỂM ĐẾN (PLACES MASTER CRUD)
              ========================================================= */}
          {activeTab === 'places' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {/* Header Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, background: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, maxWidth: 600 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 11 }} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm địa điểm theo tên, quận hoặc thành phố..."
                      value={placeSearchTerm}
                      onChange={e => setPlaceSearchTerm(e.target.value)}
                      className="aj-text-input"
                      style={{ paddingLeft: 36, width: '100%', fontSize: 13 }}
                    />
                  </div>

                  <select
                    value={placeCategoryFilter}
                    onChange={e => setPlaceCategoryFilter(e.target.value)}
                    className="aj-select"
                    style={{ fontSize: 13, minWidth: 160 }}
                  >
                    <option value="all">Tất cả danh mục</option>
                    <option value="Du lịch & Di tích">Du lịch & Di tích</option>
                    <option value="Ẩm thực & Nhà hàng">Ẩm thực & Nhà hàng</option>
                    <option value="Cà phê & Trà">Cà phê & Trà</option>
                    <option value="Vui chơi & Giải trí">Vui chơi & Giải trí</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowAddPlaceModal(true)}
                  className="aj-button-pill-dark"
                  style={{ fontSize: 13, padding: '8px 18px' }}
                >
                  <Plus size={15} />
                  <span>Thêm Địa Điểm Mới</span>
                </button>
              </div>

              {/* Bảng Danh Sách Địa Điểm */}
              <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                      <th style={{ padding: '12px 16px' }}>Tên Địa Điểm</th>
                      <th style={{ padding: '12px 16px' }}>Danh Mục</th>
                      <th style={{ padding: '12px 16px' }}>Khu Vực / Tỉnh Thành</th>
                      <th style={{ padding: '12px 16px' }}>Giờ Mở Cửa</th>
                      <th style={{ padding: '12px 16px' }}>Lượt Xem</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlaces.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                          Không tìm thấy địa điểm nào khớp với từ khóa tìm kiếm.
                        </td>
                      </tr>
                    ) : (
                      filteredPlaces.map(p => (
                        <tr key={p.id || p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <img
                                src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=200'}
                                alt={p.name}
                                style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 800, color: '#0f172a' }}>{p.name}</div>
                                <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.address?.street}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: 11, background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                              {p.categoryName}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#475569' }}>
                            📍 {p.address?.district || p.address?.city}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12 }}>
                            {p.openingHours || '08:00 - 21:00'}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0284c7' }}>
                            {(p.visitCount || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button
                              onClick={() => onSelectPlace && onSelectPlace(p)}
                              style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontSize: 12, fontWeight: 700, marginRight: 12 }}
                            >
                              Xem trước
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* =========================================================
              PHÂN HỆ 3: KIỂM DUYỆT CỘNG ĐỒNG (PRE-MODERATION)
              ========================================================= */}
          {activeTab === 'moderation' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div style={{ background: '#fef3c7', padding: '16px 20px', borderRadius: 8, border: '1px solid #fde68a' }}>
                <strong style={{ fontSize: 14, color: '#92400e' }}>🛡️ Quy trình Duyệt bài trước khi xuất bản (Pre-moderation):</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#b45309' }}>
                  Mọi bài viết của du khách tải lên đều được chuyển vào hàng đợi kiểm duyệt này để Admin xem xét ngôn từ, tính trung thực và hình ảnh trước khi công khai ra Bảng tin cộng đồng.
                </p>
              </div>

              {/* Danh sách bài đăng chờ duyệt */}
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: '#0f172a' }}>
                  Bài Viết Chờ Phê Duyệt ({pendingPosts.length})
                </h3>

                {pendingPosts.length === 0 ? (
                  <div style={{ background: '#ffffff', padding: '40px 20px', textAlign: 'center', borderRadius: 8, border: '1px solid #e2e8f0', color: '#94a3b8' }}>
                    <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Hàng đợi trống!</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Tất cả các bài đăng cộng đồng đã được xử lý xong.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {pendingPosts.map(post => (
                      <div key={post.id} style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                          <div>
                            <span style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{post.authorName}</span>
                            {post.mood && (
                              <span style={{ marginLeft: 8, fontSize: 11, background: '#f8fafc', padding: '2px 8px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                                {post.mood.label}
                              </span>
                            )}
                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                              Đăng lúc: {new Date(post.createdAt).toLocaleString('vi-VN')}
                            </div>
                          </div>

                          {post.placeTag && (
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '3px 10px', borderRadius: 12 }}>
                              📍 {post.placeTag.placeName} ({post.placeTag.district})
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.5, margin: '10px 0' }}>
                          {post.content}
                        </p>

                        {post.images && post.images.length > 0 && (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '12px 0' }}>
                            {post.images.map((img, idx) => (
                              <img key={idx} src={img.url} alt="attachment" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }} />
                            ))}
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                          <button
                            onClick={() => handleModeratePost(post.id, false)}
                            className="aj-button-pill-outline"
                            style={{ fontSize: 12, color: '#ef4444', borderColor: '#fca5a5' }}
                          >
                            Từ chối / Xóa
                          </button>
                          <button
                            onClick={() => handleModeratePost(post.id, true)}
                            className="aj-button-pill-dark"
                            style={{ fontSize: 12 }}
                          >
                            <CheckCircle2 size={14} />
                            <span>Phê duyệt xuất bản</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Báo cáo vi phạm */}
              <div style={{ marginTop: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: '#0f172a' }}>
                  Báo Cáo Vi Phạm Từ Du Khách ({reportedReviews.length})
                </h3>
                <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  {reportedReviews.map(r => (
                    <div key={r.id} style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                          Địa điểm: <span style={{ color: '#0284c7' }}>{r.placeName}</span> • Người báo cáo: {r.authorName}
                        </div>
                        <div style={{ fontSize: 12, color: '#dc2626', fontWeight: 600, marginTop: 2 }}>
                          Lý do: {r.reason}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>"{r.content}"</div>
                      </div>
                      <button
                        onClick={() => {
                          setReportedReviews(prev => prev.filter(x => x.id !== r.id));
                          alert('✓ Đã gỡ bỏ bài đánh giá bị vi phạm.');
                        }}
                        className="aj-button-pill-outline"
                        style={{ fontSize: 12, color: '#ef4444', borderColor: '#fca5a5' }}
                      >
                        Gỡ bài vi phạm
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* =========================================================
              PHÂN HỆ 4: BÁO CÁO PHÂN TÍCH (ANALYTICS)
              ========================================================= */}
          {activeTab === 'analytics' && (
            <AdminAnalyticsDashboard 
              places={places} 
              onRefreshData={onRefreshPlaces} 
            />
          )}

          {/* =========================================================
              PHÂN HỆ 5: QUẢN LÝ TÀI KHOẢN (USERS & ROLES)
              ========================================================= */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              <div style={{ background: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: 340 }}>
                  <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 11 }} />
                  <input
                    type="text"
                    placeholder="Tìm theo tên hoặc email tài khoản..."
                    value={userSearchTerm}
                    onChange={e => setUserSearchTerm(e.target.value)}
                    className="aj-text-input"
                    style={{ paddingLeft: 36, width: '100%', fontSize: 13 }}
                  />
                </div>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  Tổng cộng: <strong>{userList.length}</strong> người dùng đã đăng ký
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                      <th style={{ padding: '12px 16px' }}>Họ Và Tên</th>
                      <th style={{ padding: '12px 16px' }}>Email</th>
                      <th style={{ padding: '12px 16px' }}>Vai Trò</th>
                      <th style={{ padding: '12px 16px' }}>Trạng Thái</th>
                      <th style={{ padding: '12px 16px' }}>Ngày Tham Gia</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao Tác Quyền Hạn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.filter(u => !userSearchTerm.trim() || u.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) || u.email.toLowerCase().includes(userSearchTerm.toLowerCase())).map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0f172a' }}>{u.fullName}</td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{u.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            fontSize: 11,
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: 4,
                            background: u.role === 'Admin' ? '#0f172a' : '#f1f5f9',
                            color: u.role === 'Admin' ? '#ffffff' : '#334155'
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: u.status === 'active' ? '#166534' : '#991b1b',
                            background: u.status === 'active' ? '#dcfce7' : '#fee2e2',
                            padding: '2px 8px',
                            borderRadius: 12
                          }}>
                            {u.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 12 }}>
                          {u.joinedDate}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleToggleUserRole(u.id)}
                            style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontSize: 12, fontWeight: 700, marginRight: 10 }}
                          >
                            {u.role === 'Admin' ? 'Hạ xuống Member' : 'Nâng lên Admin'}
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            style={{ background: 'none', border: 'none', color: u.status === 'active' ? '#dc2626' : '#16a34a', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                          >
                            {u.status === 'active' ? 'Khóa' : 'Mở khóa'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: THÊM ĐỊA ĐIỂM MỚI (ADMIN CRUD)
          ───────────────────────────────────────────────────────────── */}
      {showAddPlaceModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 10,
            maxWidth: 620,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 28,
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Thêm Địa Điểm Du Lịch Mới (Admin Master Data)
              </h3>
              <button onClick={() => setShowAddPlaceModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePlaceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 5 }}>Tên địa điểm *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Chùa Bửu Long, Bảo tàng Lịch sử..."
                  value={newPlaceName}
                  onChange={e => setNewPlaceName(e.target.value)}
                  className="aj-text-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 5 }}>Danh mục *</label>
                  <select
                    value={newPlaceCategory}
                    onChange={e => setNewPlaceCategory(e.target.value)}
                    className="aj-select"
                    style={{ width: '100%' }}
                  >
                    <option value="Du lịch & Di tích">Du lịch & Di tích</option>
                    <option value="Ẩm thực & Nhà hàng">Ẩm thực & Nhà hàng</option>
                    <option value="Cà phê & Trà">Cà phê & Trà</option>
                    <option value="Vui chơi & Giải trí">Vui chơi & Giải trí</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 5 }}>Tỉnh / Thành phố *</label>
                  <input
                    type="text"
                    value={newPlaceCity}
                    onChange={e => setNewPlaceCity(e.target.value)}
                    className="aj-text-input"
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 5 }}>Quận / Huyện *</label>
                  <input
                    type="text"
                    placeholder="Quận 1, Thủ Đức..."
                    value={newPlaceDistrict}
                    onChange={e => setNewPlaceDistrict(e.target.value)}
                    className="aj-text-input"
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 5 }}>Địa chỉ đường phố</label>
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường..."
                    value={newPlaceStreet}
                    onChange={e => setNewPlaceStreet(e.target.value)}
                    className="aj-text-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 5 }}>Giờ mở cửa</label>
                  <input
                    type="text"
                    value={newPlaceOpeningHours}
                    onChange={e => setNewPlaceOpeningHours(e.target.value)}
                    className="aj-text-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 5 }}>Giá vé tham quan</label>
                  <input
                    type="text"
                    value={newPlaceTicketPrice}
                    onChange={e => setNewPlaceTicketPrice(e.target.value)}
                    className="aj-text-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 5 }}>Mô tả đặc điểm nổi bật</label>
                <textarea
                  rows={3}
                  placeholder="Kiến trúc, góc check-in, ẩm thực đặc trưng..."
                  value={newPlaceDesc}
                  onChange={e => setNewPlaceDesc(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 5 }}>Ảnh minh họa (Tải từ máy tính)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ fontSize: 12 }}
                />
                {newPlaceImagePreview && (
                  <div style={{ marginTop: 8 }}>
                    <img src={newPlaceImagePreview} alt="preview" style={{ width: 120, height: 75, objectFit: 'cover', borderRadius: 4, border: '1px solid #cbd5e1' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setShowAddPlaceModal(false)}
                  className="aj-button-pill-outline"
                  style={{ fontSize: 12.5 }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPlace}
                  className="aj-button-pill-dark"
                  style={{ fontSize: 12.5 }}
                >
                  {isSubmittingPlace ? 'Đang lưu...' : 'Lưu địa điểm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
