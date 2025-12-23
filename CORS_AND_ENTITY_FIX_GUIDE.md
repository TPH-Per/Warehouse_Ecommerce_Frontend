# 🔧 HƯỚNG DẪN SỬA LỖI CORS VÀ ENTITY MODEL

## 📋 Tổng quan vấn đề

### Vấn đề 1: Lỗi CORS
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://localhost:44377/api/categories
```

### Vấn đề 2: Entity Model không sync với Database
- `purchase_orders` table trong database có `branch_id`
- Nhưng entity C# không có property này

---

## ✅ CÁC SỬA ĐỔI ĐÃ THỰC HIỆN

### 1. Cập nhật `purchase_orders.cs`
**Thay đổi:**
- Thêm property `branch_id`
- Thêm navigation property `branch`

```csharp
// Thêm vào sau discount_id
public Nullable<long> branch_id { get; set; }

// Thêm navigation property
public virtual branch branch { get; set; }
```

### 2. Cập nhật `branch.cs`
**Thay đổi:**
- Thêm collection `purchase_orders` vào constructor
- Thêm navigation property `purchase_orders`

```csharp
// Trong constructor:
this.purchase_orders = new HashSet<purchase_orders>();

// Property:
public virtual ICollection<purchase_orders> purchase_orders { get; set; }
```

### 3. Cập nhật `ApiOrdersController.cs`
**Thay đổi:**
- Thêm `.Include(o => o.branch)` 
- Thêm `BranchId` và `BranchName` vào response
- Sửa `d.product_variant` thành `d.product_variants` (đúng tên trong entity)
- Sửa `p.payment_method` thành `p.payment_methods` (đúng tên trong entity)

---

## 🛠️ GIẢI QUYẾT LỖI CORS

### Nguyên nhân
Lỗi CORS với status code `(null)` thường là do:
1. **Backend không chạy** - Server không phản hồi
2. **SSL Certificate không được trust** - Browser reject self-signed certificate
3. **IIS Express chưa start**

### Các bước sửa

#### Bước 1: Kiểm tra Backend đang chạy
1. Mở Visual Studio
2. Nhấn F5 hoặc Ctrl+F5 để chạy project
3. Đợi IIS Express khởi động

#### Bước 2: Accept SSL Certificate
1. Mở browser (Chrome/Firefox)
2. Truy cập trực tiếp: `https://localhost:44377/api/categories`
3. Nếu thấy cảnh báo SSL, click **Advanced** → **Proceed to localhost (unsafe)** hoặc **Accept the Risk and Continue**

#### Bước 3: Xác nhận CORS đã được cấu hình (đã có sẵn)
Trong `Global.asax.cs` đã có cấu hình CORS:

```csharp
protected void Application_BeginRequest(object sender, EventArgs e)
{
    var context = HttpContext.Current;
    var origin = context.Request.Headers["Origin"];

    var allowedOrigins = new[] { "http://localhost:3000", "http://localhost:5173" };

    if (!string.IsNullOrEmpty(origin) && allowedOrigins.Contains(origin))
    {
        context.Response.AddHeader("Access-Control-Allow-Origin", origin);
        context.Response.AddHeader("Access-Control-Allow-Credentials", "true");
        context.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, Authorization");
        context.Response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    }

    if (context.Request.HttpMethod == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        context.Response.End();
    }
}
```

#### Bước 4: Kiểm tra Frontend đang chạy đúng port
Đảm bảo Frontend chạy trên một trong các port được phép:
- `http://localhost:3000`
- `http://localhost:5173`

Nếu Frontend chạy port khác, thêm vào `allowedOrigins` trong `Global.asax.cs`.

---

## 🔍 KIỂM TRA SAU KHI SỬA

### Test API trực tiếp trong browser:
1. `https://localhost:44377/api/categories` - Danh sách category
2. `https://localhost:44377/api/products` - Danh sách products
3. `https://localhost:44377/api/cart` - Giỏ hàng (cần login)
4. `https://localhost:44377/api/orders` - Đơn hàng (cần login)

### Test với PowerShell:
```powershell
# Test categories
Invoke-RestMethod -Uri "https://localhost:44377/api/categories" -Method GET

# Test products
Invoke-RestMethod -Uri "https://localhost:44377/api/products" -Method GET
```

---

## 📊 SO SÁNH ENTITY VỚI DATABASE

### Bảng `purchase_orders`

| Column (Database) | Property (Entity) | Status |
|-------------------|-------------------|--------|
| `id` | `id` | ✅ |
| `user_id` | `user_id` | ✅ |
| `order_code` | `order_code` | ✅ |
| `status` | `status` | ✅ |
| `shipping_recipient_name` | `shipping_recipient_name` | ✅ |
| `shipping_recipient_phone` | `shipping_recipient_phone` | ✅ |
| `shipping_address` | `shipping_address` | ✅ |
| `sub_total` | `sub_total` | ✅ |
| `shipping_fee` | `shipping_fee` | ✅ |
| `discount_amount` | `discount_amount` | ✅ |
| `total_amount` | `total_amount` | ✅ |
| `discount_id` | `discount_id` | ✅ |
| `branch_id` | `branch_id` | ✅ **ĐÃ THÊM** |
| `created_at` | `created_at` | ✅ |
| `updated_at` | `updated_at` | ✅ |
| `deleted_at` | `deleted_at` | ✅ |

### Navigation Properties

| Entity | Relationship | Target Entity | Status |
|--------|--------------|---------------|--------|
| `purchase_orders` | → `branch` | `branch` | ✅ **ĐÃ THÊM** |
| `purchase_orders` | → `user` | `user` | ✅ |
| `purchase_orders` | → `discount` | `discount` | ✅ |
| `purchase_orders` | → `payments` | `payment` (collection) | ✅ |
| `purchase_orders` | → `purchase_order_details` | `purchase_order_details` (collection) | ✅ |
| `branch` | → `purchase_orders` | `purchase_orders` (collection) | ✅ **ĐÃ THÊM** |

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Rebuild project** sau khi sửa entity files
2. **Restart IIS Express/Visual Studio** nếu cần
3. Nếu dùng EDMX:
   - Các file `.cs` được sinh tự động có thể bị ghi đè khi regenerate
   - Nên cập nhật EDMX từ database để đồng bộ

### Cách cập nhật EDMX (nếu cần):
1. Double-click vào `Perw.edmx`
2. Right-click trong designer → **Update Model from Database**
3. Chọn các bảng đã thay đổi → **Finish**
4. Save EDMX

---

**Ngày cập nhật:** 2025-12-23
