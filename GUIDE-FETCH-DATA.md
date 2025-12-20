# 📚 HƯỚNG DẪN FETCH DATA TỪ SERVER

Hướng dẫn từng bước để lấy dữ liệu từ ASP.NET và hiển thị trên Vue.

---

## 📋 Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Bước 1: Tạo API Controller (C#)](#2-bước-1-tạo-api-controller-c)
3. [Bước 2: Tạo API Service (Vue)](#3-bước-2-tạo-api-service-vue)
4. [Bước 3: Tạo Pinia Store](#4-bước-3-tạo-pinia-store)
5. [Bước 4: Sử dụng trong Component](#5-bước-4-sử-dụng-trong-component)
6. [Ví dụ thực tế: Products](#6-ví-dụ-thực-tế-products)
7. [Tips & Best Practices](#7-tips--best-practices)

---

## 1. Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                         VUE FRONTEND                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Component (ProductListPage.vue)                          │
│        │                                                    │
│        │ Gọi action                                         │
│        ▼                                                    │
│   Pinia Store (products.store.ts)                          │
│        │                                                    │
│        │ Gọi API                                            │
│        ▼                                                    │
│   Axios (src/api/index.ts)                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Request (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     ASP.NET BACKEND                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   API Controller (ApiProductsController.cs)                │
│        │                                                    │
│        │ Query                                              │
│        ▼                                                    │
│   Entity Framework (PerwDbContext)                         │
│        │                                                    │
│        ▼                                                    │
│   SQL Server Database                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Bước 1: Tạo API Controller (C#)

### 2.1 Tạo file Controller

📁 **File:** `Controllers/Api/ApiProductsController.cs`

```csharp
using System;
using System.Linq;
using System.Web.Http;
using System.Data.Entity;

namespace YourProject.Controllers.Api
{
    /// <summary>
    /// API Controller cho Products
    /// URL: /api/products/...
    /// </summary>
    [RoutePrefix("api/products")]
    public class ApiProductsController : ApiController
    {
        private readonly PerwDbContext _db = new PerwDbContext();

        // ========================================
        // GET /api/products
        // Lấy danh sách tất cả sản phẩm
        // ========================================
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAll()
        {
            try
            {
                var products = _db.products
                    .Include(p => p.category)
                    .Include(p => p.product_variants)
                    .Where(p => p.deleted_at == null && p.status == "active")
                    .OrderByDescending(p => p.created_at)
                    .Take(20)
                    .Select(p => new
                    {
                        Id = p.id,
                        Name = p.name,
                        Slug = p.slug,
                        Description = p.description,
                        CategoryId = p.category_id,
                        CategoryName = p.category.name,
                        // Lấy giá từ variant đầu tiên
                        Price = p.product_variants.FirstOrDefault() != null
                            ? p.product_variants.FirstOrDefault().price
                            : 0,
                        OriginalPrice = p.product_variants.FirstOrDefault() != null
                            ? p.product_variants.FirstOrDefault().original_price
                            : 0,
                        ImageUrl = p.product_variants.FirstOrDefault() != null
                            ? p.product_variants.FirstOrDefault().image_url
                            : null,
                        CreatedAt = p.created_at
                    })
                    .ToList();

                return Ok(new
                {
                    Success = true,
                    Data = products,
                    Message = "Lấy danh sách sản phẩm thành công",
                    Total = products.Count
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"GetAll Error: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // ========================================
        // GET /api/products/{id}
        // Lấy chi tiết 1 sản phẩm
        // ========================================
        [HttpGet]
        [Route("{id:long}")]
        public IHttpActionResult GetById(long id)
        {
            try
            {
                var product = _db.products
                    .Include(p => p.category)
                    .Include(p => p.product_variants)
                    .FirstOrDefault(p => p.id == id && p.deleted_at == null);

                if (product == null)
                {
                    return Content(System.Net.HttpStatusCode.NotFound, new
                    {
                        Success = false,
                        Message = "Không tìm thấy sản phẩm"
                    });
                }

                var result = new
                {
                    Id = product.id,
                    Name = product.name,
                    Slug = product.slug,
                    Description = product.description,
                    Category = new
                    {
                        Id = product.category.id,
                        Name = product.category.name
                    },
                    Variants = product.product_variants.Select(v => new
                    {
                        Id = v.id,
                        Name = v.name,
                        Sku = v.sku,
                        Price = v.price,
                        OriginalPrice = v.original_price,
                        ImageUrl = v.image_url
                    }).ToList()
                };

                return Ok(new
                {
                    Success = true,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // ========================================
        // GET /api/products/category/{categoryId}
        // Lấy sản phẩm theo category
        // ========================================
        [HttpGet]
        [Route("category/{categoryId:long}")]
        public IHttpActionResult GetByCategory(long categoryId)
        {
            try
            {
                var products = _db.products
                    .Include(p => p.product_variants)
                    .Where(p => p.category_id == categoryId
                             && p.deleted_at == null
                             && p.status == "active")
                    .Select(p => new
                    {
                        Id = p.id,
                        Name = p.name,
                        Slug = p.slug,
                        Price = p.product_variants.FirstOrDefault().price,
                        ImageUrl = p.product_variants.FirstOrDefault().image_url
                    })
                    .ToList();

                return Ok(new
                {
                    Success = true,
                    Data = products,
                    Total = products.Count
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // ========================================
        // GET /api/products/search?q=keyword
        // Tìm kiếm sản phẩm
        // ========================================
        [HttpGet]
        [Route("search")]
        public IHttpActionResult Search([FromUri] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return Ok(new { Success = true, Data = new object[] { }, Total = 0 });
                }

                var keyword = q.ToLower().Trim();

                var products = _db.products
                    .Include(p => p.product_variants)
                    .Where(p => p.deleted_at == null
                             && p.status == "active"
                             && (p.name.ToLower().Contains(keyword)
                                 || p.description.ToLower().Contains(keyword)))
                    .Take(20)
                    .Select(p => new
                    {
                        Id = p.id,
                        Name = p.name,
                        Slug = p.slug,
                        Price = p.product_variants.FirstOrDefault().price,
                        ImageUrl = p.product_variants.FirstOrDefault().image_url
                    })
                    .ToList();

                return Ok(new
                {
                    Success = true,
                    Data = products,
                    Total = products.Count,
                    Keyword = q
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // Dispose DbContext
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
```

### 2.2 Response Format chuẩn

Tất cả API nên trả về format thống nhất:

```json
{
  "Success": true,
  "Data": { ... },
  "Message": "Thông báo",
  "Total": 10
}
```

---

## 3. Bước 2: Tạo API Service (Vue)

### 3.1 Tạo file API service

📁 **File:** `src/api/products.api.ts`

```typescript
/**
 * Products API Service
 * Tập trung các API call liên quan đến products
 */
import apiClient from '@/api';

export interface Product {
  Id: number;
  Name: string;
  Slug: string;
  Description?: string;
  CategoryId?: number;
  CategoryName?: string;
  Price: number;
  OriginalPrice?: number;
  ImageUrl?: string;
}

export interface ProductDetail extends Product {
  Category: {
    Id: number;
    Name: string;
  };
  Variants: Array<{
    Id: number;
    Name: string; 
    Sku: string;
    Price: number;
    OriginalPrice?: number;
    ImageUrl?: string;
  }>;
}

export const productsApi = {
  /**
   * Lấy tất cả sản phẩm
   */
  getAll: () => {
    return apiClient.get('/products');
  },

  /**
   * Lấy sản phẩm theo ID
   */
  getById: (id: number) => {
    return apiClient.get(`/products/${id}`);
  },

  /**
   * Lấy sản phẩm theo category
   */
  getByCategory: (categoryId: number) => {
    return apiClient.get(`/products/category/${categoryId}`);
  },

  /**
   * Tìm kiếm sản phẩm
   */
  search: (keyword: string) => {
    return apiClient.get('/products/search', {
      params: { q: keyword }
    });
  },
};

export default productsApi;
```

---

## 4. Bước 3: Tạo Pinia Store

### 4.1 Tạo store file

📁 **File:** `src/stores/products.store.ts`

```typescript
/**
 * Products Store
 * Quản lý state của products
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { productsApi, type Product, type ProductDetail } from '@/api/products.api';

export const useProductsStore = defineStore('products', () => {
  // ========== STATE ==========
  const products = ref<Product[]>([]);
  const currentProduct = ref<ProductDetail | null>(null);
  const isLoading = ref(false);
  const error = ref('');
  const total = ref(0);

  // ========== GETTERS ==========
  const hasProducts = computed(() => products.value.length > 0);
  const productCount = computed(() => products.value.length);

  // ========== HELPER: Xử lý response ==========
  const handleResponse = (data: any) => {
    // Hỗ trợ cả PascalCase và camelCase
    const isSuccess = data.Success ?? data.success;
    const items = data.Data ?? data.data;
    const message = data.Message ?? data.message;
    const count = data.Total ?? data.total ?? 0;

    return { isSuccess, items, message, count };
  };

  // ========== ACTIONS ==========

  /**
   * Lấy tất cả sản phẩm
   */
  const fetchProducts = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await productsApi.getAll();
      const { isSuccess, items, message, count } = handleResponse(response.data);

      if (isSuccess) {
        products.value = items || [];
        total.value = count;
      } else {
        error.value = message || 'Lỗi khi tải sản phẩm';
      }
    } catch (err: any) {
      error.value = err.response?.data?.Message || 'Không thể kết nối server';
      console.error('fetchProducts error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Lấy sản phẩm theo ID
   */
  const fetchProductById = async (id: number) => {
    isLoading.value = true;
    error.value = '';
    currentProduct.value = null;

    try {
      const response = await productsApi.getById(id);
      const { isSuccess, items, message } = handleResponse(response.data);

      if (isSuccess) {
        currentProduct.value = items;
      } else {
        error.value = message || 'Không tìm thấy sản phẩm';
      }
    } catch (err: any) {
      error.value = err.response?.data?.Message || 'Không thể tải sản phẩm';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Lấy sản phẩm theo category
   */
  const fetchByCategory = async (categoryId: number) => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await productsApi.getByCategory(categoryId);
      const { isSuccess, items, count } = handleResponse(response.data);

      if (isSuccess) {
        products.value = items || [];
        total.value = count;
      }
    } catch (err: any) {
      error.value = err.response?.data?.Message || 'Lỗi';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Tìm kiếm sản phẩm
   */
  const searchProducts = async (keyword: string) => {
    if (!keyword.trim()) {
      products.value = [];
      return;
    }

    isLoading.value = true;
    error.value = '';

    try {
      const response = await productsApi.search(keyword);
      const { isSuccess, items, count } = handleResponse(response.data);

      if (isSuccess) {
        products.value = items || [];
        total.value = count;
      }
    } catch (err: any) {
      error.value = err.response?.data?.Message || 'Lỗi tìm kiếm';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Clear current product
   */
  const clearCurrentProduct = () => {
    currentProduct.value = null;
  };

  return {
    // State
    products,
    currentProduct,
    isLoading,
    error,
    total,
    // Getters
    hasProducts,
    productCount,
    // Actions
    fetchProducts,
    fetchProductById,
    fetchByCategory,
    searchProducts,
    clearCurrentProduct,
  };
});
```

---

## 5. Bước 4: Sử dụng trong Component

### 5.1 Trong Page Component

📁 **File:** `src/pages/ProductListPage.vue`

```vue
<template>
  <v-main>
    <v-container>
      <!-- Loading -->
      <div v-if="productsStore.isLoading" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" />
        <p class="mt-4">Đang tải sản phẩm...</p>
      </div>

      <!-- Error -->
      <v-alert v-else-if="productsStore.error" type="error" class="my-4">
        {{ productsStore.error }}
      </v-alert>

      <!-- Products Grid -->
      <v-row v-else>
        <v-col
          v-for="product in productsStore.products"
          :key="product.Id"
          cols="12" sm="6" md="4" lg="3"
        >
          <v-card class="h-100">
            <v-img :src="product.ImageUrl" height="200" cover />
            <v-card-title>{{ product.Name }}</v-card-title>
            <v-card-text>
              <div class="text-h6 text-primary">
                {{ formatPrice(product.Price) }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn :to="`/product/${product.Id}`" color="primary">
                Xem chi tiết
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Empty -->
      <div v-if="!productsStore.isLoading && !productsStore.hasProducts" class="text-center py-8">
        <v-icon size="64" color="grey">mdi-package-variant</v-icon>
        <p class="text-grey mt-4">Không có sản phẩm nào</p>
      </div>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProductsStore } from '@/stores/products.store';

const productsStore = useProductsStore();

// Format giá tiền
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// Fetch products khi component mount
onMounted(() => {
  productsStore.fetchProducts();
});
</script>
```

### 5.2 Trong Detail Page

```vue
<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '@/stores/products.store';

const route = useRoute();
const productsStore = useProductsStore();

// Fetch product khi ID thay đổi
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      productsStore.fetchProductById(Number(newId));
    }
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="productsStore.currentProduct">
    <h1>{{ productsStore.currentProduct.Name }}</h1>
    <!-- ... -->
  </div>
</template>
```

---

## 6. Ví dụ thực tế: Products

### Flow hoàn chỉnh

```
1. User vào trang /products

2. ProductListPage.vue
   └── onMounted() gọi productsStore.fetchProducts()

3. products.store.ts
   └── fetchProducts() gọi productsApi.getAll()

4. products.api.ts
   └── apiClient.get('/products')

5. Axios gửi request đến:
   └── GET https://localhost:44377/api/products

6. ASP.NET ApiProductsController
   └── GetAll() query database và trả về JSON

7. Response đi ngược lại:
   └── Store cập nhật state
   └── Vue reactive update UI
```

---

## 7. Tips & Best Practices

### 7.1 Naming Convention

| C# (PascalCase) | Vue (camelCase) | Cách xử lý |
|-----------------|-----------------|------------|
| `Success` | `success` | `data.Success ?? data.success` |
| `Data` | `data` | `data.Data ?? data.data` |
| `ProductId` | `productId` | Map khi cần |

### 7.2 Error Handling

```typescript
try {
  const response = await api.get('/endpoint');
  // Handle success
} catch (err: any) {
  if (err.response?.status === 404) {
    // Not found
  } else if (err.response?.status === 401) {
    // Unauthorized - redirect to login
  } else {
    // Generic error
    error.value = err.response?.data?.Message || 'Lỗi không xác định';
  }
}
```

### 7.3 Loading State

```vue
<template>
  <!-- Luôn có 3 state: loading, error, data -->
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>{{ data }}</div>
</template>
```

### 7.4 Debug Tips

1. **F12 → Network tab** - Xem request/response
2. **Console.log** trong Vue
3. **Debug.WriteLine** trong C#
4. **Check CORS** nếu request bị block

---

## 📝 Checklist

### Khi tạo API mới:

**Backend (C#):**
- [ ] Tạo Controller với `[RoutePrefix("api/xxx")]`
- [ ] Thêm `[HttpGet]` hoặc `[HttpPost]`
- [ ] Thêm `[Route("")]` cho mỗi action
- [ ] Include related entities nếu cần
- [ ] Try-catch với error handling
- [ ] Return format chuẩn: `{ Success, Data, Message }`

**Frontend (Vue):**
- [ ] Tạo API service file (optional)
- [ ] Tạo Pinia store hoặc gọi trực tiếp
- [ ] Xử lý loading state
- [ ] Xử lý error state
- [ ] Map PascalCase → camelCase nếu cần

---

*Created: 2024-12-20*
