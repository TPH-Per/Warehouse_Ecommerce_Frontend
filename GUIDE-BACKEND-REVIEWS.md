# GUIDE - Backend API Product Reviews

## Ngày tạo: 2025-12-23

## Mục tiêu
Hướng dẫn Backend implement API cho tính năng đánh giá sản phẩm (Product Reviews).

---

## 📊 Cấu trúc bảng `product_reviews`

```sql
CREATE TABLE [dbo].[product_reviews](
    [user_id] [bigint] NOT NULL,           -- FK → users.id
    [product_id] [bigint] NOT NULL,        -- FK → products.id
    [rating] [tinyint] NOT NULL,           -- 1-5 sao
    [comment] [nvarchar](max) NULL,        -- Nội dung đánh giá
    [is_approved] [bit] NOT NULL,          -- Default: 0
    [status] [nvarchar](255) NOT NULL,     -- Default: 'pending'
    [created_at] [datetime2](7) NULL,
    [updated_at] [datetime2](7) NULL,
    [deleted_at] [datetime2](7) NULL       -- Soft delete
)

-- Defaults
ALTER TABLE [dbo].[product_reviews] ADD DEFAULT ((0)) FOR [is_approved]
ALTER TABLE [dbo].[product_reviews] ADD DEFAULT ('pending') FOR [status]

-- Foreign Keys
FK_product_reviews_products → products(id) ON DELETE CASCADE
FK_product_reviews_users → users(id) ON DELETE CASCADE
```

### Lưu ý về Primary Key
Bảng hiện tại **KHÔNG có cột `id`**. Primary key nên là composite key: `(user_id, product_id)`.
Điều này có nghĩa: **Mỗi user chỉ có thể đánh giá 1 lần cho mỗi sản phẩm**.

### Status Values
- `pending` - Chờ duyệt (default)
- `approved` - Đã duyệt
- `rejected` - Bị từ chối

---

## 🔌 API Endpoints cần tạo

### 1. GET - Lấy danh sách đánh giá của sản phẩm

**Endpoint:** `GET /api/products/{productId}/reviews`

**Response:**
```json
{
  "Success": true,
  "Data": [
    {
      "UserId": 1,
      "ProductId": 123,
      "UserName": "Nguyễn Văn An",    // JOIN với users.full_name
      "Rating": 5,
      "Comment": "Sản phẩm tuyệt vời!",
      "IsApproved": true,
      "IsVerifiedPurchase": true,     // Kiểm tra user đã mua hàng chưa
      "Status": "approved",
      "CreatedAt": "2025-12-20T10:30:00",
      "UpdatedAt": null
    }
  ],
  "Message": null
}
```

**Query để kiểm tra "Verified Purchase":**
```sql
-- Kiểm tra user đã mua sản phẩm này chưa
SELECT CASE WHEN EXISTS (
    SELECT 1 FROM purchase_orders po
    JOIN purchase_order_details pod ON po.id = pod.order_id
    JOIN product_variants pv ON pod.product_variant_id = pv.id
    WHERE po.user_id = @UserId 
    AND pv.product_id = @ProductId
    AND po.status = 'delivered'  -- Đã nhận hàng
) THEN 1 ELSE 0 END AS IsVerifiedPurchase
```

