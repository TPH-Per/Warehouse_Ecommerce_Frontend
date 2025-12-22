# 📋 HƯỚNG DẪN BACKEND: API Discounts (Mã giảm giá)

> Tài liệu hướng dẫn tạo API endpoint để lấy danh sách mã giảm giá cho Vue Frontend

---

## 🎯 MỤC TIÊU

Tạo API endpoint để Frontend có thể lấy danh sách mã giảm giá đang active và còn hiệu lực.

### Yêu cầu nghiệp vụ:
- Mã giảm giá phải có `is_active = 1`
- Thời gian còn trong khoảng `start_at` và `end_at`
- Số lượt dùng còn dư (`used_count < max_uses` hoặc `max_uses IS NULL`)

---

## 📊 DATABASE SCHEMA

```sql
CREATE TABLE [dbo].[discounts](
  [id] [bigint] IDENTITY(1,1) NOT NULL,
  [code] [nvarchar](50) NOT NULL,           -- Mã giảm giá (VD: SALE20, FREESHIP)
  [type] [nvarchar](20) NOT NULL,           -- 'percentage' hoặc 'fixed'
  [value] [decimal](10, 2) NOT NULL,        -- Giá trị giảm (20 = 20%, 50000 = 50.000đ)
  [min_order_amount] [decimal](12, 2) NULL, -- Đơn hàng tối thiểu
  [max_uses] [int] NULL,                    -- Số lượt dùng tối đa (NULL = không giới hạn)
  [used_count] [int] NOT NULL,              -- Số lượt đã dùng
  [start_at] [datetime2](7) NULL,           -- Ngày bắt đầu (NULL = không giới hạn)
  [end_at] [datetime2](7) NULL,             -- Ngày kết thúc (NULL = không giới hạn)
  [is_active] [bit] NOT NULL,               -- 0/1: Có active không
  [created_at] [datetime2](7) NULL,
  [updated_at] [datetime2](7) NULL,
  CONSTRAINT [PK_discounts] PRIMARY KEY ([id]),
  CONSTRAINT [UQ_discounts_code] UNIQUE ([code])
)
```

---

## 🔧 API ENDPOINTS CẦN TẠO

### 1. GET /api/discounts/active

**Mô tả:** Lấy danh sách mã giảm giá đang active và còn hiệu lực

**Response:**
```json
{
  "Success": true,
  "Data": [
    {
      "Id": 1,
      "Code": "SALE20",
      "Type": "percentage",
      "Value": 20.00,
      "MinOrderAmount": 500000.00,
      "MaxUses": 100,
      "UsedCount": 45,
      "StartAt": "2024-12-01T00:00:00",
      "EndAt": "2024-12-31T23:59:59",
      "IsActive": true
    }
  ],
  "Total": 5,
  "Message": "Lấy danh sách mã giảm giá thành công"
}
```

### 2. GET /api/discounts/validate/{code}

**Mô tả:** Kiểm tra mã giảm giá có hợp lệ không

**Response thành công:**
```json
{
  "Success": true,
  "Data": {
    "Id": 1,
    "Code": "SALE20",
    "Type": "percentage",
    "Value": 20.00,
    "MinOrderAmount": 500000.00
  },
  "Message": "Mã giảm giá hợp lệ"
}
```

**Response lỗi:**
```json
{
  "Success": false,
  "Message": "Mã giảm giá không tồn tại hoặc đã hết hạn"
}
```

---

## 📝 CODE C# (ASP.NET MVC5 Web API)

### ApiDiscountsController.cs

