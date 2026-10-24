import csv
import os

tasks = [
    # =========================================================================
    # THÀNH VIÊN 1: SV1 - Backend & CSDL Cốt Lõi (11 Tasks)
    # =========================================================================
    {
        "id": 1,
        "type": "Task",
        "summary": "[CSDL] Thiết kế Schema BSON & JSON Schema Validators cho Users, Places, Categories",
        "description": "Xác định cấu trúc tài liệu BSON cho các collection 'users', 'categories', 'places'. Thiết kế mô hình nhúng (Embedded Document) reviews[] -> comments[] -> replies[]. Thiết lập JSON Schema Validator ở tầng CSDL để ràng buộc kiểu dữ liệu, các trường bắt buộc và rating từ 1 đến 5 sao.",
        "assignee": "SV1 - Backend & Data Architect",
        "priority": "Highest",
        "labels": "CSDL MongoDB Schema",
        "status": "To Do"
    },
    {
        "id": 2,
        "type": "Task",
        "summary": "[Backend] Xây dựng API Đăng ký, Đăng nhập BCrypt & Cấp phát JWT Token Claims",
        "description": "Xây dựng endpoint Đăng ký tài khoản (mã hóa mật khẩu bằng thuật toán BCrypt), Đăng nhập và cấp JWT token an toàn chứa các Claims (UserId, Email, FullName, Role). Xây dựng middleware xác thực [Authorize] kiểm tra token hết hạn.",
        "assignee": "SV1 - Backend & Data Architect",
        "priority": "Highest",
        "labels": "Backend Auth JWT Security",
        "status": "To Do"
    },
    {
        "id": 3,
        "type": "Task",
        "summary": "[Backend] Tích hợp API Xác thực Google OAuth2 Token ở Phía Server",
        "description": "Xây dựng endpoint tiếp nhận Google id_token từ client, giải mã và xác thực chữ ký qua thư viện chính thức Google API. Liên kết tài khoản an toàn qua Google Subject ID và tự động tạo tài khoản Member nếu người dùng đăng nhập lần đầu.",
        "assignee": "SV1 - Backend & Data Architect",
        "priority": "High",
        "labels": "Backend Auth Google-OAuth",
        "status": "To Do"
    },
    {
        "id": 4,
        "type": "Task",
        "summary": "[Backend] Xây dựng API Quản lý Hồ sơ Cá nhân (Profile, Avatar & Đổi mật khẩu)",
        "description": "Viết các endpoint xem thông tin tài khoản hiện tại, cập nhật họ tên, ảnh đại diện (avatar) và chức năng đổi mật khẩu (kiểm tra mật khẩu cũ trước khi hash mật khẩu mới).",
        "assignee": "SV1 - Backend & Data Architect",
        "priority": "Medium",
        "labels": "Backend User Profile",
        "status": "To Do"
    },
    {
        "id": 5,
        "type": "Task",
        "summary": "[Backend] Xây dựng Chức năng Quản lý Danh mục Động (Category CRUD) Phân quyền Admin",
        "description": "Xây dựng API lấy danh sách danh mục (công khai cho Guest) và bộ CRUD Thêm / Sửa / Xóa danh mục được bảo vệ bởi [Authorize(Roles = 'Admin')]. Tự động sinh slug tiếng Việt không dấu chuẩn cho danh mục.",
        "assignee": "SV1 - Backend & Data Architect",
        "priority": "High",
        "labels": "Backend Category CRUD Admin",
        "status": "To Do"
    },
    {
        "id": 6,
        "type": "Task",
        "summary": "[Backend] Xây dựng Chức năng Quản lý Địa điểm (Place CRUD) & Quản lý Trạng thái",
        "description": "Xây dựng API lấy danh sách và chi tiết địa điểm công khai; API thêm/sửa/xóa địa điểm dành cho Quản trị viên; Hỗ trợ quản lý trạng thái hiển thị 'active' / 'inactive' của địa điểm.",
        "assignee": "SV1 - Backend & Data Architect",
        "priority": "Highest",
        "labels": "Backend Place CRUD",
        "status": "To Do"
    },
    {
        "id": 7,
        "type": "Task",
        "summary": "[Backend] Xây dựng Quy trình Tiếp nhận & Phê duyệt Đề xuất Địa điểm Mới (Approval Flow)",
        "description": "Viết API cho Member gửi đề xuất địa điểm mới (trạng thái 'pending', lưu thông tin người đề xuất); API cho Admin xem danh sách đề xuất chờ duyệt và thực hiện Phê duyệt ('active') hoặc Từ chối kèm lý do.",
        "assignee": "SV1 - Backend & Data Architect",
        "priority": "Highest",
        "labels": "Backend Place Approval Admin",
        "status": "To Do"
    },
    {
        "id": 8,
        "type": "Task",
        "summary": "[Backend] Xây dựng Chức năng Đăng Review (Ràng buộc 1 review active / user / place)",
        "description": "Viết API thêm bài review vào mảng nhúng reviews[] của địa điểm. Áp dụng quy tắc toàn vẹn nghiệp vụ: Mỗi thành viên chỉ được có tối đa 1 bài review đang hoạt động trên một địa điểm (nếu đã có thì báo lỗi 409 Conflict).",
        "assignee": "SV1 - Backend & Data Architect",
        "priority": "Highest",
        "labels": "Backend Review Business-Rule",
        "status": "To Do"
    },
    {
        "id": 9,
        "type": "Task",
        "summary": "[Backend] Xây dựng API Chỉnh sửa Review (Khóa sau 7 ngày) & Xóa Review (Hard Delete)",
        "description": "Cho phép tác giả chỉnh sửa nội dung/sao review trong vòng 7 ngày (168 giờ) kể từ khi tạo (quá thời hạn sẽ bị chặn); Cho phép xóa vĩnh viễn review cá nhân (Hard delete bằng toán tử $pull) và kích hoạt tính lại điểm rating trung bình.",
        "assignee": "SV1 - Backend & Data Architect",
        "priority": "Highest",
        "labels": "Backend Review Hard-Delete",
        "status": "To Do"
    },
    {
        "id": 10,
        "type": "Task",
        "summary": "[Backend] Xây dựng Chức năng Thảo luận Lồng 2 Tầng (Comment tầng 1 & Reply tầng 2)",
        "description": "Sử dụng toán tử mảng MongoDB $push để thêm bình luận tầng 1 dưới review, và thêm reply tầng 2 dưới comment bằng toán tử định vị vị trí $[review].comments.$[comment]. Nghiêm cấm tạo tầng 3 (không cho reply của reply).",
        "assignee": "SV1 - Backend & Data Architect",
        "priority": "Highest",
        "labels": "Backend Comment Reply 2Tiers",
        "status": "To Do"
    },
    {
        "id": 11,
        "type": "Task",
        "summary": "[Báo cáo] Soạn thảo Báo cáo Đồ án: Chương Phân tích Hệ thống & CSDL MongoDB",
        "description": "Viết chi tiết chương đặc tả yêu cầu (SRS), mô hình phân quyền Actor, tài liệu thiết kế Schema BSON các collections, phân tích chuyên sâu so sánh Embedding vs Referencing và phương án kiểm soát giới hạn 16MB BSON của MongoDB.",
        "assignee": "SV1 - Backend & Data Architect",
        "priority": "High",
        "labels": "Bao-cao Documentation Schema",
        "status": "To Do"
    },

    # =========================================================================
    # THÀNH VIÊN 2: SV2 - NoSQL Nâng Cao & CSDL Bổ Trợ (11 Tasks)
    # =========================================================================
    {
        "id": 12,
        "type": "Task",
        "summary": "[Backend] Xây dựng Chức năng Tương tác Xã hội (Like / Unlike Review & Comment)",
        "description": "Viết API thả like / hủy like cho bài đánh giá và bình luận. Áp dụng toán tử $addToSet để like và $pull để unlike nhằm đảm bảo mỗi user chỉ có tối đa 1 like trên mỗi đối tượng (tính idempotent, chống double like).",
        "assignee": "SV2 - Advanced NoSQL & DB",
        "priority": "Medium",
        "labels": "Backend Social Like Unlike",
        "status": "To Do"
    },
    {
        "id": 13,
        "type": "Task",
        "summary": "[Backend] Xây dựng Chức năng Báo cáo Vi phạm (Report) & API Xử lý của Admin",
        "description": "Người dùng gửi báo cáo nội dung vi phạm kèm lý do (spam, sai lệch, thô tục). Xây dựng endpoint cho Admin xem danh sách reports và thực hiện xóa vĩnh viễn nội dung vi phạm mà không để lại dữ liệu rác (orphan data).",
        "assignee": "SV2 - Advanced NoSQL & DB",
        "priority": "Medium",
        "labels": "Backend Report Moderation Admin",
        "status": "To Do"
    },
    {
        "id": 14,
        "type": "Task",
        "summary": "[Backend] Xây dựng Chức năng Địa điểm Yêu thích (Favorites) & Lịch sử Xem (View History)",
        "description": "Xây dựng API thêm/bỏ địa điểm yêu thích và xem danh sách đã bookmark; API ghi nhận lịch sử xem địa điểm gắn với tài khoản cá nhân, cho phép người dùng xem và xóa thủ công lịch sử.",
        "assignee": "SV2 - Advanced NoSQL & DB",
        "priority": "Medium",
        "labels": "Backend Favorites History",
        "status": "To Do"
    },
    {
        "id": 15,
        "type": "Task",
        "summary": "[NoSQL] Cấu hình Text Search Index & Xây dựng API Tìm kiếm Toàn văn Tiếng Việt",
        "description": "Tạo Text Index trên các trường 'name' (weight: 10) và 'description' (weight: 5) của collection places. Xây dựng API tìm kiếm sử dụng toán tử $text kết hợp sắp xếp độ khớp theo $meta: 'textScore' hỗ trợ tốt tiếng Việt.",
        "assignee": "SV2 - Advanced NoSQL & DB",
        "priority": "Highest",
        "labels": "NoSQL Text-Index Search",
        "status": "To Do"
    },
    {
        "id": 16,
        "type": "Task",
        "summary": "[NoSQL] Cấu hình 2dsphere Geospatial Index & Xây dựng API Tìm Địa điểm 'Gần tôi'",
        "description": "Tạo chỉ mục không gian 2dsphere trên trường 'location' (GeoJSON Point). Xây dựng API tìm kiếm địa điểm xung quanh vị trí GPS hiện tại sử dụng toán tử $nearSphere, sắp xếp theo khoảng cách tăng dần với bán kính maxDistance.",
        "assignee": "SV2 - Advanced NoSQL & DB",
        "priority": "Highest",
        "labels": "NoSQL Geospatial 2dsphere Nearby",
        "status": "To Do"
    },
    {
        "id": 17,
        "type": "Task",
        "summary": "[NoSQL] Cấu hình Compound Indexes Tối ưu hóa Bộ lọc Đa tiêu chí",
        "description": "Phân tích và tạo Compound Index theo quy tắc ESR (Equality, Sort, Range) cho các truy vấn lọc thường xuyên (ví dụ: categoryId + district + ratingAverage). Đo lường loại bỏ trạng thái COLLSCAN chuyển sang IXSCAN.",
        "assignee": "SV2 - Advanced NoSQL & DB",
        "priority": "High",
        "labels": "NoSQL Compound-Index ESR",
        "status": "To Do"
    },
    {
        "id": 18,
        "type": "Task",
        "summary": "[NoSQL] Xây dựng Aggregation Pipeline Tính ratingAverage & reviewCount Tức thời",
        "description": "Thiết kế Aggregation Pipeline giải nén mảng reviews ($unwind), tính điểm trung bình ($avg) và đếm tổng số đánh giá ($sum) khi có thao tác tạo/sửa/xóa review. Cập nhật kết quả vào tài liệu place ngay lập tức.",
        "assignee": "SV2 - Advanced NoSQL & DB",
        "priority": "Highest",
        "labels": "NoSQL Aggregation Rating-Calc",
        "status": "To Do"
    },
    {
        "id": 19,
        "type": "Task",
        "summary": "[NoSQL] Xây dựng Aggregation Pipeline Bảng xếp hạng Top 10 Địa điểm Nổi bật",
        "description": "Xây dựng pipeline xếp hạng Top 10 địa điểm nổi bật nhất theo thuật toán cân bằng giữa ratingAverage và reviewCount (tránh sai lệch ưu tiên địa điểm chỉ có 1 đánh giá 5 sao).",
        "assignee": "SV2 - Advanced NoSQL & DB",
        "priority": "High",
        "labels": "NoSQL Aggregation Top10 Leaderboard",
        "status": "To Do"
    },
    {
        "id": 20,
        "type": "Task",
        "summary": "[NoSQL] Xây dựng Aggregation Pipelines Thống kê Phân tích Admin Dashboard ($facet)",
        "description": "Sử dụng stage $facet trong Aggregation Pipeline để đồng thời lấy tổng số địa điểm, tổng reviews, phân bố rating 1-5 sao và thống kê số lượng địa điểm theo từng danh mục/quận huyện chỉ trong một truy vấn duy nhất.",
        "assignee": "SV2 - Advanced NoSQL & DB",
        "priority": "High",
        "labels": "NoSQL Aggregation Facet Dashboard",
        "status": "To Do"
    },
    {
        "id": 21,
        "type": "Task",
        "summary": "[Mở rộng] Triển khai Redis Caching (Cache-Aside Pattern) & Rate Limiting API",
        "description": "Áp dụng mô hình Cache-Aside trên Redis cho danh sách Top 10 và chi tiết địa điểm; Cơ chế tự động xóa key (Cache Invalidation) khi có review mới; Áp dụng Rate Limiting giới hạn 10 review/phút chống spam.",
        "assignee": "SV2 - Advanced NoSQL & DB",
        "priority": "Medium",
        "labels": "Mo-rong Redis Cache Rate-Limit",
        "status": "To Do"
    },
    {
        "id": 22,
        "type": "Task",
        "summary": "[Mở rộng] Triển khai Neo4j Graph DB & Cypher Query Gợi ý Địa điểm Tương đồng",
        "description": "Mô hình hóa Graph DB (User)-[:REVIEWED]->(Place), đồng bộ dữ liệu sang Neo4j, viết truy vấn Cypher gợi ý địa điểm tương đồng (Collaborative Filtering) dựa trên hành vi người dùng có cùng gu sở thích.",
        "assignee": "SV2 - Advanced NoSQL & DB",
        "priority": "Medium",
        "labels": "Mo-rong Neo4j Graph Cypher Recommendation",
        "status": "To Do"
    },

    # =========================================================================
    # THÀNH VIÊN 3: SV3 - Giao diện Web, Dữ liệu & QA (Nguyễn Kim Long - 11 Tasks)
    # =========================================================================
    {
        "id": 23,
        "type": "Task",
        "summary": "[Môi trường] Thiết lập Hạ tầng Docker Compose (MongoDB, Redis, Neo4j) & Cấu trúc Dự án",
        "description": "Khởi tạo repo GitHub, phân quyền 3 thành viên, viết file docker-compose.yml khởi động container MongoDB 7.0+, Redis, Neo4j có gắn volume data; Cấu hình kết nối Backend và Frontend hoạt động trơn tru.",
        "assignee": "SV3 - Fullstack & QA DevOps (Nguyễn Kim Long)",
        "priority": "High",
        "labels": "Moi-truong Docker Compose DevOps",
        "status": "To Do"
    },
    {
        "id": 24,
        "type": "Task",
        "summary": "[CSDL] Viết Script Sinh Bộ Dữ liệu Mẫu (100 Địa điểm Thực tế & 1,000 Reviews Demo)",
        "description": "Xây dựng script sinh và nạp 100 địa điểm thực tế tại TP.HCM (tên thật, địa chỉ thật, tọa độ GPS chuẩn) và 1,000 bài review mô phỏng có gắn cờ 'isDemo: true' cùng 2,000 comments/replies phục vụ kiểm thử nghiệm thu.",
        "assignee": "SV3 - Fullstack & QA DevOps (Nguyễn Kim Long)",
        "priority": "Highest",
        "labels": "CSDL Seeding Dummy-Data 100Places",
        "status": "To Do"
    },
    {
        "id": 25,
        "type": "Task",
        "summary": "[Giao diện] Xây dựng Màn hình Đăng ký, Đăng nhập & Nút Google Sign-In",
        "description": "Thiết kế giao diện Đăng nhập, Đăng ký có validate form ở client; Tích hợp nút Google Identity Services (Google Sign-In) lấy id_token chuyển về backend; Quản lý lưu trữ JWT token và cập nhật thanh Header.",
        "assignee": "SV3 - Fullstack & QA DevOps (Nguyễn Kim Long)",
        "priority": "High",
        "labels": "Giao-dien Frontend Auth Google-Sign-In",
        "status": "To Do"
    },
    {
        "id": 26,
        "type": "Task",
        "summary": "[Giao diện] Xây dựng Trang Khám phá, Tìm kiếm & Bản đồ Leaflet (GPS 'Gần tôi')",
        "description": "Trang chủ hiển thị danh sách địa điểm dạng lưới card, thanh tìm kiếm từ khóa, bộ lọc danh mục/quận huyện; Tích hợp bản đồ số Leaflet hiển thị các ghim Marker và nút 'Gần tôi' định vị GPS trình duyệt để tìm địa điểm xung quanh.",
        "assignee": "SV3 - Fullstack & QA DevOps (Nguyễn Kim Long)",
        "priority": "Highest",
        "labels": "Giao-dien Frontend Leaflet Map Geospatial",
        "status": "To Do"
    },
    {
        "id": 27,
        "type": "Task",
        "summary": "[Giao diện] Xây dựng Trang Chi tiết Địa điểm & Form Đăng/Sửa Review Kèm Ảnh",
        "description": "Trang xem thông tin chi tiết địa điểm (album ảnh, địa chỉ, sao đánh giá); Xây dựng Modal viết bài đánh giá: chọn 1-5 sao, viết nhận xét và upload tối đa 5 ảnh lên Cloudinary; Tải lại nội dung cũ khi bấm sửa review.",
        "assignee": "SV3 - Fullstack & QA DevOps (Nguyễn Kim Long)",
        "priority": "Highest",
        "labels": "Giao-dien Frontend Place-Detail Review-Form",
        "status": "To Do"
    },
    {
        "id": 28,
        "type": "Task",
        "summary": "[Giao diện] Xây dựng Cây Bình luận Lồng 2 Tầng & Tương tác Like / Báo cáo Vi phạm",
        "description": "Hiển thị danh sách review có gắn nhãn phân biệt review demo. Cây thảo luận thụt lề 2 tầng (Comment -> Reply); Tương tác nút Thả tim hiển thị số like tức thời; Modal chọn lý do gửi Báo cáo vi phạm và Nút Bookmark lưu địa điểm.",
        "assignee": "SV3 - Fullstack & QA DevOps (Nguyễn Kim Long)",
        "priority": "Highest",
        "labels": "Giao-dien Frontend Comments 2Tiers Social",
        "status": "To Do"
    },
    {
        "id": 29,
        "type": "Task",
        "summary": "[Giao diện] Xây dựng Form Đề xuất Địa điểm Mới (Tương tác Ghim Marker Bản đồ)",
        "description": "Màn hình cho Member đóng góp địa điểm du lịch/ăn uống mới: Nhập tên, địa chỉ, chọn danh mục và tương tác click trực tiếp trên bản đồ để chọn tọa độ GPS [lng, lat] chính xác trước khi gửi đề xuất.",
        "assignee": "SV3 - Fullstack & QA DevOps (Nguyễn Kim Long)",
        "priority": "High",
        "labels": "Giao-dien Frontend Propose-Place Map-Picker",
        "status": "To Do"
    },
    {
        "id": 30,
        "type": "Task",
        "summary": "[Giao diện] Xây dựng Cổng Quản trị Admin Portal (Duyệt địa điểm, Report & Dashboard)",
        "description": "Trang dành riêng cho Quản trị viên: Hiển thị các thẻ thống kê tổng quan; Bảng quản lý danh mục và địa điểm; Tab duyệt/từ chối địa điểm đề xuất; Tab xem xét và xóa vĩnh viễn nội dung vi phạm bị báo cáo.",
        "assignee": "SV3 - Fullstack & QA DevOps (Nguyễn Kim Long)",
        "priority": "High",
        "labels": "Giao-dien Frontend Admin Dashboard Moderation",
        "status": "To Do"
    },
    {
        "id": 31,
        "type": "Task",
        "summary": "[Giao diện] Xây dựng Trang Hồ sơ Cá nhân (Quản lý Profile, Lịch sử & Yêu thích)",
        "description": "Giao diện quản lý thông tin tài khoản: Xem và cập nhật họ tên, avatar; Tab xem danh sách các địa điểm đã đánh dấu yêu thích; Tab xem lịch sử xem địa điểm kèm nút xóa lịch sử.",
        "assignee": "SV3 - Fullstack & QA DevOps (Nguyễn Kim Long)",
        "priority": "Medium",
        "labels": "Giao-dien Frontend Profile Favorites History",
        "status": "To Do"
    },
    {
        "id": 32,
        "type": "Task",
        "summary": "[Kiểm thử] Xây dựng Postman Test Suite Toàn bộ API & Kịch bản Đồng thời (Concurrency Test)",
        "description": "Tạo bộ Test Suite Postman kiểm thử tự động toàn bộ API; Viết script gửi 50 request đánh giá đồng thời cùng một lúc vào 1 địa điểm để kiểm thử xung đột đồng thời (Concurrency Test) và chứng minh công thức ratingAverage không bị sai lệch.",
        "assignee": "SV3 - Fullstack & QA DevOps (Nguyễn Kim Long)",
        "priority": "Highest",
        "labels": "Kiem-thu Postman Concurrency QA",
        "status": "To Do"
    },
    {
        "id": 33,
        "type": "Task",
        "summary": "[Báo cáo] Đo lường Benchmark Hiệu năng, Soạn Slide Thuyết trình & Kịch bản Demo",
        "description": "Đo lường thời gian truy vấn trước/sau khi tạo Index và so sánh độ trễ MongoDB vs Redis; Hoàn thiện báo cáo đồ án, thiết kế slide thuyết trình súc tích và kịch bản demo bảo vệ phân vai 3 người (Compass, Postman, Web UI).",
        "assignee": "SV3 - Fullstack & QA DevOps (Nguyễn Kim Long)",
        "priority": "Highest",
        "labels": "Bao-cao Benchmark Slide Demo Defense",
        "status": "To Do"
    }
]

headers = [
    "Issue Id",
    "Issue Type",
    "Summary",
    "Description",
    "Assignee",
    "Priority",
    "Labels",
    "Status"
]

all_rows = []
for task in tasks:
    all_rows.append([
        task["id"],
        task["type"],
        task["summary"],
        task["description"],
        task["assignee"],
        task["priority"],
        task["labels"],
        task["status"]
    ])

dest_paths = [
    "docs/jira/jira_tasks_import.csv",
    "jira_tasks_import.csv"
]

for p in dest_paths:
    with open(p, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(all_rows)

print(f"Generated {len(all_rows)} functional tasks ({len(tasks)//3} tasks per member).")
