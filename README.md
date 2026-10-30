# Portfolio Cá Nhân - Nguyễn Hoài An

Website hồ sơ cá nhân hiện đại, chuẩn SEO, responsive 100%, hỗ trợ song ngữ (Việt - Anh) và chế độ sáng/tối (Dark/Light mode).

## 🚀 Tính năng nổi bật
- **Không Framework, Không Build Step**: 100% HTML5, CSS3, JavaScript ES6+ thuần.
- **Nền động 2 lớp**: Lớp 1 Aurora CSS (GPU) + Lớp 2 Canvas Mạng nơ-ron (Neural Network) tự động giảm tải khi FPS thấp, dừng khi tab bị ẩn.
- **Hiệu ứng đặc biệt (`js/effects.js`)**: Typewriter xoay vòng chữ, gradient chuyển động tên, thẻ 3D tilt, vệt sáng con trỏ, nút từ tính, thanh cuộn đỉnh trang. Bật/tắt dễ dàng qua object `EFFECTS`.
- **Mục Hành trình (My Journey)**: Quản lý qua mảng `JOURNEY`, vẽ đường nối theo cuộn, chấm mốc đang diễn ra nhấp nháy pulse.
- **Form liên hệ an toàn**: Tự động validate, chống Spam bằng Honeypot & cooldown 30s, fallback `mailto:` chống Header Injection.
- **Kiểm thử tự động TDD**: Kiểm thử toàn bộ 14 hàm logic thuần bằng `node:test` có sẵn trong Node.js.

## 📁 Cấu trúc thư mục
```text
├── index.html            # Trang chính (Double click mở trực tiếp)
├── css/
│   └── style.css         # Toàn bộ định kiểu CSS (CSS Variables, Responsive)
├── js/
│   ├── i18n.js           # Từ điển song ngữ Việt - Anh
│   ├── logic.js          # Các hàm logic thuần (độc lập DOM để test)
│   ├── effects.js        # Hiệu ứng đặc biệt, canvas mạng nơ-ron, typewriter, tilt
│   └── app.js            # Quản lý DOM, theme, ngôn ngữ, form, mảng JOURNEY
├── assets/
│   ├── avatar.jpg        # Ảnh đại diện của bạn (tự thêm ảnh)
│   └── cover.jpg         # Ảnh bìa của bạn (tự thêm ảnh)
├── tests/
│   └── logic.test.js     # Bộ test tự động (node --test)
└── README.md             # Hướng dẫn sử dụng
```

## 🛠 Hướng dẫn tùy biến nhanh
1. **Chạy trang web**: Nhấp đúp vào tệp `index.html` để mở ngay trên trình duyệt (không cần cài đặt gì thêm).
2. **Thay ảnh cá nhân**: Đặt ảnh chân dung vào `assets/avatar.jpg` và ảnh bìa vào `assets/cover.jpg`. Nếu chưa có ảnh, trang web sẽ tự rơi về avatar chữ "HA" và nền gradient sang trọng mà không bị hiện icon ảnh lỗi.
3. **Thêm mốc Hành trình**: Mở `js/app.js`, thêm phần tử vào mảng `JOURNEY` và thêm key dịch tương ứng trong `js/i18n.js`.
4. **Bật/Tắt hiệu ứng**: Mở `js/effects.js`, thay đổi giá trị `true/false` trong object `EFFECTS`.
5. **Cập nhật link mạng xã hội**: Mở `js/app.js`, điền link vào biến `LINKS`.
6. **Cấu hình Form gửi thư thật**: Mở `js/app.js`, điền URL form service (ví dụ Formspree) vào `CONTACT_ENDPOINT`.
7. **Chạy kiểm thử logic**: Chạy lệnh trong terminal: `node --test`.
8. **Đưa lên GitHub Pages**: Khởi tạo git, đẩy code lên GitHub repo, vào **Settings** > **Pages** > chọn nhánh `main` / `root` > bấm **Save**.
