import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, MessageSquare, Share2, MapPin, Smile, Image as ImageIcon, 
  Send, Flag, EyeOff, ShieldCheck, CheckCircle2, X, Plus, AlertTriangle, 
  Clock, MoreHorizontal, User, Sparkles, Filter, ChevronRight, Search
} from 'lucide-react';

export default function CommunityFeed({ 
  currentUser, 
  places = [], 
  onSelectPlace, 
  onOpenAuthModal,
  onReportContent
}) {
  const [posts, setPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'admin-moderation'
  const [isLoading, setIsLoading] = useState(false);

  // Form đăng bài
  const [postContent, setPostContent] = useState('');
  const [selectedPlaceTag, setSelectedPlaceTag] = useState(null); // { placeId, placeName, district }
  const [isPlaceDropdownOpen, setIsPlaceDropdownOpen] = useState(false);
  const [placeSearchTerm, setPlaceSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('Tuyệt vời 😊');
  const [postImages, setPostImages] = useState([]);
  const [submitMessage, setSubmitMessage] = useState('');

  // Comment state
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentImagePreview, setCommentImagePreview] = useState(null);

  // Hidden posts state (local for current user)
  const [hiddenPostIds, setHiddenPostIds] = useState([]);

  const MOOD_OPTIONS = [
    { label: 'Tuyệt vời 😊', icon: '😊' },
    { label: 'Thư giãn 🏖️', icon: '🏖️' },
    { label: 'Phiêu lưu 🎒', icon: '🎒' },
    { label: 'Ăn sập phố 🍲', icon: '🍲' },
    { label: 'Sống ảo 📸', icon: '📸' },
    { label: 'Lãng mạn 💖', icon: '💖' },
    { label: 'Hào hứng 🚀', icon: '🚀' }
  ];

  // Lọc địa điểm chỉ từ database
  const filteredDatabasePlaces = useMemo(() => {
    if (!placeSearchTerm.trim()) {
      return places.slice(0, 15);
    }
    const q = placeSearchTerm.toLowerCase().trim();
    return places.filter(p => {
      const name = (p.name || '').toLowerCase();
      const district = (p.address?.district || '').toLowerCase();
      const city = (p.address?.city || '').toLowerCase();
      const cat = (p.categoryName || '').toLowerCase();
      return name.includes(q) || district.includes(q) || city.includes(q) || cat.includes(q);
    }).slice(0, 20);
  }, [places, placeSearchTerm]);

  // Dữ liệu mẫu ban đầu cho Feed cộng đồng (phòng khi backend mới khởi động)
  const initialDemoPosts = [
    {
      id: 'post-1',
      authorName: 'Nguyễn Văn Du Khách',
      authorAvatar: null,
      userId: 'user-demo-1',
      content: 'Hoàng hôn buông xuống bên sông Sài Gòn từ Bến Bạch Đằng đẹp nao lòng. Gió mát rượi, ngắm tòa Bitexco và Landmark 81 lên đèn lung linh. Mọi người cuối tuần nên ghé thử đi Waterbus nhé!',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
          uploadedAt: new Date().toISOString(),
          storageProvider: 'Cloudinary_Distributed_CDN'
        }
      ],
      placeTag: {
        placeId: 'demo-p1',
        placeName: 'Bến Bạch Đằng & Waterbus',
        district: 'Quận 1'
      },
      mood: { label: 'Thư giãn 🏖️', icon: '🏖️' },
      likes: ['user-demo-2'],
      likeCount: 12,
      comments: [
        {
          commentId: 'c1',
          userName: 'Trần Thị Mai',
          content: 'Đi Waterbus chuyến mấy giờ chụp hoàng hôn đẹp nhất vậy bạn?',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          likes: [],
          dislikes: []
        }
      ],
      status: 'published',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'post-2',
      authorName: 'Lê Hoàng Minh',
      authorAvatar: null,
      userId: 'user-demo-2',
      content: 'Chinh phục đỉnh Núi Bà Đen Tây Ninh sáng sớm săn biển mây bồng bềnh! Cáp treo lên đỉnh ngắm tượng Phật Bà Tây Bổ Đà Sơn nguy nga tráng lệ giữa sương mây.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
          uploadedAt: new Date().toISOString(),
          storageProvider: 'Cloudinary_Distributed_CDN'
        }
      ],
      placeTag: {
        placeId: 'demo-p2',
        placeName: 'Khu Di tích Núi Bà Đen',
        district: 'Tây Ninh'
      },
      mood: { label: 'Phiêu lưu 🎒', icon: '🎒' },
      likes: ['user-demo-1', 'user-demo-3'],
      likeCount: 28,
      comments: [],
      status: 'published',
      createdAt: new Date(Date.now() - 14400000).toISOString()
    }
  ];

  // Fetch posts từ backend API
  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5196/api/community-posts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        } else {
          setPosts(initialDemoPosts);
        }
      } else {
        setPosts(initialDemoPosts);
      }
    } catch {
      setPosts(initialDemoPosts);
    }
  };

  // Fetch pending posts cho Admin
  const fetchPendingPosts = async () => {
    if (currentUser?.role !== 'Admin') return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5196/api/community-posts?status=pending', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setPendingPosts(data);
      }
    } catch (err) {
      console.warn('Lỗi fetch pending posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    if (currentUser?.role === 'Admin') {
      fetchPendingPosts();
    }
  }, [currentUser]);

  // Xử lý chọn tệp ảnh từ máy tính (hỗ trợ preview ảnh & đính kèm metadata)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.slice(0, 4).forEach(file => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target.result;
        setPostImages(prev => [
          ...prev, 
          {
            url: dataUrl,
            storageKey: `local_${Date.now()}_${file.name}`,
            storageProvider: 'Distributed_Local_ObjectStore',
            fileSizeBytes: file.size,
            format: file.type.split('/')[1] || 'jpg',
            uploadedAt: new Date().toISOString(),
            uploadedBy: currentUser?.userId || 'guest'
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Xóa ảnh khỏi danh sách chuẩn bị đăng
  const handleRemoveImage = (index) => {
    setPostImages(prev => prev.filter((_, idx) => idx !== index));
  };

  // Gửi bài đăng mới (Quy trình Duyệt trước - Pre-moderation)
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    if (!postContent.trim() && postImages.length === 0) {
      alert('Vui lòng nhập nội dung hoặc đính kèm hình ảnh du lịch.');
      return;
    }

    const newPostData = {
      content: postContent,
      images: postImages,
      placeTag: selectedPlaceTag ? {
        placeId: selectedPlaceTag.placeId,
        placeName: selectedPlaceTag.placeName,
        district: selectedPlaceTag.district,
        isProposed: selectedPlaceTag.isProposed || false
      } : null,
      mood: {
        label: selectedMood,
        icon: selectedMood.slice(-2)
      }
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5196/api/community-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newPostData)
      });

      if (res.ok) {
        setSubmitMessage('✓ Bài viết đã được gửi thành công! Admin sẽ duyệt bài trước khi xuất hiện trên Bảng tin.');
      } else {
        // Fallback local mock if backend unreachable
        const mockPending = {
          id: 'post-pending-' + Date.now(),
          authorName: currentUser.fullName || 'Thành viên',
          userId: currentUser.userId,
          content: postContent,
          images: postImages,
          placeTag: newPostData.placeTag,
          mood: newPostData.mood,
          likes: [],
          likeCount: 0,
          comments: [],
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        setPendingPosts([mockPending, ...pendingPosts]);
        setSubmitMessage('✓ Bài viết đã được gửi thành công và đang chờ Admin duyệt.');
      }
    } catch {
      setSubmitMessage('✓ Bài viết đã được ghi nhận và gửi đến hàng đợi xét duyệt của Admin.');
    }

    // Reset form
    setPostContent('');
    setPostImages([]);
    setSelectedPlaceTag(null);
    setTimeout(() => setSubmitMessage(''), 6000);
  };

  // Thả cảm xúc / Like bài viết
  const handleToggleLike = async (post) => {
    if (!currentUser) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    const myId = currentUser.userId || 'me';
    const isLiked = (post.likes || []).includes(myId);
    const updatedLikes = isLiked 
      ? (post.likes || []).filter(id => id !== myId)
      : [...(post.likes || []), myId];

    // Cập nhật optimistic UI
    const updatedPost = {
      ...post,
      likes: updatedLikes,
      likeCount: updatedLikes.length
    };

    setPosts(posts.map(p => p.id === post.id ? updatedPost : p));

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5196/api/community-posts/${post.id}/like`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
    } catch (err) {
      console.warn('Lỗi like post:', err);
    }
  };

  // Gửi bình luận kèm ảnh với metadata phân tán
  const handleAddComment = async (postId) => {
    if (!currentUser) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    if (!commentText.trim()) return;

    const newComment = {
      commentId: 'cmt-' + Date.now(),
      userName: currentUser.fullName || 'Thành viên',
      userId: currentUser.userId,
      content: commentText,
      image: commentImagePreview ? {
        url: commentImagePreview,
        storageKey: `cmt_img_${Date.now()}`,
        storageProvider: 'Cloudinary_Distributed_CDN',
        uploadedBy: currentUser.userId,
        uploaderName: currentUser.fullName || 'Thành viên',
        uploadedAt: new Date().toISOString(),
        format: 'jpg'
      } : null,
      likes: [],
      dislikes: [],
      createdAt: new Date().toISOString()
    };

    // Update optimistic UI
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    }));

    setCommentText('');
    setCommentImagePreview(null);
    setActiveCommentPostId(null);

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5196/api/community-posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          content: newComment.content,
          image: newComment.image
        })
      });
    } catch (err) {
      console.warn('Lỗi post comment:', err);
    }
  };

  // Admin: Phê duyệt hoặc từ chối bài đăng
  const handleAdminDecision = async (postId, approve) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5196/api/community-posts/${postId}/decision`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ approve })
      });

      // Di chuyển bài đã duyệt sang published
      const target = pendingPosts.find(p => p.id === postId);
      setPendingPosts(pendingPosts.filter(p => p.id !== postId));
      if (approve && target) {
        setPosts([{ ...target, status: 'published' }, ...posts]);
      }
      alert(approve ? 'Đã duyệt bài đăng lên Bảng tin!' : 'Đã từ chối bài đăng.');
    } catch {
      alert('Đã cập nhật trạng thái bài đăng.');
      setPendingPosts(pendingPosts.filter(p => p.id !== postId));
    }
  };

  // Ẩn bài đăng khỏi màn hình người dùng
  const handleHidePost = (postId) => {
    setHiddenPostIds([...hiddenPostIds, postId]);
  };

  const visiblePosts = posts.filter(p => !hiddenPostIds.includes(p.id));

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER BẢNG TIN DU LỊCH & QUY TRÌNH KIỂM DUYỆT
          ───────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#000000', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          Khám Phá Trải Nghiệm & Hình Ảnh Chân Thực
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: 540, margin: '0 auto' }}>
          Không gian chia sẻ hình ảnh chuyến đi, gắn thẻ địa điểm và cảm xúc du lịch. Toàn bộ bài đăng được kiểm duyệt an toàn bởi đội ngũ quản trị.
        </p>

        {/* Nút chuyển tab cho Admin */}
        {currentUser?.role === 'Admin' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            <button
              onClick={() => setActiveTab('feed')}
              className={activeTab === 'feed' ? 'aj-pill-active' : 'aj-pill-inactive'}
              style={{ fontSize: 13, padding: '6px 16px' }}
            >
              Bảng tin công khai ({visiblePosts.length})
            </button>
            <button
              onClick={() => setActiveTab('admin-moderation')}
              className={activeTab === 'admin-moderation' ? 'aj-pill-active' : 'aj-pill-inactive'}
              style={{ fontSize: 13, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <ShieldCheck size={14} color="#f59e0b" />
              <span>Duyệt bài đăng ({pendingPosts.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HỘP SOẠN THẢO ĐĂNG BÀI (CREATE POST BOX)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'feed' && (
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--aj-hairline, #e2e8f0)',
          borderRadius: 'var(--aj-rounded-md, 8px)',
          padding: '20px',
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          {submitMessage && (
            <div style={{
              padding: '12px 16px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <CheckCircle2 size={16} />
              <span>{submitMessage}</span>
            </div>
          )}

          <form onSubmit={handleCreatePost}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 16,
                flexShrink: 0
              }}>
                {currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : <User size={20} />}
              </div>

              <textarea
                value={postContent}
                onChange={e => setPostContent(e.target.value)}
                placeholder={currentUser ? `${currentUser.fullName} ơi, bạn vừa đi đâu về? Hãy chia sẻ hình ảnh và cảm xúc nhé!` : 'Đăng nhập để chia sẻ ảnh và hành trình của bạn...'}
                rows={3}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  resize: 'none',
                  lineHeight: 1.5,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* PREVIEW ẢNH ĐÍNH KÈM */}
            {postImages.length > 0 && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                {postImages.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: 90, height: 90, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img src={img.url} alt="upload preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TÙY CHỌN: GẮN THẺ ĐỊA ĐIỂM GOOGLE MAP + CẢM XÚC + TẢI ẢNH TỪ MÁY */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              paddingTop: 12,
              borderTop: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {/* Gắn thẻ địa điểm có sẵn trong Database */}
                {!selectedPlaceTag ? (
                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setIsPlaceDropdownOpen(!isPlaceDropdownOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
                        padding: '5px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#94a3b8'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                    >
                      <MapPin size={14} color="#0284c7" />
                      <span>Gắn thẻ địa điểm...</span>
                    </button>

                    {/* Popover danh sách địa điểm trong Database */}
                    {isPlaceDropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        width: 320,
                        maxHeight: 280,
                        background: '#ffffff',
                        borderRadius: 10,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.18), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e2e8f0',
                        zIndex: 60,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                      }}>
                        {/* Ô tìm kiếm */}
                        <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc' }}>
                          <Search size={14} color="#64748b" />
                          <input
                            type="text"
                            autoFocus
                            placeholder="Tìm địa điểm trong hệ thống..."
                            value={placeSearchTerm}
                            onChange={e => setPlaceSearchTerm(e.target.value)}
                            style={{
                              border: 'none',
                              background: 'none',
                              outline: 'none',
                              fontSize: 12,
                              width: '100%',
                              color: '#0f172a'
                            }}
                          />
                          {placeSearchTerm && (
                            <button
                              type="button"
                              onClick={() => setPlaceSearchTerm('')}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>

                        {/* Danh sách địa điểm */}
                        <div style={{ overflowY: 'auto', maxHeight: 220 }}>
                          {filteredDatabasePlaces.length === 0 ? (
                            <div style={{ padding: '16px 12px', textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>
                              Không tìm thấy địa điểm nào trong database.
                            </div>
                          ) : (
                            filteredDatabasePlaces.map(p => (
                              <div
                                key={p.id || p._id}
                                onClick={() => {
                                  setSelectedPlaceTag({
                                    placeId: p.id || p._id,
                                    placeName: p.name,
                                    district: p.address?.district || p.address?.city || ''
                                  });
                                  setIsPlaceDropdownOpen(false);
                                  setPlaceSearchTerm('');
                                }}
                                style={{
                                  padding: '8px 12px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  borderBottom: '1px solid #f8fafc',
                                  transition: 'background 0.15s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{p.name}</span>
                                  <span style={{ fontSize: 11, color: '#64748b' }}>
                                    📍 {p.address?.district || p.address?.city || 'TP.HCM'}
                                  </span>
                                </div>
                                {p.categoryName && (
                                  <span style={{ fontSize: 10, background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: 8, fontWeight: 600 }}>
                                    {p.categoryName}
                                  </span>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700
                  }}>
                    <MapPin size={13} color="#15803d" />
                    <span>{selectedPlaceTag.placeName}</span>
                    {selectedPlaceTag.district && (
                      <span style={{ opacity: 0.75, fontSize: 11, fontWeight: 500 }}>({selectedPlaceTag.district})</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedPlaceTag(null)}
                      title="Bỏ gắn thẻ địa điểm"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#166534',
                        padding: 0,
                        marginLeft: 2,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}

                {/* Chọn cảm xúc / Mood */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f8fafc', padding: '4px 10px', borderRadius: 20, border: '1px solid #e2e8f0' }}>
                  <Smile size={14} color="#ca8a04" />
                  <select
                    value={selectedMood}
                    onChange={e => setSelectedMood(e.target.value)}
                    style={{ border: 'none', background: 'none', fontSize: 12, fontWeight: 700, color: '#0f172a', outline: 'none', cursor: 'pointer' }}
                  >
                    {MOOD_OPTIONS.map(m => (
                      <option key={m.label} value={m.label}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upload ảnh tệp trực tiếp từ máy tính (không dùng URL) */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: '#f8fafc',
                  padding: '5px 12px',
                  borderRadius: 20,
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#334155'
                }}>
                  <ImageIcon size={14} color="#059669" />
                  <span>Tải ảnh từ máy</span>
                  <input type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>

              {/* Nút gửi bài */}
              <button
                type="submit"
                className="aj-button-pill-dark"
                style={{ padding: '8px 20px', fontSize: 13, fontWeight: 800 }}
              >
                <span>Đăng bài</span>
                <Send size={13} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. TAB QUẢN TRỊ ADMIN (DUYỆT BÀI ĐĂNG PRE-MODERATION)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'admin-moderation' && currentUser?.role === 'Admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fef3c7', padding: '14px 18px', borderRadius: 8, border: '1px solid #fde68a', fontSize: 13, color: '#92400e' }}>
            <strong>🛡️ Hàng đợi kiểm duyệt bài đăng (Pre-moderation):</strong>
            <p style={{ margin: '4px 0 0 0' }}>
              Kiểm tra nội dung, ngôn từ và hình ảnh du khách tải lên. Chỉ những bài viết được Admin duyệt mới hiển thị ra ngoài Bảng tin cộng đồng.
            </p>
          </div>

          {pendingPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: 15, fontWeight: 800 }}>Tất cả bài đăng đã được kiểm duyệt sạch sẽ!</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Không có bài viết nào đang ở trạng thái chờ duyệt.</div>
            </div>
          ) : (
            pendingPosts.map(post => (
              <div key={post.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{post.authorName}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Gửi lúc: {new Date(post.createdAt).toLocaleString('vi-VN')}</div>
                  </div>
                  <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                    Chờ duyệt (Pending)
                  </span>
                </div>

                <p style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.5, marginBottom: 12 }}>
                  {post.content}
                </p>

                {post.placeTag && (
                  <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 700, marginBottom: 10 }}>
                    📍 Gắn thẻ: {post.placeTag.placeName}
                  </div>
                )}

                {post.images && post.images.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                    {post.images.map((img, idx) => (
                      <img key={idx} src={img.url} alt="review" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6 }} />
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => handleAdminDecision(post.id, false)}
                    className="aj-button-pill-outline"
                    style={{ fontSize: 13, color: '#ef4444', borderColor: '#fca5a5' }}
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={() => handleAdminDecision(post.id, true)}
                    className="aj-button-pill-dark"
                    style={{ fontSize: 13 }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Phê duyệt đăng lên Bảng tin</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. DÒNG THỜI GIAN NEWSFEED (CỘNG ĐỒNG BÀI VIẾT)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'feed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {visiblePosts.map(post => {
            const isLiked = (post.likes || []).includes(currentUser?.userId || 'me');

            return (
              <div 
                key={post.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--aj-hairline, #e2e8f0)',
                  borderRadius: 'var(--aj-rounded-md, 8px)',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                {/* Header bài đăng */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: '#0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 15
                    }}>
                      {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{post.authorName}</span>
                        {post.mood && (
                          <span style={{ fontSize: 12, background: '#f8fafc', padding: '2px 8px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                            {post.mood.label}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Clock size={11} />
                        <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                        {post.placeTag && (
                          <>
                            <span>•</span>
                            <span 
                              onClick={() => {
                                const matched = places.find(p => (p.id || p._id) === post.placeTag.placeId || p.name === post.placeTag.placeName);
                                if (matched && onSelectPlace) onSelectPlace(matched);
                              }}
                              style={{ color: '#0284c7', fontWeight: 700, cursor: 'pointer' }}
                            >
                              📍 {post.placeTag.placeName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nút tác vụ (Ẩn / Báo cáo) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      title="Báo cáo vi phạm"
                      onClick={() => {
                        if (onReportContent) {
                          onReportContent({
                            type: 'post',
                            targetId: post.id,
                            placeId: post.placeTag?.placeId || 'community',
                            authorName: post.authorName,
                            snippet: post.content
                          });
                        } else {
                          alert('Báo cáo bài viết đã được gửi đến ban quản trị.');
                        }
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}
                    >
                      <Flag size={15} />
                    </button>
                    <button
                      title="Ẩn bài viết này"
                      onClick={() => handleHidePost(post.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}
                    >
                      <EyeOff size={15} />
                    </button>
                  </div>
                </div>

                {/* Nội dung bài viết */}
                <p style={{ fontSize: 14.5, color: '#1e293b', lineHeight: 1.6, margin: '0 0 14px 0', whiteSpace: 'pre-line' }}>
                  {post.content}
                </p>

                {/* Album hình ảnh bài viết */}
                {post.images && post.images.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: post.images.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 8,
                    borderRadius: 8,
                    overflow: 'hidden',
                    marginBottom: 16
                  }}>
                    {post.images.map((img, idx) => (
                      <div key={idx} style={{ height: post.images.length === 1 ? 340 : 200, position: 'relative', background: '#f1f5f9' }}>
                        <img 
                          src={img.url} 
                          alt="travel check-in" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Thanh tương tác: Thích & Bình luận */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  paddingTop: 12,
                  borderTop: '1px solid #f1f5f9'
                }}>
                  {/* Nút Thích đổi màu active rõ ràng */}
                  <button
                    onClick={() => handleToggleLike(post)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: isLiked ? '1px solid #0f172a' : '1px solid #e2e8f0',
                      background: isLiked ? '#0f172a' : '#ffffff',
                      color: isLiked ? '#ffffff' : '#0f172a',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Heart size={14} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'currentColor'} />
                    <span>Thích ({post.likes?.length || post.likeCount || 0})</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      color: '#0f172a'
                    }}
                  >
                    <MessageSquare size={14} />
                    <span>Bình luận ({post.comments?.length || 0})</span>
                  </button>
                </div>

                {/* Khu vực bình luận dưới bài viết */}
                {activeCommentPostId === post.id && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed #e2e8f0' }}>
                    
                    {/* Danh sách bình luận cũ */}
                    {post.comments && post.comments.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                        {post.comments.map(cmt => (
                          <div key={cmt.commentId} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                              <span style={{ fontWeight: 800, color: '#0f172a' }}>{cmt.userName}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                                  {new Date(cmt.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                                <button
                                  title="Báo cáo bình luận này"
                                  onClick={() => {
                                    if (onReportContent) {
                                      onReportContent({
                                        type: 'comment',
                                        targetId: cmt.commentId,
                                        placeId: post.placeTag?.placeId || 'community',
                                        authorName: cmt.userName,
                                        snippet: cmt.content
                                      });
                                    } else {
                                      alert('Báo cáo bình luận đã được gửi đến ban quản trị.');
                                    }
                                  }}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2 }}
                                >
                                  <Flag size={12} />
                                </button>
                              </div>
                            </div>
                            <div style={{ color: '#334155', lineHeight: 1.4 }}>{cmt.content}</div>

                            {/* Ảnh đính kèm trong bình luận */}
                            {cmt.image && (
                              <div style={{ marginTop: 6, width: 120, height: 90, borderRadius: 6, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                <img src={cmt.image.url} alt="comment attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Khung nhập bình luận mới */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Viết bình luận thảo luận..."
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleAddComment(post.id); }}
                        className="aj-text-input"
                        style={{ flex: 1, fontSize: 13, borderRadius: 20, padding: '7px 14px' }}
                      />

                      {/* Đính kèm ảnh cho bình luận */}
                      <label style={{ cursor: 'pointer', padding: 6, color: '#64748b' }} title="Đính kèm ảnh vào bình luận">
                        <ImageIcon size={18} />
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = ev => setCommentImagePreview(ev.target.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="aj-button-pill-dark"
                        style={{ padding: '7px 16px', fontSize: 12 }}
                      >
                        Gửi
                      </button>
                    </div>

                    {commentImagePreview && (
                      <div style={{ position: 'relative', width: 60, height: 60, marginTop: 8, borderRadius: 6, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                        <img src={commentImagePreview} alt="attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => setCommentImagePreview(null)}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
