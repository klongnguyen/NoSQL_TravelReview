# THIẾT KẾ CƠ SỞ DỮ LIỆU MONGODB — ĐỀ TÀI 04
**Dự án:** NoSQL Travel Review (Nền tảng đánh giá & review địa điểm du lịch / ăn uống)  
**Phiên bản:** 1.0 (Khớp chuẩn SRS Baseline 1.0)  
**CSDL chính:** MongoDB (Document Store)  

---

## 1. Danh sách Collections

Hệ thống được thiết kế theo mô hình logic và vật lý chuẩn Document Store gồm 7 collections:

1. **`places`** (Source of Truth chính của địa điểm, chứa **embedded reviews**, **embedded comments**, **embedded replies**).
2. **`categories`** (Danh mục địa điểm động do Admin quản lý: Ẩm thực, Cà phê, Du lịch di tích, Vui chơi giải trí, Khách sạn).
3. **`users`** (Tài khoản người dùng: Admin, Member, thông tin OAuth Google, mật khẩu băm BCrypt).
4. **`place_proposals`** (Các đề xuất tạo mới hoặc chỉnh sửa thông tin địa điểm do Member gửi, chờ Admin phê duyệt/từ chối).
5. **`reports`** (Báo cáo vi phạm đối với Review, Comment hoặc Reply do Member gửi, phục vụ Admin kiểm duyệt).
6. **`favorites`** (Lưu danh sách địa điểm yêu thích của người dùng: Cặp duy nhất `{ userId, placeId }`).
7. **`view_history`** (Lịch sử xem địa điểm theo tài khoản người dùng, có cơ chế xóa thủ công, không dùng TTL tự động).

---

## 2. Chiến lược Embedding vs Referencing (Rubric 1)

### 2.1. Tại sao Embed Reviews, Comments và Replies vào `places`?
- **Đặc trưng truy vấn:** Khi người dùng xem trang chi tiết của một địa điểm du lịch (`/places/{id}`), 95% trường hợp hệ thống cần đọc đồng thời:
  - Thông tin địa điểm (tên, địa chỉ, tọa độ, mô tả, ảnh).
  - Điểm rating trung bình và các bài đánh giá (reviews) kèm ảnh minh chứng.
  - Các bình luận (comments) và câu trả lời phản hồi (replies).
- **Hiệu năng Document Store:** Mô hình nhúng (Embedding) cho phép lấy toàn bộ dữ liệu chi tiết của địa điểm chỉ với **1 thao tác đọc đơn lẻ (single read query)**, loại bỏ triệt để chi phí của phép `$lookup` (JOIN giả lập) tốn kém trong CSDL phân tán.
- **Tính trọn vẹn nghiệp vụ:** Khi Admin xóa một địa điểm hoặc kiểm duyệt xóa review, toàn bộ comments/replies phụ thuộc bên trong được xử lý ngay trong cùng một thao tác tài liệu, loại bỏ hoàn toàn nguy cơ để lại orphan records (bản ghi mồ côi).

### 2.2. Chiến lược kiểm soát giới hạn 16MB BSON (BSON Limit Mitigation)
MongoDB áp đặt kích thước tối đa cho mỗi Document là **16 MiB**.
- **Tính toán dung lượng thực tế:**
  - 1 Place Document cơ bản: ~2 KB.
  - 1 Review đầy đủ (nội dung text, metadata, 5 URL ảnh Cloudinary): ~1 KB.
  - 1 Comment + Replies (tối đa 2 tầng): ~0.5 KB.
  - Với 100 review và 300 comment/reply, tổng dung lượng document chỉ khoảng ~200 KB (chưa đến 2% ngưỡng 16MB).
- **Phạm vi MVP & Bounded Demonstration Data:** Đề tài quy định mỗi địa điểm có từ **5–15 reviews**. Bounding này đảm bảo kích thước document an toàn tuyệt đối và tối ưu tốc độ đọc ghi.
- **Phương án mở rộng tương lai (Beyond MVP):** Khi một địa điểm vượt quá 5,000 reviews, hệ thống có thể áp dụng kiến trúc Hybrid (Bucket Pattern): Giữ lại Top/Recent reviews trong document chính, và phân tách archival reviews sang collection `archived_reviews`.

---

## 3. Các quy tắc bất biến & Xử lý cạnh tranh đồng thời (Concurrency)

1. **Bất biến 1 Active Review / Member / Place (BR-08):**
   - Mỗi thành viên chỉ có duy nhất 1 bài đánh giá đang hoạt động trên một địa điểm.
   - Khi gửi review, backend thực hiện kiểm tra và update có điều kiện nguyên tử:
     ```javascript
     // Điều kiện nguyên tử đảm bảo không có review nào của userId trong place trước đó
     db.places.updateOne(
       { _id: placeId, "reviews.userId": { $ne: userId } },
       { $push: { reviews: newReview } }
     );
     ```
   - Nếu điều kiện không khớp (đã có review trước đó hoặc race condition xảy ra), backend từ chối với mã lỗi `409 Conflict`.

