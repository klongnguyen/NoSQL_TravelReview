export const REVIEW_EDIT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export function isReviewOwner(review, user) {
  const userId = user?.userId || user?.id;
  return Boolean(userId && review?.userId && review.userId === userId);
}

export function canEditReview(review, user, now = Date.now()) {
  const age = now - new Date(review?.createdAt).getTime();
  return isReviewOwner(review, user) && Number.isFinite(age) && age >= 0 && age <= REVIEW_EDIT_WINDOW_MS;
}

export function getReviewErrorMessage(error) {
  if (error?.response?.status === 401) return 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.';
  const data = error?.response?.data;
  if (typeof data?.message === 'string' && data.message.trim()) return data.message;
  const messages = Object.values(data?.errors || {}).flat().filter(value => typeof value === 'string' && value.trim());
  if (messages.length) return messages.join(' ');
  if (error?.response) return 'Không thể lưu đánh giá. Vui lòng thử lại.';
  if (error?.isReviewValidation) return error.message;
  return 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
}
