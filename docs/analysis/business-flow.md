# CÁC LUỒNG NGHIỆP VỤ CỐT LÕI (BUSINESS FLOWS)
**Đề tài 04:** Nền tảng đánh giá và review địa điểm du lịch / ăn uống  
**Căn cứ:** Mục 3 SRS Baseline 1.0  

---

## 1. Luồng UC-03 & UC-04: Đề xuất và Phê duyệt Địa điểm Mới

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant Frontend
    participant API as ASP.NET Core API
    participant MongoDB
    actor Admin

    Member->>Frontend: Điền tên, địa chỉ, chọn 1 category, mô tả, ảnh, chọn tọa độ trên bản đồ
    Frontend->>API: POST /api/places/check-duplicate (Tên & Tọa độ)
    API->>MongoDB: Truy vấn tìm tên tương tự ($text) hoặc tọa độ gần kề ($nearSphere)
    MongoDB-->>API: Danh sách khả nghi
    API-->>Frontend: Trả về kết quả đối soát trùng lặp
    Member->>Frontend: Xác nhận gửi đề xuất
    Frontend->>API: POST /api/place-proposals (type: 'create')
    API->>MongoDB: Lưu document vào collection place_proposals (status: 'pending')
    API-->>Frontend: 201 Created (Thông báo đang chờ Admin duyệt)
    
    Note over Admin, MongoDB: Admin đăng nhập vào Dashboard Quản trị
    Admin->>Frontend: Xem danh sách đề xuất Pending
    Frontend->>API: GET /api/place-proposals?status=pending
    API->>MongoDB: Truy vấn proposals
    MongoDB-->>Frontend: Danh sách đề xuất
    Admin->>Frontend: Quyết định Phê duyệt (Approve) hoặc Từ chối (Reject)
    Frontend->>API: PATCH /api/place-proposals/{id}/decision
    alt Phê duyệt (Approve)
        API->>MongoDB: 1. Tạo document mới vào places (status: 'active', ratingAverage: null, reviewCount: 0)<br/>2. Cập nhật proposal status: 'approved', reviewedBy, reviewedAt
        API-->>Frontend: 200 OK (Địa điểm chính thức xuất hiện trên bản đồ/danh sách)
    else Từ chối (Reject)
        API->>MongoDB: Cập nhật proposal status: 'rejected', rejectionReason, reviewedBy, reviewedAt
        API-->>Frontend: 200 OK (Lưu lý do từ chối để Member theo dõi kết quả)
    end
