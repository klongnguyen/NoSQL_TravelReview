# NoSQL Travel Review

**Đề tài 04 — Nền tảng đánh giá và review địa điểm du lịch / ăn uống**

> Trạng thái: **Requirements baseline SRS v1.0 đã chốt (22/10/2026)**. Các chức năng mô tả bên dưới là **phạm vi dự kiến triển khai**, không phải tính năng đã hoàn thành.

## 1. Giới thiệu

NoSQL Travel Review là nền tảng cộng đồng khám phá, tìm kiếm và đánh giá các địa điểm du lịch/ăn uống tại **TP. Hồ Chí Minh** trong giai đoạn đầu, với cấu trúc dữ liệu sẵn sàng mở rộng đến các tỉnh/thành khác về sau.

Đồ án học phần NoSQL, nhóm **03 sinh viên**. Trọng tâm đáp ứng rubric là MongoDB với **embedded reviews/comments, CRUD, Text/Compound Index, Aggregation Pipeline, dummy data và kiểm thử hiệu năng**.

## 2. Công nghệ và kiến trúc

| Thành phần | Công nghệ | Vai trò |
|---|---|---|
| Frontend | React | SPA, giao diện khám phá địa điểm, review, dashboard |
| Backend | ASP.NET Core Web API (mô hình MVC: Controllers → Services → Repositories; React đóng vai trò View) | HTTP API, xác thực, validation, phân quyền, nghiệp vụ |
| Database chính | **MongoDB** | Nguồn dữ liệu gốc (Source of Truth) |
| Database phụ trợ P1 | **Neo4j** | Hybrid Recommendation dựa trên hành vi và thuộc tính địa điểm |
| Bản đồ | Leaflet + OpenStreetMap / nhà cung cấp tile tương thích | Map markers, nearby |
| Hình ảnh | Cloudinary hoặc dịch vụ tương đương | Lưu tệp; MongoDB lưu URL/metadata |
| Đăng nhập | Email/mật khẩu và Google OAuth | Xác thực thành viên |
| Deployment | Local demo trước; React frontend trên Vercel nếu triển khai online | ASP.NET Core API cần runtime/host .NET riêng phù hợp |

**Không triển khai Redis trong baseline hiện tại.** MongoDB vẫn hoạt động độc lập khi Neo4j không khả dụng.

## 3. Phạm vi chức năng đã chốt

### P0 — MVP / bắt buộc

- **Guest** xem, tìm kiếm, lọc và khám phá địa điểm công khai theo từ khóa, danh mục, khu vực, rating; hiển thị trên bản đồ và tìm gần tôi.
- **Member** đăng ký/đăng nhập email/mật khẩu hoặc Google OAuth, quản lý hồ sơ cá nhân.
- **Danh mục động** do Admin quản lý; mỗi địa điểm chỉ thuộc **một danh mục chính**.
- **Đề xuất địa điểm mới / đề xuất chỉnh sửa:** Member nhập vị trí trên bản đồ, hệ thống kiểm tra nghi trùng; Admin phê duyệt/từ chối trước khi cập nhật dữ liệu chính.
- **Review:** 1–5 sao, tối đa 5 ảnh; mỗi thành viên có tối đa **1 review đang hoạt động/địa điểm**; sửa trong **7 ngày kể từ lần đăng đầu**, xóa bất kỳ lúc nào và được viết lại sau khi xóa.
- **Comment:** tối đa **2 tầng** (comment → reply), không cho tầng 3.
- **Tương tác:** like/unlike review và comment; report review/comment.
- **Kiểm duyệt:** review hợp lệ hiển thị ngay; Admin xử lý report và **xóa vĩnh viễn** nội dung vi phạm, không khôi phục.
- **Favorites và View History:** Member lưu địa điểm yêu thích, lịch sử xem được giữ không có thời hạn TTL tự động và có chức năng xóa thủ công.
- **MongoDB:** embedded reviews/comments, Text/Compound Index, 2dsphere cho nearby, Aggregation tự tính rating average/review count và Top 10 địa điểm.
- **Dashboard Admin** và kiểm thử dữ liệu/query/tải.

