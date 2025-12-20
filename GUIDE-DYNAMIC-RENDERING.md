# 📚 HƯỚNG DẪN RENDER ĐỘNG DỮ LIỆU TỪ API

> Tài liệu này tổng hợp tất cả những gì đã làm để triển khai hệ thống render động dữ liệu từ ASP.NET API sang Vue.js frontend.

---

## 📋 MỤC LỤC

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Các files đã tạo](#2-các-files-đã-tạo)
3. [ProductListPage - Danh sách sản phẩm](#3-productlistpage---danh-sách-sản-phẩm)
4. [ProductDetailPage - Chi tiết sản phẩm](#4-productdetailpage---chi-tiết-sản-phẩm)
5. [Branches & Inventory - Chi nhánh và tồn kho](#5-branches--inventory---chi-nhánh-và-tồn-kho)
6. [API Controllers cần tạo (C#)](#6-api-controllers-cần-tạo-c)
7. [Xử lý PascalCase vs camelCase](#7-xử-lý-pascalcase-vs-camelcase)
8. [Best Practices](#8-best-practices)

---

## 1. TỔNG QUAN KIẾN TRÚC

### Flow dữ liệu

```
┌─────────────────────────────────────────────────────────────────┐
│                        VUE COMPONENT                            │
│  (ProductListPage.vue, ProductDetailPage.vue, ...)              │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ onMounted() {                                          │    │
│  │   productsStore.fetchProducts();                       │    │
│  │ }                                                       │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PINIA STORE                              │
│  (products.store.ts, branches.store.ts, ...)                    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ async fetchProducts() {                                │    │
│  │   const response = await productsApi.getAll();         │    │
│  │   products.value = response.data.Data;                 │    │
│  │ }                                                       │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API SERVICE                              │
│  (products.api.ts, branches.api.ts, ...)                        │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ getAll: () => apiClient.get('/products')               │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        AXIOS INSTANCE                           │
│  (src/api/index.ts)                                             │
│                                                                 │
│  baseURL: 'https://localhost:44377/api'                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        ASP.NET API                              │
│  (ApiProductsController, ApiBranchesController, ...)            │
│                                                                 │
│  return Ok(new { Success = true, Data = ..., Message = "" });   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. CÁC FILES ĐÃ TẠO

### 📁 API Services (`src/api/`)

| File | Mô tả |
|------|-------|
| `index.ts` | Axios instance với config chung |
| `products.api.ts` | API calls cho sản phẩm |
| `categories.api.ts` | API calls cho danh mục |
| `suppliers.api.ts` | API calls cho nhà cung cấp |
| `branches.api.ts` | API calls cho chi nhánh & tồn kho |

### 📁 Pinia Stores (`src/stores/`)

| File | Mô tả |
|------|-------|
| `products.store.ts` | State management cho sản phẩm |
| `categories.store.ts` | State management cho danh mục |
| `suppliers.store.ts` | State management cho nhà cung cấp |
| `branches.store.ts` | State management cho chi nhánh & tồn kho |
| `auth.store.ts` | State management cho authentication |

### 📁 Pages đã cập nhật (`src/pages/`)

| File | Thay đổi |
|------|----------|
| `ProductListPage.vue` | Render động sản phẩm, filter, placeholder image |
| `ProductDetailPage.vue` | Render động chi tiết SP, variants, branches, stock |
| `ProfilePage.vue` | Hiển thị thông tin user từ auth store |
| `LoginPage.vue` | Xử lý response PascalCase từ API |
| `RegisterPage.vue` | Gửi request PascalCase tới API |

---

## 3. PRODUCTLISTPAGE - DANH SÁCH SẢN PHẨM

### 3.1 Import stores

```typescript
import { useProductsStore } from '@/stores/products.store';
import { useCategoriesStore } from '@/stores/categories.store';
import { useSuppliersStore } from '@/stores/suppliers.store';

const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const suppliersStore = useSuppliersStore();
```

### 3.2 Computed properties

```typescript
// Lấy products từ store
const products = computed(() => productsStore.products);
const loading = computed(() => productsStore.isLoading);
const totalProducts = computed(() => productsStore.total);

// Lấy filter options từ stores
const categories = computed(() => categoriesStore.categoryOptions);
const suppliers = computed(() => suppliersStore.supplierOptions);
```

### 3.3 Fetch data khi mount

```typescript
onMounted(async () => {
  await Promise.all([
    productsStore.fetchProducts(),
    categoriesStore.fetchCategories(),
    suppliersStore.fetchSuppliers(),
  ]);
});
```

### 3.4 Placeholder image cho sản phẩm không có ảnh

```typescript
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,' + btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect fill="#1a1a2e" width="400" height="400"/>
    <rect fill="#16213e" x="50" y="50" width="300" height="300" rx="20"/>
    <path fill="#0f3460" d="M200 120 L280 220 L120 220 Z"/>
    <circle fill="#e94560" cx="260" cy="140" r="25"/>
    <text x="200" y="320" text-anchor="middle" fill="#666">No Image</text>
  </svg>
`);

const getProductImage = (product) => {
  const imageUrl = product.ImageUrl || product.imageUrl;
  if (!imageUrl || imageUrl === '' || imageUrl === null) {
    return PLACEHOLDER_IMAGE;
  }
  return imageUrl;
};
```

### 3.5 Template bindings (PascalCase)

```vue
<v-col v-for="product in products" :key="product.Id">
  <v-card>
    <v-img :src="getProductImage(product)" />
    <v-card-title>{{ product.Name }}</v-card-title>
    <v-chip>{{ product.CategoryName || 'Chưa phân loại' }}</v-chip>
    <span>{{ formatPrice(product.Price) }}</span>
    <v-btn :to="`/product?id=${product.Id}`">Chi tiết</v-btn>
  </v-card>
</v-col>
```

---

## 4. PRODUCTDETAILPAGE - CHI TIẾT SẢN PHẨM

### 4.1 Import stores và router

```typescript
import { useRoute } from 'vue-router';
import { useProductsStore } from '@/stores/products.store';
import { useBranchesStore } from '@/stores/branches.store';

const route = useRoute();
const productsStore = useProductsStore();
const branchesStore = useBranchesStore();
```

### 4.2 Xử lý product data với cả PascalCase và camelCase

```typescript
const product = computed(() => {
  const p = productsStore.currentProduct;
  if (!p) return null;
  
  return {
    id: (p as any).Id ?? (p as any).id ?? 0,
    name: (p as any).Name ?? (p as any).name ?? 'Sản phẩm',
    description: (p as any).Description ?? (p as any).description ?? '',
    status: (p as any).Status ?? (p as any).status ?? 'active',
    category: {
      id: (p as any).Category?.Id ?? (p as any).category?.id ?? 0,
      name: (p as any).Category?.Name ?? (p as any).CategoryName ?? 'Chưa phân loại',
    },
    supplier: {
      id: (p as any).Supplier?.Id ?? (p as any).supplier?.id ?? 0,
      name: (p as any).Supplier?.Name ?? (p as any).SupplierName ?? '',
    },
    variants: ((p as any).Variants ?? (p as any).variants ?? []).map((v: any) => ({
      id: v.Id ?? v.id,
      name: v.Name ?? v.name ?? 'Standard',
      sku: v.Sku ?? v.sku ?? '',
      price: v.Price ?? v.price ?? 0,
      original_price: v.OriginalPrice ?? v.original_price ?? null,
      image_url: v.ImageUrl ?? v.image_url ?? PLACEHOLDER_IMAGE
    })),
    // ...
  };
});
```

### 4.3 Watch route để fetch product

```typescript
watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      const productId = Number(newId);
      if (!isNaN(productId)) {
        productsStore.fetchProductById(productId);
        branchesStore.clearStocks();
        selectedVariantId.value = null;
        quantity.value = 1;
      }
    }
  },
  { immediate: true }
);
```

### 4.4 Watch variant để fetch stock

```typescript
watch(() => selectedVariant.value, async (newVariant) => {
  if (newVariant?.id) {
    await branchesStore.fetchStockByVariant(newVariant.id);
    
    // Tự động chọn chi nhánh đầu tiên có hàng
    const branches = availableBranches.value;
    const firstAvailable = branches.find(b => b.stock > 0);
    if (firstAvailable) {
      selectedBranchId.value = firstAvailable.id;
    }
  }
});
```

### 4.5 Loading và Error states

```vue
<template>
  <div class="product-detail-page">
    <!-- Loading -->
    <v-container v-if="isLoading">
      <v-progress-circular indeterminate />
      <p>Đang tải sản phẩm...</p>
    </v-container>

    <!-- Error -->
    <v-container v-else-if="error">
      <v-icon color="error">mdi-alert-circle</v-icon>
      <p>{{ error }}</p>
    </v-container>

    <!-- Content -->
    <template v-else-if="product">
      <!-- Product content here -->
    </template>
  </div>
</template>
```

---

## 5. BRANCHES & INVENTORY - CHI NHÁNH VÀ TỒN KHO

### 5.1 API Service (`branches.api.ts`)

```typescript
export const branchesApi = {
  // Lấy tất cả chi nhánh
  getAll: () => apiClient.get('/branches'),

  // Lấy tồn kho của variant tại tất cả chi nhánh
  getStockByVariant: (variantId: number) => {
    return apiClient.get(`/branches/stock/variant/${variantId}`);
  },

  // Lấy tồn kho của product tại tất cả chi nhánh
  getStockByProduct: (productId: number) => {
    return apiClient.get(`/branches/stock/product/${productId}`);
  },
};
```

### 5.2 Store (`branches.store.ts`)

```typescript
export const useBranchesStore = defineStore('branches', () => {
  const branches = ref<Branch[]>([]);
  const variantStocks = ref<BranchStock[]>([]);
  const isLoading = ref(false);

  // Computed
  const availableBranches = computed(() => 
    variantStocks.value.filter(s => s.Stock > 0)
  );

  const totalStock = computed(() => 
    variantStocks.value.reduce((sum, s) => sum + s.Stock, 0)
  );

  // Actions
  const fetchStockByVariant = async (variantId: number) => {
    isLoading.value = true;
    try {
      const response = await branchesApi.getStockByVariant(variantId);
      variantStocks.value = response.data.Data.map((s: any) => ({
        BranchId: s.BranchId,
        BranchName: s.BranchName,
        Location: s.Location,
        VariantId: s.VariantId,
        Stock: s.Stock,
      }));
    } finally {
      isLoading.value = false;
    }
  };

  return { branches, variantStocks, isLoading, availableBranches, totalStock, fetchStockByVariant };
});
```

### 5.3 Template hiển thị chi nhánh

```vue
<!-- Loading Stock -->
<v-card v-if="isLoadingStock" class="pa-4 text-center">
  <v-progress-circular indeterminate />
  <span>Đang tải thông tin tồn kho...</span>
</v-card>

<!-- No Branches -->
<v-card v-else-if="availableBranches.length === 0" class="pa-4 text-center">
  <v-icon color="warning">mdi-alert</v-icon>
  <span>Không có chi nhánh nào có sẵn sản phẩm này</span>
</v-card>

<!-- Branch List -->
<v-card v-else>
  <v-radio-group v-model="selectedBranchId">
    <v-radio v-for="branch in availableBranches" :key="branch.id" :value="branch.id">
      <template v-slot:label>
        <div>{{ branch.name }}</div>
        <div>{{ branch.location }}</div>
        <v-chip :color="branch.stock > 0 ? 'success' : 'error'">
          {{ branch.stock > 0 ? `Còn ${branch.stock}` : 'Hết hàng' }}
        </v-chip>
      </template>
    </v-radio>
  </v-radio-group>
</v-card>
```

---

## 6. API CONTROLLERS CẦN TẠO (C#)

### 6.1 Products Controller

```csharp
[RoutePrefix("api/products")]
public class ApiProductsController : ApiController
{
    private readonly Entities _db = new Entities();

    // GET /api/products - Danh sách sản phẩm
    [HttpGet]
    [Route("")]
    public IHttpActionResult GetAll()
    {
        var products = _db.products
            .Include(p => p.category)
            .Include(p => p.supplier)
            .Where(p => p.deleted_at == null && p.status == "active")
            .Select(p => new
            {
                Id = p.id,
                Name = p.name,
                Slug = p.slug,
                Description = p.description,
                Status = p.status,
                CategoryName = p.category.name,
                SupplierName = p.supplier.name,
                Price = p.product_variants.Min(v => v.price),
                ImageUrl = p.product_variants.FirstOrDefault().image_url
            })
            .ToList();

        return Ok(new { Success = true, Data = products, Total = products.Count });
    }

    // GET /api/products/{id} - Chi tiết sản phẩm
    [HttpGet]
    [Route("{id:long}")]
    public IHttpActionResult GetById(long id)
    {
        var product = _db.products
            .Include(p => p.category)
            .Include(p => p.supplier)
            .Include(p => p.product_variants)
            .FirstOrDefault(p => p.id == id && p.deleted_at == null);

        if (product == null) return NotFound();

        return Ok(new
        {
            Success = true,
            Data = new
            {
                Id = product.id,
                Name = product.name,
                Description = product.description,
                Status = product.status,
                Category = new { Id = product.category.id, Name = product.category.name },
                Supplier = new { Id = product.supplier.id, Name = product.supplier.name },
                Variants = product.product_variants.Select(v => new
                {
                    Id = v.id,
                    Name = v.name,
                    Sku = v.sku,
                    Price = v.price,
                    OriginalPrice = v.original_price,
                    ImageUrl = v.image_url
                })
            }
        });
    }
}
```

### 6.2 Branches Controller

```csharp
[RoutePrefix("api/branches")]
public class ApiBranchesController : ApiController
{
    private readonly Entities _db = new Entities();

    // GET /api/branches
    [HttpGet]
    [Route("")]
    public IHttpActionResult GetAll()
    {
        var branches = _db.branches
            .Where(b => b.created_at != null)
            .Select(b => new { Id = b.id, Name = b.name, Location = b.location })
            .ToList();

        return Ok(new { Success = true, Data = branches });
    }

    // GET /api/branches/stock/variant/{variantId}
    [HttpGet]
    [Route("stock/variant/{variantId:long}")]
    public IHttpActionResult GetStockByVariant(long variantId)
    {
        var stocks = _db.branch_inventories
            .Include(i => i.branch)
            .Include(i => i.product_variants)
            .Where(i => i.product_variant_id == variantId)
            .Select(i => new
            {
                BranchId = i.branch_id,
                BranchName = i.branch.name,
                Location = i.branch.location,
                VariantId = i.product_variant_id,
                VariantName = i.product_variants.name,
                Stock = i.quantity_on_hand
            })
            .ToList();

        return Ok(new { Success = true, Data = stocks });
    }
}
```

### 6.3 Categories Controller

```csharp
[RoutePrefix("api/categories")]
public class ApiCategoriesController : ApiController
{
    private readonly Entities _db = new Entities();

    [HttpGet]
    [Route("")]
    public IHttpActionResult GetAll()
    {
        var categories = _db.categories
            .Where(c => c.deleted_at == null)
            .Select(c => new { Id = c.id, Name = c.name, Slug = c.slug })
            .ToList();

        return Ok(new { Success = true, Data = categories });
    }
}
```

### 6.4 Suppliers Controller

```csharp
[RoutePrefix("api/suppliers")]
public class ApiSuppliersController : ApiController
{
    private readonly Entities _db = new Entities();

    [HttpGet]
    [Route("")]
    public IHttpActionResult GetAll()
    {
        var suppliers = _db.suppliers
            .Where(s => s.deleted_at == null)
            .Select(s => new { Id = s.id, Name = s.name })
            .ToList();

        return Ok(new { Success = true, Data = suppliers });
    }
}
```

---

## 7. XỬ LÝ PASCALCASE VS CAMELCASE

### Vấn đề

| ASP.NET trả về (PascalCase) | JavaScript thường dùng (camelCase) |
|-----------------------------|------------------------------------|
| `product.Id` | `product.id` |
| `product.Name` | `product.name` |
| `product.CategoryName` | `product.categoryName` |
| `product.ImageUrl` | `product.imageUrl` |

### Giải pháp 1: Xử lý trong Store (Recommended)

```typescript
const handleResponse = (data: any) => {
  const isSuccess = data.Success ?? data.success;
  const items = data.Data ?? data.data;
  const message = data.Message ?? data.message;
  return { isSuccess, items, message };
};
```

### Giải pháp 2: Xử lý trong Component

```typescript
const product = computed(() => {
  const p = productsStore.currentProduct;
  return {
    id: (p as any).Id ?? (p as any).id,
    name: (p as any).Name ?? (p as any).name,
    // ...
  };
});
```

### Giải pháp 3: Cấu hình ASP.NET (Server-side)

```csharp
// Trong Global.asax hoặc WebApiConfig
var formatters = GlobalConfiguration.Configuration.Formatters;
var jsonFormatter = formatters.JsonFormatter;
jsonFormatter.SerializerSettings.ContractResolver = 
    new CamelCasePropertyNamesContractResolver();
```

---

## 8. BEST PRACTICES

### ✅ Nên làm

1. **Tách biệt concerns**: API Service → Store → Component
2. **Sử dụng computed properties** để transform data
3. **Xử lý loading và error states** trong UI
4. **Cache data** trong store để tránh fetch lại
5. **Dùng watchers** để react với route changes
6. **Placeholder images** cho media không có

### ❌ Không nên làm

1. Gọi API trực tiếp trong component
2. Hardcode mock data trong production
3. Bỏ qua error handling
4. Không hiển thị loading state
5. Assume casing của API response

---

## 📝 CHECKLIST TRƯỚC KHI DEPLOY

- [ ] Tạo đầy đủ API Controllers ở backend
- [ ] Test tất cả endpoints với Postman
- [ ] Kiểm tra CORS configuration
- [ ] Verify response format (`{ Success, Data, Message }`)
- [ ] Test loading states
- [ ] Test error states
- [ ] Test empty states
- [ ] Kiểm tra placeholder images hiển thị đúng

---

## 🔗 FILES LIÊN QUAN

- `GUIDE-FETCH-DATA.md` - Hướng dẫn fetch data chi tiết
- `GUIDE-API-CONTROLLER.md` - Hướng dẫn tạo API Controller
- `TODO-API-INTEGRATION.md` - Danh sách APIs cần tích hợp
- `db(1).txt` - Database schema

---

*Tài liệu này được tạo bởi Antigravity AI - 21/12/2024*
