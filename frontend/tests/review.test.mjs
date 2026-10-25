import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canEditReview, isReviewOwner, REVIEW_EDIT_WINDOW_MS, getReviewErrorMessage } from '../src/utils/reviewRules.js';
import { validateReviewFiles, uploadReviewImage, MAX_REVIEW_IMAGE_BYTES } from '../src/services/reviewImages.js';
const user = { userId: 'owner' };
const now = Date.now();
const review = { userId: 'owner', createdAt: new Date(now - 1000).toISOString() };
const image = () => new File(['image-content'], 'photo.png', { type: 'image/png' });

test('edit uses immutable user ID; matching display names are not ownership', () => {
  assert.equal(canEditReview(review, user, now), true);
  assert.equal(isReviewOwner({ userId: 'other', authorName: 'Same name' }, { userId: 'owner', fullName: 'Same name' }), false);
  assert.equal(isReviewOwner({}, {}), false);
});
test('edit window rejects expired, invalid and future dates', () => {
  for (const createdAt of [new Date(now - REVIEW_EDIT_WINDOW_MS - 1).toISOString(), 'invalid', new Date(now + 1000).toISOString()]) {
    assert.equal(canEditReview({ ...review, createdAt }, user, now), false);
  }
  assert.equal(canEditReview({ ...review, createdAt: new Date(now - REVIEW_EDIT_WINDOW_MS).toISOString() }, user, now), true);
});
test('five-image limit includes retained images', () => {
  assert.doesNotThrow(() => validateReviewFiles([image(), image()], 3));
  assert.throws(() => validateReviewFiles([image(), image(), image()], 3), /tối đa 5/);
});
test('rejects unsupported, empty and oversized files before upload', () => {
  assert.throws(() => validateReviewFiles([new File(['x'], 'bad.svg', { type: 'image/svg+xml' })]), /JPG, PNG/);
  assert.throws(() => validateReviewFiles([new File([], 'empty.png', { type: 'image/png' })]), /5 MB/);
  assert.throws(() => validateReviewFiles([{ type: 'image/png', size: MAX_REVIEW_IMAGE_BYTES + 1 }]), /5 MB/);
});
test('missing Cloudinary config fails without transmitting the image', async () => {
  let requests = 0;
  await assert.rejects(uploadReviewImage(image(), { config: { cloudName: '', uploadPreset: '' }, fetchImpl: async () => { requests++; } }), /chưa sẵn sàng/);
  assert.equal(requests, 0);
});
test('Cloudinary request uploads multipart and preserves secure URL/public ID', async () => {
  const result = await uploadReviewImage(image(), { config: { cloudName: 'sample-cloud', uploadPreset: 'reviews' }, fetchImpl: async (url, options) => {
    assert.equal(url, 'https://api.cloudinary.com/v1_1/sample-cloud/image/upload');
    assert.equal(options.method, 'POST');
    assert.equal(options.body.get('upload_preset'), 'reviews');
    assert.equal(options.body.get('file').name, 'photo.png');
    return { ok: true, json: async () => ({ secure_url: 'https://res.cloudinary.com/sample-cloud/image/upload/review.png', public_id: 'reviews/photo' }) };
  }});
  assert.equal(result.publicId, 'reviews/photo');
  assert.match(result.url, /^https:/);
});
test('upload failures and incomplete responses cannot be used as review images', async () => {
  for (const fetchImpl of [async () => { throw new Error('offline'); }, async () => ({ ok: false, json: async () => ({}) }), async () => ({ ok: true, json: async () => ({ secure_url: 'http://unsafe', public_id: 'x' }) })]) {
    await assert.rejects(uploadReviewImage(image(), { config: { cloudName: 'cloud', uploadPreset: 'preset' }, fetchImpl }), /Không tải được ảnh/);
  }
});
test('review errors expose validation and expired sessions without claiming success', () => {
  assert.match(getReviewErrorMessage({ response: { status: 401 } }), /đăng nhập lại/);
  assert.equal(getReviewErrorMessage({ response: { status: 409, data: { message: 'Duplicate review' } } }), 'Duplicate review');
  assert.equal(getReviewErrorMessage({ response: { data: { errors: { Content: ['Too short'] } } } }), 'Too short');
  assert.match(getReviewErrorMessage(new Error('offline')), /Không thể kết nối/);
});
