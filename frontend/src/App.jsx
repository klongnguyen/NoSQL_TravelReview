import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Star, MessageSquare, Heart, Compass, 
  ThumbsUp, User, LogIn, LogOut, X, PlusCircle, CheckCircle, 
  AlertTriangle, Shield, Clock, Trash2, ArrowLeft, Send, Map as MapIcon,
  Calendar, Sparkles, Navigation
} from 'lucide-react';
import { placeService, categoryService, authService, interactionService } from './services/api';
import MapView from './components/MapView';
import TripPlanner from './components/TripPlanner';
import GraphRecommendations from './components/GraphRecommendations';

export default function App() {
  // Navigation: map, trip, recommend, explore, top, propose, favorites, history, admin
  const [currentTab, setCurrentTab] = useState('map'); 
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Selected place for full detail view
  const [activePlace, setActivePlace] = useState(null);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login, register
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authError, setAuthError] = useState('');

  // Review Form in Detail view
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Comment & Reply states
  const [commentContent, setCommentContent] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  // Trip Planner custom stops
  const [customTripStops, setCustomTripStops] = useState([]);

  // Propose Place Form
  const [propName, setPropName] = useState('');
  const [propCategory, setPropCategory] = useState('');
  const [propDistrict, setPropDistrict] = useState('Quận 1');
  const [propStreet, setPropStreet] = useState('');
  const [propDesc, setPropDesc] = useState('');
  const [propImageUrl, setPropImageUrl] = useState('');
  const [propMessage, setPropMessage] = useState('');

  // Admin Data
  const [adminStats, setAdminStats] = useState(null);
  const [adminProposals, setAdminProposals] = useState([]);
  const [adminReports, setAdminReports] = useState([]);
  const [adminTab, setAdminTab] = useState('proposals');

  // Favorites & History lists
  const [userFavorites, setUserFavorites] = useState([]);
  const [userHistory, setUserHistory] = useState([]);

  // Check auth on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
      }
    }
    loadCategories();
    loadPlaces();
  }, []);

  useEffect(() => {
    if (currentTab === 'explore') {
      loadPlaces();
    } else if (currentTab === 'top') {
      loadTopPlaces();
    } else if (currentTab === 'favorites' && currentUser) {
      loadFavorites();
    } else if (currentTab === 'history' && currentUser) {
      loadHistory();
    } else if (currentTab === 'admin' && currentUser?.role === 'Admin') {
      loadAdminData();
    }
  }, [currentTab, selectedCategory, selectedDistrict]);

  const loadCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      if (res.data) setCategories(res.data);
    } catch (err) {
      console.warn('Lỗi tải danh mục:', err);
    }
  };

  const loadPlaces = async () => {
    setLoading(true);
    try {
      const res = await placeService.getPlaces({
        categoryId: selectedCategory || undefined,
        district: selectedDistrict || undefined,
        keyword: keyword || undefined
      });
      setPlaces(res.data?.data || []);
    } catch (err) {
      console.error('Lỗi tải danh sách địa điểm:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTopPlaces = async () => {
    setLoading(true);
    try {
      const res = await placeService.getTopPlaces(10);
      setPlaces(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await interactionService.getFavorites();
      setUserFavorites(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await interactionService.getViewHistory();
      setUserHistory(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, propsRes, reportsRes] = await Promise.allSettled([
        interactionService.getAdminStats(),
        interactionService.getProposals(),
        interactionService.getReports()
      ]);
      if (statsRes.status === 'fulfilled') setAdminStats(statsRes.value.data);
      if (propsRes.status === 'fulfilled') setAdminProposals(propsRes.value.data);
      if (reportsRes.status === 'fulfilled') setAdminReports(reportsRes.value.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPlaceDetail = async (place) => {
    setActivePlace(place);
    if (currentUser) {
      try {
        await interactionService.recordView(place.id || place._id);
      } catch {
        // silent
      }
    }
  };

  // Add stop to trip planner
  const handleAddToTrip = (place) => {
    const pId = place.id || place._id;
    if (customTripStops.some(s => (s.id || s._id) === pId)) {
      alert(`Địa điểm "${place.name}" đã có trong kế hoạch du lịch của bạn.`);
      return;
    }
    setCustomTripStops([...customTripStops, place]);
    alert(`Đã thêm "${place.name}" vào lịch trình du lịch!`);
  };

  const handleRemoveTripStop = (index) => {
    const updated = [...customTripStops];
    updated.splice(index, 1);
    setCustomTripStops(updated);
  };

  // Auth Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      let res;
      if (authMode === 'login') {
        res = await authService.login(authEmail, authPassword);
      } else {
        res = await authService.register(authEmail, authPassword, authFullName);
      }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setCurrentUser(res.data);
      setAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthFullName('');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Thao tác không thành công');
    }
  };

  const handleQuickLogin = async (role) => {
    try {
      const email = role === 'admin' ? 'admin@travelreview.vn' : 'traveler@travelreview.vn';
      const pass = role === 'admin' ? 'Admin@123' : 'Member@123';
      const res = await authService.login(email, pass);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setCurrentUser(res.data);
      setAuthModalOpen(false);
    } catch {
      setAuthError('Không thể đăng nhập tài khoản mẫu.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    if (currentTab === 'admin' || currentTab === 'favorites' || currentTab === 'history') {
      setCurrentTab('map');
    }
  };

  // Review Actions
  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!reviewContent.trim()) return;

    setIsSubmittingReview(true);
    try {
      await placeService.createReview(activePlace.id || activePlace._id, {
        rating: reviewRating,
        content: reviewContent.trim(),
        images: []
      });
      const updated = await placeService.getPlaceById(activePlace.id || activePlace._id);
      setActivePlace(updated.data);
      setReviewContent('');
      alert('Đã đăng bài đánh giá thành công!');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi gửi đánh giá');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn bài đánh giá này?')) return;
    try {
      await placeService.deleteReview(activePlace.id || activePlace._id, reviewId);
      const updated = await placeService.getPlaceById(activePlace.id || activePlace._id);
      setActivePlace(updated.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa đánh giá');
    }
  };

  const handleToggleLike = async (reviewId) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    try {
      await placeService.toggleLike(activePlace.id || activePlace._id, reviewId);
      const updated = await placeService.getPlaceById(activePlace.id || activePlace._id);
      setActivePlace(updated.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Comment Actions
  const handleAddComment = async (reviewId) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!commentContent.trim()) return;
    try {
      await placeService.addComment(activePlace.id || activePlace._id, reviewId, commentContent.trim());
      const updated = await placeService.getPlaceById(activePlace.id || activePlace._id);
      setActivePlace(updated.data);
      setCommentContent('');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi bình luận');
    }
  };

  const handleAddReply = async (reviewId, commentId) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!replyContent.trim()) return;
    try {
      await placeService.addReply(activePlace.id || activePlace._id, reviewId, commentId, replyContent.trim());
      const updated = await placeService.getPlaceById(activePlace.id || activePlace._id);
      setActivePlace(updated.data);
      setReplyContent('');
      setReplyingToCommentId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi phản hồi');
    }
  };

  // Toggle Favorite
  const handleToggleFav = async (e, placeId) => {
    e.stopPropagation();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    try {
      await interactionService.toggleFavorite(placeId);
      if (currentTab === 'favorites') {
        loadFavorites();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Propose Place
  const handleProposeSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    try {
      await interactionService.createProposal({
        type: 'create',
        name: propName.trim(),
        description: propDesc.trim(),
        categoryId: propCategory || categories[0]?.id || '650000000000000000000001',
        street: propStreet.trim(),
        district: propDistrict,
        imageUrl: propImageUrl.trim() || undefined
      });
      setPropMessage('Đề xuất địa điểm đã gửi thành công và đang chờ Admin duyệt!');
      setPropName('');
      setPropDesc('');
      setPropStreet('');
      setPropImageUrl('');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi gửi đề xuất');
    }
  };

  // Admin Actions
  const handleAdminDecision = async (proposalId, approve) => {
    const reason = approve ? null : prompt('Nhập lý do từ chối:');
    if (!approve && reason === null) return;
    try {
      await interactionService.processProposal(proposalId, approve, reason);
      loadAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi xử lý');
    }
  };

  const handleAdminResolveReport = async (reportId, deleteContent) => {
    try {
      await interactionService.resolveReport(reportId, deleteContent);
      loadAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi xử lý báo cáo');
    }
  };

  // Check if current user already reviewed active place
  const hasUserReviewed = activePlace?.reviews?.some(
    r => r.userId === currentUser?.userId || r.userId === currentUser?.id
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Header Navigation Tối Giản (Không box, không viền dày) */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{
          maxWidth: 1140,
          margin: '0 auto',
          padding: '0 20px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div 
            onClick={() => { setActivePlace(null); setCurrentTab('map'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          >
            <Compass size={22} color="var(--primary)" />
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              SaigonReview
            </span>
          </div>

          {/* Clean Menu Items (Ghost buttons) */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button 
              onClick={() => { setActivePlace(null); setCurrentTab('map'); }}
              className={`btn-clean-ghost ${currentTab === 'map' ? 'active' : ''}`}
              style={{ fontWeight: currentTab === 'map' ? 600 : 400, color: currentTab === 'map' ? '#0f172a' : undefined }}
            >
              <MapIcon size={15} />
              <span>Bản đồ & Gần tôi</span>
            </button>

            <button 
              onClick={() => { setActivePlace(null); setCurrentTab('trip'); }}
              className={`btn-clean-ghost ${currentTab === 'trip' ? 'active' : ''}`}
              style={{ fontWeight: currentTab === 'trip' ? 600 : 400, color: currentTab === 'trip' ? '#0f172a' : undefined }}
            >
              <Calendar size={15} />
              <span>Lập kế hoạch</span>
              {customTripStops.length > 0 && (
                <span style={{ fontSize: '10px', background: '#0284c7', color: '#fff', borderRadius: 9999, padding: '1px 5px' }}>
                  {customTripStops.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => { setActivePlace(null); setCurrentTab('recommend'); }}
              className={`btn-clean-ghost ${currentTab === 'recommend' ? 'active' : ''}`}
              style={{ fontWeight: currentTab === 'recommend' ? 600 : 400, color: currentTab === 'recommend' ? '#0f172a' : undefined }}
            >
              <Sparkles size={15} />
              <span>Gợi ý Graph</span>
            </button>

            <button 
              onClick={() => { setActivePlace(null); setCurrentTab('explore'); }}
              className={`btn-clean-ghost ${currentTab === 'explore' ? 'active' : ''}`}
              style={{ fontWeight: currentTab === 'explore' ? 600 : 400 }}
            >
              Danh sách
            </button>

            <button 
              onClick={() => { setActivePlace(null); setCurrentTab('top'); }}
              className={`btn-clean-ghost ${currentTab === 'top' ? 'active' : ''}`}
              style={{ fontWeight: currentTab === 'top' ? 600 : 400 }}
            >
              Top 10
            </button>

            {currentUser && (
              <>
                <button 
                  onClick={() => { setActivePlace(null); setCurrentTab('favorites'); }}
                  className={`btn-clean-ghost ${currentTab === 'favorites' ? 'active' : ''}`}
                >
                  Yêu thích
                </button>
                <button 
                  onClick={() => { setActivePlace(null); setCurrentTab('history'); }}
                  className={`btn-clean-ghost ${currentTab === 'history' ? 'active' : ''}`}
                >
                  Lịch sử
                </button>
              </>
            )}

            <button 
              onClick={() => { setActivePlace(null); setCurrentTab('propose'); }}
              className={`btn-clean-ghost ${currentTab === 'propose' ? 'active' : ''}`}
            >
              Đề xuất
            </button>

            {currentUser?.role === 'Admin' && (
              <button 
                onClick={() => { setActivePlace(null); setCurrentTab('admin'); }}
                className={`btn-clean-ghost ${currentTab === 'admin' ? 'active' : ''}`}
                style={{ color: '#0284c7', fontWeight: 600 }}
              >
                Quản trị
              </button>
            )}
          </nav>

          {/* User Auth Info */}
          <div>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {currentUser.fullName} {currentUser.role === 'Admin' && <strong style={{ color: '#0284c7' }}>(Admin)</strong>}
                </span>
                <button onClick={handleLogout} className="btn-clean-ghost" title="Đăng xuất" style={{ padding: '6px 8px' }}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="btn-clean-primary" style={{ padding: '6px 14px' }}>
                <LogIn size={15} />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Content Body */}
      <div style={{ maxWidth: 1140, margin: '0 auto', width: '100%', padding: '24px 20px', flex: 1 }}>

        {/* CHI TIẾT ĐỊA ĐIỂM (PLACE DETAIL VIEW) */}
        {activePlace ? (
          <div>
            <button 
              onClick={() => setActivePlace(null)} 
              className="btn-clean-ghost" 
              style={{ marginBottom: 16, paddingLeft: 0 }}
            >
              <ArrowLeft size={16} />
              <span>Quay lại</span>
            </button>

            {/* Title & Info */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', marginBottom: 6 }}>{activePlace.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <MapPin size={16} color="var(--primary)" />
                    <span>{activePlace.address?.street}, {activePlace.address?.district}, {activePlace.address?.city}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button 
                    onClick={() => handleAddToTrip(activePlace)}
                    className="btn-clean-outline"
                    style={{ fontSize: '0.85rem' }}
                  >
                    + Thêm vào kế hoạch
                  </button>

                  {activePlace.ratingAverage ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '1.25rem', fontWeight: 700 }}>
                      <Star size={20} fill="var(--accent-star)" color="var(--accent-star)" />
                      <span>{activePlace.ratingAverage.toFixed(1)}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                        ({activePlace.reviewCount} đánh giá)
                      </span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chưa có đánh giá</span>
                  )}
                </div>
              </div>
            </div>

            {/* Photo & Description */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 24, marginBottom: 32 }}>
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: 320, background: '#eee' }}>
                <img 
                  src={activePlace.images?.[0]?.url || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'} 
                  alt={activePlace.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: 8, color: 'var(--text-secondary)' }}>Giới thiệu</h4>
                  <p style={{ lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: 16 }}>
                    {activePlace.description}
                  </p>
                </div>

                <div style={{ padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Vị trí GeoJSON (2dsphere index):</div>
                  <div>Kinh độ: {activePlace.location?.coordinates?.[0]} • Vĩ độ: {activePlace.location?.coordinates?.[1]}</div>
                </div>
              </div>
            </div>

            {/* REVIEWS SECTION */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: '1.25rem' }}>
                  Đánh giá từ cộng đồng ({activePlace.reviews?.length || 0})
                </h3>
              </div>

              {/* Review writing form */}
              {!hasUserReviewed ? (
                <form onSubmit={handleCreateReview} style={{ marginBottom: 28, padding: 16, border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 10 }}>Viết đánh giá của bạn</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Chọn số sao:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setReviewRating(star)}
                        style={{ padding: 2 }}
                      >
                        <Star 
                          size={20} 
                          fill={star <= reviewRating ? "var(--accent-star)" : "none"} 
                          color={star <= reviewRating ? "var(--accent-star)" : "#cbd5e1"} 
                        />
                      </button>
                    ))}
                  </div>

                  <textarea 
                    rows={3} 
                    placeholder="Chia sẻ trải nghiệm thực tế của bạn tại đây (tối thiểu 10 ký tự)..."
                    value={reviewContent}
                    onChange={e => setReviewContent(e.target.value)}
                    style={{ width: '100%', marginBottom: 10, resize: 'vertical' }}
                    required
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" disabled={isSubmittingReview} className="btn-clean-primary">
                      <Send size={14} />
                      <span>{isSubmittingReview ? 'Đang gửi...' : 'Đăng bài đánh giá'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ padding: '10px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: 24, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  ✓ Bạn đã đăng đánh giá trên địa điểm này (Tuân thủ bất biến BR-08: Tối đa 1 review/user).
                </div>
              )}

              {/* Embedded reviews list */}
              {activePlace.reviews && activePlace.reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {activePlace.reviews.map(rev => {
                    const isAuthor = currentUser && (rev.userId === currentUser.userId || rev.userId === currentUser.id);
                    const isAdmin = currentUser?.role === 'Admin';

                    return (
                      <div key={rev.reviewId} style={{ paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{rev.authorName}</span>
                            {rev.isDemo && (
                              <span style={{ marginLeft: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>[Dữ liệu mẫu]</span>
                            )}
                            <div style={{ display: 'flex', color: 'var(--accent-star)', marginTop: 2 }}>
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} size={14} fill="var(--accent-star)" />
                              ))}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span>{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</span>
                            {(isAuthor || isAdmin) && (
                              <button 
                                onClick={() => handleDeleteReview(rev.reviewId)}
                                className="btn-clean-ghost" 
                                style={{ color: '#ef4444', padding: '2px 6px' }}
                                title="Xóa đánh giá này"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        <p style={{ color: 'var(--text-primary)', fontSize: '0.925rem', marginBottom: 10, lineHeight: 1.5 }}>
                          {rev.content}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.85rem' }}>
                          <button 
                            onClick={() => handleToggleLike(rev.reviewId)}
                            className="btn-clean-ghost" 
                            style={{ padding: '4px 8px' }}
                          >
                            <ThumbsUp size={14} />
                            <span>Thích ({rev.likes?.length || 0})</span>
                          </button>
                          
                          <button 
                            onClick={() => setReplyingToCommentId(replyingToCommentId === rev.reviewId ? null : rev.reviewId)}
                            className="btn-clean-ghost"
                            style={{ padding: '4px 8px' }}
                          >
                            <MessageSquare size={14} />
                            <span>Bình luận ({rev.comments?.length || 0})</span>
                          </button>
                        </div>

                        {/* Input comment level 1 */}
                        {replyingToCommentId === rev.reviewId && (
                          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                            <input 
                              type="text" 
                              placeholder="Viết bình luận (tầng 1)..."
                              value={commentContent}
                              onChange={e => setCommentContent(e.target.value)}
                              style={{ flex: 1 }}
                            />
                            <button onClick={() => handleAddComment(rev.reviewId)} className="btn-clean-primary" style={{ padding: '6px 12px' }}>
                              Gửi
                            </button>
                          </div>
                        )}

                        {/* Comments & Replies */}
                        {rev.comments && rev.comments.length > 0 && (
                          <div style={{ marginTop: 12, marginLeft: 16, paddingLeft: 12, borderLeft: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {rev.comments.map(cmt => (
                              <div key={cmt.commentId} style={{ fontSize: '0.875rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ fontWeight: 600 }}>{cmt.userName}</span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {new Date(cmt.createdAt).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                                <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{cmt.content}</div>

                                <button 
                                  onClick={() => setReplyingToCommentId(replyingToCommentId === cmt.commentId ? null : cmt.commentId)}
                                  style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 2, padding: 0 }}
                                >
                                  Trả lời
                                </button>

                                {replyingToCommentId === cmt.commentId && (
                                  <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                                    <input 
                                      type="text" 
                                      placeholder="Phản hồi bình luận này (tầng 2)..."
                                      value={replyContent}
                                      onChange={e => setReplyContent(e.target.value)}
                                      style={{ flex: 1, fontSize: '0.8rem', padding: '6px 10px' }}
                                    />
                                    <button onClick={() => handleAddReply(rev.reviewId, cmt.commentId)} className="btn-clean-primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                                      Trả lời
                                    </button>
                                  </div>
                                )}

                                {cmt.replies && cmt.replies.length > 0 && (
                                  <div style={{ marginTop: 6, marginLeft: 12, paddingLeft: 8, borderLeft: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {cmt.replies.map(rep => (
                                      <div key={rep.replyId} style={{ fontSize: '0.825rem' }}>
                                        <span style={{ fontWeight: 600 }}>{rep.userName}: </span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{rep.content}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Chưa có bài đánh giá nào. Bạn hãy là người đầu tiên để lại đánh giá!
                </div>
              )}
            </div>
          </div>
        ) : (
          /* MAIN TABS */
          <div>
            {/* TAB 1: BẢN ĐỒ VÀ GẦN TÔI (MAP & NEARBY) */}
            {currentTab === 'map' && (
              <MapView 
                onSelectPlace={handleOpenPlaceDetail} 
                onAddToTrip={handleAddToTrip} 
              />
            )}

            {/* TAB 2: LẬP KẾ HOẠCH DU LỊCH (TRIP PLANNER) */}
            {currentTab === 'trip' && (
              <TripPlanner 
                customStops={customTripStops}
                onRemoveStop={handleRemoveTripStop}
                onSelectPlace={handleOpenPlaceDetail}
                onClearTrip={() => setCustomTripStops([])}
              />
            )}

            {/* TAB 3: GỢI Ý ĐỒ THỊ NEO4J (GRAPH RECOMMENDATIONS) */}
            {currentTab === 'recommend' && (
              <GraphRecommendations 
                places={places}
                onSelectPlace={handleOpenPlaceDetail}
                onAddToTrip={handleAddToTrip}
              />
            )}

            {/* TAB 4: KHÁM PHÁ (DANH SÁCH LƯỚI & TÌM KIẾM) */}
            {currentTab === 'explore' && (
              <div>
                {/* Search Bar Tối Giản */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 12 }} />
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm theo tên địa điểm, món ăn, di tích..." 
                      value={keyword}
                      onChange={e => setKeyword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && loadPlaces()}
                      style={{ width: '100%', paddingLeft: 38 }}
                    />
                  </div>

                  <select 
                    value={selectedDistrict} 
                    onChange={e => setSelectedDistrict(e.target.value)}
                    style={{ minWidth: 160 }}
                  >
                    <option value="">Tất cả Quận/Huyện</option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="Quận 3">Quận 3</option>
                    <option value="Quận 4">Quận 4</option>
                    <option value="Quận 6">Quận 6</option>
                    <option value="Phú Nhuận">Phú Nhuận</option>
                    <option value="Bình Thạnh">Bình Thạnh</option>
                    <option value="TP. Thủ Đức">TP. Thủ Đức</option>
                  </select>

                  <button onClick={loadPlaces} className="btn-clean-primary">
                    Tìm kiếm
                  </button>
                </div>

                {/* Minimalist Categories Bar */}
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', borderBottom: '1px solid var(--border-light)', marginBottom: 20 }}>
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className={`tab-minimal ${selectedCategory === '' ? 'active' : ''}`}
                  >
                    Tất cả danh mục
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat.id || cat._id}
                      onClick={() => setSelectedCategory(cat.id || cat._id)}
                      className={`tab-minimal ${selectedCategory === (cat.id || cat._id) ? 'active' : ''}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Grid places */}
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                    Đang tải dữ liệu từ MongoDB Atlas...
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 20
                  }}>
                    {places.map(place => (
                      <div 
                        key={place.id || place._id}
                        className="place-card-minimal"
                        onClick={() => handleOpenPlaceDetail(place)}
                      >
                        <div style={{ height: 180, position: 'relative', background: '#e2e8f0' }}>
                          <img 
                            src={place.images?.[0]?.url || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'} 
                            alt={place.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <button 
                            onClick={(e) => handleToggleFav(e, place.id || place._id)}
                            style={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              background: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '50%',
                              width: 32,
                              height: 32,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ef4444'
                            }}
                          >
                            <Heart size={16} />
                          </button>
                        </div>

                        <div style={{ padding: 14 }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                            {place.address?.district}
                          </div>
                          <h3 style={{ fontSize: '1.05rem', marginBottom: 6, lineHeight: 1.3 }}>
                            {place.name}
                          </h3>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: '0.85rem' }}>
                            {place.ratingAverage ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                                <Star size={14} fill="var(--accent-star)" color="var(--accent-star)" />
                                <span>{place.ratingAverage.toFixed(1)}</span>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({place.reviewCount})</span>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>Chưa có đánh giá</span>
                            )}

                            <span style={{ color: 'var(--primary)', fontWeight: 500 }}>Chi tiết →</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: TOP 10 */}
            {currentTab === 'top' && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Top 10 Địa Điểm Đánh Giá Cao Nhất</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Xếp hạng dựa trên thuật toán Aggregation của MongoDB kết hợp giữa điểm trung bình và số lượt đánh giá
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                  {places.map((place, idx) => (
                    <div 
                      key={place.id || place._id}
                      className="place-card-minimal"
                      onClick={() => handleOpenPlaceDetail(place)}
                    >
                      <div style={{ height: 180, position: 'relative' }}>
                        <img 
                          src={place.images?.[0]?.url || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'} 
                          alt={place.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: '#0f172a',
                          color: '#fff',
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}>
                          #{idx + 1}
                        </div>
                      </div>

                      <div style={{ padding: 14 }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                          {place.address?.district}
                        </div>
                        <h3 style={{ fontSize: '1.05rem', marginBottom: 6 }}>{place.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                          <Star size={14} fill="var(--accent-star)" color="var(--accent-star)" />
                          <span>{place.ratingAverage?.toFixed(1) || '5.0'}</span>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({place.reviewCount} đánh giá)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: YÊU THÍCH (FAVORITES) */}
            {currentTab === 'favorites' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Địa Điểm Yêu Thích Của Bạn</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
                  Danh sách địa điểm bạn đã lưu lại
                </p>

                {userFavorites.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                    {userFavorites.map(place => (
                      <div key={place.id || place._id} className="place-card-minimal" onClick={() => handleOpenPlaceDetail(place)}>
                        <div style={{ height: 180, position: 'relative' }}>
                          <img src={place.images?.[0]?.url || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: 14 }}>
                          <h3 style={{ fontSize: '1.05rem', marginBottom: 6 }}>{place.name}</h3>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{place.address?.district}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    Bạn chưa lưu địa điểm yêu thích nào.
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: LỊCH SỬ XEM (VIEW HISTORY) */}
            {currentTab === 'history' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Lịch Sử Xem Địa Điểm</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Các địa điểm bạn đã khám phá gần đây
                    </p>
                  </div>
                  {userHistory.length > 0 && (
                    <button 
                      onClick={async () => {
                        await interactionService.clearViewHistory();
                        setUserHistory([]);
                      }}
                      className="btn-clean-ghost" 
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={15} /> Xóa lịch sử
                    </button>
                  )}
                </div>

                {userHistory.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                    {userHistory.map(place => (
                      <div key={place.id || place._id} className="place-card-minimal" onClick={() => handleOpenPlaceDetail(place)}>
                        <div style={{ height: 180, position: 'relative' }}>
                          <img src={place.images?.[0]?.url || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: 14 }}>
                          <h3 style={{ fontSize: '1.05rem', marginBottom: 6 }}>{place.name}</h3>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{place.address?.district}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    Chưa có lịch sử xem nào.
                  </div>
                )}
              </div>
            )}

            {/* TAB 8: ĐỀ XUẤT ĐỊA ĐIỂM (PROPOSE) */}
            {currentTab === 'propose' && (
              <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Đề Xuất Địa Điểm Mới</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
                  Đóng góp địa điểm du lịch, quán ăn ngon tại TP.HCM để chia sẻ cùng cộng đồng. Đề xuất sẽ xuất hiện sau khi Admin duyệt.
                </p>

                {propMessage && (
                  <div style={{ padding: '12px 16px', background: '#ecfdf5', color: '#065f46', borderRadius: 'var(--radius-sm)', marginBottom: 20 }}>
                    {propMessage}
                  </div>
                )}

                <form onSubmit={handleProposeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Tên địa điểm *</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Phở Lệ Quận 5"
                      value={propName}
                      onChange={e => setPropName(e.target.value)}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Danh mục *</label>
                      <select 
                        value={propCategory} 
                        onChange={e => setPropCategory(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        {categories.map(c => (
                          <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Quận / Huyện *</label>
                      <select 
                        value={propDistrict} 
                        onChange={e => setPropDistrict(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="Quận 1">Quận 1</option>
                        <option value="Quận 3">Quận 3</option>
                        <option value="Quận 4">Quận 4</option>
                        <option value="Quận 5">Quận 5</option>
                        <option value="Quận 6">Quận 6</option>
                        <option value="Phú Nhuận">Phú Nhuận</option>
                        <option value="Bình Thạnh">Bình Thạnh</option>
                        <option value="TP. Thủ Đức">TP. Thủ Đức</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Địa chỉ chi tiết (Đường, số nhà) *</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: 413-415 Nguyễn Trãi, Phường 7"
                      value={propStreet}
                      onChange={e => setPropStreet(e.target.value)}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Mô tả địa điểm *</label>
                    <textarea 
                      rows={4}
                      placeholder="Mô tả các điểm đặc sắc, món ăn nổi bật, giá cả hoặc lịch sử..."
                      value={propDesc}
                      onChange={e => setPropDesc(e.target.value)}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>URL Hình ảnh minh họa</label>
                    <input 
                      type="url" 
                      placeholder="https://images.unsplash.com/photo-..."
                      value={propImageUrl}
                      onChange={e => setPropImageUrl(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <button type="submit" className="btn-clean-primary" style={{ width: '100%', padding: '10px 0' }}>
                      Gửi đề xuất
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 9: QUẢN TRỊ ADMIN */}
            {currentTab === 'admin' && currentUser?.role === 'Admin' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Bảng Quản Trị Hệ Thống</h2>

                {adminStats && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
                    <div style={{ padding: 16, background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tổng địa điểm</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: 4 }}>{adminStats.totalPlaces}</div>
                    </div>
                    <div style={{ padding: 16, background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tổng bài đánh giá</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: 4 }}>{adminStats.totalReviews}</div>
                    </div>
                    <div style={{ padding: 16, background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Điểm bình quân</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: 4, color: '#eab308' }}>
                        {adminStats.averageRating} ★
                      </div>
                    </div>
                    <div style={{ padding: 16, background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Đề xuất đang chờ</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: 4, color: '#0284c7' }}>
                        {adminStats.pendingProposals}
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--border-light)', marginBottom: 20 }}>
                  <button 
                    onClick={() => setAdminTab('proposals')}
                    className={`tab-minimal ${adminTab === 'proposals' ? 'active' : ''}`}
                  >
                    Duyệt đề xuất ({adminProposals.filter(p => p.status === 'pending').length})
                  </button>
                  <button 
                    onClick={() => setAdminTab('reports')}
                    className={`tab-minimal ${adminTab === 'reports' ? 'active' : ''}`}
                  >
                    Báo cáo vi phạm ({adminReports.filter(r => r.status === 'pending').length})
                  </button>
                </div>

                {adminTab === 'proposals' && (
                  <div>
                    {adminProposals.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {adminProposals.map(p => (
                          <div key={p.id} style={{ padding: 16, background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                              <div>
                                <span style={{ fontWeight: 600, fontSize: '1rem' }}>
                                  {p.payload?.name || 'Đề xuất'}
                                </span>
                                <span style={{ marginLeft: 8, fontSize: '0.75rem', padding: '2px 8px', borderRadius: 4, background: p.status === 'pending' ? '#fef3c7' : p.status === 'approved' ? '#ecfdf5' : '#fee2e2', color: p.status === 'pending' ? '#92400e' : p.status === 'approved' ? '#065f46' : '#991b1b' }}>
                                  {p.status}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {new Date(p.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                              {p.payload?.description}
                            </p>

                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                              Khu vực: {p.payload?.district} • Địa chỉ: {p.payload?.street}
                            </div>

                            {p.status === 'pending' && (
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => handleAdminDecision(p.id, true)} className="btn-clean-primary" style={{ padding: '6px 14px' }}>
                                  Phê duyệt
                                </button>
                                <button onClick={() => handleAdminDecision(p.id, false)} className="btn-clean-ghost" style={{ color: '#ef4444' }}>
                                  Từ chối
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-muted)' }}>Không có đề xuất nào cần xử lý.</div>
                    )}
                  </div>
                )}

                {adminTab === 'reports' && (
                  <div>
                    {adminReports.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {adminReports.map(r => (
                          <div key={r.id} style={{ padding: 16, background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span style={{ fontWeight: 600 }}>Báo cáo đối tượng: {r.targetType}</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12 }}>
                              Lý do: <strong>{r.reason}</strong>
                            </div>

                            {r.status === 'pending' && (
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => handleAdminResolveReport(r.id, true)} className="btn-clean-primary" style={{ background: '#ef4444' }}>
                                  Xóa nội dung (Hard Delete)
                                </button>
                                <button onClick={() => handleAdminResolveReport(r.id, false)} className="btn-clean-ghost">
                                  Bỏ qua báo cáo
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-muted)' }}>Không có báo cáo vi phạm nào.</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Modal Đăng nhập / Đăng ký Tối Giản */}
      {authModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            maxWidth: 400,
            padding: 24,
            boxShadow: 'var(--shadow-modal)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.15rem' }}>
                {authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
              </h3>
              <button onClick={() => setAuthModalOpen(false)} className="btn-clean-ghost" style={{ padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            {authError && (
              <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: 16 }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {authMode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: 4 }}>Họ và tên</label>
                  <input 
                    type="text" 
                    placeholder="Nguyễn Văn A"
                    value={authFullName}
                    onChange={e => setAuthFullName(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: 4 }}>Email</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: 4 }}>Mật khẩu</label>
                <input 
                  type="password" 
                  placeholder="Tối thiểu 6 ký tự"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <button type="submit" className="btn-clean-primary" style={{ width: '100%', marginTop: 8, padding: '10px 0' }}>
                {authMode === 'login' ? 'Đăng nhập' : 'Đăng ký ngay'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem' }}>
              {authMode === 'login' ? (
                <span>Chưa có tài khoản? <button onClick={() => { setAuthMode('register'); setAuthError(''); }} style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng ký</button></span>
              ) : (
                <span>Đã có tài khoản? <button onClick={() => { setAuthMode('login'); setAuthError(''); }} style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng nhập</button></span>
              )}
            </div>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, textAlign: 'center' }}>
                Đăng nhập nhanh để trải nghiệm:
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleQuickLogin('admin')} className="btn-clean-outline" style={{ flex: 1, fontSize: '0.8rem', padding: '6px 0' }}>
                  Admin mẫu
                </button>
                <button onClick={() => handleQuickLogin('member')} className="btn-clean-outline" style={{ flex: 1, fontSize: '0.8rem', padding: '6px 0' }}>
                  Member mẫu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Footer Tối Giản */}
      <footer style={{
        borderTop: '1px solid var(--border-light)',
        padding: '20px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        background: '#ffffff'
      }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          Đồ án CSDL NoSQL (Đề tài 04) • ASP.NET Core 9 • MongoDB Atlas (Source of Truth) • Sẵn sàng mở rộng Neo4j AuraDB
        </div>
      </footer>
    </div>
  );
}
