import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, MapPin, ShieldCheck, BarChart3, Users, 
  Eye, LogOut, Plus, Search, Filter, Trash2, CheckCircle2, 
  X, AlertTriangle, Clock, RefreshCw, Star, Image as ImageIcon,
  ChevronRight, ChevronLeft, ExternalLink, ShieldAlert, ArrowLeft, ArrowUpRight
} from 'lucide-react';
import AdminAnalyticsDashboard from './AdminAnalyticsDashboard';

// Danh sách đồng bộ đầy đủ 24 tài khoản thành viên hệ thống LonGo
const INITIAL_USERS = [
  { id: 'usr-1', fullName: 'Kim Long (Admin)', email: 'admin@longo.vn', role: 'Admin', status: 'active', joinedDate: '2026-01-10' },
  { id: 'usr-2', fullName: 'Thảo Nguyên', email: 'thaonguyen.travel@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-02-15' },
  { id: 'usr-3', fullName: 'Minh Hoàng Photographer', email: 'hoang.canon@yahoo.com', role: 'Member', status: 'active', joinedDate: '2026-03-01' },
  { id: 'usr-4', fullName: 'Lê Văn Tuấn', email: 'tuandulich@outlook.com', role: 'Member', status: 'blocked', joinedDate: '2026-03-12' },
  { id: 'usr-5', fullName: 'Sarah Jenkins', email: 'sarah.j@traveler.uk', role: 'Member', status: 'active', joinedDate: '2026-04-02' },
  { id: 'usr-6', fullName: 'Trần Bảo Ngọc', email: 'baongoc.foodie@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-04-18' },
  { id: 'usr-7', fullName: 'Phạm Đức Trí', email: 'ductri.traveler@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-05-02' },
  { id: 'usr-8', fullName: 'Nguyễn Hoàng Yến', email: 'hoangyen.review@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-05-14' },
  { id: 'usr-9', fullName: 'Vũ Thanh Hằng', email: 'thanhhang.saigon@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-05-28' },
  { id: 'usr-10', fullName: 'Đặng Quốc Huy', email: 'quochuy.phuot@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-06-05' },
  { id: 'usr-11', fullName: 'Nguyễn Thùy Linh', email: 'thuylinh.journey@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-06-19' },
  { id: 'usr-12', fullName: 'Lê Quang Hải', email: 'quanghai.camper@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-07-01' },
  { id: 'usr-13', fullName: 'Đỗ Mỹ Uyên', email: 'myuyen.checkin@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-07-15' },
  { id: 'usr-14', fullName: 'Bùi Anh Tuấn', email: 'anhtuan.coffee@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-08-03' },
  { id: 'usr-15', fullName: 'Trịnh Khánh Huyền', email: 'khanhhuyen.wander@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-08-20' },
  { id: 'usr-16', fullName: 'Phan Đình Trọng', email: 'dinhtrong.discovery@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-09-02' },
  { id: 'usr-17', fullName: 'Hồ Ánh Tuyết', email: 'anhtuyet.dalat@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-09-11' },
  { id: 'usr-18', fullName: 'Võ Minh Quân', email: 'minhquan.hiker@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-09-25' },
  { id: 'usr-19', fullName: 'Dương Gia Bảo', email: 'giabao.backpacker@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-10-04' },
  { id: 'usr-20', fullName: 'Ngô Phương Thảo', email: 'phuongthao.escape@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-10-10' },
  { id: 'usr-21', fullName: 'Huỳnh Nhật Nam', email: 'nhatnam.trail@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-10-15' },
  { id: 'usr-22', fullName: 'Lâm Thanh Tâm', email: 'thanhtam.foodreview@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-10-18' },
  { id: 'usr-23', fullName: 'Cao Thái Sơn', email: 'thaison.travels@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-10-21' },
  { id: 'usr-24', fullName: 'Mai Phương Trang', email: 'phuongtrang.longo@gmail.com', role: 'Member', status: 'active', joinedDate: '2026-10-24' }
];

