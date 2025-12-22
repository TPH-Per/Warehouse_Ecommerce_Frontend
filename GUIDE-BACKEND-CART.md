# 📋 HƯỚNG DẪN BACKEND: API Cart (Giỏ hàng)

> Tài liệu hướng dẫn tạo API endpoint để quản lý giỏ hàng
> **Lưu ý:** User phải đăng nhập để sử dụng các API này

---

## 🎯 MỤC TIÊU

Tạo API endpoints để:
1. Lấy giỏ hàng của user
2. Thêm sản phẩm vào giỏ
3. Cập nhật số lượng
4. Xóa sản phẩm
5. Áp dụng mã giảm giá

---

## ⚠️ QUAN TRỌNG: Enable Session cho Web API

**Vấn đề:** Web API mặc định không enable Session state, dẫn đến `NullReferenceException` khi truy cập `HttpContext.Current.Session`.

### Giải pháp: Thêm vào `Global.asax.cs`

```csharp
protected void Application_PostAuthorizeRequest()
{
    // Enable Session state cho Web API
    if (HttpContext.Current.Request.Path.ToLower().StartsWith("/api/"))
    {
        HttpContext.Current.SetSessionStateBehavior(
            System.Web.SessionState.SessionStateBehavior.Required);
    }
}
```

### Hoặc: Tạo Route Handler riêng

1. Tạo file `SessionEnabledHandler.cs`:

```csharp
using System.Web;
using System.Web.Http.WebHost;
using System.Web.Routing;
using System.Web.SessionState;

public class SessionEnabledControllerHandler : HttpControllerHandler, IRequiresSessionState
{
    public SessionEnabledControllerHandler(RouteData routeData) : base(routeData) { }
}

public class SessionEnabledRouteHandler : HttpControllerRouteHandler
{
    protected override IHttpHandler GetHttpHandler(RequestContext requestContext)
    {
        return new SessionEnabledControllerHandler(requestContext.RouteData);
    }
}
```

2. Trong `WebApiConfig.cs`:

```csharp
public static void Register(HttpConfiguration config)
{
    var route = config.Routes.MapHttpRoute(
        name: "DefaultApi",
        routeTemplate: "api/{controller}/{action}/{id}",
        defaults: new { id = RouteParameter.Optional }
    );
    route.RouteHandler = new SessionEnabledRouteHandler();
}
```

---

## 📊 DATABASE SCHEMA

### Bảng carts
```sql
CREATE TABLE [dbo].[carts](
  [id] [bigint] IDENTITY(1,1) NOT NULL,
  [user_id] [bigint] NOT NULL,           -- FK -> users.id
  [product_variant_id] [bigint] NOT NULL, -- FK -> product_variants.id
  [quantity] [int] NOT NULL,
  [price] [decimal](18, 2) NOT NULL,     -- Giá tại thời điểm add
  [created_at] [datetime2](7) NULL,
  [updated_at] [datetime2](7) NULL,
  [deleted_at] [datetime2](7) NULL,      -- Soft delete
  CONSTRAINT [PK_carts] PRIMARY KEY ([id]),
  -- Unique: 1 user + 1 variant + not deleted = 1 record
  CONSTRAINT [UQ_carts_user_variant_deleted] UNIQUE ([user_id], [product_variant_id], [deleted_at])
)
```

### Bảng product_variants (liên quan)
```sql
CREATE TABLE [dbo].[product_variants](
  [id] [bigint] IDENTITY(1,1) NOT NULL,
  [product_id] [bigint] NOT NULL,
  [name] [nvarchar](100) NOT NULL,
  [sku] [nvarchar](100) NOT NULL,
  [price] [decimal](10, 2) NOT NULL,
  [original_price] [decimal](10, 2) NULL,
  [image_url] [nvarchar](500) NULL,
  ...
)
```

---

## 🔧 API ENDPOINTS

### 1. GET /api/cart
**Mô tả:** Lấy giỏ hàng của user hiện tại

**Headers:**
- Cookie: Session login

**Response:**
```json
{
  "Success": true,
  "Data": [
    {
      "Id": 1,
      "UserId": 5,
      "ProductVariantId": 10,
      "Quantity": 2,
      "Price": 4250000,
      "CreatedAt": "2024-12-22T10:00:00",
      "ProductId": 3,
      "ProductName": "Gojo Satoru Figure",
      "ProductSlug": "gojo-satoru-figure",
      "VariantName": "Standard Edition",
      "VariantSku": "GSC-GOJO-001",
      "VariantImageUrl": "/uploads/products/gojo-001.jpg",
      "OriginalPrice": 5100000,
      "BranchId": 1,
      "BranchName": "Chi nhánh Hà Nội",
      "StockQuantity": 15
    }
  ],
  "Total": 1
}
```

