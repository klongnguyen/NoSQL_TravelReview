# KẾ HOẠCH THỰC HIỆN ĐỒ ÁN NoSQL – ĐỀ TÀI 04

## 1. Thông tin chung

**Đề tài:** Nền tảng đánh giá và review địa điểm du lịch / ăn uống  
**Số lượng thành viên:** 03 sinh viên  
**CSDL chính:** MongoDB  
**CSDL bổ trợ:** Redis và/hoặc Neo4j nếu cần  
**Hướng triển khai:** MongoDB là Source of Truth; Redis dùng cho cache/rate limit; Neo4j dùng cho recommendation.

---

## 2. Mục tiêu hệ thống

Xây dựng một nền tảng cộng đồng cho phép:

- Đăng ký, đăng nhập người dùng.
- Quản lý địa điểm du lịch / ăn uống.
- Tìm kiếm địa điểm theo từ khóa, danh mục, khu vực, rating.
- Xem chi tiết địa điểm.
- Chấm điểm từ 1–5 sao.
- Viết review.
- Đính kèm hình ảnh vào review.
- Bình luận vào review.
- Trả lời bình luận nhiều cấp.
- Tự động tính rating trung bình và số lượng review.
- Hiển thị Top địa điểm nổi bật.
- Quản trị người dùng, địa điểm, review.
- Thống kê trên Dashboard Admin.
- Mở rộng bằng Redis để cache / rate limiting.
- Mở rộng bằng Neo4j để gợi ý địa điểm dựa trên hành vi người dùng.

---

# 3. Kiến trúc tổng thể

```text
Frontend
   │
   ▼
Backend API
   │
   ├── MongoDB  ← CSDL chính / Source of Truth
   │
   ├── Redis    ← Cache / Session / Rate Limiting
   │
   └── Neo4j    ← Recommendation Engine
```

## Vai trò từng hệ CSDL

| Database | Vai trò | Mức ưu tiên |
|---|---|---|
| MongoDB | Users, Places, Reviews, Comments, Rating, Images metadata | P0 - Bắt buộc |
| Redis | Cache dữ liệu đọc nhiều, rate limiting, session | P1 - Nên làm |
| Neo4j | Recommendation dựa trên quan hệ User–Place | P2 - Bonus |

---

# 4. Phân công vai trò nhóm

| Thành viên | Vai trò chính | Phạm vi |
|---|---|---|
| SV1 | Data Architect & CRUD Lead | MongoDB Schema, CRUD Place, Review, Comment |
| SV2 | Advanced Query Specialist | Index, Aggregation Pipeline, Redis, Neo4j |
| SV3 | Fullstack Integrator & DB Tester | Dummy Data, Frontend, Dashboard, Testing, Demo |

> Lưu ý: Cả 3 thành viên đều phải hiểu MongoDB Schema, Index và Aggregation để có thể bảo vệ chéo.

---

# 5. Quy trình quản lý dự án trên GitHub

Mỗi công việc phải đi theo luồng:

```text
Requirement
   ↓
GitHub Issue
   ↓
Assignee
   ↓
Branch
   ↓
Commit
   ↓
Pull Request
   ↓
Review
   ↓
Merge
   ↓
Issue Done
```

Không giao việc chỉ bằng tin nhắn cá nhân.  
Mỗi task quan trọng phải tồn tại dưới dạng GitHub Issue.

---

# 6. GitHub Project Board

## Trạng thái

| Status | Ý nghĩa |
|---|---|
| Backlog | Ý tưởng / task chưa sẵn sàng |
| Ready | Task đã rõ yêu cầu và có thể bắt đầu |
| In Progress | Đang thực hiện |
| Review | Đã hoàn thành code, chờ review/test |
| Done | Hoàn tất và đã merge / nghiệm thu |

## Custom Fields

| Field | Giá trị gợi ý |
|---|---|
| Status | Backlog / Ready / In Progress / Review / Done |
| Assignee | SV1 / SV2 / SV3 |
| Priority | P0 / P1 / P2 |
| Module | MongoDB / Backend / Frontend / Redis / Neo4j / Test / Docs |
| Type | Feature / Bug / Research / Documentation / Test |
| Sprint | Sprint 0, Sprint 1, Sprint 2... |
| Estimate | 1 / 2 / 3 / 5 / 8 Story Points |
| Start Date | Ngày bắt đầu |
| Target Date | Deadline |

