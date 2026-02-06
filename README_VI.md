# Portfolio Next.js - Flutter Developer

Dự án portfolio được chuyển đổi từ HTML sang Next.js với cấu hình nội dung bằng JSON.

## Cấu trúc dự án

```
portfolio-nextjs/
├── app/
│   ├── globals.css          # Styles tổng thể
│   ├── layout.tsx           # Layout chính
│   └── page.tsx             # Trang chủ
├── components/              # Các React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   └── ScrollToTop.tsx
└── data/                    # Cấu hình JSON
    ├── navigation.json      # Menu điều hướng
    ├── hero.json            # Phần hero
    ├── about.json           # Phần giới thiệu
    ├── skills.json          # Kỹ năng
    ├── projects.json        # Dự án
    └── contact.json         # Liên hệ
```

## Cách thay đổi nội dung

Tất cả nội dung được cấu hình trong các file JSON trong thư mục `data/`. Bạn chỉ cần chỉnh sửa các file JSON này để thay đổi nội dung website.

### 1. Thay đổi thông tin Hero (`data/hero.json`)

```json
{
  "title": "Tiêu đề của bạn",
  "subtitle": {
    "icon": "fa-brands fa-flutter",
    "text": "Mobile · Web · Desktop"
  },
  "description": "Mô tả của bạn",
  "links": [...]
}
```

### 2. Thay đổi About (`data/about.json`)

```json
{
  "items": [
    {
      "icon": "fa-solid fa-graduation-cap",
      "title": "Background",
      "description": "Mô tả background"
    }
  ]
}
```

### 3. Thay đổi Skills (`data/skills.json`)

Bạn có thể thêm/xóa/sửa skills theo category:
- platforms (blue)
- core (blue)
- state (purple)
- storage (pink)
- locale (orange)
- backend (red)
- arch (green)

### 4. Thay đổi Projects (`data/projects.json`)

Thêm hoặc chỉnh sửa dự án:

```json
{
  "projects": [
    {
      "id": 1,
      "icon": "fa-solid fa-shopping-cart",
      "title": "Tên dự án",
      "year": "2024",
      "description": "Mô tả dự án",
      "technologies": ["Flutter", "Bloc"],
      "link": {
        "text": "View Project",
        "url": "#"
      }
    }
  ]
}
```

### 5. Thay đổi Contact (`data/contact.json`)

```json
{
  "description": "Mô tả liên hệ",
  "email": {
    "icon": "fa-solid fa-envelope",
    "address": "your.email@example.com"
  },
  "socialLinks": [...]
}
```

## Cài đặt và chạy

1. Cài đặt dependencies:
```bash
cd portfolio-nextjs
npm install
```

2. Chạy development server:
```bash
npm run dev
```

3. Mở trình duyệt tại http://localhost:3000

## Build production

```bash
npm run build
npm start
```

## Font Awesome Icons

Project sử dụng Font Awesome 6.4.0 CDN. Bạn có thể tìm icons tại: https://fontawesome.com/icons

## Chỉnh sửa màu sắc

Các biến màu được định nghĩa trong `app/globals.css`:

```css
:root {
  --flutter-blue: #54C5F8;
  --flutter-blue-dark: #027DFD;
  --bg-primary: #0A0E27;
  --text-primary: #E8E9ED;
  ...
}
```

## Tính năng

✅ JSON-based content configuration
✅ TypeScript
✅ Tailwind CSS
✅ Responsive design
✅ Scroll animations
✅ Mobile menu
✅ Smooth scrolling
✅ Custom scrollbar
✅ Font Awesome icons

## Lưu ý

- Nhớ cập nhật email, links social trong các file JSON
- Có thể thêm/xóa sections bằng cách chỉnh sửa `app/page.tsx`
- Animations và styles có thể tùy chỉnh trong `app/globals.css`