### 2. POST /api/cart
**Mô tả:** Thêm sản phẩm vào giỏ hàng

**Request Body:**
```json
{
  "productVariantId": 10,
  "quantity": 1,
  "price": 4250000,
  "branchId": 1
}
```

**Logic:**
- Nếu sản phẩm đã có trong giỏ → tăng quantity
- Nếu chưa có → tạo mới

**Response:**
```json
{
  "Success": true,
  "Data": {
    "Id": 1,
    "ProductVariantId": 10,
    "Quantity": 2
  },
  "Message": "Đã thêm vào giỏ hàng"
}
```

### 3. PUT /api/cart/{id}
**Mô tả:** Cập nhật số lượng

**Request Body:**
```json
{
  "quantity": 3
}
```

### 4. DELETE /api/cart/{id}
**Mô tả:** Xóa sản phẩm khỏi giỏ (soft delete)

### 5. DELETE /api/cart/clear
**Mô tả:** Xóa tất cả sản phẩm trong giỏ

### 6. GET /api/cart/count
**Mô tả:** Lấy số lượng items (cho badge header)

**Response:**
```json
{
  "Success": true,
  "Data": {
    "ItemCount": 3,
    "TotalQuantity": 5
  }
}
```

---

## 📝 CODE C# (ASP.NET MVC5 Web API)

### ApiCartController.cs