---

# 7. Label chuẩn

```text
type:feature
type:bug
type:research
type:documentation
type:test

area:mongodb
area:backend
area:frontend
area:redis
area:neo4j
area:test
area:docs
area:devops

priority:P0
priority:P1
priority:P2
```

### Ý nghĩa Priority

- **P0:** bắt buộc để đáp ứng rubric / hệ thống cốt lõi.
- **P1:** nên có để tăng chất lượng đồ án.
- **P2:** mở rộng / bonus.

---

# 8. Milestone

| Milestone | Nội dung |
|---|---|
| M1 | Analysis & Architecture |
| M2 | MongoDB Core |
| M3 | Backend API |
| M4 | Advanced MongoDB |
| M5 | Frontend Integration |
| M6 | Redis Integration |
| M7 | Neo4j Recommendation |
| M8 | Testing |
| M9 | Final Report & Demo |

---

# 9. Kế hoạch thực hiện chi tiết

## PHASE 0 – Project Management Setup

### Mục tiêu
Thiết lập môi trường cộng tác và cơ chế quản lý tiến độ.

| ID | Công việc | Owner | Priority | Deliverable | GitHub Evidence |
|---|---|---|---|---|---|
| PM-01 | Tạo GitHub Repository | SV3 | P0 | Repo chung của nhóm | Repository |
| PM-02 | Add Collaborators | SV3 | P0 | 3 thành viên có quyền truy cập | Collaborator list |
| PM-03 | Tạo GitHub Project | SV3 | P0 | Kanban Board | Project Board |
| PM-04 | Tạo labels | SV3 | P0 | Bộ labels chuẩn | Labels |
| PM-05 | Tạo milestones | SV3 | P0 | M1 → M9 | Milestones |
| PM-06 | Tạo Issue Template | SV3 | P1 | Feature/Bug template | `.github/ISSUE_TEMPLATE` |
| PM-07 | Tạo Pull Request Template | SV3 | P1 | Checklist PR | `.github/pull_request_template.md` |
| PM-08 | Thiết lập quy tắc branch / PR | Cả nhóm | P1 | Workflow thống nhất | PR history |
| PM-09 | Tạo README ban đầu | SV3 | P0 | Mô tả đề tài và thành viên | README.md |

### Definition of Done

- Repository tồn tại.
- 3 thành viên đã được add.
- Project Board hoạt động.
- Có labels và milestones.
- Mọi task mới được tạo bằng Issue.

---

# PHASE 1 – Phân tích bài toán & kiến trúc

### Mục tiêu
Xác định phạm vi trước khi code.

| ID | Công việc | Owner | Priority | Deliverable |
|---|---|---|---|---|
| AN-01 | Phân tích yêu cầu đề tài | Cả nhóm | P0 | Requirement document |
| AN-02 | Xác định Actor | SV1 | P0 | User/Admin |
| AN-03 | Functional Requirements | SV1 | P0 | Danh sách chức năng |
| AN-04 | Non-functional Requirements | SV3 | P1 | Performance/Security |
| AN-05 | Use Case Diagram | SV3 | P0 | Use Case |
| AN-06 | Business Flow | SV1 | P0 | Flow chính |
| AN-07 | Thiết kế Architecture V1 | SV2 | P0 | Architecture Diagram |
| AN-08 | Xác định vai trò MongoDB/Redis/Neo4j | SV2 | P0 | Architecture Decision |

### Deliverables

```text
docs/
└── analysis/
    ├── requirements.md
    ├── use-case.md
    ├── business-flow.md
    └── architecture.md
```

---

# PHASE 2 – MongoDB Data Modeling

### Mục tiêu
Thiết kế CSDL đáp ứng đúng yêu cầu Document Store.

## Collections chính

```text
users
places
categories
```

## Embedded Data

```text
places
 ├── address
 ├── location
 ├── images[]
 ├── tags[]
 └── reviews[]
      ├── images[]
      └── comments[]
           └── replies[]
```

### Công việc