**DTO Class cho Response (tạo trong thư mục Models):**
```csharp
// File: Models/ReviewResponse.cs
public class ReviewResponse
{
    public long UserId { get; set; }
    public long ProductId { get; set; }
    public string UserName { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    public bool IsApproved { get; set; }
    public bool IsVerifiedPurchase { get; set; }
    public string Status { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

**Backend Logic:**
```csharp
[HttpGet]
[Route("api/products/{productId}/reviews")]
public JsonResult GetProductReviews(long productId)
{
    try
    {
        // 1. Lấy user_id hiện tại (nếu đang đăng nhập)
        var currentUserId = GetCurrentUserId();
        
        // 2. Kiểm tra product tồn tại
        var product = db.products.Find(productId);
        if (product == null)
        {
            return Json(new { Success = false, Message = "Sản phẩm không tồn tại" }, JsonRequestBehavior.AllowGet);
        }
        
        // 3. Lấy danh sách reviews
        // CHẾ ĐỘ TEST: Lấy tất cả reviews (không cần is_approved)
        // Production: Chỉ lấy reviews đã approved HOẶC review của user hiện tại
        var reviewsQuery = db.product_reviews
            .Where(r => r.product_id == productId && r.deleted_at == null)
            // TEST MODE: Bỏ comment dòng dưới để dùng cho production
            // .Where(r => r.is_approved == true || r.user_id == currentUserId)
            .OrderByDescending(r => r.created_at)
            .ToList();
        
        // 4. Map sang DTO với thông tin user và verified purchase
        var reviews = reviewsQuery.Select(r => {
            // Lấy tên user
            var user = db.users.Find(r.user_id);
            var userName = user?.full_name ?? "Ẩn danh";
            
            // Kiểm tra verified purchase
            var isVerifiedPurchase = db.purchase_orders
                .Join(db.purchase_order_details, 
                    po => po.id, 
                    pod => pod.order_id, 
                    (po, pod) => new { po, pod })
                .Join(db.product_variants,
                    x => x.pod.product_variant_id,
                    pv => pv.id,
                    (x, pv) => new { x.po, pv })
                .Any(x => x.po.user_id == r.user_id 
                       && x.pv.product_id == productId 
                       && x.po.status == "delivered");
            
            return new ReviewResponse
            {
                UserId = r.user_id,
                ProductId = r.product_id,
                UserName = userName,
                Rating = r.rating,
                Comment = r.comment,
                IsApproved = r.is_approved,
                IsVerifiedPurchase = isVerifiedPurchase,
                Status = r.status,
                CreatedAt = r.created_at,
                UpdatedAt = r.updated_at
            };
        }).ToList();
        
        return Json(new { 
            Success = true, 
            Data = reviews,
            Message = (string)null
        }, JsonRequestBehavior.AllowGet);
    }
    catch (Exception ex)
    {
        System.Diagnostics.Debug.WriteLine($"[GetProductReviews] Error: {ex.Message}");
        return Json(new { 
            Success = false, 
            Message = "Đã xảy ra lỗi khi lấy danh sách đánh giá" 
        }, JsonRequestBehavior.AllowGet);
    }
}
```

**Lưu ý:**
- Chỉ trả về reviews có `is_approved = 1` (hoặc `status = 'approved'`) trong production
- HOẶC trả về review của chính user hiện tại (để họ thấy review đang chờ duyệt)
- JOIN với bảng `users` để lấy `full_name`
- ORDER BY `created_at DESC`


---

### 2. POST - Tạo đánh giá mới

**Endpoint:** `POST /api/products/{productId}/reviews`

**Headers:** Yêu cầu Authentication

**Request Body:**
```json
{
  "Rating": 5,
  "Comment": "Sản phẩm tuyệt vời, đóng gói cẩn thận!"
}
```

**DTO Class (tạo trong thư mục Models hoặc ViewModels):**
```csharp
// File: Models/ReviewCreateRequest.cs (hoặc ViewModels/ReviewCreateRequest.cs)
using System.ComponentModel.DataAnnotations;

public class ReviewCreateRequest
{
    [Required(ErrorMessage = "Rating là bắt buộc")]
    [Range(1, 5, ErrorMessage = "Rating phải từ 1 đến 5")]
    public int Rating { get; set; }

