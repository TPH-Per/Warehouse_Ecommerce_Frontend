<template>
  <footer class="bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">OP</span>
            </div>
            <span class="text-xl font-bold">Otaku Paradise</span>
          </div>
          <p class="text-gray-400 mb-4 max-w-md">
            Điểm đến hàng đầu của bạn cho figures anime chính hãng, đồ sưu tập và gấu bông. 
            Chúng tôi mang đến cho bạn những sản phẩm mới nhất từ các nhà sản xuất hàng đầu trên toàn thế giới.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <span class="sr-only">Facebook</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Liên kết nhanh</h3>
          <ul class="space-y-2">
            <li><router-link to="/products" class="text-gray-400 hover:text-white transition-colors">Tất cả sản phẩm</router-link></li>
            <li><router-link to="/products?category=figures" class="text-gray-400 hover:text-white transition-colors">Figures</router-link></li>
            <li><router-link to="/products?category=nendoroids" class="text-gray-400 hover:text-white transition-colors">Nendoroids</router-link></li>
            <li><router-link to="/products?category=plushies" class="text-gray-400 hover:text-white transition-colors">Gấu bông</router-link></li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Chăm sóc khách hàng</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Thông tin vận chuyển</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Trả hàng</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Liên hệ</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400 text-sm">© 2025 Otaku Paradise. Tất cả quyền được bảo lưu.</p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Chính sách bảo mật</a>
          <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Điều khoản dịch vụ</a>
        </div>
      </div>
    </div>
  </footer>
</template>
