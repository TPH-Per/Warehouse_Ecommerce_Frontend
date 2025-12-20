<template>
  <v-footer class="app-footer pa-0 flex-column overflow-hidden">
    <!-- Grid Pattern Overlay -->
    <div class="footer-grid-overlay" />
    
    <v-container class="py-16 position-relative" style="z-index: 1;">
      <v-row class="mb-12">
        <!-- Brand Section -->
        <v-col cols="12" lg="8">
          <v-sheet class="glass-panel pa-8 rounded-xl h-100" color="transparent">
            <div class="d-flex align-center ga-4 mb-6">
              <v-avatar size="56" class="logo-avatar rounded-lg">
                <span class="text-h5 font-weight-black">WS</span>
              </v-avatar>
              <div>
                <p class="text-overline tracking-widest text-medium-emphasis mb-1">
                  WIBU SHOP COLLECTIBLES
                </p>
                <p class="text-h5 font-weight-bold gradient-text">
                  Thế giới của những giấc mơ wibu
                </p>
              </div>
            </div>
            <p class="text-body-1 text-medium-emphasis mb-8" style="max-width: 600px; line-height: 1.8;">
              Bổ sung góc trưng bày của bạn bằng những sản phẩm chính hãng được tuyển chọn bởi các chuyên gia otaku.
              Từ figures tỉ lệ cao cấp đến nendoroids đáng yêu, mỗi tuần chúng tôi đều cập nhật các deal độc quyền.
            </p>
            <div class="d-flex flex-wrap ga-3">
              <v-chip color="primary" variant="tonal" prepend-icon="mdi-headset">24/7 hỗ trợ</v-chip>
              <v-chip color="primary" variant="tonal" prepend-icon="mdi-truck-fast">Vận chuyển toàn cầu</v-chip>
              <v-chip color="primary" variant="tonal" prepend-icon="mdi-shield-check">Bảo hành 365 ngày</v-chip>
            </div>
          </v-sheet>
        </v-col>

        <!-- Newsletter Section -->
        <v-col cols="12" lg="4">
          <v-sheet class="glass-panel pa-8 rounded-xl newsletter-box" color="transparent">
            <v-icon size="40" color="secondary" class="mb-4">mdi-email-newsletter</v-icon>
            <h3 class="text-h6 font-weight-bold mb-2">Đăng ký newsletter</h3>
            <p class="text-body-2 text-medium-emphasis mb-6">
              Nhận ưu đãi flash, lịch pre-order và hậu trường studio mỗi tuần.
            </p>
            <v-text-field
              placeholder="Email của bạn"
              variant="outlined"
              rounded="xl"
              density="comfortable"
              class="mb-4 newsletter-input"
              hide-details
              prepend-inner-icon="mdi-at"
            />
            <v-btn block color="secondary" rounded="xl" size="large" class="font-weight-bold">
              <v-icon start>mdi-send</v-icon>
              Theo dõi cập nhật
            </v-btn>
          </v-sheet>
        </v-col>
      </v-row>

      <!-- Links Grid -->
      <v-row>
        <v-col cols="6" md="3">
          <h4 class="text-subtitle-1 font-weight-bold mb-4 neon-text-primary">Danh mục nổi bật</h4>
          <v-list bg-color="transparent" density="compact" class="pa-0">
            <v-list-item to="/products" class="link-item pa-0 min-h-0 mb-2">
              <template v-slot:prepend>
                <v-icon size="small" class="mr-2">mdi-chevron-right</v-icon>
              </template>
              Tất cả sản phẩm
            </v-list-item>
            <v-list-item to="/products?category=figures" class="link-item pa-0 min-h-0 mb-2">
              <template v-slot:prepend>
                <v-icon size="small" class="mr-2">mdi-chevron-right</v-icon>
              </template>
              Figures
            </v-list-item>
            <v-list-item to="/products?category=nendoroids" class="link-item pa-0 min-h-0 mb-2">
              <template v-slot:prepend>
                <v-icon size="small" class="mr-2">mdi-chevron-right</v-icon>
              </template>
              Nendoroids
            </v-list-item>
            <v-list-item to="/products?category=plushies" class="link-item pa-0 min-h-0 mb-2">
              <template v-slot:prepend>
                <v-icon size="small" class="mr-2">mdi-chevron-right</v-icon>
              </template>
              Gấu bông
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="6" md="3">
          <h4 class="text-subtitle-1 font-weight-bold mb-4 neon-text-primary">Hỗ trợ</h4>
          <v-list bg-color="transparent" density="compact" class="pa-0">
            <v-list-item href="#" class="link-item pa-0 min-h-0 mb-2">Câu hỏi thường gặp</v-list-item>
            <v-list-item href="#" class="link-item pa-0 min-h-0 mb-2">Chính sách giao hàng</v-list-item>
            <v-list-item href="#" class="link-item pa-0 min-h-0 mb-2">Theo dõi đơn</v-list-item>
            <v-list-item href="#" class="link-item pa-0 min-h-0 mb-2">Yêu cầu bảo hành</v-list-item>
          </v-list>
        </v-col>

        <v-col cols="6" md="3">
          <h4 class="text-subtitle-1 font-weight-bold mb-4 neon-text-primary">Cộng đồng</h4>
          <v-list bg-color="transparent" density="compact" class="pa-0">
            <v-list-item href="#" class="link-item pa-0 min-h-0 mb-2">Discord collectors</v-list-item>
            <v-list-item href="#" class="link-item pa-0 min-h-0 mb-2">Blog review</v-list-item>
            <v-list-item href="#" class="link-item pa-0 min-h-0 mb-2">Sự kiện offline</v-list-item>
            <v-list-item href="#" class="link-item pa-0 min-h-0 mb-2">Chương trình đại sứ</v-list-item>
          </v-list>
        </v-col>

        <v-col cols="6" md="3">
          <h4 class="text-subtitle-1 font-weight-bold mb-4 neon-text-primary">Kết nối</h4>
          <div class="text-body-2 text-medium-emphasis">
            <p class="mb-2">
              <v-icon size="small" class="mr-2">mdi-email</v-icon>
              <a href="mailto:hello@wibushop.vn" class="link-item">hello@wibushop.vn</a>
            </p>
            <p class="mb-2">
              <v-icon size="small" class="mr-2">mdi-phone</v-icon>
              <a href="tel:+84123456789" class="link-item">+84 123 456 789</a>
            </p>
            <p class="mb-4">
              <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
              77 Nguyễn Trãi, Hà Nội
            </p>
            <div class="d-flex ga-2">
              <v-btn icon size="small" variant="outlined" color="primary" class="social-btn">
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <v-btn icon size="small" variant="outlined" color="primary" class="social-btn">
                <v-icon>mdi-instagram</v-icon>
              </v-btn>
              <v-btn icon size="small" variant="outlined" color="primary" class="social-btn">
                <v-icon>mdi-youtube</v-icon>
              </v-btn>
              <v-btn icon size="small" variant="outlined" color="primary" class="social-btn">
                <v-icon>mdi-twitter</v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Bottom Bar -->
      <v-divider class="mt-12 mb-8" style="border-color: rgba(0, 212, 255, 0.15);" />
      <div class="d-flex flex-column flex-md-row justify-space-between align-center text-caption text-medium-emphasis">
        <p>© 2025 Wibu Shop Collective. All rights reserved.</p>
        <div class="d-flex ga-4 mt-3 mt-md-0">
          <a href="#" class="link-item">Chính sách bảo mật</a>
          <a href="#" class="link-item">Điều khoản</a>
          <a href="#" class="link-item">Cookies</a>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
.app-footer {
  background: linear-gradient(180deg, #0a0a0f 0%, #050508 100%) !important;
  position: relative;
}

.footer-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.5;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.02) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.logo-avatar {
  background: linear-gradient(135deg, #00d4ff 0%, #ff00ff 100%);
  color: #000;
}

.newsletter-box {
  position: relative;
  overflow: hidden;
}

.newsletter-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #00d4ff, #ff00ff);
}

.newsletter-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.1);
}

.newsletter-input :deep(.v-field:focus-within) {
  border-color: rgba(255, 0, 255, 0.5);
}

.link-item {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.link-item:hover {
  color: #00d4ff !important;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.social-btn {
  transition: all 0.3s ease;
}

.social-btn:hover {
  background: rgba(0, 212, 255, 0.15) !important;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}

.neon-text-primary {
  color: #00d4ff;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}

.gradient-text {
  background: linear-gradient(90deg, #00d4ff 0%, #ff00ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>