### P1 — Neo4j sau MVP

- Đồng bộ graph User–Place–Category và tín hiệu xem, yêu thích, đánh giá từ MongoDB.
- **Hybrid Recommendation** kết hợp tương đồng hành vi và thuộc tính địa điểm.
- Cold-start recommendation khi chưa có lịch sử.
- Neo4j có thể gián đoạn mà không chặn nghiệp vụ chính MongoDB.

### Ngoài phạm vi

Booking, thanh toán, đặt vé/tour, chat, vai trò chủ địa điểm, triển khai toàn quốc ngay trong MVP, Redis.

## 4. Bộ dữ liệu phục vụ bảo vệ

- Mục tiêu **100 địa điểm thực ở TP.HCM** (theo yêu cầu đề bài: 50–100).
- Mỗi địa điểm có **5–15 review giả lập** để kiểm thử/demo.
- **Review giả lập phải được đánh dấu rõ là dữ liệu mẫu**, không thể hiện như trải nghiệm thật của khách hàng.
- Demo đầy đủ CRUD, embedded documents trên MongoDB Compass, Text/Compound Index, rating/count Aggregation, Top 10 và kiểm thử nhiều lượt review đồng thời.

## 5. SRS và Product Backlog

**Nguồn yêu cầu chuẩn (source of truth):** [SRS_Travel_Review_noSQL — Google Docs](https://docs.google.com/document/d/1ZJytVDFOTnUZPPHa25hPQRL2G9sKMq8dlNfXbOH4mvY/edit)

SRS v1.0 gồm:

1. Giới thiệu, phạm vi và đối tượng
2. Use Case và luồng nghiệp vụ
3. Functional Requirements / Business Rules
4. Data Requirements: MongoDB / Neo4j
5. Non-functional Requirements
6. API contract định hướng
7. Testing, nghiệm thu và đối chiếu rubric
8. **Product Backlog: 8 Epic, 34 User Stories** (P0/P1, Story Points dự kiến, Sprint đề xuất, Acceptance Criteria)
9. Traceability Matrix

Kế hoạch thực hiện chi tiết: [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md).

## 6. Quản lý dự án và teamwork evidence

- [GitHub Project — Main Board / By Member / Current Sprint / Roadmap](https://github.com/users/klongnguyen/projects/1)
- [Issues](https://github.com/klongnguyen/NoSQL_TravelReview/issues) để quản lý công việc, milestone, nhãn và người phụ trách.
- [Pull Requests](https://github.com/klongnguyen/NoSQL_TravelReview/pulls) làm bằng chứng branch, commit, review và merge.
- Mỗi User Story cần được chuyển thành GitHub Issue trong quá trình sprint planning; **các US trong SRS không mặc nhiên là Issue đã được tạo**.

Quy trình: **Backlog → Ready → In Progress → Review → Done**. Code trên nhánh riêng, tạo Pull Request gắn với Issue và có reviewer khác người thực hiện.

## 7. Cách chạy dự án

Các bước chạy cụ thể sẽ được cập nhật khi backend/frontend được triển khai. **Chưa công bố lệnh chạy giả định hoặc link production chưa tồn tại.**

Hướng demo: chạy local trước; khi triển khai online, frontend React deploy qua Vercel, backend ASP.NET Core chạy trên nền tảng hỗ trợ .NET và kết nối an toàn tới MongoDB / Neo4j.

## 8. Tiêu chí nghiệm thu chính

- MongoDB là DB chính; chứng minh cấu trúc JSON Embedded Reviews/Comments.
- CRUD địa điểm/danh mục/review/comment, đề xuất và duyệt hoạt động.
- Text/Compound Index và Aggregation rating/count được giải thích và kiểm thử.
- Dữ liệu mẫu đáp ứng số lượng yêu cầu, có phân biệt review giả lập.
- Có bằng chứng kiểm thử đồng thời và demo trực quan.
- Neo4j chỉ là module ưu tiên P1 và không thay thế các tiêu chí MongoDB của học phần.

---

Tài liệu mô tả **phạm vi và kế hoạch**, không tuyên bố hệ thống đã có các tính năng nêu trên.