2. **Giới hạn thời gian chỉnh sửa Review trong 7 ngày (BR-09, FR-REV-02):**
   - Review chỉ được chỉnh sửa trong vòng `7 * 24` giờ tính từ `createdAt` ban đầu.
   - Thao tác chỉnh sửa KHÔNG làm thay đổi trường `createdAt`, chỉ cập nhật `updatedAt`.
   - Nếu quá hạn 7 ngày, API trả về `400 Bad Request` hoặc `403 Forbidden`.
   - Người dùng có thể xóa review bất cứ lúc nào. Sau khi xóa, người dùng được quyền viết review mới.

3. **Cấu trúc bình luận tối đa 2 tầng (BR-12, FR-SOC-01):**
   - **Tầng 1 (Comment):** Đặt trực tiếp dưới Review (`reviews[i].comments[]`).
   - **Tầng 2 (Reply):** Đặt dưới Comment (`reviews[i].comments[j].replies[]`).
   - Không cho phép tạo tầng 3 (reply bên trong reply bị chặn ở tầng validation backend và schema).

4. **Hard Delete & Đồng bộ Rating / Review Count:**
   - Khi xóa review, review bị loại bỏ hoàn toàn khỏi mảng `reviews` (Hard Delete). Toàn bộ comments/replies bên trong bị xóa theo.
   - Ngay sau thao tác xóa/sửa review, hệ thống tự động chạy MongoDB Aggregation để cập nhật lại `ratingAverage` và `reviewCount`. Nếu không còn review nào, `ratingAverage = null`, `reviewCount = 0` (hiển thị "Chưa có đánh giá", không hiểu là 0 sao).

---

## 4. Đặc tả Indexes (Mục 6.2 SRS)

| Collection | Tên Index | Định nghĩa Keys | Mục đích & Nghiệp vụ |
|---|---|---|---|
| `places` | `geospatial_place_location` | `{ "location": "2dsphere" }` | Tìm kiếm địa điểm lân cận ("Gần tôi" / Nearby Places) qua `$nearSphere` hoặc `$geoNear`. |
| `places` | `text_search_name_desc` | `{ "name": "text", "description": "text" }` | Tìm kiếm toàn văn (Text Search) theo tên và nội dung giới thiệu địa điểm. |
| `places` | `compound_cat_rating_count` | `{ "categoryId": 1, "ratingAverage": -1, "reviewCount": -1 }` | Lọc địa điểm theo danh mục kết hợp sắp xếp theo sao đánh giá và độ phổ biến. |
| `places` | `compound_district_rating` | `{ "address.district": 1, "ratingAverage": -1 }` | Lọc theo quận/huyện tại TP.HCM và xếp hạng chất lượng. |
| `places` | `uniq_place_slug` | `{ "slug": 1 }` (unique) | Truy cập thân thiện SEO qua URL slug. |
| `users` | `uniq_user_email` | `{ "email": 1 }` (unique) | Đảm bảo tính duy nhất của tài khoản thành viên. |
| `favorites`| `uniq_user_favorite_place` | `{ "userId": 1, "placeId": 1 }` (unique) | Đảm bảo một user chỉ lưu yêu thích một địa điểm đúng 1 lần (Idempotent). |

---

## 5. Các Aggregation Pipelines chuẩn (Mục 6.3 SRS)

### 5.1. AGG-01: Tính toán Rating Trung bình và Số lượng Review còn tồn tại
```javascript
db.places.aggregate([
  { $match: { _id: ObjectId("653333333333333333333331") } },
  { $unwind: "$reviews" },
  {
    $group: {
      _id: "$_id",
      ratingAverage: { $avg: "$reviews.rating" },
      reviewCount: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 1,
      ratingAverage: { $round: ["$ratingAverage", 1] },
      reviewCount: 1
    }
  }
]);
```

### 5.2. AGG-02: Top 10 Địa điểm được đánh giá cao nhất
```javascript
db.places.aggregate([
  { $match: { status: "active", reviewCount: { $gte: 1 } } },
  {
    $sort: {
      ratingAverage: -1,
      reviewCount: -1
    }
  },
  { $limit: 10 },
  {
    $project: {
      name: 1,
      slug: 1,
      categoryId: 1,
      "address.district": 1,
      ratingAverage: 1,
      reviewCount: 1,
      images: { $slice: ["$images", 1] }
    }
  }
]);
```

### 5.3. AGG-03: Thống kê số lượng địa điểm theo từng danh mục
```javascript
db.places.aggregate([
  { $match: { status: "active" } },
  {
    $group: {
      _id: "$categoryId",
      totalPlaces: { $sum: 1 },
      avgRating: { $avg: "$ratingAverage" },
      totalReviews: { $sum: "$reviewCount" }
    }
  },
  {
    $lookup: {
      from: "categories",
      localField: "_id",
      foreignField: "_id",
      as: "category"
    }
  },
  { $unwind: "$category" },
  {
    $project: {
      categoryId: "$_id",
      categoryName: "$category.name",
      categorySlug: "$category.slug",
      totalPlaces: 1,
      avgRating: { $round: ["$avgRating", 1] },
      totalReviews: 1
    }
  },
  { $sort: { totalPlaces: -1 } }
]);
```
