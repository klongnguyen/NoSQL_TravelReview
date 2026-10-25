export const MAX_REVIEW_IMAGES = 5;
export const MAX_REVIEW_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const env = import.meta.env || {};
const defaultConfig = {
  cloudName: env.VITE_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
};

function validationError(message) {
  return Object.assign(new Error(message), { isReviewValidation: true });
}

export function hasCloudinaryConfig(config = defaultConfig) {
  return Boolean(typeof config?.cloudName === 'string' && config.cloudName.trim()
    && typeof config?.uploadPreset === 'string' && config.uploadPreset.trim());
}

export function validateReviewFiles(files, existingCount = 0) {
  if (files.length + existingCount > MAX_REVIEW_IMAGES) {
    throw validationError('Mỗi đánh giá được đính kèm tối đa 5 ảnh.');
  }
  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) throw validationError('Vui lòng chọn ảnh JPG, PNG hoặc WebP.');
    if (file.size <= 0 || file.size > MAX_REVIEW_IMAGE_BYTES) {
      throw validationError('Mỗi ảnh phải có dung lượng lớn hơn 0 và không quá 5 MB.');
    }
  }
}

export async function uploadReviewImage(file, { config = defaultConfig, fetchImpl = fetch } = {}) {
  validateReviewFiles([file]);
  if (!hasCloudinaryConfig(config)) {
    throw validationError('Chức năng tải ảnh chưa sẵn sàng. Bạn có thể bỏ ảnh đã chọn để đăng đánh giá không kèm ảnh.');
  }
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', config.uploadPreset);
  let response;
  try {
    response = await fetchImpl(`https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`, {
      method: 'POST', body: form,
    });
  } catch {
    throw validationError('Không tải được ảnh. Vui lòng kiểm tra kết nối và thử lại.');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || typeof data?.secure_url !== 'string' || !data.secure_url.startsWith('https://') || typeof data?.public_id !== 'string' || !data.public_id) {
    throw validationError('Không tải được ảnh lên dịch vụ lưu trữ. Vui lòng thử lại sau.');
  }
  return { url: data.secure_url, publicId: data.public_id };
}