// Danh sách các lý do từ chối bài viết
const REJECT_REASONS = [
  { id: 'spam', label: 'Spam, quảng cáo thương mại hoặc chèo kéo bán hàng' },
  { id: 'offensive', label: 'Ngôn từ phản cảm, thù ghét hoặc đả kích cá nhân' },
  { id: 'inappropriate', label: 'Hình ảnh nhạy cảm, phản cảm hoặc vi phạm bản quyền' },
  { id: 'misleading', label: 'Thông tin sai lệch hoặc không chính xác về điểm đến' },
  { id: 'other', label: 'Lý do khác' }
];

export default function AdminPortal({
  currentUser,
  places = [],
  onRefreshPlaces,
  onSwitchToClientMode,
  onLogout,
  onSelectPlace
}) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'places' | 'moderation' | 'analytics' | 'users'

  // Toast thông báo nổi tự động biến mất (Không cần bấm xác nhận)
  const [adminToast, setAdminToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showAdminToast = (message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setAdminToast(message);
    toastTimerRef.current = setTimeout(() => {
      setAdminToast(null);
    }, 2600);
  };

  // State cho Quản lý Địa điểm
  const [placeSearchTerm, setPlaceSearchTerm] = useState('');
  const [placeCategoryFilter, setPlaceCategoryFilter] = useState('all');
  const [placePage, setPlacePage] = useState(1);
  const PLACES_PER_PAGE = 10;

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

  // State cho Kiểm duyệt Cộng đồng
  const [pendingPosts, setPendingPosts] = useState([]);
  const [reportedReviews, setReportedReviews] = useState([
    {
      id: 'rep-1',
      authorName: 'Du khách ẩn danh',
      placeName: 'Bưu điện Trung tâm Sài Gòn',
      reason: 'Đánh giá mang tính quảng cáo bán hàng rong',
      content: 'Nhân viên bán đồ lưu niệm ở sảnh giá hơi đắt, ra ngoài cổng mua của chị bán dạo rẻ hơn nhiều nhé.'
    }
  ]);

  // Modal Từ chối bài đăng
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [postToReject, setPostToReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('spam');
  const [customRejectReason, setCustomRejectReason] = useState('');

  // State cho Quản lý Tài khoản (Đồng bộ 24 người dùng)
  const [userList, setUserList] = useState(INITIAL_USERS);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userPage, setUserPage] = useState(1);
  const USERS_PER_PAGE = 10;

  // Reset trang khi lọc hoặc tìm kiếm
  useEffect(() => {
    setPlacePage(1);
  }, [placeSearchTerm, placeCategoryFilter]);

  useEffect(() => {
    setUserPage(1);
  }, [userSearchTerm]);

  // Helper lấy Tỉnh / Thành phố trực thuộc trung ương chuẩn (Không lấy cấp Quận / Huyện / Xã)
  const getPlaceProvince = (place) => {
    if (!place) return 'Việt Nam';
    const city = place.address?.city || place.city;
    if (!city || !city.trim()) return 'TP. Hồ Chí Minh';
    const trimmed = city.trim();
    if (trimmed === 'Hồ Chí Minh' || trimmed === 'TP.HCM' || trimmed === 'TP Hồ Chí Minh') {
      return 'TP. Hồ Chí Minh';
    }
    return trimmed;
  };

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
        // Fallback mẫu
        setPendingPosts([
          {
            id: 'mock-pend-1',
            authorName: 'Hoàng Yến',
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            content: 'Cuối tuần dạo phố ẩm thực Chợ Lớn ăn hủ tiếu sa tế và chè mè đen gia truyền. Không gian hoài cổ, giá hợp lý!',
            placeTag: { placeName: 'Phố Người Hoa - Chợ Lớn' },
            images: [
              { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500' }
            ]
          },
          {
            id: 'mock-pend-2',
            authorName: 'Đức Trí',
            createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
            content: 'Ghé Bến Bạch Đằng lúc hoàng hôn ngắm Landmark 81 cực chill. Gió mát rượi, rất đáng để đi cùng gia đình.',
            placeTag: { placeName: 'Bến Bạch Đằng' },
            images: [
              { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500' }
            ]
          }
        ]);
      }
    } catch {
      setPendingPosts([
        {
          id: 'mock-pend-1',
          authorName: 'Hoàng Yến',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          content: 'Cuối tuần dạo phố ẩm thực Chợ Lớn ăn hủ tiếu sa tế và chè mè đen gia truyền. Không gian hoài cổ, giá hợp lý!',
          placeTag: { placeName: 'Phố Người Hoa - Chợ Lớn' },
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

  // Xử lý Phê duyệt bài đăng (Thông báo nổi tự biến mất, không popup xác nhận)
  const handleApprovePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5196/api/community-posts/admin/${postId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ isApproved: true })
      });
    } catch {
      // ignore
    }
    setPendingPosts(prev => prev.filter(p => p.id !== postId));
    showAdminToast('✓ Đã phê duyệt bài đăng lên Bảng tin cộng đồng');
  };

  // Mở modal chọn lý do từ chối
  const handleOpenRejectModal = (post) => {
    setPostToReject(post);
    setRejectReason('spam');
    setCustomRejectReason('');
    setRejectModalOpen(true);
  };

  // Xác nhận từ chối bài đăng (Thông báo nổi tự biến mất, không popup xác nhận)
  const handleConfirmReject = async () => {
    if (!postToReject) return;
    const postId = postToReject.id;

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5196/api/community-posts/admin/${postId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ isApproved: false })
      });
    } catch {
      // ignore
    }

    setPendingPosts(prev => prev.filter(p => p.id !== postId));
    setRejectModalOpen(false);
    setPostToReject(null);
    showAdminToast('✓ Đã từ chối bài đăng và gỡ bỏ khỏi hàng đợi');
  };

  // Lọc địa điểm cho tab Quản lý Điểm Đến
  const filteredPlaces = useMemo(() => {
    return places.filter(p => {
      const city = getPlaceProvince(p);
      const matchSearch = !placeSearchTerm.trim() || 
        (p.name || '').toLowerCase().includes(placeSearchTerm.toLowerCase().trim()) ||
        city.toLowerCase().includes(placeSearchTerm.toLowerCase().trim());

      const matchCat = placeCategoryFilter === 'all' || p.categoryName === placeCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [places, placeSearchTerm, placeCategoryFilter]);

  // Phân trang địa điểm (10 địa điểm / trang)
  const totalPlacePages = Math.max(1, Math.ceil(filteredPlaces.length / PLACES_PER_PAGE));
  const paginatedPlaces = useMemo(() => {
    const start = (placePage - 1) * PLACES_PER_PAGE;
    return filteredPlaces.slice(start, start + PLACES_PER_PAGE);
  }, [filteredPlaces, placePage]);

  // Lọc người dùng
  const filteredUsers = useMemo(() => {
    return userList.filter(u => 
      !userSearchTerm.trim() || 
      u.fullName.toLowerCase().includes(userSearchTerm.toLowerCase().trim()) || 
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase().trim())
    );
  }, [userList, userSearchTerm]);

  // Phân trang người dùng (10 người dùng / trang)
  const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const paginatedUsers = useMemo(() => {
    const start = (userPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, userPage]);

  // Thêm mới địa điểm trực tiếp từ Admin
  const handleCreatePlaceSubmit = async (e) => {
    e.preventDefault();
    if (!newPlaceName.trim()) {
      showAdminToast('Vui lòng nhập tên địa điểm');
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
      description: newPlaceDesc.trim() || `Điểm đến tại ${newPlaceCity}.`,
      openingHours: newPlaceOpeningHours,
      ticketPrice: newPlaceTicketPrice,
      images: newPlaceImagePreview ? [{ url: newPlaceImagePreview, caption: newPlaceName }] : [
        { url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800', caption: newPlaceName }
      ],
      rating: 5.0,
      reviewCount: 1,
      visitCount: 1
    };

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5196/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      showAdminToast(`✓ Đã thêm địa điểm "${newPlaceName}"`);
      if (onRefreshPlaces) onRefreshPlaces();
    } catch {
      showAdminToast(`✓ Đã thêm địa điểm "${newPlaceName}"`);
    } finally {
      setIsSubmittingPlace(false);
      setShowAddPlaceModal(false);
      setNewPlaceName('');
      setNewPlaceStreet('');
      setNewPlaceDesc('');
      setNewPlaceImagePreview(null);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setNewPlaceImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Thay đổi trạng thái tài khoản
  const handleToggleUserStatus = (userId) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'blocked' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    showAdminToast('✓ Đã cập nhật trạng thái tài khoản');
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
    showAdminToast('✓ Đã thay đổi vai trò quyền hạn');
  };

  // KPI Tổng quan
  const totalVisits = useMemo(() => {
    return places.reduce((sum, p) => sum + (p.visitCount || 0), 0);
  }, [places]);

  const totalReviews = useMemo(() => {
    return places.reduce((sum, p) => sum + ((p.reviews || []).length), 0);
  }, [places]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#090d16', fontFamily: 'Roboto, sans-serif' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          FLOATING TOAST (Tự động biến mất, không chặn thao tác)
          ───────────────────────────────────────────────────────────── */}
      {adminToast && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 28,
          background: '#090d16',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 9999,
          fontSize: 13,
          fontWeight: 600,
          border: '1px solid #27272a'
        }}>
          <CheckCircle2 size={16} color="#ffffff" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. ADMIN SIDEBAR (Đồng nhất Style Trắng Đen Minimal)
          ───────────────────────────────────────────────────────────── */}
      <aside style={{
        width: 260,
        background: '#090d16',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #1f2937',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50
      }}>
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1f2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
              LonGo
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: 800,
              background: '#ffffff',
              color: '#090d16',
              padding: '2px 7px',
              borderRadius: 4,
              letterSpacing: '0.04em'
            }}>
              ADMIN
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
            Hệ thống Quản trị LonGo
          </div>
        </div>

        {/* Thẻ Quản trị viên */}
        <div style={{ padding: '14px 18px', background: '#111827', margin: '14px 14px 10px 14px', borderRadius: 8, border: '1px solid #1f2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#ffffff',
              color: '#090d16',
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
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>
                Quản trị viên
              </div>
            </div>
          </div>
        </div>

        {/* Nút Xem giao diện Du khách */}
        <div style={{ padding: '0 14px 14px 14px' }}>
          <button
            onClick={onSwitchToClientMode}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '9px 14px',
              background: '#18181b',
              color: '#ffffff',
              border: '1px solid #27272a',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#27272a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#18181b'; }}
          >
            <Eye size={14} color="#ffffff" />
            <span>Xem giao diện Du khách</span>
          </button>
        </div>

        {/* Menu Điều Hướng */}
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
              background: activeTab === 'dashboard' ? '#18181b' : 'transparent',
              color: activeTab === 'dashboard' ? '#ffffff' : '#9ca3af',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LayoutDashboard size={16} color={activeTab === 'dashboard' ? '#ffffff' : '#6b7280'} />
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
              background: activeTab === 'places' ? '#18181b' : 'transparent',
              color: activeTab === 'places' ? '#ffffff' : '#9ca3af',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <MapPin size={16} color={activeTab === 'places' ? '#ffffff' : '#6b7280'} />
              <span>Quản lý Điểm đến</span>
            </div>
            <span style={{ fontSize: 11, background: '#27272a', padding: '1px 8px', borderRadius: 10, color: '#e4e4e7', fontWeight: 800 }}>
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
              background: activeTab === 'moderation' ? '#18181b' : 'transparent',
              color: activeTab === 'moderation' ? '#ffffff' : '#9ca3af',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ShieldCheck size={16} color={activeTab === 'moderation' ? '#ffffff' : '#6b7280'} />
              <span>Kiểm duyệt Cộng đồng</span>
            </div>
            {pendingPosts.length > 0 && (
              <span style={{ fontSize: 11, background: '#ffffff', color: '#090d16', padding: '1px 8px', borderRadius: 10, fontWeight: 900 }}>
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
              background: activeTab === 'analytics' ? '#18181b' : 'transparent',
              color: activeTab === 'analytics' ? '#ffffff' : '#9ca3af',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <BarChart3 size={16} color={activeTab === 'analytics' ? '#ffffff' : '#6b7280'} />
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
              background: activeTab === 'users' ? '#18181b' : 'transparent',
              color: activeTab === 'users' ? '#ffffff' : '#9ca3af',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Users size={16} color={activeTab === 'users' ? '#ffffff' : '#6b7280'} />
              <span>Quản lý Tài khoản</span>
            </div>
            <span style={{ fontSize: 11, background: '#27272a', padding: '1px 8px', borderRadius: 10, color: '#e4e4e7', fontWeight: 800 }}>
              {userList.length}
            </span>
          </button>
        </nav>

        {/* Footer: Đăng xuất */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1f2937' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; }}
          >
            <LogOut size={16} />
            <span>Đăng xuất Quản trị</span>
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. ADMIN WORKSPACE CHÍNH
          ───────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Header */}
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
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, color: '#090d16' }}>
              {activeTab === 'dashboard' && 'Tổng quan Dashboard'}
              {activeTab === 'places' && 'Quản lý Điểm đến'}
              {activeTab === 'moderation' && 'Kiểm duyệt Cộng đồng'}
              {activeTab === 'analytics' && 'Báo cáo & Thống kê'}
              {activeTab === 'users' && 'Quản lý Tài khoản'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={onSwitchToClientMode}
              className="aj-button-pill-dark"
              style={{ fontSize: 12.5, padding: '7px 16px' }}
            >
              <Eye size={14} />
              <span>Xem giao diện Du khách</span>
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main style={{ padding: '28px 32px', flex: 1, overflowY: 'auto' }}>
          
          {/* =========================================================
              PHÂN HỆ 1: TỔNG QUAN DASHBOARD
              ========================================================= */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* 4 Thẻ KPI tối giản trắng đen */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tổng Điểm Đến</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#090d16', marginTop: 8 }}>{places.length}</div>
                </div>

                <div style={{ background: '#ffffff', padding: '20px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Đánh Giá & Thảo Luận</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#090d16', marginTop: 8 }}>{totalReviews}</div>
                </div>

                <div style={{ background: '#ffffff', padding: '20px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tổng Lượt Xem</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#090d16', marginTop: 8 }}>{totalVisits.toLocaleString('vi-VN')}</div>
                </div>

                <div style={{ background: '#ffffff', padding: '20px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Bài Viết Chờ Duyệt</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#090d16', marginTop: 8 }}>
                    {pendingPosts.length}
                  </div>
                </div>

              </div>

              {/* Hàng Đợi Duyệt Nhanh */}
              {pendingPosts.length > 0 && (
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#090d16' }}>
                      Bài viết chờ duyệt ({pendingPosts.length})
                    </div>
                    <button onClick={() => setActiveTab('moderation')} style={{ fontSize: 12, fontWeight: 700, color: '#090d16', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      Xem tất cả ➔
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pendingPosts.slice(0, 2).map(p => (
                      <div key={p.id} style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 6, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#090d16' }}>{p.authorName} • <span style={{ color: '#64748b' }}>📍 {p.placeTag?.placeName}</span></div>
                          <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>"{p.content}"</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleOpenRejectModal(p)} className="aj-button-pill-outline" style={{ fontSize: 11, padding: '5px 12px' }}>
                            Từ chối
                          </button>
                          <button onClick={() => handleApprovePost(p.id)} className="aj-button-pill-dark" style={{ fontSize: 11, padding: '5px 14px' }}>
                            Duyệt
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top 5 Địa điểm được quan tâm nhất */}
              <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 16px 0', color: '#090d16' }}>
                  Địa Điểm Có Lượng Truy Cập Cao Nhất
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                        <th style={{ padding: '8px 12px' }}>Địa Điểm</th>
                        <th style={{ padding: '8px 12px' }}>Danh Mục</th>
                        <th style={{ padding: '8px 12px' }}>Khu Vực</th>
                        <th style={{ padding: '8px 12px' }}>Lượt Xem</th>
                        <th style={{ padding: '8px 12px' }}>Đánh Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...places].sort((a,b) => (b.visitCount || 0) - (a.visitCount || 0)).slice(0, 5).map(p => (
                        <tr key={p.id || p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px', fontWeight: 800, color: '#090d16' }}>{p.name}</td>
                          <td style={{ padding: '12px', color: '#64748b' }}>{p.categoryName}</td>
                          <td style={{ padding: '12px', color: '#64748b', fontWeight: 600 }}>📍 {getPlaceProvince(p)}</td>
                          <td style={{ padding: '12px', fontWeight: 800, color: '#090d16' }}>{(p.visitCount || 0).toLocaleString('vi-VN')}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ background: '#090d16', color: '#ffffff', padding: '2px 8px', borderRadius: 4, fontWeight: 800, fontSize: 11 }}>
                              ★ {p.ratingAverage ? Number(p.ratingAverage).toFixed(1) : (p.rating ? Number(p.rating).toFixed(1) : '5.0')}
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
              PHÂN HỆ 2: QUẢN LÝ ĐIỂM ĐẾN
              - Các cột: Danh mục, Khu vực (tỉnh), Đánh giá, Lượt xem
              - Nút: "Xem chi tiết"
              - Bỏ cột Giờ mở cửa
              - Phân trang 10 địa điểm / trang
              ========================================================= */}
          {activeTab === 'places' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {/* Header Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, background: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, maxWidth: 620 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 11 }} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên địa điểm hoặc tỉnh thành..."
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

              {/* Bảng Danh Sách Địa Điểm (Chuẩn hóa 6 cột) */}
              <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                      <th style={{ padding: '12px 16px' }}>Tên Địa Điểm</th>
                      <th style={{ padding: '12px 16px' }}>Danh Mục</th>
                      <th style={{ padding: '12px 16px' }}>Khu Vực</th>
                      <th style={{ padding: '12px 16px' }}>Đánh Giá</th>
                      <th style={{ padding: '12px 16px' }}>Lượt Xem</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPlaces.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                          Không tìm thấy địa điểm nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      paginatedPlaces.map(p => {
                        const ratingScore = p.ratingAverage ? Number(p.ratingAverage).toFixed(1) : (p.rating ? Number(p.rating).toFixed(1) : '5.0');
                        const reviewCount = p.reviewCount || (p.reviews ? p.reviews.length : 0);

                        return (
                          <tr key={p.id || p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <img
                                  src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=200'}
                                  alt={p.name}
                                  style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                                />
                                <div>
                                  <div style={{ fontWeight: 800, color: '#090d16' }}>{p.name}</div>
                                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.address?.street}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontSize: 11, background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                                {p.categoryName}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>
                              📍 {getPlaceProvince(p)}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ fontWeight: 800, color: '#090d16' }}>★ {ratingScore}</span>
                                <span style={{ fontSize: 11, color: '#64748b' }}>({reviewCount})</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: 800, color: '#090d16' }}>
                              {(p.visitCount || 0).toLocaleString('vi-VN')}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <button
                                onClick={() => onSelectPlace && onSelectPlace(p)}
                                style={{
                                  background: '#ffffff',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: 6,
                                  color: '#090d16',
                                  cursor: 'pointer',
                                  fontSize: 12,
                                  fontWeight: 700,
                                  padding: '6px 12px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
                              >
                                <Eye size={13} color="#090d16" />
                                <span>Xem chi tiết</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Phân trang lấy đúng 10 địa điểm 1 trang */}
              {filteredPlaces.length > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#ffffff',
                  padding: '12px 18px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  flexWrap: 'wrap',
                  gap: 12
                }}>
                  <div style={{ fontSize: 13, color: '#64748b' }}>
                    Hiển thị <strong>{(placePage - 1) * PLACES_PER_PAGE + 1}</strong> - <strong>{Math.min(placePage * PLACES_PER_PAGE, filteredPlaces.length)}</strong> trên tổng số <strong>{filteredPlaces.length}</strong> địa điểm
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => setPlacePage(p => Math.max(1, p - 1))}
                      disabled={placePage === 1}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid #e2e8f0',
                        background: placePage === 1 ? '#f8fafc' : '#ffffff',
                        color: placePage === 1 ? '#94a3b8' : '#090d16',
                        cursor: placePage === 1 ? 'not-allowed' : 'pointer',
                        fontSize: 12.5,
                        fontWeight: 700
                      }}
                    >
                      ‹ Trước
                    </button>

                    {Array.from({ length: totalPlacePages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setPlacePage(pageNum)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          border: placePage === pageNum ? '1px solid #090d16' : '1px solid #e2e8f0',
                          background: placePage === pageNum ? '#090d16' : '#ffffff',
                          color: placePage === pageNum ? '#ffffff' : '#090d16',
                          cursor: 'pointer',
                          fontSize: 12.5,
                          fontWeight: 800
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => setPlacePage(p => Math.min(totalPlacePages, p + 1))}
                      disabled={placePage === totalPlacePages}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid #e2e8f0',
                        background: placePage === totalPlacePages ? '#f8fafc' : '#ffffff',
                        color: placePage === totalPlacePages ? '#94a3b8' : '#090d16',
                        cursor: placePage === totalPlacePages ? 'not-allowed' : 'pointer',
                        fontSize: 12.5,
                        fontWeight: 700
                      }}
                    >
                      Sau ›
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* =========================================================
              PHÂN HỆ 3: KIỂM DUYỆT CỘNG ĐỒNG
              ========================================================= */}
          {activeTab === 'moderation' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14, color: '#090d16' }}>
                  Bài Viết Chờ Phê Duyệt ({pendingPosts.length})
                </h3>

                {pendingPosts.length === 0 ? (
                  <div style={{ background: '#ffffff', padding: '48px 20px', textAlign: 'center', borderRadius: 8, border: '1px solid #e2e8f0', color: '#94a3b8' }}>
                    <CheckCircle2 size={40} color="#090d16" style={{ margin: '0 auto 10px auto' }} />
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#090d16' }}>Hàng đợi trống</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Tất cả các bài đăng đã được xử lý xong.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {pendingPosts.map(post => (
                      <div key={post.id} style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                          <div>
                            <span style={{ fontWeight: 800, fontSize: 14, color: '#090d16' }}>{post.authorName}</span>
                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                              Đăng lúc: {new Date(post.createdAt).toLocaleString('vi-VN')}
                            </div>
                          </div>

                          {post.placeTag && (
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#090d16', background: '#f1f5f9', padding: '3px 10px', borderRadius: 12 }}>
                              📍 {post.placeTag.placeName}
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
                            onClick={() => handleOpenRejectModal(post)}
                            className="aj-button-pill-outline"
                            style={{ fontSize: 12, padding: '6px 16px' }}
                          >
                            Từ chối...
                          </button>
                          <button
                            onClick={() => handleApprovePost(post.id)}
                            className="aj-button-pill-dark"
                            style={{ fontSize: 12, padding: '6px 18px' }}
                          >
                            <CheckCircle2 size={14} />
                            <span>Phê duyệt</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Báo cáo vi phạm */}
              <div style={{ marginTop: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14, color: '#090d16' }}>
                  Báo Cáo Vi Phạm ({reportedReviews.length})
                </h3>
                <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  {reportedReviews.map(r => (
                    <div key={r.id} style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#090d16' }}>
                          Điểm đến: <strong>{r.placeName}</strong> • Người báo cáo: {r.authorName}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 2 }}>
                          Lý do: {r.reason}
                        </div>
                        <div style={{ fontSize: 12, color: '#334155', marginTop: 2 }}>"{r.content}"</div>
                      </div>
                      <button
                        onClick={() => {
                          setReportedReviews(prev => prev.filter(x => x.id !== r.id));
                          showAdminToast('✓ Đã gỡ bỏ bài đánh giá bị vi phạm');
                        }}
                        className="aj-button-pill-outline"
                        style={{ fontSize: 12, padding: '5px 14px' }}
                      >
                        Gỡ vi phạm
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
              userCount={userList.length}
              onRefreshData={onRefreshPlaces} 
            />
          )}

          {/* =========================================================
              PHÂN HỆ 5: QUẢN LÝ TÀI KHOẢN (Đồng bộ 24 người dùng)
              ========================================================= */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              <div style={{ background: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
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
                    {paginatedUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#090d16' }}>{u.fullName}</td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{u.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            fontSize: 11,
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: 4,
                            background: u.role === 'Admin' ? '#090d16' : '#f1f5f9',
                            color: u.role === 'Admin' ? '#ffffff' : '#334155'
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: u.status === 'active' ? '#090d16' : '#64748b',
                            background: '#f1f5f9',
                            padding: '3px 8px',
                            borderRadius: 4
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
                            style={{ background: 'none', border: 'none', color: '#090d16', cursor: 'pointer', fontSize: 12, fontWeight: 700, marginRight: 12, textDecoration: 'underline' }}
                          >
                            {u.role === 'Admin' ? 'Hạ xuống Member' : 'Nâng lên Admin'}
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: 4,
                              color: '#090d16',
                              cursor: 'pointer',
                              fontSize: 11.5,
                              fontWeight: 700,
                              padding: '3px 10px'
                            }}
                          >
                            {u.status === 'active' ? 'Khóa' : 'Mở khóa'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Phân trang người dùng (10 người dùng / trang) */}
              {filteredUsers.length > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#ffffff',
                  padding: '12px 18px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  flexWrap: 'wrap',
                  gap: 12
                }}>
                  <div style={{ fontSize: 13, color: '#64748b' }}>
                    Hiển thị <strong>{(userPage - 1) * USERS_PER_PAGE + 1}</strong> - <strong>{Math.min(userPage * USERS_PER_PAGE, filteredUsers.length)}</strong> trên tổng số <strong>{filteredUsers.length}</strong> người dùng
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => setUserPage(p => Math.max(1, p - 1))}
                      disabled={userPage === 1}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid #e2e8f0',
                        background: userPage === 1 ? '#f8fafc' : '#ffffff',
                        color: userPage === 1 ? '#94a3b8' : '#090d16',
                        cursor: userPage === 1 ? 'not-allowed' : 'pointer',
                        fontSize: 12.5,
                        fontWeight: 700
                      }}
                    >
                      ‹ Trước
                    </button>

                    {Array.from({ length: totalUserPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setUserPage(pageNum)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          border: userPage === pageNum ? '1px solid #090d16' : '1px solid #e2e8f0',
                          background: userPage === pageNum ? '#090d16' : '#ffffff',
                          color: userPage === pageNum ? '#ffffff' : '#090d16',
                          cursor: 'pointer',
                          fontSize: 12.5,
                          fontWeight: 800
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                      disabled={userPage === totalUserPages}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid #e2e8f0',
                        background: userPage === totalUserPages ? '#f8fafc' : '#ffffff',
                        color: userPage === totalUserPages ? '#94a3b8' : '#090d16',
                        cursor: userPage === totalUserPages ? 'not-allowed' : 'pointer',
                        fontSize: 12.5,
                        fontWeight: 700
                      }}
                    >
                      Sau ›
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: TỪ CHỐI BÀI ĐĂNG (CHỌN LÝ DO, KHÔNG POPUP BẮT BẤM OK)
          ───────────────────────────────────────────────────────────── */}
      {rejectModalOpen && postToReject && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
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
            maxWidth: 500,
            width: '100%',
            padding: 24,
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: '#090d16' }}>
                Chọn Lý Do Từ Chối Bài Đăng
              </h3>
              <button onClick={() => setRejectModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>
              Bài đăng của <strong>{postToReject.authorName}</strong> sẽ bị gỡ bỏ khỏi hàng đợi và không được hiển thị công khai.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {REJECT_REASONS.map(r => (
                <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#090d16', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="rejectReason"
                    value={r.id}
                    checked={rejectReason === r.id}
                    onChange={() => setRejectReason(r.id)}
                    style={{ accentColor: '#090d16', cursor: 'pointer' }}
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>

            {rejectReason === 'other' && (
              <div style={{ marginBottom: 16 }}>
                <textarea
                  rows={2}
                  placeholder="Ghi chú cụ thể lý do từ chối..."
                  value={customRejectReason}
                  onChange={e => setCustomRejectReason(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, outline: 'none' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="aj-button-pill-outline"
                style={{ fontSize: 12.5 }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="aj-button-pill-dark"
                style={{ fontSize: 12.5 }}
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: THÊM ĐỊA ĐIỂM MỚI
          ───────────────────────────────────────────────────────────── */}
      {showAddPlaceModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
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
              <h3 style={{ fontSize: 17, fontWeight: 900, margin: 0, color: '#090d16' }}>
                Thêm Địa Điểm Mới
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
                  placeholder="Ví dụ: Chùa Bửu Long, Cầu Vàng..."
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
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 5 }}>Quận / Huyện</label>
                  <input
                    type="text"
                    placeholder="Quận 1, Hòa Thành..."
                    value={newPlaceDistrict}
                    onChange={e => setNewPlaceDistrict(e.target.value)}
                    className="aj-text-input"
                    style={{ width: '100%' }}
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

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 5 }}>Mô tả điểm đến</label>
                <textarea
                  rows={3}
                  placeholder="Kiến trúc, trải nghiệm đặc trưng..."
                  value={newPlaceDesc}
                  onChange={e => setNewPlaceDesc(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 5 }}>Ảnh minh họa</label>
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
                  {isSubmittingPlace ? 'Đang lưu...' : 'Lưu địa điểm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
