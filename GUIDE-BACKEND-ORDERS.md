# 📋 HƯỚNG DẪN BACKEND - ORDERS API

## 📊 Database Schema

Orders sử dụng 3 bảng chính:

### 1. `purchase_orders` - Đơn hàng
```sql
CREATE TABLE [dbo].[purchase_orders](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [user_id] [bigint] NULL,
    [order_code] [nvarchar](50) NOT NULL,          -- VD: ORD-20241223-0001
    [status] [nvarchar](20) NOT NULL,               -- pending, processing, shipped, delivered, cancelled
    [shipping_recipient_name] [nvarchar](100) NULL,
    [shipping_recipient_phone] [nvarchar](20) NULL,
    [shipping_address] [nvarchar](max) NULL,
    [sub_total] [decimal](12, 2) NOT NULL,
    [shipping_fee] [decimal](12, 2) NOT NULL,
    [discount_amount] [decimal](12, 2) NOT NULL,
    [total_amount] [decimal](12, 2) NOT NULL,
    [discount_id] [bigint] NULL,
    [branch_id] [bigint] NULL,
    [created_at] [datetime2](7) NULL,
    [updated_at] [datetime2](7) NULL,
    [deleted_at] [datetime2](7) NULL
)
```

### 2. `purchase_order_details` - Chi tiết đơn hàng
```sql
CREATE TABLE [dbo].[purchase_order_details](
    [order_id] [bigint] NOT NULL,
    [product_variant_id] [bigint] NOT NULL,
    [quantity] [int] NOT NULL,
    [price_at_purchase] [decimal](10, 2) NOT NULL,
    [subtotal] [decimal](10, 2) NOT NULL,
    [created_at] [datetime2](7) NULL,
    [updated_at] [datetime2](7) NULL,
    [deleted_at] [datetime2](7) NULL
)
```

### 3. `payments` - Thanh toán
```sql
CREATE TABLE [dbo].[payments](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [order_id] [bigint] NOT NULL,
    [payment_method_id] [bigint] NOT NULL,
    [amount] [decimal](12, 2) NOT NULL,
    [status] [nvarchar](20) NOT NULL,              -- pending, completed, failed, refunded
    [transaction_code] [nvarchar](100) NULL,
    [created_at] [datetime2](7) NULL
)
```

---

## 🔌 API ENDPOINTS

### 1. GET `/api/orders` - Lấy danh sách đơn hàng của user

**Request:**
```
GET /api/orders?status=pending&page=1&limit=10
Headers:
  Cookie: .ASPXAUTH=...
```

**Response (Success):**
```json
{
  "Success": true,
  "Data": [
    {
      "Id": 1,
      "OrderCode": "ORD-20241223-0001",
      "UserId": 5,
      "Status": "processing",
      "ShippingRecipientName": "Nguyễn Văn A",
      "ShippingRecipientPhone": "0912345678",
      "ShippingAddress": "123 Đường ABC, Quận 1, TP.HCM",
      "SubTotal": 2450000,
      "ShippingFee": 30000,
      "DiscountAmount": 100000,
      "TotalAmount": 2380000,
      "BranchId": 1,
      "BranchName": "Chi nhánh Quận 1",
      "CreatedAt": "2024-12-23T10:30:00",
      "Items": [
        {
          "ProductVariantId": 1,
          "ProductId": 1,
          "ProductName": "Gojo Satoru Figure 1/7",
          "VariantName": "Phiên bản giới hạn",
          "Quantity": 1,
          "PriceAtPurchase": 1950000,
          "Subtotal": 1950000,
          "ImageUrl": "/uploads/products/gojo-satoru.jpg"
        }
      ],
      "Payment": {
        "Id": 1,
        "PaymentMethodId": 1,
        "MethodName": "COD",
        "Status": "pending",
        "Amount": 2380000,
        "TransactionCode": null
      }
    }
  ],
  "Message": "Lấy danh sách đơn hàng thành công"
}
```

