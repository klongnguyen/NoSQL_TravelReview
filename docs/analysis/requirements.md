# ĐẶC TẢ YÊU CẦU HỆ THỐNG (REQUIREMENTS SPECIFICATION)
**Đề tài 04:** Nền tảng đánh giá và review địa điểm du lịch / ăn uống  
**Phạm vi:** TP. Hồ Chí Minh (chuẩn bị kiến trúc mở rộng toàn quốc)  
**Tài liệu tham chiếu:** SRS Baseline 1.0 (22/10/2026)  

---

## 1. Các Vai Trò Trong Hệ Thống (Actors)

| Actor | Quyền hạn & Trách nhiệm |
|---|---|
| **Guest** (Khách vãng lai) | - Xem danh sách địa điểm, tìm kiếm theo từ khóa, lọc danh mục/khu vực/rating.<br>- Xem bản đồ Leaflet, tìm địa điểm gần tôi (nếu cấp quyền vị trí trình duyệt).<br>- Xem chi tiết địa điểm, các bài đánh giá (reviews), bình luận và phản hồi.<br>- Không được thực hiện các thao tác ghi (cần đăng nhập). |
| **Member** (Thành viên xác thực) | - Sở hữu toàn bộ quyền của Guest.<br>- Đăng ký/đăng nhập bằng Email/Password hoặc Google OAuth.<br>- Quản lý thông tin hồ sơ cá nhân.<br>- Đề xuất địa điểm mới (kèm vị trí trên bản đồ, kiểm tra trùng lặp).<br>- Đề xuất chỉnh sửa thông tin địa điểm đang công khai.<br>- Đăng bài đánh giá (1–5 sao nguyên, nội dung, tối đa 5 ảnh). Giới hạn 1 review active / place.<br>- Chỉnh sửa review trong vòng 7 ngày (168 giờ) kể từ khi tạo.<br>- Xóa review cá nhân (hard delete) bất cứ lúc nào.<br>- Viết bình luận (tầng 1) và phản hồi bình luận (tầng 2). Không có tầng 3.<br>- Thả like / hủy like cho review hoặc comment (tối đa 1 like/user/đối tượng).<br>- Báo cáo (report) nội dung vi phạm kèm lý do.<br>- Lưu / bỏ lưu địa điểm yêu thích (Favorites).<br>- Xem và xóa thủ công lịch sử xem địa điểm (View history). |
| **Admin** (Quản trị viên) | - Đăng nhập bằng tài khoản quản trị được phân quyền backend.<br>- Quản lý danh mục (CRUD danh mục động).<br>- Quản lý địa điểm công khai (CRUD place, kiểm soát trạng thái).<br>- Phê duyệt hoặc từ chối đề xuất tạo địa điểm mới.<br>- Phê duyệt hoặc từ chối đề xuất chỉnh sửa địa điểm (xem diff trực quan).<br>- Quản lý báo cáo vi phạm (xem xét report, xóa vĩnh viễn nội dung vi phạm).<br>- Xem thống kê tổng quan (Admin Dashboard) qua MongoDB Aggregation. |

---

## 2. Yêu Cầu Chức Năng Cốt Lõi (Functional Requirements - P0)

### 2.1. Phân hệ Xác thực & Tài khoản (FR-AUTH)
- **FR-AUTH-01:** Đăng ký tài khoản Member bằng email hợp lệ và duy nhất. Mật khẩu được băm an toàn bằng BCrypt trước khi lưu vào MongoDB.
- **FR-AUTH-02:** Đăng nhập và đăng xuất. Cấp JWT token xác thực có thời hạn, chứa Claims vai trò (Role) an toàn.
- **FR-AUTH-03:** Đăng nhập bằng Google OAuth. Backend xác minh id_token của Google, liên kết an toàn qua Google Subject ID.
- **FR-AUTH-04:** Phân quyền ở từng endpoint trên ASP.NET Core API (`[Authorize]`, `[Authorize(Roles = "Admin")]`). Tuyệt đối không tin cậy role do client tự gửi.
- **FR-AUTH-05:** Member xem và chỉnh sửa thông tin cá nhân. Admin có giao diện quản lý riêng.

### 2.2. Phân hệ Danh mục & Địa điểm (FR-PLC)
- **FR-PLC-01:** Quản lý danh mục động (CRUD Category). Mỗi địa điểm chỉ được liên kết đúng 1 `categoryId` chính hợp lệ.
- **FR-PLC-02:** Quản lý địa điểm (Place): tên, slug duy nhất, mô tả, danh mục, địa chỉ (đường, phường/xã, quận/huyện, thành phố, mã tỉnh), tọa độ GeoJSON Point `[longitude, latitude]`, ảnh bìa/danh sách ảnh, trạng thái `active`/`inactive`.
- **FR-PLC-03:** Xem danh sách và chi tiết địa điểm công khai kèm `ratingAverage`, `reviewCount`, ảnh và bình luận được nhúng trực tiếp.
- **FR-PLC-04:** Member đề xuất địa điểm mới: bắt buộc đặt ghim (marker) trên bản đồ Leaflet, phát hiện cảnh báo trùng lặp trước khi gửi.
- **FR-PLC-05:** Admin duyệt/từ chối đề xuất tạo địa điểm. Địa điểm chỉ hiển thị công khai sau khi được duyệt.
- **FR-PLC-06:** Member đề xuất sửa địa điểm; lưu snapshot thay đổi; trước khi Admin duyệt thì dữ liệu công khai không bị biến động.

