# Hướng Dẫn Tải File Task Lên Jira Web (Phiên Bản 33 Tasks Toàn Diện Theo Chức Năng)

File task gồm **33 Tasks chức năng hoàn chỉnh** (chia đều **11 tasks cho mỗi thành viên**), thể hiện đầy đủ mọi phân hệ nghiệp vụ từ Backend, CSDL NoSQL, Giao diện người dùng đến Kiểm thử & Báo cáo.

---

## 1. Vị Trí File Import
- Đường dẫn: [jira_tasks_import.csv](file:///d:/Study/2026/Nam04_HK1/noSQL_T.Binh/DT04_TravelReview/jira_tasks_import.csv) (hoặc [docs/jira/jira_tasks_import.csv](file:///d:/Study/2026/Nam04_HK1/noSQL_T.Binh/DT04_TravelReview/docs/jira/jira_tasks_import.csv))

---

## 2. Bảng Phân Công 33 Task Theo Chức Năng & 3 Thành Viên

| Thành viên | Phân hệ phụ trách chính | Số Task |
|---|---|:---:|
| **SV1 - Backend & Data Architect** | **CSDL Cốt lõi & Backend API**: Schema MongoDB, Auth JWT/BCrypt, Google OAuth, Hồ sơ cá nhân, Danh mục CRUD, Địa điểm CRUD, Quy trình duyệt đề xuất, Đăng review 1 active/place, Sửa review 7 ngày & Xóa Hard Delete, Bình luận lồng 2 tầng, Báo cáo đồ án Schema. | **11 Tasks** |
| **SV2 - Advanced NoSQL & DB** | **NoSQL Nâng cao & CSDL Mở rộng**: Tương tác Like/Unlike, Báo cáo vi phạm (Report), Yêu thích & Lịch sử xem, Text Search Index, 2dsphere Bản đồ Gần tôi, Compound Index ESR, Aggregation Rating, Top 10 Leaderboard, Admin Dashboard Facet, Redis Cache-Aside & Rate Limiting, Neo4j Graph Recommendation. | **11 Tasks** |
| **SV3 - Fullstack & QA DevOps (Nguyễn Kim Long)** | **Giao diện Web, Dữ liệu Mẫu & QA**: Docker Compose, Script sinh 100 Địa điểm thật & 1,000 Reviews demo, UI Auth & Google Sign-In, UI Bản đồ Leaflet GPS, UI Chi tiết & Review 5 ảnh Cloudinary, UI Bình luận 2 tầng & Social, UI Ghim Marker đề xuất địa điểm, UI Admin Portal, UI Trang cá nhân, Postman & Concurrency Test, Slide & Demo bảo vệ. | **11 Tasks** |

---

## 3. Các Bước Import Nhanh Trên Jira

1. Tải lên file [jira_tasks_import.csv](file:///d:/Study/2026/Nam04_HK1/noSQL_T.Binh/DT04_TravelReview/jira_tasks_import.csv).
2. Tại bước **Map fields**:
   - `Issue Id` ➜ **Work item id** (hoặc bỏ chọn)
   - `Issue Type` ➜ **Work Type** (hoặc Issue Type)
   - `Summary` ➜ **Summary**
   - `Description` ➜ **Description**
   - `Assignee` ➜ **Assignee**
   - `Priority` ➜ **Priority**
   - `Labels` ➜ **Labels**
   - `Status` ➜ **Status**
3. Tại bước **Map values**:
   - Gán `SV1`, `SV2`, `SV3` tương ứng với tài khoản Jira của 3 bạn.
4. Bấm **Begin Import** ➜ Hoàn tất!