---

### 2. GET `/api/orders/{id}` - Chi tiết một đơn hàng

**Request:**
```
GET /api/orders/1
Headers:
  Cookie: .ASPXAUTH=...
```

**Response:** Tương tự như trên nhưng chỉ 1 order

---

### 3. POST `/api/orders` - Tạo đơn hàng mới

**Request:**
```json
{
  "ShippingRecipientName": "Nguyễn Văn A",
  "ShippingRecipientPhone": "0912345678", 
  "ShippingAddress": "123 Đường ABC, Quận 1, TP.HCM",
  "PaymentMethodId": 1,
  "DiscountCode": "SALE10",
  "Notes": "Giao buổi sáng"
}
```

**Backend Logic:**
1. Validate user đã đăng nhập
2. Lấy giỏ hàng của user từ bảng `carts`
3. Tính toán sub_total, shipping_fee, discount (nếu có)
4. Tạo record trong `purchase_orders`
5. Tạo records trong `purchase_order_details`
6. Tạo record trong `payments` với status = 'pending'
7. **Clear giỏ hàng** (xóa records trong `carts` của user)
8. Trả về order vừa tạo

**Response:**
```json
{
  "Success": true,
  "Data": { /* order object */ },
  "Message": "Đặt hàng thành công"
}
```

---

### 4. PUT `/api/orders/{id}/cancel` - Hủy đơn hàng

**Request:**
```json
{
  "Reason": "Đổi ý không mua nữa"
}
```

**Backend Logic:**
1. Kiểm tra order thuộc về user hiện tại
2. Kiểm tra status = 'pending' (chỉ được hủy khi chưa xử lý)
3. Cập nhật status = 'cancelled'

**Response:**
```json
{
  "Success": true,
  "Message": "Đã hủy đơn hàng"
}
```

---

## 💻 C# CONTROLLER EXAMPLE

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Security;

namespace YourNamespace.Controllers.Api
{
    [RoutePrefix("api/orders")]
    public class ApiOrdersController : ApiController
    {
        private YourDbContext db = new YourDbContext();

        /// <summary>
        /// Lấy User ID từ FormsAuthentication ticket
        /// </summary>
        private int? GetCurrentUserId()
        {
            var authCookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            if (authCookie == null) return null;

            try
            {
                var ticket = FormsAuthentication.Decrypt(authCookie.Value);
                if (ticket == null || ticket.Expired) return null;

                // UserData chứa userId
                if (int.TryParse(ticket.UserData, out int userId))
                {
                    return userId;
                }
            }
            catch { }

            return null;
        }

        /// <summary>
        /// GET /api/orders - Lấy danh sách đơn hàng của user
        /// </summary>
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetMyOrders(string status = null)
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var query = db.purchase_orders
                .Where(o => o.user_id == userId.Value && o.deleted_at == null);

            // Filter by status
            if (!string.IsNullOrEmpty(status) && status != "all")
            {
                query = query.Where(o => o.status == status);
            }

            var orders = query
                .OrderByDescending(o => o.created_at)
                .Select(o => new
                {
                    o.id,
                    OrderCode = o.order_code,
                    o.user_id,
                    o.status,
                    ShippingRecipientName = o.shipping_recipient_name,
                    ShippingRecipientPhone = o.shipping_recipient_phone,
                    ShippingAddress = o.shipping_address,
                    SubTotal = o.sub_total,
                    ShippingFee = o.shipping_fee,
                    DiscountAmount = o.discount_amount,
                    TotalAmount = o.total_amount,
                    o.branch_id,
                    BranchName = o.branch != null ? o.branch.name : null,
                    o.created_at,
                    Items = o.purchase_order_details
                        .Where(d => d.deleted_at == null)
                        .Select(d => new
                        {
                            d.product_variant_id,
                            ProductId = d.product_variant.product_id,
                            ProductName = d.product_variant.product.name,
                            VariantName = d.product_variant.name,
                            d.quantity,
                            PriceAtPurchase = d.price_at_purchase,
                            d.subtotal,
                            ImageUrl = d.product_variant.image_url
                        }).ToList(),
                    Payment = o.payments.FirstOrDefault(p => p.deleted_at == null) != null
                        ? new
                        {
                            o.payments.FirstOrDefault().id,
                            o.payments.FirstOrDefault().payment_method_id,
                            MethodName = o.payments.FirstOrDefault().payment_method.name,
                            o.payments.FirstOrDefault().status,
                            o.payments.FirstOrDefault().amount,
                            o.payments.FirstOrDefault().transaction_code
                        }
                        : null
                })
                .ToList();

