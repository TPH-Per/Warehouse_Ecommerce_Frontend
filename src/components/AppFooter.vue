<template>
  <v-footer class="pa-0 flex-column overflow-hidden" style="background: transparent;">
    <div class="footer-bg position-absolute inset-0"></div>
    <div class="hero-grid position-absolute inset-0 opacity-40"></div>

    <v-container class="relative py-16 text-white" style="z-index: 1;">
      <v-row class="mb-12">
        <v-col cols="12" lg="8">
          <v-sheet
            class="glass-panel pa-8 rounded-xl h-100"
            color="transparent"
          >
            <div class="d-flex align-center gap-4 mb-6">
              <v-avatar
                size="48"
                class="rounded-lg font-weight-black text-white"
                style="background: linear-gradient(to bottom right, #ec4899, #0ea5e9);"
              >
                PW
              </v-avatar>
              <div>
                <p class="text-uppercase text-caption font-weight-thin tracking-widest text-white-50">
                  PerW Collectibles
                </p>
                <p class="text-h5 font-weight-semibold">Thế giới của những giấc mơ wibu</p>
              </div>
            </div>
            <p class="text-body-1 text-white-70 max-w-2xl leading-relaxed mb-8">
              Bổ sung góc trưng bày của bạn bằng những sản phẩm chính hãng được tuyển chọn bởi các chuyên gia otaku.
              Từ figures tỉ lệ cao cấp đến nendoroids đáng yêu, mỗi tuần chúng tôi đều cập nhật các deal độc quyền.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <v-chip color="white" variant="tonal" border>24/7 hỗ trợ</v-chip>
              <v-chip color="white" variant="tonal" border>Vận chuyển toàn cầu</v-chip>
              <v-chip color="white" variant="tonal" border>Bảo hành sản phẩm 365 ngày</v-chip>
            </div>
          </v-sheet>
        </v-col>

        <v-col cols="12" lg="4">
          <v-sheet
            class="glass-panel pa-8 rounded-xl shine-border"
            color="transparent"
          >
            <h3 class="text-h6 font-weight-semibold mb-2">Đăng ký newsletter</h3>
            <p class="text-body-2 text-white-70 mb-6">
              Nhận ưu đãi flash, lịch pre-order và hậu trường studio mỗi tuần.
            </p>
            <v-text-field
              placeholder="Email của bạn"
              variant="outlined"
              rounded="xl"
              bg-color="white-lighten-4"
              class="mb-4"
              hide-details
            ></v-text-field>
            <v-btn
              block
              color="pink-accent-3"
              rounded="xl"
              size="large"
              class="text-capitalize"
            >
              Theo dõi cập nhật
            </v-btn>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6" md="3">
          <h4 class="text-subtitle-1 font-weight-bold mb-4">Danh mục nổi bật</h4>
          <v-list bg-color="transparent" density="compact" class="pa-0 text-white-70">
            <v-list-item to="/products" class="pa-0 min-h-0 link-hover">Tất cả sản phẩm</v-list-item>
            <v-list-item to="/products?category=figures" class="pa-0 min-h-0 link-hover">Figures</v-list-item>
            <v-list-item to="/products?category=nendoroids" class="pa-0 min-h-0 link-hover">Nendoroids</v-list-item>
            <v-list-item to="/products?category=plushies" class="pa-0 min-h-0 link-hover">Gấu bông</v-list-item>
          </v-list>
        </v-col>

        <v-col cols="6" md="3">
          <h4 class="text-subtitle-1 font-weight-bold mb-4">Hỗ trợ</h4>
          <v-list bg-color="transparent" density="compact" class="pa-0 text-white-70">
            <v-list-item href="#" class="pa-0 min-h-0 link-hover">Câu hỏi thường gặp</v-list-item>
            <v-list-item href="#" class="pa-0 min-h-0 link-hover">Chính sách giao hàng</v-list-item>
            <v-list-item href="#" class="pa-0 min-h-0 link-hover">Theo dõi đơn</v-list-item>
            <v-list-item href="#" class="pa-0 min-h-0 link-hover">Yêu cầu bảo hành</v-list-item>
          </v-list>
        </v-col>

        <v-col cols="6" md="3">
          <h4 class="text-subtitle-1 font-weight-bold mb-4">Cộng đồng</h4>
          <v-list bg-color="transparent" density="compact" class="pa-0 text-white-70">
            <v-list-item href="#" class="pa-0 min-h-0 link-hover">Discord collectors</v-list-item>
            <v-list-item href="#" class="pa-0 min-h-0 link-hover">Blog review</v-list-item>
            <v-list-item href="#" class="pa-0 min-h-0 link-hover">Sự kiện offline</v-list-item>
            <v-list-item href="#" class="pa-0 min-h-0 link-hover">Chương trình đại sứ</v-list-item>
          </v-list>
        </v-col>

        <v-col cols="6" md="3">
          <h4 class="text-subtitle-1 font-weight-bold mb-4">Kết nối</h4>
          <div class="text-body-2 text-white-70 space-y-2">
            <p><a href="mailto:hello@perw.vn" class="text-decoration-none text-white-70 link-hover">hello@perw.vn</a></p>
            <p><a href="tel:+84123456789" class="text-decoration-none text-white-70 link-hover">+84 123 456 789</a></p>
            <p>77 Nguyễn Trãi, Hà Nội</p>
            <div class="d-flex gap-3 pt-4">
              <v-btn icon="mdi-facebook" size="small" variant="tonal" color="white"></v-btn>
              <v-btn icon="mdi-instagram" size="small" variant="tonal" color="white"></v-btn>
              <v-btn icon="mdi-youtube" size="small" variant="tonal" color="white"></v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-divider class="mt-12 mb-8 opacity-20"></v-divider>
      <div class="d-flex flex-column flex-md-row justify-space-between align-center text-caption text-white-50">
        <p>© 2025 PerW Collective. All rights reserved.</p>
        <div class="d-flex gap-4 mt-3 mt-md-0">
          <a href="#" class="text-decoration-none text-white-50 link-hover">Chính sách bảo mật</a>
          <a href="#" class="text-decoration-none text-white-50 link-hover">Điều khoản</a>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
.footer-bg {
  background: linear-gradient(to bottom, #0f172a, #020617);
  width: 100%;
  height: 100%;
}

.hero-grid {
  background-image: radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
  background-size: 32px 32px;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.shine-border {
  position: relative;
  overflow: hidden;
}

.shine-border::after {
  content: "";
  position: absolute;
  top: -50%; left: -50%; width: 200%; height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.05), transparent);
  transform: rotate(45deg);
  animation: shine 6s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

.text-white-70 { color: rgba(255, 255, 255, 0.7); }
.text-white-50 { color: rgba(255, 255, 255, 0.5); }

.link-hover:hover {
  color: white !important;
  transition: 0.3s;
  cursor: pointer;
}

.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
</style>