| ID | Công việc | Owner | Priority | Deliverable |
|---|---|---|---|---|
| DB-01 | Thiết kế User Schema | SV1 | P0 | JSON Schema |
| DB-02 | Thiết kế Category Schema | SV1 | P0 | JSON Schema |
| DB-03 | Thiết kế Place Schema | SV1 | P0 | JSON Schema |
| DB-04 | Thiết kế Embedded Reviews | SV1 | P0 | Review model |
| DB-05 | Thiết kế Comments/Replies | SV1 | P0 | Nested model |
| DB-06 | Phân tích Embedding vs Referencing | SV2 | P0 | ADR / Report section |
| DB-07 | Validation Schema | SV2 | P1 | MongoDB validator |
| DB-08 | Tạo database trên MongoDB | SV1 | P0 | MongoDB DB |
| DB-09 | Kiểm thử schema trên Compass | SV3 | P0 | Screenshots/Test |

### Deliverables

```text
database/
└── mongodb/
    ├── schema.md
    ├── validators.js
    └── sample-documents.json
```

---

# PHASE 3 – Dummy Data

### Mục tiêu
Đạt và vượt mức dữ liệu mẫu tối thiểu.

### Target Data

| Loại | Số lượng |
|---|---:|
| Places | 100 |
| Users | 30–50 |
| Reviews | Khoảng 1,000 |
| Comments | Khoảng 2,000 |
| Categories | 4–8 |

### Công việc

| ID | Công việc | Owner | Priority |
|---|---|---|---|
| DATA-01 | Generate Users | SV3 | P0 |
| DATA-02 | Generate Categories | SV3 | P0 |
| DATA-03 | Generate Places | SV3 | P0 |
| DATA-04 | Generate Reviews | SV3 | P0 |
| DATA-05 | Generate Comments | SV3 | P0 |
| DATA-06 | Validate data quality | SV1 + SV3 | P0 |
| DATA-07 | Import/Export bằng Compass | SV3 | P0 |

---

# PHASE 4 – Backend CRUD

### Mục tiêu
Hoàn thiện nghiệp vụ cốt lõi bằng API.

| ID | API / Module | Owner | Priority |
|---|---|---|---|
| API-01 | Register | SV1 | P0 |
| API-02 | Login | SV1 | P0 |
| API-03 | User Profile | SV1 | P1 |
| API-04 | Category CRUD | SV1 | P0 |
| API-05 | Place CRUD | SV1 | P0 |
| API-06 | Create Review | SV1 | P0 |
| API-07 | Update Review | SV1 | P0 |
| API-08 | Delete Review | SV1 | P0 |
| API-09 | Create Comment | SV1 | P0 |
| API-10 | Reply Comment | SV1 | P0 |
| API-11 | Delete Comment | SV1 | P1 |
| API-12 | Authorization / Admin | SV1 + SV3 | P1 |

### Mốc hoàn thành

Toàn bộ chức năng cốt lõi có thể chạy bằng Postman trước khi tích hợp Frontend.

---

# PHASE 5 – Advanced MongoDB

### Mục tiêu
Đáp ứng phần nâng cao đặc trưng của đề tài.

## Index

| ID | Công việc | Owner | Priority |
|---|---|---|---|
| IDX-01 | Text Index | SV2 | P0 |
| IDX-02 | Compound Index | SV2 | P0 |
| IDX-03 | 2dsphere Index | SV2 | P1 |
| IDX-04 | Test query trước/sau Index | SV2 + SV3 | P1 |

## Aggregation

| ID | Pipeline | Owner | Priority |
|---|---|---|---|
| AGG-01 | Rating Average | SV2 | P0 |
| AGG-02 | Review Count | SV2 | P0 |
| AGG-03 | Top 10 Places | SV2 | P0 |
| AGG-04 | Statistics by Category | SV2 | P1 |
| AGG-05 | Rating Distribution | SV2 | P1 |
| AGG-06 | Reviews by Month | SV2 | P1 |
| AGG-07 | Admin Dashboard Pipeline | SV2 | P1 |

### Mốc hoàn thành

MongoDB một mình đã đáp ứng toàn bộ yêu cầu bắt buộc của đề tài.

---

# PHASE 6 – Frontend Integration

### Mục tiêu
Hoàn thiện giao diện sử dụng thực tế.