```

---

## 2. Luồng UC-05: Đề xuất Chỉnh sửa Thông tin Địa điểm

- **Nguyên tắc an toàn:** Không chỉnh sửa trực tiếp dữ liệu đang công khai của Place khi chưa qua kiểm duyệt.
1. Member bấm "Đề xuất chỉnh sửa" trên trang chi tiết địa điểm đang hoạt động.
2. Member cập nhật các trường thông tin mong muốn (ví dụ: đổi địa chỉ, thêm mô tả, bổ sung hình ảnh) kèm lý do chỉnh sửa.
3. API lưu một bản ghi `PlaceProposal` với `type = 'edit'`, chứa:
   - `placeId`: ID địa điểm hiện tại.
   - `payload`: Thông tin mới được đề xuất.
   - `originalVersion`: Snapshot thông tin cũ để làm căn cứ đối chiếu diff.
   - `status = 'pending'`.
4. Admin truy cập trang duyệt đề xuất, hệ thống hiển thị màn hình so sánh song song (**Diff View: Cũ vs Mới**).
5. Khi Admin bấm **Duyệt**, backend cập nhật atomic vào collection `places` và đánh dấu proposal là `approved`. Nếu Admin từ chối, cập nhật lý do từ chối và dữ liệu công khai giữ nguyên vẹn.

---

## 3. Luồng UC-06: Đăng, Chỉnh sửa, Xóa Review và Cập nhật Rating

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant API as ASP.NET Core API
    participant MongoDB

    Note over Member, API: 1. Tạo mới Review
    Member->>API: POST /api/places/{id}/reviews (rating: 1..5, content, images <= 5)
    API->>MongoDB: Kiểm tra Place có tồn tại và chưa có review active của Member này
    alt Đã tồn tại review active của Member
        API-->>Member: 409 Conflict ("Bạn đã đánh giá địa điểm này rồi")
    else Chưa có review
        API->>MongoDB: Push new review vào places.reviews (createdAt = UTC Now)
        API->>MongoDB: Thực thi Aggregation Pipeline tính ratingAverage & reviewCount
        API->>MongoDB: Cập nhật ratingAverage & reviewCount vào place document
        API-->>Member: 201 Created (Review hiển thị ngay lập tức)
    end

    Note over Member, API: 2. Chỉnh sửa Review (Trong 7 ngày)
    Member->>API: PUT /api/places/{id}/reviews/{reviewId} (rating, content, images)
    API->>MongoDB: Kiểm tra owner == current_user && (Now - createdAt) <= 7 ngày
    alt Quá 7 ngày (168 giờ)
        API-->>Member: 400 Bad Request ("Đã quá thời hạn 7 ngày chỉnh sửa")
    else Hợp lệ
        API->>MongoDB: Cập nhật nội dung, số sao, updatedAt (giữ nguyên createdAt ban đầu)
        API->>MongoDB: Chạy lại Aggregation Pipeline tính toán lại ratingAverage
        API-->>Member: 200 OK
    end

    Note over Member, API: 3. Xóa Review (Hard Delete)
    Member->>API: DELETE /api/places/{id}/reviews/{reviewId}
    API->>MongoDB: Kiểm tra owner == current_user
    API->>MongoDB: Pull review ra khỏi mảng places.reviews (xóa sạch cả comments/replies con)
    API->>MongoDB: Chạy lại Aggregation Pipeline (nếu không còn review thì ratingAverage=null, reviewCount=0)
    API-->>Member: 204 No Content
    Note over Member, API: Member có thể viết review mới sau khi xóa (luôn đảm bảo tối đa 1 active review)
```

---

## 4. Luồng UC-07 & UC-09: Tương tác Bình luận 2 Tầng và Xử lý Vi phạm

- **Comment Tầng 1:** Member bình luận dưới Review (`POST /api/places/{placeId}/reviews/{reviewId}/comments`).
- **Reply Tầng 2:** Member trả lời bình luận tầng 1 (`POST /api/places/{placeId}/reviews/{reviewId}/comments/{commentId}/replies`).
- **Chặn Tầng 3:** API kiểm tra endpoint, tuyệt đối không hỗ trợ hoặc từ chối tạo reply lồng bên trong một reply khác.
- **Like / Unlike:**
  - Thao tác là một toggle idempotent: Nếu userId đã có trong mảng `likes`, bấm like sẽ xóa khỏi mảng (unlike); nếu chưa có thì thêm vào (`$addToSet`). Mỗi user tối đa 1 like.
- **Báo cáo vi phạm (Report):**
  - Member bấm Báo cáo vi phạm cho Review / Comment / Reply với lý do vi phạm (Spam, Ngôn từ thù ghét, Sai sự thật...).
  - Lưu vào collection `reports` (`status: 'pending'`).
  - Admin vào Quản lý báo cáo vi phạm, xem nội dung bị tố cáo:
    - Nếu vi phạm thực sự: Admin chọn **Xóa vĩnh viễn (Hard Delete)**. Backend tiến hành gỡ bỏ review/comment/reply tương ứng khỏi document Place, cập nhật trạng thái report là `resolved`, ghi nhận `resolvedBy` và `resolvedAt`.
    - Nếu không vi phạm: Đánh dấu report là `dismissed`.