```csharp
using System;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Security;

namespace DoAnLTWHQT.Controllers.Api
{
    [RoutePrefix("api/cart")]
    public class ApiCartController : ApiController
    {
        private readonly Entities _db = new Entities();

        // =====================================================
        // Helper: Lấy user ID từ FormsAuthentication
        // QUAN TRỌNG: Dự án dùng FormsAuth, KHÔNG phải Session!
        // =====================================================
        private long? GetCurrentUserId()
        {
            try
            {
                // CÁCH 1: Lấy từ HttpContext.Current.User (đã set trong Application_PostAuthenticateRequest)
                var identity = HttpContext.Current?.User?.Identity;
                if (identity == null || !identity.IsAuthenticated)
                {
                    System.Diagnostics.Debug.WriteLine("[GetCurrentUserId] User not authenticated");
                    return null;
                }
                
                // identity.Name chứa email/username từ FormsAuthenticationTicket
                var userName = identity.Name;
                if (string.IsNullOrEmpty(userName))
                {
                    System.Diagnostics.Debug.WriteLine("[GetCurrentUserId] userName is empty");
                    return null;
                }
                
                System.Diagnostics.Debug.WriteLine($"[GetCurrentUserId] Looking up user: {userName}");
                
                // Query database để lấy user id
                var user = _db.users.FirstOrDefault(u => 
                    (u.email == userName || u.name == userName) && 
                    u.deleted_at == null && 
                    u.status == "active");
                
                if (user != null)
                {
                    System.Diagnostics.Debug.WriteLine($"[GetCurrentUserId] Found user id: {user.id}");
                    return user.id;
                }
                
                System.Diagnostics.Debug.WriteLine("[GetCurrentUserId] User not found in database");
                return null;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[GetCurrentUserId] Error: {ex.Message}");
                return null;
            }
        }
        
        // =====================================================
        // CÁCH TỐI ƯU HƠN: Lấy UserId từ FormsAuthenticationTicket.UserData
        // Yêu cầu: Khi login, lưu userId vào ticket.UserData
        // Format userData: "userId|roleName" (ví dụ: "123|customer")
        // =====================================================
        private long? GetCurrentUserIdFromTicket()
        {
            try
            {
                var authCookie = HttpContext.Current?.Request?.Cookies[FormsAuthentication.FormsCookieName];
                if (authCookie == null) return null;
                
                var ticket = FormsAuthentication.Decrypt(authCookie.Value);
                if (ticket == null || ticket.Expired) return null;
                
                // userData format: "userId|roleName"
                var userData = ticket.UserData;
                if (string.IsNullOrEmpty(userData)) return null;
                
                var parts = userData.Split('|');
                if (parts.Length > 0 && long.TryParse(parts[0], out long userId))
                {
                    return userId;
                }
                
                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // ========================================
        // GET /api/cart
        // Lấy giỏ hàng của user
        // ========================================
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetCart()
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Content(System.Net.HttpStatusCode.Unauthorized, new
                {
                    Success = false,
                    Message = "Vui lòng đăng nhập"
                });
            }

            try
            {
                var cartItems = _db.carts
                    .Where(c => c.user_id == userId && c.deleted_at == null)
                    .Select(c => new
                    {
                        Id = c.id,
                        UserId = c.user_id,
                        ProductVariantId = c.product_variant_id,
                        Quantity = c.quantity,
                        Price = c.price,
                        CreatedAt = c.created_at,
                        UpdatedAt = c.updated_at,
                        // Join product_variants
                        ProductId = c.product_variant.product_id,
                        ProductName = c.product_variant.product.name,
                        ProductSlug = c.product_variant.product.slug,
                        VariantName = c.product_variant.name,
                        VariantSku = c.product_variant.sku,
                        VariantImageUrl = c.product_variant.image_url,
                        OriginalPrice = c.product_variant.original_price,
                        // Branch info từ inventory (optional)
                        BranchId = _db.branch_inventories
                            .Where(bi => bi.product_variant_id == c.product_variant_id && bi.quantity_on_hand > 0)
                            .Select(bi => bi.branch_id)
                            .FirstOrDefault(),
                        BranchName = _db.branch_inventories
                            .Where(bi => bi.product_variant_id == c.product_variant_id && bi.quantity_on_hand > 0)
                            .Select(bi => bi.branch.name)
                            .FirstOrDefault(),
                        StockQuantity = _db.branch_inventories
                            .Where(bi => bi.product_variant_id == c.product_variant_id)
                            .Sum(bi => (int?)bi.quantity_on_hand) ?? 0
                    })
                    .OrderByDescending(c => c.CreatedAt)
                    .ToList();

                return Ok(new
                {
                    Success = true,
                    Data = cartItems,
                    Total = cartItems.Count
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // ========================================
        // POST /api/cart
        // Thêm sản phẩm vào giỏ
        // ========================================
        [HttpPost]
        [Route("")]
        public IHttpActionResult AddToCart([FromBody] AddToCartRequest request)
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Content(System.Net.HttpStatusCode.Unauthorized, new
                {
                    Success = false,
                    Message = "Vui lòng đăng nhập để thêm vào giỏ hàng"
                });
            }

            if (request == null || request.ProductVariantId <= 0 || request.Quantity <= 0)
            {
                return Content(System.Net.HttpStatusCode.BadRequest, new
                {
                    Success = false,
                    Message = "Dữ liệu không hợp lệ"
                });
            }

            try
            {
                // Kiểm tra product variant tồn tại
                var variant = _db.product_variants.Find(request.ProductVariantId);
                if (variant == null || variant.deleted_at != null)
                {
                    return Content(System.Net.HttpStatusCode.NotFound, new
                    {
                        Success = false,
                        Message = "Sản phẩm không tồn tại"
                    });
                }

                // Kiểm tra đã có trong giỏ chưa
                var existingItem = _db.carts
                    .FirstOrDefault(c => 
                        c.user_id == userId && 
                        c.product_variant_id == request.ProductVariantId &&
                        c.deleted_at == null);

                if (existingItem != null)
                {
                    // Tăng quantity
                    existingItem.quantity += request.Quantity;
                    existingItem.updated_at = DateTime.Now;
                }
                else
                {
                    // Tạo mới
                    var newItem = new cart
                    {
                        user_id = userId.Value,
                        product_variant_id = request.ProductVariantId,
                        quantity = request.Quantity,
                        price = request.Price > 0 ? request.Price : variant.price,
                        created_at = DateTime.Now
                    };
                    _db.carts.Add(newItem);
                }

                _db.SaveChanges();

                return Ok(new
                {
                    Success = true,
                    Message = "Đã thêm vào giỏ hàng"
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // ========================================
        // PUT /api/cart/{id}
        // Cập nhật số lượng
        // ========================================
        [HttpPut]
        [Route("{id:long}")]
        public IHttpActionResult UpdateQuantity(long id, [FromBody] UpdateCartRequest request)
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Content(System.Net.HttpStatusCode.Unauthorized, new
                {
                    Success = false,
                    Message = "Vui lòng đăng nhập"
                });
            }

            if (request == null || request.Quantity < 1)
            {
                return Content(System.Net.HttpStatusCode.BadRequest, new
                {
                    Success = false,
                    Message = "Số lượng không hợp lệ"
                });
            }

            try
            {
                var item = _db.carts.FirstOrDefault(c => 
                    c.id == id && 
                    c.user_id == userId && 
                    c.deleted_at == null);

                if (item == null)
                {
                    return Content(System.Net.HttpStatusCode.NotFound, new
                    {
                        Success = false,
                        Message = "Không tìm thấy sản phẩm trong giỏ"
                    });
                }

                item.quantity = request.Quantity;
                item.updated_at = DateTime.Now;
                _db.SaveChanges();

                return Ok(new
                {
                    Success = true,
                    Message = "Đã cập nhật số lượng"
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // ========================================
        // DELETE /api/cart/{id}
        // Xóa sản phẩm (soft delete)
        // ========================================
        [HttpDelete]
        [Route("{id:long}")]
        public IHttpActionResult RemoveItem(long id)
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Content(System.Net.HttpStatusCode.Unauthorized, new
                {
                    Success = false,
                    Message = "Vui lòng đăng nhập"
                });
            }

            try
            {
                var item = _db.carts.FirstOrDefault(c => 
                    c.id == id && 
                    c.user_id == userId && 
                    c.deleted_at == null);

                if (item == null)
                {
                    return Content(System.Net.HttpStatusCode.NotFound, new
                    {
                        Success = false,
                        Message = "Không tìm thấy sản phẩm"
                    });
                }

                // Soft delete
                item.deleted_at = DateTime.Now;
                _db.SaveChanges();

                return Ok(new { Success = true, Message = "Đã xóa sản phẩm" });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // ========================================
        // DELETE /api/cart/clear
        // Xóa tất cả giỏ hàng
        // ========================================
        [HttpDelete]
        [Route("clear")]
        public IHttpActionResult ClearCart()
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Content(System.Net.HttpStatusCode.Unauthorized, new
                {
                    Success = false,
                    Message = "Vui lòng đăng nhập"
                });
            }

            try
            {
                var items = _db.carts.Where(c => 
                    c.user_id == userId && 
                    c.deleted_at == null).ToList();

                foreach (var item in items)
                {
                    item.deleted_at = DateTime.Now;
                }
                _db.SaveChanges();

                return Ok(new { Success = true, Message = "Đã xóa tất cả giỏ hàng" });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // ========================================
        // GET /api/cart/count
        // Lấy số lượng items cho badge
        // ========================================
        [HttpGet]
        [Route("count")]
        public IHttpActionResult GetCartCount()
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Ok(new
                {
                    Success = true,
                    Data = new { ItemCount = 0, TotalQuantity = 0 }
                });
            }

            try
            {
                var items = _db.carts
                    .Where(c => c.user_id == userId && c.deleted_at == null)
                    .ToList();

                return Ok(new
                {
                    Success = true,
                    Data = new
                    {
                        ItemCount = items.Count,
                        TotalQuantity = items.Sum(i => i.quantity)
                    }
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _db.Dispose();
            }
            base.Dispose(disposing);
        }
    }

    // Request models
    public class AddToCartRequest
    {
        public long ProductVariantId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public long? BranchId { get; set; }
    }

    public class UpdateCartRequest
    {
        public int Quantity { get; set; }
    }
}
```

