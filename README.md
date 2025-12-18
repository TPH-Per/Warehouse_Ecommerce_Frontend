<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js">
  <img src="https://img.shields.io/badge/Vuetify-3.10-1867C0?style=for-the-badge&logo=vuetify&logoColor=white" alt="Vuetify">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-7.1-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Pinia-3.0-FFDA44?style=for-the-badge&logo=pinia&logoColor=black" alt="Pinia">
</p>

<h1 align="center">🎌 Wibu Shop</h1>

<p align="center">
  <strong>Website thương mại điện tử chuyên bán đồ Anime & Figures</strong>
</p>

<p align="center">
  <em>Nơi hội tụ đam mê Anime - Mang đến những sản phẩm Figure, Nendoroid, Plushies chất lượng nhất!</em>
</p>

---

## � Giới thiệu

**Wibu Shop** là một ứng dụng web thương mại điện tử hiện đại được xây dựng bằng Vue 3 và Vuetify 3, chuyên cung cấp các sản phẩm liên quan đến Anime như:

- 🎭 **Figures** - Mô hình nhân vật Anime cao cấp
- 🐣 **Nendoroids** - Mô hình chibi đáng yêu
- 🧸 **Plushies** - Gấu bông nhân vật Anime
- 🤖 **Figma** - Mô hình có khớp chuyển động

## ✨ Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| 🏠 **Trang chủ** | Hiển thị sản phẩm nổi bật, banner quảng cáo |
| 🔍 **Tìm kiếm** | Tìm kiếm sản phẩm theo từ khóa |
| 📂 **Danh mục** | Phân loại sản phẩm theo danh mục |
| 🛒 **Giỏ hàng** | Quản lý sản phẩm trong giỏ hàng |
| ❤️ **Wishlist** | Lưu sản phẩm yêu thích |
| 🔔 **Thông báo** | Thông báo real-time cho người dùng |
| 👤 **Tài khoản** | Đăng ký, đăng nhập, quản lý hồ sơ |
| 📦 **Đơn hàng** | Theo dõi trạng thái đơn hàng |
| 🌓 **Dark Mode** | Hỗ trợ chế độ sáng/tối |
| 📱 **Responsive** | Tương thích mọi kích thước màn hình |

## 🚀 Công nghệ sử dụng

### Frontend Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      WIBU SHOP STACK                        │
├─────────────────────────────────────────────────────────────┤
│  🖼️  Vue 3.5          │  Framework chính                    │
│  🎨  Vuetify 3.10     │  UI Component Library               │
│  📝  TypeScript 5.9   │  Type-safe development              │
│  ⚡  Vite 7.1         │  Build tool & Dev server            │
│  🗃️  Pinia 3.0        │  State Management                   │
│  🚦  Vue Router 4.5   │  SPA Routing                        │
│  🎭  MDI Icons        │  Material Design Icons              │
│  ✍️  Roboto Font      │  Typography                         │
└─────────────────────────────────────────────────────────────┘
```

### Công cụ phát triển

- **ESLint** - Code linting & formatting
- **vue-tsc** - TypeScript type checking
- **unplugin-vue-components** - Auto import components
- **vite-plugin-vue-layouts-next** - Layout management
- **sass-embedded** - SCSS preprocessing

## 📁 Cấu trúc dự án

```
wibu-shop/
├── 📂 public/              # Static assets
├── 📂 src/
│   ├── 📂 assets/          # Images, fonts, media
│   ├── 📂 components/      # Vue components
│   │   ├── AppHeader.vue   # Header navigation
│   │   └── AppFooter.vue   # Footer component
│   ├── 📂 composables/     # Vue composables (hooks)
│   │   ├── useAuth.ts      # Authentication logic
│   │   ├── useCart.ts      # Cart management
│   │   ├── useWishlist.ts  # Wishlist management
│   │   ├── useTheme.ts     # Theme switching
│   │   └── useNotifications.ts
│   ├── � layouts/         # Page layouts
│   │   ├── home.vue        # Home page layout
│   │   └── product-detail.vue
│   ├── 📂 pages/           # Route pages
│   │   ├── HomePage.vue    # Trang chủ
│   │   └── ProductDetailPage.vue
│   ├── 📂 plugins/         # Vue plugins
│   ├── 📂 router/          # Vue Router config
│   ├── 📂 stores/          # Pinia stores
│   ├── 📂 styles/          # Global styles
│   ├── App.vue             # Root component
│   └── main.ts             # Entry point
├── 📄 index.html           # HTML entry
├── 📄 package.json         # Dependencies
├── 📄 vite.config.mts      # Vite configuration
├── 📄 tsconfig.json        # TypeScript config
└── 📄 eslint.config.js     # ESLint config
```

## � Cài đặt

### Yêu cầu hệ thống

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 hoặc **yarn** >= 1.22.0

### Các bước cài đặt

1️⃣ **Clone repository**

```bash
git clone https://github.com/your-username/wibu-shop.git
cd wibu-shop
```

2️⃣ **Cài đặt dependencies**

```bash
# Sử dụng npm
npm install

# Hoặc sử dụng yarn
yarn install

# Hoặc sử dụng pnpm
pnpm install
```

3️⃣ **Chạy development server**

```bash
# Sử dụng npm
npm run dev

# Hoặc sử dụng yarn
yarn dev
```

4️⃣ **Mở trình duyệt**

Truy cập 👉 [http://localhost:5173](http://localhost:5173)

## 📜 Scripts có sẵn

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Khởi chạy development server với HMR |
| `npm run build` | Build production với type-check |
| `npm run preview` | Preview production build |
| `npm run type-check` | Kiểm tra TypeScript types |
| `npm run lint` | Lint và fix code với ESLint |

## 🏗️ Build Production

```bash
# Build ứng dụng
npm run build

# Preview bản build
npm run preview
```

Sau khi build, thư mục `dist/` sẽ chứa các file tĩnh sẵn sàng deploy.

## 🎨 Customization

### Thay đổi Theme

Vuetify theme có thể được tùy chỉnh tại `src/plugins/vuetify.ts`:

```typescript
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#3b82f6',
          secondary: '#ec4899',
          // ...
        },
      },
    },
  },
})
```

### Thêm Components mới

1. Tạo file `.vue` trong `src/components/`
2. Component sẽ tự động được import nhờ `unplugin-vue-components`

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 👥 Tác giả

<table>
  <tr>
    <td align="center">
      <strong>Wibu Shop Team</strong><br>
      <em>Đồ án Lập trình Web</em>
    </td>
  </tr>
</table>

## 📞 Liên hệ

- 📧 Email: contact@wibushop.com
- 🌐 Website: [wibushop.com](https://wibushop.com)
- 📱 Hotline: 1900-xxxx

## 📄 License

```
MIT License

Copyright (c) 2024 Wibu Shop

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<p align="center">
  Made with ❤️ by <strong>Wibu Shop Team</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome">
</p>
