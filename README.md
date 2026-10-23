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