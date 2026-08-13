# Thiết lập Lịch học & Deadline / Schedule & Deadline Setup

Website đã dùng sẵn project URL và **publishable key** của Supabase. Publishable key có thể xuất hiện ở frontend; không bao giờ đưa `service_role` hoặc secret key vào website.

## Thiết lập một lần

1. Mở Supabase Dashboard → **SQL Editor** → **New query**.
2. Sao chép toàn bộ nội dung trong [`supabase-study-events.sql`](supabase-study-events.sql), chạy query.
3. Mở **Table Editor** → bảng `study_events` → **Insert row** để nhập lịch hoặc deadline thật.

## Các trường cần dùng

- `kind`: `class` hoặc `deadline`.
- `course_code`: ví dụ `IST2510`.
- `title_vi`, `title_en`: tên hiển thị song ngữ.
- `start_at`: ngày giờ bắt đầu hoặc hạn nộp, nên dùng múi giờ `+07:00`.
- `slot_label`: tiết học, ví dụ `01–02`.
- `room`: phòng học.
- `color`: màu môn học dạng `#RRGGBB`.
- `priority`: `low`, `normal` hoặc `high`.
- `is_completed`: chuyển thành `true` khi đã hoàn thành để ẩn khỏi Tổng quan.

## Bảo mật

Chính sách RLS trong tệp SQL chỉ cho khách truy cập **đọc** dữ liệu. Việc thêm, sửa và xóa được thực hiện trong Supabase Dashboard. Website không được cấp quyền ghi công khai.

