# NSD-98: Review creation, editing and images

## Scope

- Submit reviews only after the API confirms success. Refresh the place from MongoDB through the API; use server review IDs, ratingAverage and reviewCount.
- Keep the draft on validation/network/API failures. A failed refresh after a successful write offers a GET-only retry instead of posting the review again.
- Load the existing content, rating and image metadata when editing. Allow only the author within seven days; the backend enforces the same rule in its update filter.
- Fix nested review ObjectId matching in UpdateReviewAsync, support place IDs/slugs, and return a JSON 403 for unauthorized edits.
- Show attached review images, place gallery thumbnails, and edit actions in place details and My Reviews. Ownership uses user IDs rather than display names.
- Select/remove/preview up to five JPG/PNG/WebP files, maximum 5 MB each. Uploads use the Cloudinary image upload API; MongoDB stores the resulting URL and public ID.

## Cloudinary configuration

Copy frontend/.env.example to frontend/.env.local and supply VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET. Restart Vite after editing the environment.

Use an unsigned upload preset restricted to the review folder, JPG/PNG/WebP formats and a maximum size of 5 MB. The browser sends file and upload_preset to the image/upload endpoint. Never put API Secret into VITE_* variables or commit real account configuration. Client-side configuration is visible in the browser; authenticated/signed uploads are an alternative for production.

Reference: https://cloudinary.com/documentation/upload_images#unauthenticated_requests

Without configuration, text-only create/edit remains usable. Selecting new images must produce a clear error on submit rather than dropping the images or claiming a successful upload. Previously stored images can be retained without uploading them again.

Removing an image detaches its metadata on review save; it does not delete the asset from Cloudinary. Successful uploads are reused when retrying a failed review save. Account-level cleanup of unused assets is outside this change.

## Validation performed

- dotnet build: succeeded.
- npm run build: succeeded.
- npm test: 8 tests for edit ownership/time limits, file limits/types/sizes, Cloudinary request/response/error handling with mocked responses, and API error messages.
- API integration against a disposable place in local MongoDB: create, duplicate rejection, ObjectId edit, slug edit, ownership 403, anonymous 401, expired review, invalid rating and more than five images. The disposable place was removed after testing.
- Browser against the local backend: create a 2-star review, open edit with the original content/rating, change to 4 stars, reload, and verify persisted content/rating. A server-side duplicate rejection was also tested in the browser: the draft remained in the textarea, the server error was displayed, and no fabricated review or success notice was added. Disposable reviews were removed after testing.

Live Cloudinary uploading has NOT been verified because the group's cloud name/upload preset were unavailable. Do not mark NSD-98 complete until live upload and its persisted images are checked.

## Manual acceptance

1. Log in to a real backend account, open a place without a review from that account, and submit 1-5 stars with at least ten non-space characters.
2. Reload: exactly one review exists, it has a server ID, and rating/count agree with MongoDB.
3. Open Edit: original text, stars and existing images are present. Change and save; reload to confirm persistence without increasing review count.
4. Try another account and an expired review: editing must be denied by the backend.
5. Test an unavailable API and a server validation error: draft stays, no successful-save notice or fabricated review is shown.
6. Configure Cloudinary, choose up to five images, preview/remove them, save, and reload. Confirm URLs/public IDs in MongoDB and assets in Cloudinary. Test unsupported/oversized/sixth files and an upload failure.
7. Force a refresh failure after a successful write: use the refresh button to retrieve data without issuing a second POST/PUT.

## Branch separation

This branch starts from main and does not include the separate NSD-96 auth fix in PR #12. Merge both PRs to retain both changes. Google Sign-In, comments/replies, Redis, Neo4j and concurrency redesign are not part of NSD-98.
