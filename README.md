<<<<<<< HEAD
# Nền Tảng Đánh Giá & Review Địa Điểm Du Lịch / Ăn Uống (NoSQL Travel Review)

[![.NET 9](https://img.shields.io/badge/.NET-9.0-blue.svg)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green.svg)](https://www.mongodb.com/)
[![SRS Version](https://img.shields.io/badge/SRS-Baseline%201.0-orange.svg)](#)

> **Học phần:** Cơ sở dữ liệu NoSQL — **Đề tài 04**  
> **Nhóm thực hiện:** 03 sinh viên  
> **Phạm vi triển khai:** TP. Hồ Chí Minh (Sẵn sàng mở rộng toàn quốc)  
> **Nguồn dữ liệu chuẩn (Source of Truth):** MongoDB (Document Store)  
> **Hệ cơ sở dữ liệu mở rộng (P1):** Neo4j (Hybrid Recommendation Engine)

---

## 1. Giới thiệu tổng quan

Hệ thống cung cấp nền tảng cộng đồng trực tuyến cho phép người dùng khám phá, tìm kiếm địa điểm du lịch và quán ăn tại TP.HCM, xem thông tin chi tiết, tọa độ địa lý trên bản đồ, đăng bài đánh giá (1–5 sao), đính kèm hình ảnh và bình luận thảo luận đa cấp (tối đa 2 tầng: Comment → Reply).

### Điểm đặc trưng về CSDL NoSQL (MongoDB):
- **Mô hình nhúng (Embedded Document):** Mỗi tài liệu `places` nhúng trực tiếp mảng các bài đánh giá `reviews[]`, trong mỗi review nhúng các bình luận `comments[]`, và trong mỗi comment nhúng các phản hồi `replies[]`.
- **Geospatial 2dsphere Index:** Tối ưu hóa truy vấn tìm kiếm các địa điểm xung quanh vị trí hiện tại ("Gần tôi" / Nearby Places).
- **Text Search Index:** Tìm kiếm toàn văn nhanh chóng theo tên địa điểm và nội dung mô tả.
- **Aggregation Pipelines:** Tự động tính toán điểm trung bình (`ratingAverage`), số lượng review (`reviewCount`), thống kê Top 10 và Admin Analytics.
- **Bất biến & Toàn vẹn:** Giới hạn mỗi người dùng chỉ có 1 bài đánh giá đang hoạt động trên một địa điểm, chỉnh sửa review trong 7 ngày, xóa vĩnh viễn (Hard Delete) không để lại orphan records.

---

## 2. Kiến trúc hệ thống (Architecture)

```text
React SPA (View - Vite) 
   │
   ▼ HTTPS / REST API
ASP.NET Core 9 Web API (Controllers → Services → Repositories / DTOs)
   │
   ├── MongoDB (Source of Truth: Users, Categories, Places with Embedded Reviews/Comments)
   │
   └── Neo4j (Bonus P1: Hybrid Recommendation Engine dựa trên đồ thị quan hệ)
```

---

## 3. Cấu trúc thư mục (Project Structure)

```text
DT04_TravelReview/
├── .github/                       # GitHub Templates quản lý dự án (SRS Section 13)
│   ├── ISSUE_TEMPLATE/            # Feature request, Bug report templates
│   └── pull_request_template.md   # PR review checklist
├── backend/                       # ASP.NET Core 9 Web API
│   ├── Controllers/               # Auth, Places, Categories REST endpoints
│   ├── Models/                    # C# BSON Entities (Place, Review, Comment, User...)
│   ├── DTOs/                      # Data Transfer Objects & Input Validations
│   ├── Services/                  # Business Logic, Atomic Concurrency, Aggregation
│   ├── Repositories/              # MongoDbContext strongly-typed collections
│   └── Program.cs                 # JWT Auth, CORS, DI, Swagger UI config
├── frontend/                      # React SPA (Vite)
│   ├── src/
│   │   ├── services/api.js        # Axios API client
│   │   ├── App.jsx                # UI Khám phá, Tìm kiếm, Modal Embedded Review 2 tầng
│   │   └── index.css              # Design System hiện đại (Vanilla CSS)
│   └── package.json
├── database/                      # Scripts khởi tạo và đặc tả CSDL
│   └── mongodb/
│       ├── init-mongo.js          # Script tự động tạo Collections, Validators, Indexes, Seed data
│       └── schema.md              # Tài liệu thiết kế chi tiết Document DB & Aggregation
├── docs/                          # Tài liệu phân tích và kiến trúc
│   ├── analysis/
│   │   ├── requirements.md        # Đặc tả chức năng (FR) và phi chức năng (NFR)
│   │   └── business-flow.md       # Các luồng nghiệp vụ cốt lõi & Sequence Diagrams
│   └── architecture/
│       └── architecture.md        # Kiến trúc tổng thể và API contracts
├── docker-compose.yml             # Môi trường chạy MongoDB, Neo4j, Redis
├── SRS_Travel_Review_noSQL.pdf    # Tài liệu SRS Baseline 1.0 chính thức
└── README.md
```

---

## 4. Hướng dẫn khởi chạy cục bộ (Local Runbook)

### Yêu cầu tiên quyết:
- **Docker Desktop** (hoặc Docker Engine).
- **.NET 9.0 SDK**.
- **Node.js** (v18 trở lên).

### Bước 1: Khởi động CSDL MongoDB qua Docker Compose
```bash
# Khởi động dịch vụ MongoDB
docker compose up -d mongodb
```
*Ghi chú:* Script `database/mongodb/init-mongo.js` sẽ được tự động kích hoạt để khởi tạo cơ sở dữ liệu `travel_review`, tạo đầy đủ JSON Schema Validator, 2dsphere index, text index và seed dữ liệu mẫu ban đầu.

### Bước 2: Khởi chạy Backend ASP.NET Core 9 Web API
```bash
cd backend
dotnet restore
dotnet run
```
- API sẽ lắng nghe tại: `http://localhost:5000` (hoặc cổng cấu hình).
- Xem và kiểm thử API trực quan qua **Swagger UI**: `http://localhost:5000/swagger`

### Bước 3: Khởi chạy Frontend React
Mở một terminal mới:
```bash
cd frontend
npm install
npm run dev
```
- Truy cập giao diện ứng dụng tại: `http://localhost:5173`

---

## 5. Tài khoản thử nghiệm (Test Credentials)

| Vai trò (Role) | Email | Mật khẩu | Quyền hạn |
|---|---|---|---|
| **Admin** | `admin@travelreview.vn` | `Admin@123` | Quản trị danh mục, địa điểm, duyệt đề xuất, xem Dashboard |
| **Member** | `traveler@travelreview.vn` | `Member@123` | Đăng review, bình luận 2 tầng, like, lưu favorites |

---

## 6. Ma trận phân công nhiệm vụ (Theo SRS 1.0)

| Thành viên | Vai trò | Trách nhiệm chính |
|---|---|---|
| **SV1** | MongoDB Data Architect & CRUD Lead | Thiết kế Schema Document DB, CRUD Places, Categories, Embedded Reviews, Concurrency Control |
| **SV2** | Advanced Query & Neo4j Specialist | MongoDB Indexes (Text, Compound, 2dsphere), Aggregation Pipelines, Recommendation P1 |
| **SV3** | Frontend, Seed Data & Testing Lead | React SPA, Leaflet Map, Seed dữ liệu thực tế TP.HCM, Kiểm thử tải & Demo Script |
=======
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
>>>>>>> 5e758ed55ddf3cfc9cfeac49d8301ca46eb00932
