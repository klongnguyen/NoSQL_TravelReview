import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Heart, Share2, Copy, Check, MapPin, Clock, Phone, 
  ExternalLink, Star, Sparkles, Calendar, Info, ShieldCheck, Ticket, 
  PlusCircle, CheckCircle2, MessageSquare, ThumbsUp, ThumbsDown, 
  Flag, Image as ImageIcon, Trash2, Send, Lock, UserCheck, 
  ChevronRight, ChevronLeft, Trophy, Compass, Eye, Navigation, Award,
  SlidersHorizontal, CheckCircle
} from 'lucide-react';
import { getPlaceTimingDetails } from '../utils/placeTimingHelper';

export default function PlaceDetailView({
  activePlace,
  places = [],
  currentUser,
  favoritePlaceIds = [],
  onBack,
  onAddToTrip,
  onToggleFavorite,
  onSelectPlace,
  onOpenAuthModal,
  onQuickLogin,
  onOpenReportModal,
  onLightboxImage,
  reviewImages = [],
  onReviewImagesUpload,
  onRemoveReviewImage,
  onCreateReview,
  onLikeReview,
  onDislikeReview,
  onDeleteReview,
  onAddComment,
  onAddReply,
  formatPlaceAddress,
  reviewRating = 5,
  setReviewRating,
  reviewContent = '',
  setReviewContent,
  reviewComment = '',
  setReviewComment,
  isSubmittingReview = false,
  commentContent = '',
  setCommentContent,
  activeCommentReviewId = null,
  setActiveCommentReviewId,
  replyContent = '',
  setReplyContent,
  activeReplyCommentId = null,
  setActiveReplyCommentId,
  commentInputs = {},
  setCommentInputs,
  activeCommentInputId = null,
  setActiveCommentInputId,
  activeReplyInputId = null,
  setActiveReplyInputId,
  replyInputs = {},
  setReplyInputs,
  commentImagePreview = null,
  setCommentImagePreview,
  replyImagePreview = null,
  setReplyImagePreview,
  handleCommentImageUpload,
  handleReplyImageUpload,
  handleRemoveReplyImage
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'tickets' | 'timing' | 'location' | 'reviews' | 'nearby'
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedStarFilter, setSelectedStarFilter] = useState(0); // 0 = all
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const effectiveReviewText = reviewContent || reviewComment || '';
  const handleReviewTextChange = (val) => {
    if (setReviewContent) setReviewContent(val);
    if (setReviewComment) setReviewComment(val);
  };

  const reviewsRef = useRef(null);
  const timingRef = useRef(null);
  const ticketsRef = useRef(null);
  const overviewRef = useRef(null);
  const locationRef = useRef(null);
  const nearbyRef = useRef(null);

  if (!activePlace) return null;

  const isFavorite = favoritePlaceIds.includes(activePlace.id || activePlace._id);
  const timing = getPlaceTimingDetails(activePlace);
  const fullAddress = formatPlaceAddress ? formatPlaceAddress(activePlace) : (activePlace.address?.street || '');

  // Ảnh địa điểm đầy đủ (sử dụng ảnh có sẵn hoặc các góc chụp tham khảo)
  const placeImages = useMemo(() => {
    if (activePlace.images && activePlace.images.length > 0) {
      return activePlace.images.map(img => typeof img === 'string' ? img : img.url);
    }
    return [
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80'
    ];
  }, [activePlace]);

  // Đảm bảo có ít nhất 3 ảnh để tạo banner kiểu Trip.com
  const heroDisplayImages = useMemo(() => {
    const defaultGallery = [
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&auto=format&fit=crop&q=80'
    ];
    if (placeImages.length >= 3) return placeImages;
    return [...placeImages, ...defaultGallery.slice(placeImages.length, 3)];
  }, [placeImages]);

  // Tính toán xếp hạng Khám phá trên toàn địa bàn Tỉnh / Thành phố
  // Tiêu chí:
  // 1. Điểm đánh giá (cao nhất)
  // 2. Chỉ số phụ 1: Thảo luận nhiều nhất (số reviews + số bình luận)
  // 3. Chỉ số phụ 2: Lượt click/xem nhiều nhất (visitCount)
  const provinceRanking = useMemo(() => {
    const rawProvince = (activePlace.address?.city || '').toLowerCase().trim();
    if (!rawProvince) {
      return { rank: 1, provinceDisplay: 'Việt Nam', isTop1: true };
    }

    // Lọc tất cả địa điểm thuộc cùng tỉnh / thành phố này
    const provincePlaces = places.filter(p => {
      const pCity = (p.address?.city || '').toLowerCase().trim();
      const pDistrict = (p.address?.district || '').toLowerCase().trim();
      return pCity.includes(rawProvince) || rawProvince.includes(pCity) || pDistrict.includes(rawProvince);
    });

    const candidateList = provincePlaces.length > 0 ? provincePlaces : [activePlace];

    const getPlaceScore = (p) => {
      const rating = Number(p.ratingAverage || p.googleRating || 4.5);
      const reviewsCount = Number((p.reviews && p.reviews.length) || p.reviewCount || p.googleReviewCount || 0);
      const commentsCount = (p.reviews || []).reduce((acc, r) => acc + (r.comments?.length || 0), 0);
      const discussionScore = reviewsCount + commentsCount;
      const visitScore = Number(p.visitCount || 0);
      return { rating, discussionScore, visitScore };
    };

    // Sắp xếp thứ hạng trong tỉnh
    const sorted = [...candidateList].sort((a, b) => {
      const scoreA = getPlaceScore(a);
      const scoreB = getPlaceScore(b);
      if (scoreB.rating !== scoreA.rating) {
        return scoreB.rating - scoreA.rating;
      }
      if (scoreB.discussionScore !== scoreA.discussionScore) {
        return scoreB.discussionScore - scoreA.discussionScore;
      }
      return scoreB.visitScore - scoreA.visitScore;
    });

    const activeId = activePlace.id || activePlace._id || activePlace.slug;
    const rankIndex = sorted.findIndex(p => (p.id || p._id || p.slug) === activeId);
    const rank = rankIndex >= 0 ? rankIndex + 1 : 1;

    let provinceDisplay = activePlace.address?.city || 'Địa phương';
    provinceDisplay = provinceDisplay.replace(/^(Tỉnh|Thành phố|TP\.)\s+/i, '').trim();

    return {
      rank,
      provinceDisplay,
      isTop1: rank === 1,
      isTop3: rank <= 3,
      totalInProvince: sorted.length
    };
  }, [places, activePlace]);

  // Tên tỉnh hiển thị chuẩn xác cho Breadcrumb (Không chia nhỏ xã huyện)
  const provinceName = useMemo(() => {
    return activePlace.address?.city || 'Việt Nam';
  }, [activePlace]);

  // Địa điểm tương tự / lân cận cùng Tỉnh / Thành phố
  const nearbyPlaces = useMemo(() => {
    const currentId = activePlace.id || activePlace._id;
    return places.filter(p => (p.id || p._id) !== currentId && (
      p.address?.city === activePlace.address?.city ||
      p.categoryName === activePlace.categoryName
    )).slice(0, 4);
  }, [places, activePlace]);

  // Bộ lọc reviews
  const filteredReviews = useMemo(() => {
    const revs = activePlace.reviews || [];
    if (!selectedStarFilter) return revs;
    return revs.filter(r => r.rating === selectedStarFilter);
  }, [activePlace.reviews, selectedStarFilter]);

  // Phân trang đánh giá (10 bài đánh giá / trang)
  const [reviewPage, setReviewPage] = useState(1);
  const REVIEWS_PER_PAGE = 10;

  useEffect(() => {
    setReviewPage(1);
  }, [selectedStarFilter, activePlace?.id, activePlace?._id, activePlace?.slug]);

  const totalReviewPages = Math.max(1, Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE));
  const paginatedReviews = useMemo(() => {
    const start = (reviewPage - 1) * REVIEWS_PER_PAGE;
    return filteredReviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [filteredReviews, reviewPage]);

  // Thống kê số sao
  const ratingDistribution = useMemo(() => {
    const revs = activePlace.reviews || [];
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    revs.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [activePlace.reviews]);

  const handleCopyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleCopyPageLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const scrollToSection = (ref, tabId) => {
    setActiveTab(tabId);
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Giá tham khảo định dạng
  const displayPrice = activePlace.ticketPrice || (activePlace.ticketType === 'free' ? 'Miễn phí vào cổng' : 'Liên hệ đặt trước');

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: 60 }}>
      
      {/* ─────────────────────────────────────────────────────────────
          1. BREADCRUMB & SOCIAL SHARE BAR (Trip.com Pattern)
          ───────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 56, zIndex: 90 }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          
          {/* Breadcrumbs: Cấp Tỉnh/Thành phố (Không chia nhỏ cấp xã/huyện) */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', color: '#64748b', flexWrap: 'wrap' }}>
            <button 
              onClick={onBack}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0f172a', fontWeight: 700, padding: '4px 8px', borderRadius: 6, background: '#f1f5f9', border: 'none', cursor: 'pointer' }}
            >
              <ArrowLeft size={14} />
              <span>Quay lại</span>
            </button>
            <span>/</span>
            <span style={{ cursor: 'pointer', color: '#334155' }} onClick={onBack}>Khám phá</span>
            <span>&gt;</span>
            <span style={{ color: '#334155', fontWeight: 600 }}>{provinceName}</span>
            <span>&gt;</span>
            <span style={{ color: '#0f172a', fontWeight: 700, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activePlace.name}
            </span>
          </nav>

          {/* Social share & Favorites right strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Chia sẻ đến:</span>
            
            {/* Facebook Share */}
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank" 
              rel="noopener noreferrer"
              style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#1877f2', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Chia sẻ lên Facebook"
            >
              <span style={{ fontWeight: 900, fontSize: '14px' }}>f</span>
            </a>

            {/* X / Twitter Share */}
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(activePlace.name)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank" 
              rel="noopener noreferrer"
              style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Chia sẻ lên X (Twitter)"
            >
              <span style={{ fontWeight: 900, fontSize: '13px' }}>𝕏</span>
            </a>

            {/* Copy Link Button */}
            <button 
              onClick={handleCopyPageLink}
              style={{ 
                height: 32, 
                padding: '0 12px', 
                borderRadius: 16, 
                backgroundColor: copiedLink ? '#ecfdf5' : '#f1f5f9', 
                color: copiedLink ? '#059669' : '#334155', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6,
                fontSize: '12.5px',
                fontWeight: 600,
                border: '1px solid',
                borderColor: copiedLink ? '#a7f3d0' : '#e2e8f0'
              }}
              title="Sao chép liên kết địa điểm"
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? 'Đã chép link' : 'Chép link'}</span>
            </button>

            {/* Favorite Button */}
            <button 
              onClick={(e) => onToggleFavorite && onToggleFavorite(activePlace.id || activePlace._id, e)}
              style={{ 
                height: 32, 
                padding: '0 12px', 
                borderRadius: 16, 
                backgroundColor: isFavorite ? '#fee2e2' : '#ffffff', 
                color: isFavorite ? '#dc2626' : '#334155', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6,
                fontSize: '12.5px',
                fontWeight: 700,
                border: '1px solid',
                borderColor: isFavorite ? '#fecaca' : '#cbd5e1'
              }}
            >
              <Heart size={15} fill={isFavorite ? '#dc2626' : 'none'} />
              <span>{isFavorite ? 'Đã lưu' : 'Lưu yêu thích'}</span>
            </button>
          </div>

        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: '20px auto 0 auto', padding: '0 20px' }}>
        
        {/* ─────────────────────────────────────────────────────────────
            2. TRIP.COM HERO PANORAMIC PHOTO SHOWCASE
            ───────────────────────────────────────────────────────────── */}
        <div style={{
          position: 'relative',
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
          marginBottom: 24
        }}>
          {/* Panoramic 3-Photo Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2.4fr 1fr',
            gap: 4,
            height: 420,
            backgroundColor: '#000000'
          }}>
            {/* Left Photo */}
            <div 
              style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
              onClick={() => onLightboxImage && onLightboxImage(heroDisplayImages[0])}
            >
              <img 
                src={heroDisplayImages[0]} 
                alt={`${activePlace.name} - góc nhìn 1`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>

            {/* Center Main Hero Photo */}
            <div 
              style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
              onClick={() => onLightboxImage && onLightboxImage(heroDisplayImages[1] || heroDisplayImages[0])}
            >
              <img 
                src={heroDisplayImages[1] || heroDisplayImages[0]} 
                alt={`${activePlace.name} - toàn cảnh chính`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <Sparkles size={13} color="#f59e0b" />
                <span>Toàn cảnh tiêu biểu đã xác minh</span>
              </div>
            </div>

            {/* Right Photo */}
            <div 
              style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
              onClick={() => onLightboxImage && onLightboxImage(heroDisplayImages[2] || heroDisplayImages[0])}
            >
              <img 
                src={heroDisplayImages[2] || heroDisplayImages[0]} 
                alt={`${activePlace.name} - góc nhìn 3`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
          </div>

          {/* Bottom Overlay Info & "Xem tất cả ảnh" Pill */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <button
              onClick={() => onLightboxImage && onLightboxImage(placeImages[0])}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '8px 18px',
                borderRadius: 24,
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                cursor: 'pointer'
              }}
            >
              <ImageIcon size={15} />
              <span>Xem tất cả {placeImages.length} ảnh &gt;</span>
            </button>
          </div>

          {/* Carousel indicators */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 6
          }}>
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                style={{
                  width: idx === currentHeroIndex ? 22 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: idx === currentHeroIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. TRIP.COM TWO-COLUMN MASTER LAYOUT
            ───────────────────────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: 24,
          alignItems: 'start'
        }}>
          
          {/* =========================================================
              LEFT COLUMN: PLACE PROFILE, SPECIFICATIONS & REVIEWS
              ========================================================= */}
          <div>
            
            {/* Place Title & Rating Badges Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: '24px 28px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              marginBottom: 20
            }}>
              
              {/* Title & Heart Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                      {activePlace.name}
                    </h1>
                    {activePlace.catSlug && (
                      <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: 12, fontWeight: 700 }}>
                        {activePlace.categoryName || 'Địa điểm nổi bật'}
                      </span>
                    )}
                  </div>
                  {activePlace.englishName && (
                    <div style={{ fontSize: '15px', color: '#64748b', marginTop: 4, fontWeight: 500 }}>
                      {activePlace.englishName}
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => onToggleFavorite && onToggleFavorite(activePlace.id || activePlace._id, e)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: isFavorite ? '#fee2e2' : '#f8fafc',
                    border: '1px solid',
                    borderColor: isFavorite ? '#fecaca' : '#e2e8f0',
                    color: isFavorite ? '#dc2626' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                  title="Lưu vào danh sách yêu thích"
                >
                  <Heart size={20} fill={isFavorite ? '#dc2626' : 'none'} />
                </button>
              </div>

              {/* Trip.com Ranking & Score Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginTop: 14,
                paddingBottom: 16,
                borderBottom: '1px solid #f1f5f9',
                flexWrap: 'wrap'
              }}>
                {/* Ranking Trophy: CHỈ hiển thị cho TOP 3 trên địa bàn Tỉnh */}
                {provinceRanking.isTop3 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: provinceRanking.rank === 1 ? '#fef3c7' : provinceRanking.rank === 2 ? '#f1f5f9' : '#fff7ed',
                    color: provinceRanking.rank === 1 ? '#b45309' : provinceRanking.rank === 2 ? '#334155' : '#9a3412',
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: '12.5px',
                    fontWeight: 800,
                    border: `1px solid ${provinceRanking.rank === 1 ? '#fde68a' : provinceRanking.rank === 2 ? '#e2e8f0' : '#fed7aa'}`
                  }}>
                    <Trophy size={14} color={provinceRanking.rank === 1 ? '#d97706' : provinceRanking.rank === 2 ? '#64748b' : '#ea580c'} />
                    <span>Top {provinceRanking.rank} Khám phá tại {provinceRanking.provinceDisplay}</span>
                  </div>
                )}

                {/* Royal Blue Score Badge (Trip.com signature style) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 900,
                    padding: '3px 8px',
                    borderRadius: 6
                  }}>
                    {(activePlace.ratingAverage || activePlace.googleRating || 4.8).toFixed(1)} / 5
                  </span>
                  <button 
                    onClick={() => scrollToSection(reviewsRef, 'reviews')}
                    style={{ fontSize: '13px', color: '#2563eb', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    {activePlace.reviews?.length || activePlace.reviewCount || 42} bài đánh giá cộng đồng &gt;
                  </button>
                </div>

                {/* Verified badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#059669', fontSize: '12.5px', fontWeight: 700 }}>
                  <ShieldCheck size={16} />
                  <span>Đã đối soát thực tế</span>
                </div>
              </div>

              {/* Award tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: 4, fontWeight: 700 }}>
                  🏆 LonGo Global 100 • Trải nghiệm nổi bật 2026 &gt;
                </span>
                <span style={{ fontSize: '12px', background: '#f8fafc', color: '#475569', padding: '4px 10px', borderRadius: 4, fontWeight: 600, border: '1px solid #e2e8f0' }}>
                  {activePlace.categoryName || 'Di tích & Ẩm thực'}
                </span>
                <span style={{ fontSize: '12px', background: '#f8fafc', color: '#475569', padding: '4px 10px', borderRadius: 4, fontWeight: 600, border: '1px solid #e2e8f0' }}>
                  Điểm check-in nổi tiếng
                </span>
              </div>

              {/* Specifications Block (Trip.com Key Info Rows) */}
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* 🕒 Giờ mở cửa */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <Clock size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1, fontSize: '13.5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>
                        {activePlace.isOpenNow ? 'Đang mở cửa' : 'Mở cửa hàng ngày'}: {activePlace.openingHours || '07:30 – 22:00'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        (Thời gian nhận khách kết thúc 1 tiếng trước khi đóng cửa)
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                        {timing.idealTimeOfDay || 'Giờ cao điểm: 18:00 - 20:00'}
                      </span>
                      <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                        Nên đặt chỗ trước hoặc đến sớm
                      </span>
                    </div>
                  </div>
                </div>

                {/* ⏱️ Thời gian tham quan đề xuất */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <Calendar size={18} color="#0891b2" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ fontSize: '13.5px', color: '#334155' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Thời gian trải nghiệm đề xuất: </span>
                    <span>{timing.hasSeasonalRecommendation ? '2–4 tiếng đồng hồ' : '1–2 tiếng đồng hồ'}</span>
                  </div>
                </div>

                {/* 📍 Địa chỉ đầy đủ */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <MapPin size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1, fontSize: '13.5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>Địa chỉ: </span>
                      <span style={{ color: '#1e293b' }}>{fullAddress}</span>
                      
                      {/* Action buttons */}
                      <button
                        onClick={handleCopyAddress}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '12px',
                          color: copiedAddress ? '#059669' : '#2563eb',
                          fontWeight: 700,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {copiedAddress ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedAddress ? 'Đã chép' : 'Sao chép'}</span>
                      </button>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePlace.name + ' ' + fullAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '12px', color: '#2563eb', fontWeight: 700 }}
                      >
                        <ExternalLink size={13} />
                        <span>Xem bản đồ</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 📞 Hotline / Điện thoại */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <Phone size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ fontSize: '13.5px', color: '#334155' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Hỗ trợ du khách & Hỏi về vé: </span>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>(+84) 28 3829 7434</span>
                  </div>
                </div>

              </div>

              {/* Trip.com Mini Review Quote Highlight */}
              <div style={{
                marginTop: 20,
                padding: '14px 16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                fontSize: '13px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>
                    Đánh giá của du khách khác về {activePlace.name}
                  </span>
                  <button 
                    onClick={() => scrollToSection(reviewsRef, 'reviews')}
                    style={{ color: '#2563eb', fontWeight: 700, fontSize: '12px' }}
                  >
                    Xem thêm đánh giá &gt;
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#334155'
                  }}>
                    {activePlace.reviews?.[0]?.authorName?.[0] || 'D'}
                  </div>
                  <span style={{ fontWeight: 600, color: '#334155', fontSize: '12.5px' }}>
                    {activePlace.reviews?.[0]?.authorName || 'Thành viên LonGo'}
                  </span>
                  <span style={{ background: '#2563eb', color: '#ffffff', fontSize: '10.5px', fontWeight: 800, padding: '1px 5px', borderRadius: 4 }}>
                    5/5 Rất tốt
                  </span>
                </div>

                <p style={{ color: '#475569', fontStyle: 'italic', margin: 0, lineHeight: 1.5, fontSize: '12.5px' }}>
                  "{activePlace.googleReviewSnippet || activePlace.reviews?.[0]?.content || 'Không gian thoáng mát, trải nghiệm rất thú vị và đậm chất văn hóa địa phương. Rất đáng ghé thăm khi đến đây!'}"
                </p>
              </div>

            </div>

            {/* Sticky Anchor Tab Navigation Bar */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: '6px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              gap: 4,
              marginBottom: 20,
              overflowX: 'auto',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              {[
                { id: 'overview', label: 'Tổng quan & Giới thiệu', ref: overviewRef },
                { id: 'tickets', label: 'Bảng giá & Dịch vụ', ref: ticketsRef },
                { id: 'timing', label: 'Thời điểm lý tưởng', ref: timingRef },
                { id: 'location', label: 'Vị trí & Chỉ đường', ref: locationRef },
                { id: 'reviews', label: `Đánh giá du khách (${activePlace.reviews?.length || 0})`, ref: reviewsRef },
                { id: 'nearby', label: 'Địa điểm lân cận', ref: nearbyRef }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.ref, tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: '13px',
                    fontWeight: activeTab === tab.id ? 800 : 600,
                    backgroundColor: activeTab === tab.id ? '#0f172a' : 'transparent',
                    color: activeTab === tab.id ? '#ffffff' : '#64748b',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* =========================================================
                SECTION 1: TỔNG QUAN & GIỚI THIỆU (Overview)
                ========================================================= */}
            <section ref={overviewRef} style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: '24px 28px',
              border: '1px solid #e2e8f0',
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ width: 4, height: 18, backgroundColor: '#fa9000', borderRadius: 2 }} />
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Giới thiệu & Điểm Nổi Bật
                </h2>
              </div>

              <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.7, margin: '0 0 16px 0' }}>
                {activePlace.description}
              </p>

              {/* Highlights Chips */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 16 }}>
                <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', marginBottom: 4 }}>
                    ✦ ĐẶC ĐIỂM KIẾN TRÚC & VĂN HÓA
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569' }}>
                    Di tích mang tính biểu tượng lịch sử và phong cách kiến trúc đặc trưng khu vực.
                  </div>
                </div>

                <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#059669', marginBottom: 4 }}>
                    ✦ TRẢI NGHIỆM ĐỀ XUẤT
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569' }}>
                    Chụp ảnh kỷ niệm, tham quan hiện vật trưng bày và trải nghiệm ẩm thực xung quanh.
                  </div>
                </div>

                <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#d97706', marginBottom: 4 }}>
                    ✦ ĐỐI TƯỢNG PHÙ HỢP
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569' }}>
                    Gia đình, nhóm bạn, du khách quốc tế và các tín đồ nhiếp ảnh.
                  </div>
                </div>
              </div>
            </section>

            {/* =========================================================
                SECTION 2: BẢNG GIÁ VÉ & DỊCH VỤ (Trip.com Ticket Table)
                ========================================================= */}
            <section ref={ticketsRef} style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: '24px 28px',
              border: '1px solid #e2e8f0',
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Ticket size={20} color="#2563eb" />
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Vé Tham Quan & Bảng Giá Dịch Vụ
                  </h2>
                </div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                  Thông tin giá vé tham khảo trực tiếp
                </span>
              </div>

              {/* Ticket Cards Grid (Trip.com Product options) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                
                {/* Option 1: Vé Tiêu Chuẩn / Vé Cổng */}
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  flexWrap: 'wrap',
                  gap: 14
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                        Vé Tham Quan Tiêu Chuẩn / Phục Vụ
                      </span>
                      <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                        Phổ biến nhất
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: 4 }}>
                      Bao gồm toàn bộ khu vực công cộng, chụp ảnh tự do và hướng dẫn chỉ dẫn tại chỗ.
                    </div>
                    <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, marginTop: 4 }}>
                      ✓ Xác nhận ngay lập tức • Hỗ trợ lưu trữ lịch trình
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Mức giá từ</span>
                      <span style={{ fontSize: '18px', fontWeight: 900, color: '#2563eb' }}>
                        {activePlace.ticketPrice || 'Miễn phí'}
                      </span>
                    </div>
                    <button
                      onClick={() => onAddToTrip && onAddToTrip(activePlace)}
                      style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: 8,
                        fontSize: '13.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
                      }}
                    >
                      + Thêm vào chuyến đi
                    </button>
                  </div>
                </div>

                {/* Option 2: Gói Ưu Đãi Học Sinh / Sinh Viên */}
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  flexWrap: 'wrap',
                  gap: 14
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                        Chính Sách Ưu Đãi Trẻ Em / Học Sinh / Sinh Viên
                      </span>
                      <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                        Giảm đến 50%
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: 4 }}>
                      Áp dụng khi xuất trình thẻ học sinh, sinh viên hoặc trẻ em dưới độ tuổi quy định.
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Áp dụng tại chỗ</span>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#059669' }}>
                        Giảm 50% / Miễn phí
                      </span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePlace.name + ' ' + fullAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        border: '1px solid #cbd5e1',
                        padding: '10px 18px',
                        borderRadius: 8,
                        fontSize: '13px',
                        fontWeight: 700
                      }}
                    >
                      Xem chi tiết tại điểm
                    </a>
                  </div>
                </div>

              </div>
            </section>

            {/* =========================================================
                SECTION 3: THỜI ĐIỂM LÝ TƯỞNG (Travel Intelligence)
                ========================================================= */}
            <section ref={timingRef} style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: '24px 28px',
              border: '1px solid #e2e8f0',
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} color="#0284c7" />
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Cẩm Nang Thời Điểm Lý Tưởng & Kinh Nghiệm Khám Phá
                  </h2>
                </div>
                <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '3px 9px', borderRadius: 4, fontWeight: 800 }}>
                  Dữ liệu đối soát thực tế
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                
                {/* Mùa đẹp nhất */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="#0284c7" />
                    <span>Mùa & Tháng Đẹp Nhất</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    {timing.bestSeasonText || 'Quanh năm • Đẹp nhất từ tháng 11 đến tháng 4'}
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                      const isGood = timing.bestMonths ? timing.bestMonths.includes(m) : [11, 12, 1, 2, 3, 4].includes(m);
                      return (
                        <span
                          key={m}
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 4,
                            backgroundColor: isGood ? '#0284c7' : '#ffffff',
                            color: isGood ? '#ffffff' : '#94a3b8',
                            border: isGood ? 'none' : '1px solid #e2e8f0'
                          }}
                        >
                          T{m}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Khung giờ lý tưởng */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={14} color="#0284c7" />
                    <span>Khung Giờ Vàng Trong Ngày</span>
                  </div>
                  <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a', lineHeight: 1.4 }}>
                    {timing.idealTimeOfDay || '08:00 - 10:30 sáng hoặc sau 15:30 chiều'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: 6 }}>
                    Thời tiết dịu mát, ánh sáng lý tưởng để tham quan và chụp ảnh lưu niệm.
                  </div>
                </div>

                {/* Lưu ý trải nghiệm */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 10, border: '1px solid #e2e8f0', gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Info size={14} color="#d97706" />
                    <span>Lưu Ý Thực Tế Cho Du Khách</span>
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6 }}>
                    {timing.practicalTip || 'Trang phục lịch sự khi ghé thăm các khu vực trang nghiêm. Nên chuẩn bị nón, nước uống cá nhân và mang giày đế mềm thoải mái khi đi bộ.'}
                  </div>
                </div>

              </div>
            </section>

            {/* =========================================================
                SECTION 4: VỊ TRÍ & CHỈ ĐƯỜNG (Location & Map)
                ========================================================= */}
            <section ref={locationRef} style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: '24px 28px',
              border: '1px solid #e2e8f0',
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={20} color="#dc2626" />
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Vị Trí Địa Lý & Hướng Dẫn Chỉ Đường
                  </h2>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePlace.name + ' ' + fullAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Navigation size={14} />
                  <span>Dẫn đường Google Maps</span>
                </a>
              </div>

              {/* Address detail banner */}
              <div style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    ĐỊA CHỈ XÁC THỰC
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                    {fullAddress}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: 2 }}>
                    Tọa độ GPS: {activePlace.location?.coordinates?.[1] || 10.7769}°N, {activePlace.location?.coordinates?.[0] || 106.7009}°E
                  </div>
                </div>

                <button
                  onClick={handleCopyAddress}
                  style={{
                    backgroundColor: copiedAddress ? '#ecfdf5' : '#ffffff',
                    color: copiedAddress ? '#059669' : '#0f172a',
                    border: '1px solid #cbd5e1',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  {copiedAddress ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedAddress ? 'Đã sao chép' : 'Sao chép địa chỉ'}</span>
                </button>
              </div>
            </section>

            {/* =========================================================
                SECTION 5: CỘNG ĐỒNG ĐÁNH GIÁ & NHẬN XÉT (Reviews System)
                ========================================================= */}
            <section ref={reviewsRef} style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: '24px 28px',
              border: '1px solid #e2e8f0',
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MessageSquare size={22} color="#0f172a" />
                    <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      Đánh Giá Trải Nghiệm Thực Tế
                    </h2>
                  </div>
                  <p style={{ fontSize: '13.5px', color: '#64748b', margin: '4px 0 0 0' }}>
                    100% đánh giá thực tế từ thành viên và du khách đã trải nghiệm
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '14px', background: '#eff6ff', color: '#1e40af', padding: '6px 14px', borderRadius: 20, fontWeight: 800 }}>
                    ⭐ {(activePlace.ratingAverage || 4.8).toFixed(1)} / 5.0 ({activePlace.reviews?.length || 0} bài viết)
                  </span>
                </div>
              </div>

              {/* Star Rating Breakdown Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                gap: 24,
                padding: '20px',
                background: '#f8fafc',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                alignItems: 'center',
                marginBottom: 24
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '42px', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                    {(activePlace.ratingAverage || 4.8).toFixed(1)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', color: '#f59e0b', margin: '6px 0' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {activePlace.reviews?.length || 0} lượt đánh giá
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = ratingDistribution[star] || 0;
                    const total = activePlace.reviews?.length || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div 
                        key={star}
                        onClick={() => setSelectedStarFilter(selectedStarFilter === star ? 0 : star)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '12.5px' }}
                      >
                        <span style={{ width: 45, fontWeight: selectedStarFilter === star ? 800 : 600, color: selectedStarFilter === star ? '#2563eb' : '#334155' }}>
                          {star} sao
                        </span>
                        <div style={{ flex: 1, height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: star >= 4 ? '#2563eb' : star === 3 ? '#f59e0b' : '#ef4444', borderRadius: 4 }} />
                        </div>
                        <span style={{ width: 35, textAlign: 'right', color: '#64748b', fontSize: '12px' }}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Star Filter Pills */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedStarFilter(0)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: '12.5px',
                    fontWeight: 700,
                    backgroundColor: selectedStarFilter === 0 ? '#0f172a' : '#f1f5f9',
                    color: selectedStarFilter === 0 ? '#ffffff' : '#334155',
                    border: 'none'
                  }}
                >
                  Tất cả ({activePlace.reviews?.length || 0})
                </button>
                {[5, 4, 3, 2, 1].map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStarFilter(selectedStarFilter === s ? 0 : s)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: '12.5px',
                      fontWeight: 700,
                      backgroundColor: selectedStarFilter === s ? '#2563eb' : '#f1f5f9',
                      color: selectedStarFilter === s ? '#ffffff' : '#334155',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span>{s} sao</span>
                    <span>({ratingDistribution[s] || 0})</span>
                  </button>
                ))}
              </div>

              {/* Review Submission Form: Guest Notice vs Member Form */}
              {!currentUser ? (
                <div style={{
                  padding: '20px',
                  background: '#f8fafc',
                  borderRadius: 12,
                  marginBottom: 28,
                  border: '1.5px dashed #cbd5e1',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}>
                    <Lock size={18} color="#0f172a" />
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 4px 0', color: '#0f172a' }}>
                    Quyền đăng đánh giá dành cho Thành viên LonGo
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748b', maxWidth: 500, margin: '0 auto 14px auto', lineHeight: 1.5 }}>
                    Đăng nhập để đóng góp nhận xét chân thực, chấm điểm số sao và chia sẻ hình ảnh trải nghiệm với cộng đồng.
                  </p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      onClick={() => onQuickLogin && onQuickLogin('member')} 
                      style={{
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        padding: '8px 18px',
                        borderRadius: 20,
                        fontSize: '13px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <UserCheck size={14} />
                      <span>Đăng nhập nhanh Thành viên</span>
                    </button>
                    <button 
                      type="button"
                      onClick={onOpenAuthModal}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        border: '1px solid #cbd5e1',
                        padding: '8px 18px',
                        borderRadius: 20,
                        fontSize: '13px',
                        fontWeight: 700
                      }}
                    >
                      <span>Đăng nhập bằng Email</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form 
                  onSubmit={onCreateReview}
                  style={{
                    padding: 20,
                    background: '#f8fafc',
                    borderRadius: 12,
                    marginBottom: 28,
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                      Chia sẻ trải nghiệm thực tế của bạn về {activePlace.name}
                    </div>
                    <span style={{ fontSize: '11.5px', background: '#0f172a', color: '#ffffff', padding: '3px 10px', borderRadius: 12, fontWeight: 700 }}>
                      {currentUser.fullName} ({currentUser.role || 'Thành viên'})
                    </span>
                  </div>

                  {/* Star rating selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Đánh giá của bạn:</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating && setReviewRating(star)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 2,
                            color: star <= reviewRating ? '#f59e0b' : '#cbd5e1'
                          }}
                        >
                          <Star size={24} fill={star <= reviewRating ? '#f59e0b' : 'none'} />
                        </button>
                      ))}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>
                      {reviewRating === 5 ? '5/5 Tuyệt vời' : reviewRating === 4 ? '4/5 Rất tốt' : reviewRating === 3 ? '3/5 Hài lòng' : reviewRating === 2 ? '2/5 Tạm được' : '1/5 Kém'}
                    </span>
                  </div>

                  {/* Comment text input */}
                  <textarea
                    rows={3}
                    placeholder="Viết cảm nhận thực tế của bạn (Không gian, dịch vụ, giá cả, lời khuyên cho du khách sau)..."
                    value={effectiveReviewText}
                    onChange={e => handleReviewTextChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      marginBottom: 12,
                      backgroundColor: '#ffffff'
                    }}
                    required
                  />

                  {/* Image previews */}
                  {reviewImages && reviewImages.length > 0 && (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                      {reviewImages.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: 72, height: 72, borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                          <img src={img.url} alt="Review upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => onRemoveReviewImage && onRemoveReviewImage(idx)}
                            style={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              background: 'rgba(0, 0, 0, 0.7)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '50%',
                              width: 18,
                              height: 18,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: '11px'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 14px',
                      borderRadius: 6,
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      <ImageIcon size={16} color="#2563eb" />
                      <span>Đính kèm hình ảnh trải nghiệm ({reviewImages.length}/5)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={onReviewImagesUpload}
                        style={{ display: 'none' }}
                        disabled={reviewImages.length >= 5}
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmittingReview || (!effectiveReviewText.trim() && reviewImages.length === 0)}
                      style={{
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px 24px',
                        borderRadius: 20,
                        fontSize: '13.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        opacity: (isSubmittingReview || (!effectiveReviewText.trim() && reviewImages.length === 0)) ? 0.6 : 1
                      }}
                    >
                      {isSubmittingReview ? 'Đang gửi...' : 'Gửi bài đánh giá'}
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filteredReviews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b', fontSize: '14px' }}>
                    Chưa có bài đánh giá nào phù hợp với bộ lọc. Hãy là người đầu tiên chia sẻ cảm nhận của bạn!
                  </div>
                ) : (
                  paginatedReviews.map(rev => (
                    <div 
                      key={rev.reviewId}
                      style={{
                        padding: '18px 20px',
                        borderRadius: 12,
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
                      }}
                    >
                      {/* Review Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img 
                            src={rev.authorAvatar || 'https://images.unsplash.com/photo-1535713875002?w=150'} 
                            alt={rev.authorName}
                            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>
                              {rev.authorName}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                              <div style={{ display: 'flex', color: '#f59e0b' }}>
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={13} fill={i < rev.rating ? '#f59e0b' : 'none'} color={i < rev.rating ? '#f59e0b' : '#cbd5e1'} />
                                ))}
                              </div>
                              <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                                {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Report & Delete Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button
                            onClick={() => onOpenReportModal && onOpenReportModal({
                              type: 'review',
                              targetId: rev.reviewId,
                              placeId: activePlace.slug || activePlace.id || activePlace._id,
                              authorName: rev.authorName,
                              snippet: rev.content
                            })}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 4,
                              background: 'none',
                              border: 'none',
                              color: '#94a3b8',
                              fontSize: '11.5px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              cursor: 'pointer'
                            }}
                            title="Báo cáo vi phạm"
                          >
                            <Flag size={13} />
                            <span>Báo cáo</span>
                          </button>

                          {currentUser && (currentUser.userId === rev.userId || currentUser.role === 'Admin') && (
                            <button
                              onClick={() => onDeleteReview && onDeleteReview(activePlace.slug || activePlace.id || activePlace._id, rev.reviewId)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: 4,
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                fontSize: '11.5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                cursor: 'pointer'
                              }}
                              title="Xóa đánh giá này"
                            >
                              <Trash2 size={13} />
                              <span>Xóa</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, margin: '0 0 10px 0' }}>
                        {rev.content}
                      </p>

                      {/* Attached Review Images */}
                      {rev.images && rev.images.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                          {rev.images.map((img, i) => (
                            <img
                              key={i}
                              src={img.url}
                              alt="Ảnh đính kèm đánh giá"
                              onClick={() => onLightboxImage && onLightboxImage(img.url)}
                              style={{
                                width: 84,
                                height: 84,
                                borderRadius: 8,
                                objectFit: 'cover',
                                cursor: 'zoom-in',
                                border: '1px solid #e2e8f0',
                                transition: 'transform 0.15s ease'
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            />
                          ))}
                        </div>
                      )}

                      {/* Action Bar: Like & Comment */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                        <button
                          onClick={() => onLikeReview && onLikeReview(activePlace.slug || activePlace.id || activePlace._id, rev.reviewId)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: '12.5px',
                            color: (rev.likes || []).includes(currentUser?.userId) ? '#2563eb' : '#64748b',
                            fontWeight: 600,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <ThumbsUp size={14} />
                          <span>Hữu ích ({rev.likes?.length || 0})</span>
                        </button>

                        <button
                          onClick={() => setActiveCommentInputId(activeCommentInputId === rev.reviewId ? null : rev.reviewId)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: '12.5px',
                            color: '#64748b',
                            fontWeight: 600,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <MessageSquare size={14} />
                          <span>Bình luận ({rev.comments?.length || 0})</span>
                        </button>
                      </div>

                      {/* Comment Input Box */}
                      {activeCommentInputId === rev.reviewId && (
                        <div style={{ marginTop: 12, padding: 12, backgroundColor: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                          <textarea
                            rows={2}
                            placeholder="Nhập bình luận của bạn..."
                            value={commentInputs[rev.reviewId] || ''}
                            onChange={e => setCommentInputs({ ...commentInputs, [rev.reviewId]: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: 6,
                              border: '1px solid #cbd5e1',
                              fontSize: '13px',
                              fontFamily: 'inherit',
                              resize: 'none',
                              marginBottom: 8,
                              backgroundColor: '#ffffff'
                            }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <button
                              type="button"
                              onClick={() => setActiveCommentInputId(null)}
                              style={{ padding: '6px 14px', borderRadius: 6, fontSize: '12px', background: '#ffffff', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onAddComment && onAddComment(rev.reviewId);
                              }}
                              style={{ padding: '6px 16px', borderRadius: 6, fontSize: '12px', background: '#0f172a', color: '#ffffff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Gửi bình luận
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Comments & Replies list */}
                      {rev.comments && rev.comments.length > 0 && (
                        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 16, borderLeft: '2px solid #e2e8f0' }}>
                          {rev.comments.map(cmt => (
                            <div key={cmt.commentId} style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: 8 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                                  {cmt.userName || 'Thành viên'}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                                    {new Date(cmt.createdAt).toLocaleDateString('vi-VN')}
                                  </span>
                                  <button
                                    onClick={() => onOpenReportModal && onOpenReportModal({
                                      type: 'comment',
                                      targetId: cmt.commentId,
                                      placeId: activePlace.slug || activePlace.id || activePlace._id,
                                      authorName: cmt.userName,
                                      snippet: cmt.content
                                    })}
                                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2 }}
                                    title="Báo cáo bình luận này"
                                  >
                                    <Flag size={12} />
                                  </button>
                                </div>
                              </div>
                              <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                                {cmt.content}
                              </p>

                              {/* Comment Image */}
                              {cmt.image && cmt.image.url && (
                                <img
                                  src={cmt.image.url}
                                  alt="Ảnh bình luận"
                                  onClick={() => onLightboxImage && onLightboxImage(cmt.image.url)}
                                  style={{ width: 64, height: 64, borderRadius: 6, objectFit: 'cover', cursor: 'zoom-in', marginBottom: 6 }}
                                />
                              )}

                              {/* Reply button */}
                              <button
                                onClick={() => setActiveReplyInputId(activeReplyInputId === cmt.commentId ? null : cmt.commentId)}
                                style={{ fontSize: '11.5px', color: '#2563eb', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              >
                                Phản hồi ({cmt.replies?.length || 0})
                              </button>

                              {/* Reply Input Box */}
                              {activeReplyInputId === cmt.commentId && (
                                <div style={{ marginTop: 8, padding: 8, backgroundColor: '#ffffff', borderRadius: 6, border: '1px solid #cbd5e1' }}>
                                  <input
                                    type="text"
                                    placeholder="Viết phản hồi..."
                                    value={replyInputs[cmt.commentId] || ''}
                                    onChange={e => setReplyInputs({ ...replyInputs, [cmt.commentId]: e.target.value })}
                                    style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: '12px', marginBottom: 6 }}
                                  />
                                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                                    <button
                                      type="button"
                                      onClick={() => setActiveReplyInputId(null)}
                                      style={{ padding: '4px 10px', fontSize: '11px', borderRadius: 4, background: '#f1f5f9', border: 'none', cursor: 'pointer' }}
                                    >
                                      Hủy
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => onAddReply && onAddReply(rev.reviewId, cmt.commentId)}
                                      style={{ padding: '4px 12px', fontSize: '11px', borderRadius: 4, background: '#0f172a', color: '#ffffff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                      Gửi
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Replies sub-list */}
                              {cmt.replies && cmt.replies.length > 0 && (
                                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 12, borderLeft: '1.5px solid #cbd5e1' }}>
                                  {cmt.replies.map(rep => (
                                    <div key={rep.replyId} style={{ fontSize: '12px', backgroundColor: '#ffffff', padding: '6px 10px', borderRadius: 6 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{rep.userName || 'Thành viên'}</span>
                                        <button
                                          onClick={() => onOpenReportModal && onOpenReportModal({
                                            type: 'reply',
                                            targetId: rep.replyId,
                                            placeId: activePlace.slug || activePlace.id || activePlace._id,
                                            authorName: rep.userName,
                                            snippet: rep.content
                                          })}
                                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2 }}
                                        >
                                          <Flag size={11} />
                                        </button>
                                      </div>
                                      <div style={{ color: '#334155', marginTop: 2 }}>{rep.content}</div>
                                      {rep.image && rep.image.url && (
                                        <img
                                          src={rep.image.url}
                                          alt="Ảnh phản hồi"
                                          onClick={() => onLightboxImage && onLightboxImage(rep.image.url)}
                                          style={{ width: 50, height: 50, borderRadius: 4, objectFit: 'cover', cursor: 'zoom-in', marginTop: 4 }}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Phân trang đánh giá (10 bài đánh giá / trang) */}
              {filteredReviews.length > REVIEWS_PER_PAGE && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: '1px solid #e2e8f0',
                  flexWrap: 'wrap',
                  gap: 12
                }}>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    Hiển thị <strong>{(reviewPage - 1) * REVIEWS_PER_PAGE + 1}</strong> - <strong>{Math.min(reviewPage * REVIEWS_PER_PAGE, filteredReviews.length)}</strong> trên tổng số <strong>{filteredReviews.length}</strong> bài đánh giá
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setReviewPage(p => Math.max(1, p - 1));
                        if (reviewsRef.current) reviewsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      disabled={reviewPage === 1}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        background: reviewPage === 1 ? '#f8fafc' : '#ffffff',
                        color: reviewPage === 1 ? '#94a3b8' : '#0f172a',
                        cursor: reviewPage === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '12.5px',
                        fontWeight: 700
                      }}
                    >
                      ‹ Trước
                    </button>

                    {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setReviewPage(pageNum);
                          if (reviewsRef.current) reviewsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          border: reviewPage === pageNum ? '1px solid #0f172a' : '1px solid #e2e8f0',
                          background: reviewPage === pageNum ? '#0f172a' : '#ffffff',
                          color: reviewPage === pageNum ? '#ffffff' : '#0f172a',
                          cursor: 'pointer',
                          fontSize: '12.5px',
                          fontWeight: 800
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setReviewPage(p => Math.min(totalReviewPages, p + 1));
                        if (reviewsRef.current) reviewsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      disabled={reviewPage === totalReviewPages}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        background: reviewPage === totalReviewPages ? '#f8fafc' : '#ffffff',
                        color: reviewPage === totalReviewPages ? '#94a3b8' : '#0f172a',
                        cursor: reviewPage === totalReviewPages ? 'not-allowed' : 'pointer',
                        fontSize: '12.5px',
                        fontWeight: 700
                      }}
                    >
                      Sau ›
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* =========================================================
                SECTION 6: ĐỊA ĐIỂM TƯƠNG TỰ / LÂN CẬN (Nearby Places)
                ========================================================= */}
            <section ref={nearbyRef} style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: '24px 28px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Compass size={20} color="#0f172a" />
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Địa Điểm Tương Tự & Lân Cận Tại {activePlace.address?.district || 'Khu Vực'}
                  </h2>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {nearbyPlaces.map(np => (
                  <div
                    key={np.id || np._id}
                    onClick={() => onSelectPlace && onSelectPlace(np)}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
                    }}
                  >
                    <div style={{ height: 130, overflow: 'hidden' }}>
                      <img
                        src={np.images?.[0]?.url || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600'}
                        alt={np.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase' }}>
                        {np.categoryName || 'Địa điểm'}
                      </div>
                      <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {np.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, fontSize: '12px', color: '#64748b' }}>
                        <span>⭐ {(np.ratingAverage || 4.7).toFixed(1)}</span>
                        <span>{np.ticketPrice ? np.ticketPrice.split('/')[0] : 'Miễn phí'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* =========================================================
              RIGHT COLUMN: STICKY BOOKING & PLANNING ACTION CARD
              (Trip.com Signature Right Sidebar Action Card)
              ========================================================= */}
          <div style={{ position: 'sticky', top: 120, display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Main Action Box */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)'
            }}>
              {/* Price header */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
                  Mức giá trải nghiệm / vé tham quan:
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Từ</span>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: '#2563eb', letterSpacing: '-0.02em' }}>
                    {displayPrice}
                  </span>
                </div>
              </div>

              {/* Primary Action Button (Trip.com "Đặt ngay" equivalent) */}
              <button
                onClick={() => onAddToTrip && onAddToTrip(activePlace)}
                style={{
                  width: '100%',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: 10,
                  fontSize: '15px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                <PlusCircle size={18} />
                <span>Thêm Vào Lịch Trình Ngay</span>
              </button>

              {/* Secondary Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePlace.name + ' ' + fullAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    padding: '10px 16px',
                    borderRadius: 8,
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <Navigation size={14} color="#dc2626" />
                  <span>Chỉ đường trên Google Maps</span>
                </a>

                <button
                  onClick={(e) => onToggleFavorite && onToggleFavorite(activePlace.id || activePlace._id, e)}
                  style={{
                    width: '100%',
                    backgroundColor: isFavorite ? '#fee2e2' : '#ffffff',
                    color: isFavorite ? '#dc2626' : '#334155',
                    border: '1px solid',
                    borderColor: isFavorite ? '#fecaca' : '#cbd5e1',
                    padding: '10px 16px',
                    borderRadius: 8,
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <Heart size={14} fill={isFavorite ? '#dc2626' : 'none'} />
                  <span>{isFavorite ? 'Đã lưu trong mục yêu thích' : 'Lưu vào danh sách yêu thích'}</span>
                </button>
              </div>

              {/* Trip.com Trust checklist */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '12px', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} color="#059669" />
                  <span>Đánh giá khách quan từ cộng đồng LonGo</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} color="#059669" />
                  <span>Giờ mở cửa & giá vé cập nhật liên tục</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} color="#059669" />
                  <span>Tự động tối ưu lịch trình tham quan</span>
                </div>
              </div>

            </div>

            {/* Quick Contact & Working Hours Widget */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 14,
              padding: '18px 20px',
              border: '1px solid #e2e8f0',
              fontSize: '13px'
            }}>
              <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Info size={15} color="#2563eb" />
                <span>Hỗ Trợ & Đối Soát Trực Tuyến</span>
              </div>
              <div style={{ color: '#64748b', fontSize: '12.5px', lineHeight: 1.5 }}>
                Nếu bạn phát hiện thông tin giờ mở cửa hoặc giá vé của <strong>{activePlace.name}</strong> bị thay đổi, hãy thông báo để Ban Quản Trị kịp thời cập nhật cho cộng đồng.
              </div>
              <button
                onClick={() => onOpenReportModal && onOpenReportModal({
                  type: 'place_info',
                  targetId: activePlace.slug || activePlace.id || activePlace._id,
                  placeId: activePlace.slug || activePlace.id || activePlace._id,
                  authorName: activePlace.name,
                  snippet: `Thông tin địa điểm: ${fullAddress}`
                })}
                style={{
                  marginTop: 10,
                  fontSize: '12px',
                  color: '#dc2626',
                  fontWeight: 700,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Flag size={12} />
                <span>Báo cáo sai lệch thông tin địa điểm</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