    [MaxLength(2000, ErrorMessage = "Comment không được quá 2000 ký tự")]
    public string Comment { get; set; }
}
```

**Backend Logic:**
```csharp
[HttpPost]
[Route("api/products/{productId}/reviews")]
public JsonResult CreateReview(long productId, ReviewCreateRequest request)
{
    // 1. Lấy user_id từ authentication
    var userId = GetCurrentUserId();
    if (userId == null)
    {
        return Json(new { Success = false, Message = "Vui lòng đăng nhập" });
    }

    // 2. Validate rating (1-5)
    if (request.Rating < 1 || request.Rating > 5)
    {
        return Json(new { Success = false, Message = "Rating phải từ 1-5" });
    }

    // 3. Kiểm tra product tồn tại
    var product = db.products.Find(productId);
    if (product == null)
    {
        return Json(new { Success = false, Message = "Sản phẩm không tồn tại" });
    }

    // 4. Kiểm tra user đã review chưa (vì PK là composite key)
    var existingReview = db.product_reviews
        .FirstOrDefault(r => r.user_id == userId && r.product_id == productId);
    
    if (existingReview != null)
    {
        return Json(new { Success = false, Message = "Bạn đã đánh giá sản phẩm này rồi" });
    }

    // 5. Tạo review mới
    // ⚡ CHẾ ĐỘ TEST: Tự động approved để tiện test
    // Khi deploy production, đổi is_approved = false và status = "pending"
    var review = new product_review
    {
        user_id = userId.Value,
        product_id = productId,
        rating = (byte)request.Rating,
        comment = request.Comment,
        is_approved = true,   // TEST MODE: Auto approve
        status = "approved", // TEST MODE: Auto approve
        created_at = DateTime.Now
    };

    db.product_reviews.Add(review);
    db.SaveChanges();

    return Json(new { 
        Success = true, 
        Message = "Đánh giá của bạn đã được gửi và đang chờ duyệt!",
        Data = review
    });
}
```

**Response Success:**
```json
{
  "Success": true,
  "Message": "Đánh giá của bạn đã được gửi và đang chờ duyệt!",
  "Data": {
    "UserId": 1,
    "ProductId": 123,
    "Rating": 5,
    "Comment": "...",
    "Status": "approved",  // TEST MODE: Auto approved
    "IsApproved": true,
    "CreatedAt": "2025-12-23T19:30:00"
  }
}
```

> ⚡ **Chế độ Test:** Reviews tự động được approved ngay khi tạo để tiện test UI. Khi deploy production, cần đổi lại `is_approved = false` và `status = "pending"`.

---

### 3. PUT - Cập nhật đánh giá (Optional)

**Endpoint:** `PUT /api/products/{productId}/reviews`

**Headers:** Yêu cầu Authentication

**Request Body:**
```json
{
  "Rating": 4,
  "Comment": "Cập nhật đánh giá..."
}
```

**Logic:**
- User chỉ có thể sửa review của chính mình
- Reset `is_approved = false` và `status = 'pending'` khi sửa (cần duyệt lại)
- Set `updated_at = DateTime.Now`

---

### 4. DELETE - Xóa đánh giá (Optional)

**Endpoint:** `DELETE /api/products/{productId}/reviews`

**Headers:** Yêu cầu Authentication

**Logic:**
- User chỉ có thể xóa review của chính mình
- Soft delete: Set `deleted_at = DateTime.Now`

---

### 5. GET - Lấy thống kê đánh giá (Optional)

**Endpoint:** `GET /api/products/{productId}/reviews/stats`

**Response:**
```json
{
  "Success": true,
  "Data": {
    "TotalReviews": 25,
    "AverageRating": 4.5,
    "RatingBreakdown": {
      "5": 15,
      "4": 6,
      "3": 3,
      "2": 1,
      "1": 0
    }
  }
}
```

---

## 🔐 Admin APIs (Duyệt đánh giá)

### 1. GET - Lấy danh sách reviews chờ duyệt

**Endpoint:** `GET /api/admin/reviews/pending`

**Response:** Danh sách reviews có `status = 'pending'`

### 2. PUT - Duyệt/Từ chối review

**Endpoint:** `PUT /api/admin/reviews/{userId}/{productId}/approve`

**Request Body:**
```json
{
  "Action": "approve",  // hoặc "reject"
  "Reason": "Lý do từ chối..." // optional, chỉ dùng khi reject
}
```

**Logic:**
```csharp
if (action == "approve")
{
    review.is_approved = true;
    review.status = "approved";
}
else if (action == "reject")
{
    review.is_approved = false;
    review.status = "rejected";
}
review.updated_at = DateTime.Now;
```

---

## 📝 SQL Queries hữu ích

### Lấy reviews với thông tin user
```sql
SELECT 
    pr.user_id,
    pr.product_id,
    u.full_name AS user_name,
    pr.rating,
    pr.comment,
    pr.is_approved,
    pr.status,
    pr.created_at,
    pr.updated_at,
    -- Kiểm tra verified purchase
    CASE WHEN EXISTS (
        SELECT 1 FROM purchase_orders po
        JOIN purchase_order_details pod ON po.id = pod.order_id
        JOIN product_variants pv ON pod.product_variant_id = pv.id
        WHERE po.user_id = pr.user_id 
        AND pv.product_id = pr.product_id
        AND po.status = 'delivered'
    ) THEN 1 ELSE 0 END AS is_verified_purchase
FROM product_reviews pr
JOIN users u ON pr.user_id = u.id
WHERE pr.product_id = @ProductId
AND (pr.is_approved = 1 OR pr.user_id = @CurrentUserId)
AND pr.deleted_at IS NULL
ORDER BY pr.created_at DESC
```

### Tính rating trung bình và cập nhật vào products
```sql
-- Cập nhật rating trong bảng products (nếu có cột rating)
UPDATE products
SET rating = (
    SELECT AVG(CAST(rating AS DECIMAL(3,2)))
    FROM product_reviews
    WHERE product_id = @ProductId
    AND is_approved = 1
    AND deleted_at IS NULL
)
WHERE id = @ProductId
```

---

## ⚠️ Lưu ý quan trọng

1. **Validation Rating:** Rating phải từ 1-5 (TINYINT)

2. **Composite Primary Key:** Vì không có cột `id`, backend cần xử lý với composite key `(user_id, product_id)`

3. **Soft Delete:** Sử dụng cột `deleted_at` thay vì xóa thật

4. **Moderation Flow:**
   - User tạo review → status = 'pending'
   - Admin duyệt → status = 'approved', is_approved = 1
   - User sửa review → status = 'pending', is_approved = 0 (cần duyệt lại)

5. **Verified Purchase Badge:** Kiểm tra trong bảng `purchase_orders` xem user đã mua sản phẩm này chưa

6. **Tính toán rating cho products:** Sau khi approve review, có thể trigger update rating trung bình trong bảng `products`

---

## 🔄 Frontend Integration

Frontend hiện đang sử dụng **mock data** tạm thời. Sau khi Backend hoàn thành API:

1. Uncomment các dòng gọi API trong `ProductDetailPage.vue`:
   ```typescript
   // Trong fetchReviews():
   const response = await apiClient.get(`/products/${product.value.id}/reviews`);
   reviews.value = response.data.Data || [];
   
   // Trong submitReview():
   const response = await apiClient.post(`/products/${product.value.id}/reviews`, {
     Rating: newReview.value.rating,
     Comment: newReview.value.comment,
   });
   ```

2. Xóa mock data trong `fetchReviews()`

3. Test các edge cases:
   - User chưa đăng nhập
   - User đã review rồi
   - Review đang chờ duyệt
   - Verified purchase badge