| ID | Trang | Owner | Priority |
|---|---|---|---|
| FE-01 | Login/Register | SV3 | P0 |
| FE-02 | Home | SV3 | P0 |
| FE-03 | Search Places | SV3 | P0 |
| FE-04 | Place Detail | SV3 | P0 |
| FE-05 | Write Review | SV3 | P0 |
| FE-06 | Comment / Reply UI | SV3 | P0 |
| FE-07 | User Profile | SV3 | P1 |
| FE-08 | Admin Place Management | SV3 | P0 |
| FE-09 | Admin Review Management | SV3 | P1 |
| FE-10 | Dashboard | SV3 + SV2 | P1 |
| FE-11 | Nearby Places | SV3 + SV2 | P1 |

---

# PHASE 7 – Redis Integration

### Mục tiêu
Tăng hiệu năng và bổ sung cơ chế bảo vệ API.

| ID | Công việc | Owner | Priority |
|---|---|---|---|
| REDIS-01 | Setup Redis | SV2 | P1 |
| REDIS-02 | Cache-Aside Pattern | SV2 | P1 |
| REDIS-03 | Cache Place Detail | SV2 | P1 |
| REDIS-04 | Cache Top Places | SV2 | P1 |
| REDIS-05 | Cache Invalidation | SV2 | P1 |
| REDIS-06 | Rate Limiting | SV2 | P1 |
| REDIS-07 | Benchmark MongoDB vs Redis | SV2 + SV3 | P1 |

### Nguyên tắc

Redis không lưu dữ liệu gốc.  
Nếu Redis bị tắt, hệ thống vẫn phải hoạt động bằng MongoDB.

---

# PHASE 8 – Neo4j Recommendation

### Mục tiêu
Xây dựng recommendation như phần mở rộng.

## Graph Model

```text
(User)-[:REVIEWED]->(Place)
(User)-[:LIKED]->(Place)
(Place)-[:IN_CATEGORY]->(Category)
(Place)-[:LOCATED_IN]->(City)
```

### Công việc

| ID | Công việc | Owner | Priority |
|---|---|---|---|
| NEO-01 | Setup Neo4j | SV2 | P2 |
| NEO-02 | Thiết kế Graph Schema | SV2 | P2 |
| NEO-03 | Sync User/Place basic data | SV2 | P2 |
| NEO-04 | Tạo REVIEWED relationship | SV2 | P2 |
| NEO-05 | Similar User Query | SV2 | P2 |
| NEO-06 | Recommendation Query | SV2 | P2 |
| NEO-07 | Recommendation API | SV2 | P2 |
| NEO-08 | Frontend Recommendation | SV3 | P2 |

---

# PHASE 9 – Testing & Performance

### Mục tiêu
Kiểm thử chức năng, dữ liệu và hiệu năng.

| ID | Test | Owner | Priority |
|---|---|---|---|
| TEST-01 | API Functional Test | SV3 | P0 |
| TEST-02 | MongoDB Query Test | SV2 | P0 |
| TEST-03 | Aggregation Accuracy Test | SV2 | P0 |
| TEST-04 | Concurrent Review Test | SV3 | P0 |
| TEST-05 | Search Performance | SV2 + SV3 | P1 |
| TEST-06 | Index Benchmark | SV2 | P1 |
| TEST-07 | Redis Cache Benchmark | SV2 + SV3 | P1 |
| TEST-08 | Security / Rate Limit Test | SV3 | P1 |
| TEST-09 | Bug Fixing Sprint | Cả nhóm | P0 |

---

# PHASE 10 – Báo cáo & Demo

### Mục tiêu
Chuẩn bị đầy đủ bằng chứng kỹ thuật và bằng chứng làm việc nhóm.

| ID | Công việc | Owner | Priority |
|---|---|---|---|
| DOC-01 | Viết phần phân tích MongoDB | SV1 | P0 |
| DOC-02 | Viết phần Schema | SV1 | P0 |
| DOC-03 | Viết phần Index/Aggregation | SV2 | P0 |
| DOC-04 | Viết phần Redis/Neo4j | SV2 | P1 |
| DOC-05 | Viết phần Testing | SV3 | P0 |
| DOC-06 | Architecture Diagram | SV3 | P0 |
| DOC-07 | Chuẩn bị Demo Script | Cả nhóm | P0 |
| DOC-08 | Tổng hợp GitHub Evidence | SV3 | P0 |
| DOC-09 | Rehearsal Demo | Cả nhóm | P0 |

