import React, { useState, useMemo } from 'react';
import { canEditReview, isReviewOwner } from '../utils/reviewRules';
import { 
  User, Shield, Star, Clock, Trash2, Edit3, 
  Heart, LogOut, CheckCircle2, AlertCircle, Compass, LogIn
} from 'lucide-react';

export default function AccountManagement({ 
  currentUser, 
  places = [], 
  favoritePlaceIds = [],
  onOpenAuthModal, 
  onLogout, 
  onSelectPlace,
  onDeleteReview,
  onEditReview
}) {
  const [activeSubTab, setActiveSubTab] = useState('my-reviews'); // 'my-reviews', 'favorites'

  // Tìm tất cả các bài đánh giá của người dùng hiện tại
  const myReviews = useMemo(() => {
    if (!currentUser) return [];
    const reviewsList = [];

    places.forEach(place => {
      (place.reviews || []).forEach(rev => {
        const isMyReview = isReviewOwner(rev, currentUser);

        if (isMyReview) {
          reviewsList.push({
            ...rev,
            placeId: place.id || place._id,
            placeName: place.name,
            placeSlug: place.slug,
            placeImage: place.images?.[0]?.url || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800',
            placeDistrict: place.address?.district || place.address?.city || 'TP.HCM',
            placeObj: place
          });
        }
      });
    });

    return reviewsList;
  }, [places, currentUser]);

  // Danh sách địa điểm yêu thích
  const myFavoritePlaces = useMemo(() => {
    return places.filter(p => favoritePlaceIds.includes(p.id) || favoritePlaceIds.includes(p._id));
  }, [places, favoritePlaceIds]);

  // Kiểm tra thời hạn 7 ngày (BR-09)
  const isWithin7Days = (createdAt) => {
    if (!createdAt) return true;
    const diffHours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 3600);
    return diffHours <= 168; // 7 ngày = 168 giờ
  };

  // Nếu là khách vãng lai
  if (!currentUser) {
    return (
      <div style={{ maxWidth: 760, margin: '40px auto', padding: '0 20px' }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--aj-hairline, #e2e8f0)',
          borderRadius: 'var(--aj-rounded-md, 8px)',
          padding: '40px 32px',
          textAlign: 'center'
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <User size={32} color="#64748b" />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#000000', marginBottom: 8 }}>
            Bạn đang là Khách vãng lai (Guest)
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 480, margin: '0 auto 24px auto', lineHeight: 1.5 }}>
            Khách vãng lai có thể xem toàn bộ hơn 40 địa điểm và tất cả đánh giá chân thực trên LonGo. Để đăng tải bài đánh giá và chấm điểm địa điểm, bạn chỉ cần đăng nhập tài khoản thành viên.
          </p>

          <button
            onClick={onOpenAuthModal}
            className="aj-button-pill-dark"
            style={{ padding: '10px 24px', fontSize: 14, fontWeight: 700 }}
          >
            <LogIn size={16} />
            <span>Đăng nhập / Đăng ký thành viên</span>
          </button>
        </div>
      </div>
    );
  }

  // Giao diện quản lý tài khoản thành viên (Đơn giản, tinh gọn)
  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Thẻ Thông Tin Hồ Sơ Thành Viên */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: '#000000',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 900
          }}>
            {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#000000', margin: 0 }}>
                {currentUser.fullName}
              </h2>
              <span style={{
                background: currentUser.role === 'Admin' ? '#000000' : '#f1f5f9',
                color: currentUser.role === 'Admin' ? '#ffffff' : '#000000',
                border: '1px solid #cbd5e1',
                padding: '2px 8px',
                borderRadius: 9999,
                fontSize: 11,
                fontWeight: 800
              }}>
                {currentUser.role === 'Admin' ? 'Quản trị viên' : 'Thành viên LonGo'}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0 0' }}>
              📧 {currentUser.email}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="aj-button-pill-outline"
          style={{ fontSize: 13, padding: '7px 16px' }}
        >
          <LogOut size={14} />
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* 2. Thanh phân nhóm Sub-tab */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: 8 }}>
        <button
          onClick={() => setActiveSubTab('my-reviews')}
          style={{
            padding: '10px 18px',
            border: 'none',
            borderBottom: activeSubTab === 'my-reviews' ? '2px solid #000000' : '2px solid transparent',
            background: 'none',
            fontSize: 14,
            fontWeight: activeSubTab === 'my-reviews' ? 800 : 600,
            color: activeSubTab === 'my-reviews' ? '#000000' : '#64748b',
            cursor: 'pointer'
          }}
        >
          Đánh giá của tôi ({myReviews.length})
        </button>
        <button
          onClick={() => setActiveSubTab('favorites')}
          style={{
            padding: '10px 18px',
            border: 'none',
            borderBottom: activeSubTab === 'favorites' ? '2px solid #000000' : '2px solid transparent',
            background: 'none',
            fontSize: 14,
            fontWeight: activeSubTab === 'favorites' ? 800 : 600,
            color: activeSubTab === 'favorites' ? '#000000' : '#64748b',
            cursor: 'pointer'
          }}
        >
          Địa điểm đã lưu ({myFavoritePlaces.length})
        </button>
      </div>

      {/* 3. Nội dung Tab: Đánh giá của tôi */}
      {activeSubTab === 'my-reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {myReviews.length === 0 ? (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '40px',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <p style={{ margin: 0, fontSize: 14 }}>Bạn chưa đăng bài đánh giá nào.</p>
              <p style={{ margin: '6px 0 0 0', fontSize: 13 }}>Hãy ghé thăm trang chi tiết của một địa điểm để gửi đánh giá thực tế nhé!</p>
            </div>
          ) : (
            myReviews.map((rev) => {
              const within7Days = isWithin7Days(rev.createdAt);

              return (
                <div
                  key={rev.reviewId}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '20px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <img
                        src={rev.placeImage}
                        alt={rev.placeName}
                        style={{ width: 50, height: 50, borderRadius: 6, objectFit: 'cover' }}
                      />
                      <div>
                        <button
                          onClick={() => onSelectPlace(rev.placeObj)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            fontSize: 15,
                            fontWeight: 800,
                            color: '#000000',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          {rev.placeName}
                        </button>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                          📍 {rev.placeDistrict} • {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        background: '#000000',
                        color: '#ffffff',
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 800
                      }}>
                        ★ {rev.rating} sao
                      </span>
                    </div>
                  </div>

                  {/* Nội dung đánh giá */}
                  <p style={{ fontSize: 14, color: '#1e293b', margin: 0, lineHeight: 1.5 }}>
                    "{rev.content}"
                  </p>

                  {/* Thanh tiện ích chân review */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 6,
                    paddingTop: 10,
                    borderTop: '1px dashed #e2e8f0',
                    fontSize: 12
                  }}>
                    <span style={{ color: within7Days ? '#059669' : '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} />
                      {within7Days ? 'Còn trong thời hạn chỉnh sửa (7 ngày)' : 'Đã qua thời hạn chỉnh sửa'}
                    </span>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => onSelectPlace(rev.placeObj)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#000000',
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        Xem trên địa điểm
                      </button>
                      {onEditReview && canEditReview(rev, currentUser) && <button
                        type="button" onClick={() => onEditReview(rev.placeObj, rev)}
                        className="aj-button-pill-outline" style={{ fontSize: 12 }}>
                        Sửa đánh giá
                      </button>}
                      {onDeleteReview && (
                        <button
                          onClick={() => onDeleteReview(rev.placeId, rev.reviewId)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#e11d48',
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: 'pointer'
                          }}
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 4. Nội dung Tab: Địa điểm đã lưu */}
      {activeSubTab === 'favorites' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {myFavoritePlaces.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <p style={{ margin: 0, fontSize: 14 }}>Bạn chưa lưu địa điểm yêu thích nào.</p>
              <p style={{ margin: '6px 0 0 0', fontSize: 13 }}>Nhấn vào biểu tượng trái tim ở các thẻ địa điểm để lưu lại nhé!</p>
            </div>
          ) : (
            myFavoritePlaces.map(place => (
              <div
                key={place.id || place._id}
                onClick={() => onSelectPlace(place)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
              >
                <img
                  src={place.images?.[0]?.url || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800'}
                  alt={place.name}
                  style={{ width: '100%', height: 140, objectFit: 'cover' }}
                />
                <div style={{ padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
                    {place.categoryName || 'Di tích'}
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: '#000000', margin: '4px 0 6px 0' }}>
                    {place.name}
                  </h4>
                  <div style={{ fontSize: 12, color: '#ca8a04', fontWeight: 700 }}>
                    ★ {place.ratingAverage ? Number(place.ratingAverage).toFixed(1) : 4.8} ({place.reviewCount || 10} đánh giá)
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