---

## 🔍 SQL TEST QUERIES

```sql
-- Xem giỏ hàng của user
SELECT 
    c.id,
    c.user_id,
    c.product_variant_id,
    c.quantity,
    c.price,
    pv.name AS variant_name,
    pv.sku,
    p.name AS product_name,
    p.slug
FROM carts c
INNER JOIN product_variants pv ON pv.id = c.product_variant_id
INNER JOIN products p ON p.id = pv.product_id
WHERE c.user_id = 1 AND c.deleted_at IS NULL
ORDER BY c.created_at DESC;

-- Thêm sản phẩm vào giỏ
INSERT INTO carts (user_id, product_variant_id, quantity, price, created_at)
VALUES (1, 10, 1, 4250000, GETDATE());

-- Cập nhật số lượng
UPDATE carts SET quantity = 3, updated_at = GETDATE() WHERE id = 1;

-- Xóa (soft delete)
UPDATE carts SET deleted_at = GETDATE() WHERE id = 1;
```

---

## ✅ CHECKLIST

- [ ] Tạo entity `cart.cs` trong Model (nếu chưa có)
- [ ] Cập nhật `.edmx` để include navigation properties
- [ ] Tạo `ApiCartController.cs`
- [ ] Test các endpoints bằng Postman
- [ ] Kiểm tra authentication (session)
- [ ] Test thêm sản phẩm đã có trong giỏ → tăng quantity

---

## 🔗 FILES LIÊN QUAN

**Frontend:**
- `src/api/cart.api.ts` - API service
- `src/stores/cart.store.ts` - Pinia store
- `src/pages/CartPage.vue` - Trang giỏ hàng
- `src/components/AppHeader.vue` - Badge cart count

---

*Tài liệu tạo bởi AI - 22/12/2024*