---

# 10. Sprint gợi ý

| Sprint | Trọng tâm |
|---|---|
| Sprint 0 | GitHub Setup & Planning |
| Sprint 1 | Analysis & Architecture |
| Sprint 2 | MongoDB Schema & Dummy Data |
| Sprint 3 | Backend CRUD |
| Sprint 4 | Advanced MongoDB |
| Sprint 5 | Frontend Integration |
| Sprint 6 | Redis |
| Sprint 7 | Neo4j |
| Sprint 8 | Testing & Bug Fix |
| Sprint 9 | Report & Demo |

---

# 11. Quy tắc Issue

Mỗi công việc = một Issue.

## Issue Template

```markdown
## Description

Mô tả công việc.

## Requirements

- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Acceptance Criteria

- [ ] Code hoạt động
- [ ] Có test
- [ ] Không ảnh hưởng chức năng cũ
- [ ] Có screenshot/Postman evidence nếu cần
- [ ] Pull Request được review

## Evidence

- Screenshot:
- Postman:
- MongoDB Compass:
- Benchmark:
```

---

# 12. Quy tắc Branch

Không code trực tiếp lên `main`.

## Format

```text
feature/<issue-id>-<short-name>
fix/<issue-id>-<short-name>
docs/<issue-id>-<short-name>
test/<issue-id>-<short-name>
```

## Ví dụ

```text
feature/14-review-api
feature/18-rating-aggregation
fix/27-review-validation
docs/35-architecture
```

---

# 13. Quy tắc Commit

Khuyến nghị theo Conventional Commits.

```text
feat(review): implement create review API #14
feat(mongodb): add rating aggregation #18
fix(auth): validate expired token #27
docs(architecture): update system diagram #35
test(review): add concurrent request test #42
```

---

# 14. Quy tắc Pull Request

Mỗi PR phải:

- Link đến Issue.
- Có mô tả thay đổi.
- Có checklist test.
- Được ít nhất 1 thành viên khác review.
- Không tự merge khi chưa review nếu chưa thật sự cần thiết.

## PR Template

```markdown
## Related Issue

Closes #

## Changes

- 
- 
- 

## Testing

- [ ] Local test passed
- [ ] API test passed
- [ ] Database test passed
- [ ] No regression found

## Evidence

Screenshot / Postman / Compass:
```

---

# 15. Weekly Progress

Mỗi tuần tạo một Issue:

```text
Weekly Report – Week XX
```

## Template

```markdown
## Mục tiêu tuần

- 
- 
- 

## SV1

### Completed
-

### In Progress
-

### Blocked
-

## SV2

### Completed
-

### In Progress
-

### Blocked
-

## SV3

### Completed
-

### In Progress
-

### Blocked
-

## Tổng kết

Completed:
In Progress:
Blocked:

## Kế hoạch tuần sau

-
-
```

---

# 16. Bằng chứng làm việc nhóm

Khi giáo viên kiểm tra, nhóm có thể trình bày:

1. **GitHub Project Board**
   - Task nào đang làm.
   - Task nào đã hoàn tất.
   - Task thuộc thành viên nào.

2. **GitHub Issues**
   - Lịch sử tạo task.
   - Assignee.
   - Comment trao đổi.
   - Acceptance Criteria.

3. **Commit History**
   - Ai code phần nào.
   - Thời điểm thực hiện.

4. **Pull Requests**
   - Ai thực hiện.
   - Ai review.
   - Nội dung thay đổi.

5. **Milestones**
   - Tiến độ theo từng giai đoạn.

6. **Weekly Reports**
   - Bằng chứng quá trình làm việc xuyên suốt.

7. **MongoDB Compass / Redis Insight / Neo4j Browser**
   - Bằng chứng triển khai kỹ thuật.

---

# 17. Project Views nên tạo

## View 1 – Main Board

```text
Backlog
Ready
In Progress
Review
Done
```

## View 2 – By Member

Group by:

```text
Assignee
```

Dùng để giáo viên kiểm tra phân công.

## View 3 – Current Sprint

Filter:

```text
Sprint = Current Sprint
```

## View 4 – Roadmap

Hiển thị:

```text
Analysis
MongoDB
Backend
Frontend
Redis
Neo4j
Testing
Final Demo
```

