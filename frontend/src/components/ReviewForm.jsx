import React, { useEffect, useRef, useState } from 'react';
import { placeService } from '../services/api';
import { hasCloudinaryConfig, MAX_REVIEW_IMAGES, uploadReviewImage, validateReviewFiles } from '../services/reviewImages';
import { canEditReview, getReviewErrorMessage, isReviewOwner } from '../utils/reviewRules';

function ImagePreview({ entry, disabled, onRemove }) {
  const imageRef = useRef(null);
  useEffect(() => {
    if (!entry.file) return;
    const url = URL.createObjectURL(entry.file);
    if (imageRef.current) imageRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [entry.file]);
  return (
    <div style={{ width: 100 }}>
      <img ref={imageRef} src={entry.file ? undefined : entry.image?.url} alt={entry.file?.name || 'Ảnh đã đính kèm'} style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 6 }} />
      <button type="button" disabled={disabled} onClick={onRemove} className="aj-button-pill-outline" style={{ fontSize: 12, marginTop: 4 }}>
        Bỏ ảnh
      </button>
    </div>
  );
}

export default function ReviewForm({ place, currentUser, editingReview, onCancelEdit, onSaved, onBusyChange }) {
  const [rating, setRating] = useState(editingReview?.rating || 5);
  const [content, setContent] = useState(editingReview?.content || '');
  const [entries, setEntries] = useState(() => (editingReview?.images || []).map((image, index) => ({ key: `existing-${index}`, image })));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [savedPlaceId, setSavedPlaceId] = useState(null);
  const submittingRef = useRef(false);
  const ownReview = place.reviews?.find(review => isReviewOwner(review, currentUser));
  const isEditing = Boolean(editingReview);

  function addFiles(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    try {
      validateReviewFiles(files, entries.length);
      setEntries(previous => [...previous, ...files.map(file => ({ key: crypto.randomUUID(), file }))]);
      setError('');
    } catch (err) {
      setError(getReviewErrorMessage(err));
    }
  }

  async function refreshSavedPlace(id) {
    const { data } = await placeService.getPlaceById(id);
    if (!data?.id || !Array.isArray(data.reviews)) throw new Error('Invalid place response');
    onSaved(data, isEditing ? 'Đã cập nhật đánh giá.' : 'Đã đăng đánh giá thành công.');
    setSavedPlaceId(null);
  }

  async function submit(event) {
    event.preventDefault();
    if (submittingRef.current || savedPlaceId) return;
    setError('');
    if (!currentUser) { setError('Vui lòng đăng nhập để gửi đánh giá.'); return; }
    if (content.trim().length < 10) { setError('Nội dung đánh giá phải có ít nhất 10 ký tự.'); return; }
    if (isEditing && !canEditReview(editingReview, currentUser)) {
      setError('Bạn chỉ có thể sửa đánh giá của mình trong vòng 7 ngày kể từ khi đăng.'); return;
    }
    try {
      validateReviewFiles(entries.filter(entry => entry.file).map(entry => entry.file), entries.filter(entry => !entry.file).length);
    } catch (err) { setError(getReviewErrorMessage(err)); return; }

    submittingRef.current = true;
    setIsSubmitting(true);
    onBusyChange?.(true);
    const placeId = place.id || place._id || place.slug;
    let written = false;
    try {
      const images = [];
      // Retain successful uploads on retry so a failed save does not reupload the same files.
      for (const entry of entries) {
        const image = entry.image || await uploadReviewImage(entry.file);
        images.push({ url: image.url, publicId: image.publicId });
        if (!entry.image) setEntries(previous => previous.map(item => item.key === entry.key ? { ...item, image } : item));
      }
      const payload = { rating, content: content.trim(), images };
      if (isEditing) await placeService.updateReview(placeId, editingReview.reviewId, payload);
      else await placeService.createReview(placeId, payload);
      written = true;
      setSavedPlaceId(placeId);
      await refreshSavedPlace(placeId);
    } catch (err) {
      setError(written
        ? 'Đánh giá đã được lưu nhưng chưa tải lại được dữ liệu. Bấm “Tải lại đánh giá” để cập nhật, không gửi lại bài.'
        : getReviewErrorMessage(err));
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
      onBusyChange?.(false);
    }
  }

  async function retryRefresh() {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    onBusyChange?.(true);
    try { await refreshSavedPlace(savedPlaceId); }
    catch { setError('Chưa tải lại được đánh giá. Vui lòng kiểm tra kết nối và thử lại.'); }
    finally { submittingRef.current = false; setIsSubmitting(false); onBusyChange?.(false); }
  }

  if (ownReview && !isEditing && !savedPlaceId) {
    return <div id="review-form" style={{ padding: 20, marginBottom: 24, background: 'var(--aj-soft)', borderRadius: 8 }}>
      <p>Bạn đã đăng đánh giá cho địa điểm này. Mỗi tài khoản có một đánh giá trên mỗi địa điểm.</p>
      <p>{canEditReview(ownReview, currentUser) ? 'Bấm “Sửa đánh giá” ở bài của bạn bên dưới để cập nhật.' : 'Đánh giá đã quá thời hạn chỉnh sửa 7 ngày.'}</p>
    </div>;
  }

  return (
    <form id="review-form" aria-label={isEditing ? 'Sửa đánh giá' : 'Viết đánh giá'} onSubmit={submit}
      style={{ padding: 20, background: 'var(--aj-soft)', borderRadius: 8, marginBottom: 28, border: '1px solid var(--aj-hairline)' }}>
      <h4 style={{ marginTop: 0 }}>{isEditing ? 'Chỉnh sửa đánh giá của bạn' : `Chia sẻ trải nghiệm tại ${place.name}`}</h4>
      {error && <div role="alert" style={{ padding: 12, marginBottom: 16, background: '#fee2e2', color: '#991b1b', borderRadius: 6 }}>{error}</div>}
      {savedPlaceId && <button type="button" disabled={isSubmitting} onClick={retryRefresh} className="aj-button-pill-dark">Tải lại đánh giá</button>}
      <fieldset disabled={isSubmitting || Boolean(savedPlaceId)} style={{ border: 0, padding: 0, margin: 0 }}>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="review-rating" style={{ display: 'block', marginBottom: 6 }}>Chấm điểm</label>
          <select id="review-rating" value={rating} onChange={event => setRating(Number(event.target.value))} className="aj-text-input">
            {[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value} sao</option>)}
          </select>
        </div>
        <label htmlFor="review-content" style={{ display: 'block', marginBottom: 6 }}>Nội dung đánh giá</label>
        <textarea id="review-content" value={content} onChange={event => setContent(event.target.value)} rows={4} required minLength={10}
          placeholder="Chia sẻ trải nghiệm của bạn (ít nhất 10 ký tự)" className="aj-text-input" style={{ width: '100%', marginBottom: 14, resize: 'vertical' }} />
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="review-images" style={{ display: 'block', marginBottom: 6 }}>Ảnh đính kèm ({entries.length}/{MAX_REVIEW_IMAGES})</label>
          <input id="review-images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addFiles} disabled={entries.length >= MAX_REVIEW_IMAGES} />
          <p style={{ fontSize: 12 }}>Tối đa 5 ảnh JPG, PNG hoặc WebP; mỗi ảnh không quá 5 MB.</p>
          {!hasCloudinaryConfig() && <p style={{ fontSize: 12, color: '#92400e' }}>Chức năng tải ảnh chưa sẵn sàng. Bạn vẫn có thể đăng hoặc sửa đánh giá không kèm ảnh mới.</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {entries.map(entry => <ImagePreview key={entry.key} entry={entry} disabled={isSubmitting || Boolean(savedPlaceId)}
              onRemove={() => setEntries(previous => previous.filter(item => item.key !== entry.key))} />)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="aj-button-pill-dark">{isSubmitting ? 'Đang lưu đánh giá...' : isEditing ? 'Lưu thay đổi' : 'Đăng bài đánh giá'}</button>
          {isEditing && <button type="button" onClick={onCancelEdit} className="aj-button-pill-outline">Hủy chỉnh sửa</button>}
        </div>
      </fieldset>
    </form>
  );
}