### 2.3. Phân hệ Đánh giá & Hình ảnh (FR-REV)
- **FR-REV-01:** Member đăng review với số sao nguyên 1–5, nội dung và tối đa 5 ảnh (lưu Cloudinary, MongoDB chỉ lưu URL + metadata). Đảm bảo bất biến duy nhất 1 review active / member / place.
- **FR-REV-02:** Chỉ tác giả mới được sửa review và chỉ trong vòng 7 ngày (168h) từ `createdAt`. Ngày tạo ban đầu bất biến.
- **FR-REV-03:** Chủ bài đánh giá có thể xóa review bất kỳ lúc nào. Sau khi xóa được quyền viết review mới.
- **FR-REV-04:** Hiển thị bài đánh giá kèm thông tin tác giả, thời điểm tạo/sửa. Có nhãn đánh dấu phân biệt dữ liệu demo (isDemo) với người thật.
- **FR-REV-05:** Cập nhật tức thời `ratingAverage` và `reviewCount` bằng MongoDB Aggregation khi tạo/sửa/xóa review. Địa điểm chưa có review hiển thị "Chưa có đánh giá" (không coi là 0 sao).

### 2.4. Phân hệ Tương tác Xã hội (FR-SOC)
- **FR-SOC-01:** Bình luận tầng 1 dưới Review, và trả lời (Reply tầng 2) dưới bình luận. Nghiêm cấm tạo tầng 3.
- **FR-SOC-02:** Thả like/unlike cho review và comment. Mỗi user chỉ có tối đa 1 like trên mỗi đối tượng.
- **FR-SOC-03:** Tạo báo cáo (report) vi phạm kèm lý do. Giao diện hiển thị trạng thái đã báo cáo để tránh gửi trùng lặp.
- **FR-SOC-04:** Admin xem danh sách report và thực hiện xóa vĩnh viễn (Hard Delete) nội dung vi phạm. Không hỗ trợ khôi phục.
- **FR-SOC-05:** Khi xóa review/comment/reply, không để lại bản ghi mồ côi (orphan references). Bộ đếm và hiển thị cập nhật chính xác.

### 2.5. Phân hệ Khám phá, Tìm kiếm & Lịch sử (FR-DIS)
- **FR-DIS-01:** Tìm kiếm địa điểm theo từ khóa sử dụng MongoDB Text Index, kết hợp lọc theo danh mục, quận/huyện, rating và phân trang.
- **FR-DIS-02:** Bản đồ Leaflet thể hiện vị trí địa điểm; hỗ trợ tính năng "Gần tôi" qua truy vấn `$nearSphere` / `2dsphere` index từ tọa độ GPS trình duyệt; xử lý lịch sự khi người dùng từ chối cấp quyền vị trí.
- **FR-DIS-03:** Thêm/bỏ địa điểm yêu thích (Favorites), xem danh sách đã lưu.
- **FR-DIS-04:** Ghi nhận lịch sử xem địa điểm (View history) gắn với tài khoản cá nhân; không đặt TTL tự động; cho phép xóa thủ công.
- **FR-DIS-05:** Danh sách Top 10 địa điểm nổi bật tính toán dựa trên cả `ratingAverage` và `reviewCount` (tránh ưu tiên sai lệch nơi 1 review 5 sao).

### 2.6. Phân hệ Quản trị & Thống kê (FR-ADM)
- **FR-ADM-01:** Giao diện quản trị tập trung danh mục, địa điểm, đề xuất và báo cáo vi phạm.
- **FR-ADM-02:** Dashboard phân tích bằng MongoDB Aggregation: Tổng số địa điểm, tổng reviews, rating trung bình toàn hệ thống, Top 10, phân bố theo danh mục và khu vực.
- **FR-ADM-03:** Trực quan hóa và đối chiếu trực tiếp cấu trúc document nhúng trên MongoDB Compass khi demo nghiệm thu.

---

## 3. Yêu Cầu Phi Chức Năng (Non-Functional Requirements - NFR)

1. **NFR-01 Bảo mật:** Mã hóa băm mật khẩu bằng thuật ngữ công nghiệp (BCrypt); Xác thực JWT an toàn; Kiểm tra token Google OAuth ở backend; CORS giới hạn origin; không commit connection strings, secret keys lên git.
2. **NFR-02 Riêng tư:** Dữ liệu Favorites và View History thuộc quyền riêng tư của cá nhân; không công khai cho người dùng khác; hỗ trợ xóa lịch sử.
3. **NFR-03 Toàn vẹn dữ liệu:** Bảo đảm bất biến 1 review active per member/place; kiểm tra phân quyền sở hữu nội dung (owner check) ở server; không để lọt tầng 3 comment; tính toán lại rating chính xác sau thao tác xóa.
4. **NFR-04 Khả năng kiểm thử & Giám sát:** API trả mã lỗi HTTP chuẩn mực (200, 201, 400, 401, 403, 404, 409, 422); logging không lưu trữ token/mật khẩu; có kịch bản Postman và truy vấn Compass chứng minh Index/Aggregation execution stats.
5. **NFR-08 Trải nghiệm người dùng:** Giao diện responsive trên Desktop và Mobile; thông báo lỗi rõ ràng; tải trang nhanh và bản đồ tương tác mượt mà.
