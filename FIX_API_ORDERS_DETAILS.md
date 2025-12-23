# 🔧 FIX API ORDERS - HIỂN THỊ CHI TIẾT ĐƠN HÀNG

## VẤN ĐỀ
API `/api/orders` đang trả về:
- `Items: []` (rỗng)
- `Payment: null` 
- Không có `ShippingRecipientName`, `ShippingRecipientPhone`, `ShippingAddress`

## NGUYÊN NHÂN
Backend chưa include đúng các navigation properties trong LINQ query.

## GIẢI PHÁP

### Sửa `GetMyOrders()` trong `ApiOrdersController.cs`:

```csharp
[HttpGet]
[Route("")]
public IHttpActionResult GetMyOrders()
{
    var userId = GetCurrentUserId();
    if (!userId.HasValue)
    {
        return Content(HttpStatusCode.Unauthorized, new { Success = false, Message = "Vui lòng đăng nhập" });
    }

    try
    {
        var orders = db.purchase_orders
            .Where(o => o.user_id == userId.Value && o.deleted_at == null)
            .OrderByDescending(o => o.created_at)
            .ToList() // Lấy data trước
            .Select(o => new
            {
                Id = o.id,
                OrderCode = o.order_code,
                UserId = o.user_id,
                Status = o.status,
                ShippingRecipientName = o.shipping_recipient_name,
                ShippingRecipientPhone = o.shipping_recipient_phone,
                ShippingAddress = o.shipping_address,
                SubTotal = o.sub_total,
                ShippingFee = o.shipping_fee,
                DiscountAmount = o.discount_amount,
                TotalAmount = o.total_amount,
                BranchId = o.branch_id,
                BranchName = o.branch != null ? o.branch.name : "Chi nhánh chính",
                CreatedAt = o.created_at,
                UpdatedAt = o.updated_at,
                
                // Load Items từ purchase_order_details
                Items = db.purchase_order_details
                    .Where(d => d.order_id == o.id)
                    .Select(d => new
                    {
                        ProductVariantId = d.product_variant_id,
                        ProductId = d.product_variants != null ? d.product_variants.product_id : 0,
                        ProductName = d.product_variants != null && d.product_variants.products != null 
                            ? d.product_variants.products.name : "",
                        VariantName = d.product_variants != null ? d.product_variants.name : "",
                        Quantity = d.quantity,
                        PriceAtPurchase = d.price_at_purchase,
                        Subtotal = d.subtotal,
                        ImageUrl = d.product_variants != null ? d.product_variants.image_url : ""
                    }).ToList(),
                
                // Load Payment
                Payment = db.payments
                    .Where(p => p.order_id == o.id && p.deleted_at == null)
                    .Select(p => new
                    {
                        Id = p.id,
                        PaymentMethodId = p.payment_method_id,
                        MethodName = p.payment_methods != null ? p.payment_methods.name : "COD",
                        Status = p.status,
                        Amount = p.amount,
                        TransactionCode = p.transaction_code,
                        CreatedAt = p.created_at
                    }).FirstOrDefault()
            })
            .ToList();

        return Ok(new
        {
            Success = true,
            Data = orders,
            Message = "Lấy danh sách đơn hàng thành công"
        });
    }
    catch (Exception ex)
    {
        System.Diagnostics.Debug.WriteLine($"[GetMyOrders] Error: {ex.Message}");
        System.Diagnostics.Debug.WriteLine($"[GetMyOrders] StackTrace: {ex.StackTrace}");
        return InternalServerError(ex);
    }
}
```

## KIỂM TRA ENTITY MODEL

Đảm bảo các navigation properties được cấu hình đúng:

### `purchase_order_details.cs`:
```csharp
public partial class purchase_order_details
{
    public long order_id { get; set; }
    public long product_variant_id { get; set; }
    public int quantity { get; set; }
    public decimal price_at_purchase { get; set; }
    public decimal subtotal { get; set; }
    
    // Navigation properties
    public virtual purchase_orders purchase_orders { get; set; }
    public virtual product_variants product_variants { get; set; }
}
```

### `product_variants.cs`:
```csharp
public partial class product_variants
{
    public long id { get; set; }
    public long product_id { get; set; }
    public string name { get; set; }
    public string image_url { get; set; }
    // ...
    
    // Navigation property
    public virtual products products { get; set; }
}
```

### `payments.cs`:
```csharp
public partial class payments
{
    public long id { get; set; }
    public long order_id { get; set; }
    public long payment_method_id { get; set; }
    // ...
    
    // Navigation properties
    public virtual purchase_orders purchase_orders { get; set; }
    public virtual payment_methods payment_methods { get; set; }
}
```

## TEST SAU KHI SỬA

1. Rebuild project
2. Gọi API: `GET https://localhost:44377/api/orders`
3. Kiểm tra response có:
   - `Items` với danh sách sản phẩm
   - `Payment` với thông tin thanh toán
   - `ShippingRecipientName`, `ShippingRecipientPhone`, `ShippingAddress`

## RESPONSE MẪU

```json
{
  "Success": true,
  "Data": [
    {
      "Id": 1,
      "OrderCode": "ORD-20251223-1234",
      "Status": "pending",
      "ShippingRecipientName": "Nguyen Van A",
      "ShippingRecipientPhone": "0901234567",
      "ShippingAddress": "123 ABC Street",
      "SubTotal": 890000,
      "ShippingFee": 30000,
      "DiscountAmount": 0,
      "TotalAmount": 920000,
      "BranchName": "Chi nhánh Q1",
      "CreatedAt": "2025-12-23T16:48:22",
      "Items": [
        {
          "ProductVariantId": 2012,
          "ProductName": "Nendoroid Denji",
          "VariantName": "Standard Ver.",
          "Quantity": 1,
          "PriceAtPurchase": 890000,
          "Subtotal": 890000,
          "ImageUrl": "/wwwroot/uploads/products/nendo-denji.jpg"
        }
      ],
      "Payment": {
        "Id": 1,
        "MethodName": "Thanh toán khi nhận hàng (COD)",
        "Status": "pending",
        "Amount": 920000
      }
    }
  ]
}
```

---
**Ngày cập nhật:** 2025-12-23