```csharp
using System;
using System.Linq;
using System.Web.Http;
using System.Data.Entity;

namespace YourProject.Controllers.Api
{
    [RoutePrefix("api/discounts")]
    public class ApiDiscountsController : ApiController
    {
        private readonly Entities _db = new Entities();

        // ========================================
        // GET /api/discounts/active
        // Lấy mã giảm giá đang active và còn hiệu lực
        // ========================================
        [HttpGet]
        [Route("active")]
        public IHttpActionResult GetActiveDiscounts()
        {
            try
            {
                var now = DateTime.Now;

                var discounts = _db.discounts
                    .Where(d => 
                        d.is_active == true &&
                        // Kiểm tra thời gian bắt đầu
                        (d.start_at == null || d.start_at <= now) &&
                        // Kiểm tra thời gian kết thúc
                        (d.end_at == null || d.end_at >= now) &&
                        // Kiểm tra số lượt dùng
                        (d.max_uses == null || d.used_count < d.max_uses)
                    )
                    .OrderByDescending(d => d.value)  // Sắp xếp theo giá trị giảm
                    .Select(d => new
                    {
                        Id = d.id,
                        Code = d.code,
                        Type = d.type,
                        Value = d.value,
                        MinOrderAmount = d.min_order_amount,
                        MaxUses = d.max_uses,
                        UsedCount = d.used_count,
                        StartAt = d.start_at,
                        EndAt = d.end_at,
                        IsActive = d.is_active
                    })
                    .ToList();

                return Ok(new
                {
                    Success = true,
                    Data = discounts,
                    Total = discounts.Count,
                    Message = "Lấy danh sách mã giảm giá thành công"
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"GetActiveDiscounts Error: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // ========================================
        // GET /api/discounts
        // Lấy tất cả mã giảm giá (admin)
        // ========================================
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAll()
        {
            try
            {
                var discounts = _db.discounts
                    .OrderByDescending(d => d.created_at)
                    .Select(d => new
                    {
                        Id = d.id,
                        Code = d.code,
                        Type = d.type,
                        Value = d.value,
                        MinOrderAmount = d.min_order_amount,
                        MaxUses = d.max_uses,
                        UsedCount = d.used_count,
                        StartAt = d.start_at,
                        EndAt = d.end_at,
                        IsActive = d.is_active,
                        CreatedAt = d.created_at
                    })
                    .ToList();

                return Ok(new
                {
                    Success = true,
                    Data = discounts,
                    Total = discounts.Count
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // ========================================
        // GET /api/discounts/validate/{code}
        // Kiểm tra mã giảm giá có hợp lệ
        // ========================================
        [HttpGet]
        [Route("validate/{code}")]
        public IHttpActionResult ValidateCode(string code)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(code))
                {
                    return Content(System.Net.HttpStatusCode.BadRequest, new
                    {
                        Success = false,
                        Message = "Vui lòng nhập mã giảm giá"
                    });
                }

                var now = DateTime.Now;
                var normalizedCode = code.Trim().ToUpper();

                var discount = _db.discounts
                    .FirstOrDefault(d => 
                        d.code.ToUpper() == normalizedCode &&
                        d.is_active == true
                    );

                if (discount == null)
                {
                    return Content(System.Net.HttpStatusCode.NotFound, new
                    {
                        Success = false,
                        Message = "Mã giảm giá không tồn tại"
                    });
                }

                // Kiểm tra thời gian
                if (discount.start_at.HasValue && discount.start_at > now)
                {
                    return Content(System.Net.HttpStatusCode.BadRequest, new
                    {
                        Success = false,
                        Message = "Mã giảm giá chưa đến thời gian áp dụng"
                    });
                }

                if (discount.end_at.HasValue && discount.end_at < now)
                {
                    return Content(System.Net.HttpStatusCode.BadRequest, new
                    {
                        Success = false,
                        Message = "Mã giảm giá đã hết hạn"
                    });
                }

                // Kiểm tra số lượt dùng
                if (discount.max_uses.HasValue && discount.used_count >= discount.max_uses)
                {
                    return Content(System.Net.HttpStatusCode.BadRequest, new
                    {
                        Success = false,
                        Message = "Mã giảm giá đã hết lượt sử dụng"
                    });
                }

                return Ok(new
                {
                    Success = true,
                    Data = new
                    {
                        Id = discount.id,
                        Code = discount.code,
                        Type = discount.type,
                        Value = discount.value,
                        MinOrderAmount = discount.min_order_amount
                    },
                    Message = "Mã giảm giá hợp lệ"
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // ========================================
        // POST /api/discounts/apply
        // Áp dụng mã giảm giá (tăng used_count)
        // ========================================
        [HttpPost]
        [Route("apply")]
        public IHttpActionResult ApplyDiscount([FromBody] ApplyDiscountRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrWhiteSpace(request.Code))
                {
                    return Content(System.Net.HttpStatusCode.BadRequest, new
                    {
                        Success = false,
                        Message = "Dữ liệu không hợp lệ"
                    });
                }

                var now = DateTime.Now;
                var normalizedCode = request.Code.Trim().ToUpper();

                var discount = _db.discounts
                    .FirstOrDefault(d => d.code.ToUpper() == normalizedCode && d.is_active == true);

                if (discount == null)
                {
                    return Content(System.Net.HttpStatusCode.NotFound, new
                    {
                        Success = false,
                        Message = "Mã giảm giá không hợp lệ"
                    });
                }

                // Các kiểm tra tương tự validate...
                // Kiểm tra min_order_amount
                if (discount.min_order_amount.HasValue && request.OrderTotal < discount.min_order_amount)
                {
                    return Content(System.Net.HttpStatusCode.BadRequest, new
                    {
                        Success = false,
                        Message = $"Đơn hàng tối thiểu {discount.min_order_amount:N0}đ để áp dụng mã này"
                    });
                }

                // Tính toán giảm giá
                decimal discountAmount = 0;
                if (discount.type == "percentage")
                {
                    discountAmount = Math.Round(request.OrderTotal * discount.value / 100);
                }
                else
                {
                    discountAmount = Math.Min(discount.value, request.OrderTotal);
                }

                // Tăng used_count
                discount.used_count++;
                discount.updated_at = DateTime.Now;
                _db.SaveChanges();

                return Ok(new
                {
                    Success = true,
                    Data = new
                    {
                        DiscountId = discount.id,
                        DiscountCode = discount.code,
                        DiscountAmount = discountAmount,
                        FinalTotal = request.OrderTotal - discountAmount
                    },
                    Message = $"Áp dụng mã thành công! Bạn được giảm {discountAmount:N0}đ"
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

    // Request model
    public class ApplyDiscountRequest
    {
        public string Code { get; set; }
        public decimal OrderTotal { get; set; }
    }
}
```

