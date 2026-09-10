# Team Workflow

## 1. Mục tiêu

Quy định cách 3 thành viên làm việc trên GitHub để quản lý tiến độ rõ ràng và giữ lại bằng chứng teamwork cho đồ án NoSQL Travel Review.

## 2. Luồng công việc chuẩn

```text
Requirement
  ↓
GitHub Issue
  ↓
Assignee
  ↓
Feature/Fix/Docs Branch
  ↓
Commit
  ↓
Pull Request
  ↓
Reviewer khác thành viên thực hiện
  ↓
Merge vào main
  ↓
Issue Done
```

## 3. Không code trực tiếp trên main

`main` chỉ nhận thay đổi thông qua Pull Request, ngoại trừ trường hợp khẩn cấp được cả nhóm thống nhất và ghi rõ lý do.

## 4. Quy tắc branch

```text
feature/<issue-id>-<short-name>
fix/<issue-id>-<short-name>
docs/<issue-id>-<short-name>
test/<issue-id>-<short-name>
chore/<issue-id>-<short-name>
```

Ví dụ:

```text
feature/14-review-api
feature/18-rating-aggregation
fix/27-review-validation
docs/35-architecture
```

## 5. Quy tắc commit

Khuyến nghị Conventional Commits:

```text
feat(review): implement create review API #14
feat(mongodb): add rating aggregation #18
fix(auth): validate expired token #27
docs(architecture): update system diagram #35
test(review): add concurrent request test #42
```

Commit phải mô tả đúng thay đổi, tránh các message chung chung như `update`, `fix code`, `done`.

## 6. Quy tắc Issue

Mỗi công việc đáng kể phải có Issue trước khi bắt đầu.

Mỗi Issue cần có tối thiểu:

- Mô tả rõ công việc.
- Requirements.
- Acceptance Criteria.
- Assignee.
- Label phù hợp.
- Milestone phù hợp.
- Project fields: Priority, Module, Type, Sprint.

## 7. Quy tắc Pull Request

Mỗi PR cần:

- Link Issue bằng `Closes #<issue-number>`.
- Mô tả thay đổi.
- Có evidence/test phù hợp.
- Được ít nhất 1 thành viên khác review.
- Không tự approve PR của chính mình.

## 8. Review rotation gợi ý

```text
SV1 làm → SV2 review
SV2 làm → SV3 review
SV3 làm → SV1 review
```

Có thể đổi reviewer tùy module nhưng reviewer phải là người khác author.

## 9. Project Board

Các trạng thái:

```text
Backlog → Ready → In Progress → Review → Done
```

- Backlog: chưa sẵn sàng làm.
- Ready: đủ yêu cầu để bắt đầu.
- In Progress: đang thực hiện.
- Review: chờ review/test.
- Done: đã nghiệm thu/merge.

## 10. Weekly Report

Mỗi tuần tạo Issue bằng template `Weekly Report` để ghi:

- Mục tiêu tuần.
- Task hoàn thành của từng thành viên.
- Task đang làm.
- Blocker.
- Kế hoạch tuần sau.
- Link Issues, PRs, commits và tài liệu liên quan.

## 11. Definition of Done cho một task

Một task chỉ được chuyển sang Done khi:

- Acceptance Criteria đã đạt.
- Code/tài liệu đã được kiểm tra.
- Có evidence khi cần.
- PR đã được review.
- PR đã merge hoặc deliverable đã được nghiệm thu.
- Issue đã được đóng.

## 12. Evidence teamwork khi bảo vệ

Nhóm ưu tiên trình bày theo chuỗi:

```text
Project Board → Issue → Assignee → Branch → Commits → Pull Request → Review → Merge
```

Đây là bằng chứng rõ nhất để thể hiện quá trình phân công, thực hiện, review và phối hợp giữa các thành viên.