            return Ok(new { Success = true, Data = orders, Message = "Lấy danh sách đơn hàng thành công" });
        }

        /// <summary>
        /// GET /api/orders/{id} - Chi tiết đơn hàng
        /// </summary>
        [HttpGet]
        [Route("{id}")]
        public IHttpActionResult GetOrderById(int id)
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var order = db.purchase_orders
                .Where(o => o.id == id && o.user_id == userId.Value && o.deleted_at == null)
                .Select(o => new
                {
                    // ... same as above
                })
                .FirstOrDefault();

            if (order == null)
            {
                return NotFound();
            }

            return Ok(new { Success = true, Data = order });
        }

        /// <summary>
        /// PUT /api/orders/{id}/cancel - Hủy đơn hàng
        /// </summary>
        [HttpPut]
        [Route("{id}/cancel")]
        public IHttpActionResult CancelOrder(int id, [FromBody] CancelOrderRequest request)
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var order = db.purchase_orders
                .FirstOrDefault(o => o.id == id && o.user_id == userId.Value && o.deleted_at == null);

            if (order == null)
            {
                return NotFound();
            }

            if (order.status != "pending")
            {
                return BadRequest("Chỉ có thể hủy đơn hàng đang chờ xác nhận");
            }

            order.status = "cancelled";
            order.updated_at = DateTime.Now;
            db.SaveChanges();

            return Ok(new { Success = true, Message = "Đã hủy đơn hàng" });
        }
    }

    public class CancelOrderRequest
    {
        public string Reason { get; set; }
    }
}
```

---

## 🔧 CORS CONFIGURATION

Đảm bảo `Web.config` có cấu hình CORS:

```xml
<system.webServer>
  <httpProtocol>
    <customHeaders>
      <add name="Access-Control-Allow-Origin" value="http://localhost:5173" />
      <add name="Access-Control-Allow-Credentials" value="true" />
      <add name="Access-Control-Allow-Headers" value="Content-Type, Accept, X-Requested-With" />
      <add name="Access-Control-Allow-Methods" value="GET, POST, PUT, DELETE, OPTIONS" />
    </customHeaders>
  </httpProtocol>
</system.webServer>
```

---

## 📝 SQL QUERIES THAM KHẢO

### Lấy danh sách đơn hàng của user
```sql
SELECT 
    po.id,
    po.order_code,
    po.status,
    po.shipping_recipient_name,
    po.total_amount,
    po.created_at,
    b.name as branch_name
FROM purchase_orders po
LEFT JOIN branches b ON po.branch_id = b.id
WHERE po.user_id = @userId 
  AND po.deleted_at IS NULL
ORDER BY po.created_at DESC
```

### Lấy chi tiết đơn hàng
```sql
SELECT 
    pod.product_variant_id,
    p.id as product_id,
    p.name as product_name,
    pv.name as variant_name,
    pv.image_url,
    pod.quantity,
    pod.price_at_purchase,
    pod.subtotal
FROM purchase_order_details pod
JOIN product_variants pv ON pod.product_variant_id = pv.id
JOIN products p ON pv.product_id = p.id
WHERE pod.order_id = @orderId
  AND pod.deleted_at IS NULL
```

---

*Tài liệu tạo bởi AI Assistant - 23/12/2024*