---

# 18. Definition of Done toàn dự án

## MongoDB Core

- [ ] Schema đúng yêu cầu Document Store.
- [ ] Reviews được embedded.
- [ ] Comments / Replies hoạt động.
- [ ] CRUD hoàn chỉnh.
- [ ] Có Text Index.
- [ ] Có Compound Index.
- [ ] Aggregation tính Rating Average.
- [ ] Aggregation tính Review Count.
- [ ] Top 10 Places hoạt động.
- [ ] Dummy Data đạt yêu cầu.

## Frontend

- [ ] Search hoạt động.
- [ ] Place Detail hoạt động.
- [ ] Review hoạt động.
- [ ] Comment / Reply hoạt động.
- [ ] Admin CRUD hoạt động.
- [ ] Dashboard hoạt động.

## Redis

- [ ] Cache-Aside hoạt động.
- [ ] Cache Invalidation hoạt động.
- [ ] Rate Limiting hoạt động.
- [ ] Có benchmark.

## Neo4j

- [ ] Graph Schema.
- [ ] User → Place Relationship.
- [ ] Recommendation Query.
- [ ] API Recommendation.
- [ ] Frontend Recommendation.

## Project Management

- [ ] Tất cả task lớn có Issue.
- [ ] Mỗi Issue có Assignee.
- [ ] Code qua Branch + PR.
- [ ] Có Review giữa thành viên.
- [ ] Có Weekly Report.
- [ ] Project Board được cập nhật.
- [ ] Milestones phản ánh đúng tiến độ.

---

# 19. Kịch bản demo cuối kỳ

## Demo 1 – Embedded Document

1. User gửi Review mới.
2. Mở MongoDB Compass.
3. Chứng minh Review được thêm vào `reviews[]`.
4. Gửi Comment.
5. Chứng minh Comment nằm trong Review tương ứng.

## Demo 2 – Aggregation

1. Xem rating hiện tại.
2. Gửi review 1 sao hoặc 5 sao.
3. Chạy Aggregation.
4. Chứng minh Rating Average và Review Count thay đổi.
5. Frontend cập nhật kết quả.

## Demo 3 – Search + Index

1. Search theo keyword.
2. Lọc theo category / city / rating.
3. Giải thích Text Index / Compound Index.
4. Đối chiếu query trong Compass.

## Demo 4 – Redis

1. Gọi Top Places lần đầu.
2. Dữ liệu lấy từ MongoDB.
3. Gọi lần hai.
4. Dữ liệu lấy từ Redis.
5. So sánh latency.

## Demo 5 – Neo4j

1. User A đã review các Place A, B, C.
2. Tìm users có hành vi tương tự.
3. Tìm Place mà User A chưa review.
4. Trả recommendation.
5. Hiển thị trên Web.

## Demo 6 – Teamwork Evidence

1. Mở GitHub Project.
2. Show Board theo Assignee.
3. Mở một Issue.
4. Mở branch tương ứng.
5. Mở commit.
6. Mở Pull Request.
7. Show reviewer.
8. Show Issue đã tự đóng sau khi merge.

---

# 20. Cấu trúc thư mục đề xuất

```text
NoSQL_TravelReview/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   │   ├── mongodb/
│   │   ├── redis/
│   │   └── neo4j/
│   └── tests/
│
├── frontend/
│
├── database/
│   ├── mongodb/
│   │   ├── schema/
│   │   ├── indexes/
│   │   └── aggregation/
│   ├── redis/
│   └── neo4j/
│
├── scripts/
│   ├── generate_users.py
│   ├── generate_places.py
│   ├── generate_reviews.py
│   └── generate_comments.py
│
├── docs/
│   ├── analysis/
│   ├── architecture/
│   ├── testing/
│   └── report/
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
│
├── README.md
└── docker-compose.yml
```

---

# 21. Nguyên tắc cuối cùng

```text
P0 – MongoDB + CRUD + Index + Aggregation + Dummy Data + Frontend + Testing
             ↓
P1 – Redis + Performance + Rate Limiting
             ↓
P2 – Neo4j Recommendation
```

Không triển khai Redis hoặc Neo4j trước khi MongoDB Core ổn định.

MongoDB luôn là CSDL chính và là nền tảng để đáp ứng rubric của đề tài.