---

## 🔍 SQL TEST QUERY

```sql
-- Thêm dữ liệu mẫu
INSERT INTO discounts (code, type, value, min_order_amount, max_uses, used_count, start_at, end_at, is_active, created_at)
VALUES 
  ('WELCOME10', 'percentage', 10.00, 200000, NULL, 0, GETDATE(), DATEADD(month, 1, GETDATE()), 1, GETDATE()),
  ('FREESHIP', 'fixed', 30000.00, 300000, 100, 23, GETDATE(), DATEADD(month, 1, GETDATE()), 1, GETDATE()),
  ('SALE20', 'percentage', 20.00, 500000, 50, 12, GETDATE(), DATEADD(day, 7, GETDATE()), 1, GETDATE()),
  ('VIP50K', 'fixed', 50000.00, 1000000, 20, 5, GETDATE(), DATEADD(month, 3, GETDATE()), 1, GETDATE());

-- Lấy mã giảm giá còn hiệu lực
SELECT * FROM discounts 
WHERE is_active = 1 
  AND (start_at IS NULL OR start_at <= GETDATE())
  AND (end_at IS NULL OR end_at >= GETDATE())
  AND (max_uses IS NULL OR used_count < max_uses)
ORDER BY value DESC;
```

---

## ✅ CHECKLIST

- [ ] Tạo entity `discount.cs` trong Model (nếu chưa có)
- [ ] Tạo `ApiDiscountsController.cs`
- [ ] Test endpoint `GET /api/discounts/active` bằng Postman
- [ ] Test endpoint `GET /api/discounts/validate/{code}`
- [ ] Thêm dữ liệu mẫu vào database
- [ ] Verify response format PascalCase

---

## 🔗 FILES LIÊN QUAN

**Frontend:**
- `src/api/discounts.api.ts` - API service
- `src/stores/discounts.store.ts` - Pinia store
- `src/pages/HomePage.vue` - Hiển thị mã giảm giá

---

*Tài liệu tạo bởi AI - 22/12/2024*
