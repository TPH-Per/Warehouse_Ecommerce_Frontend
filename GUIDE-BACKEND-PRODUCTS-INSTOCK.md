# 📋 HƯỚNG DẪN BACKEND: API Products In-Stock

> Tài liệu hướng dẫn tạo endpoint API để lấy sản phẩm có tồn kho tại chi nhánh

---

## 🎯 MỤC TIÊU

Tạo API endpoint mới để **chỉ trả về sản phẩm có tồn tại trong kho của chi nhánh**.

### Yêu cầu nghiệp vụ:
- Sản phẩm **phải có ít nhất 1 variant** tồn tại trong bảng `branch_inventories` với `quantity_on_hand > 0`
- Hỗ trợ filter theo `branchId` cụ thể (optional)
- Nếu không truyền `branchId`, trả về sản phẩm có hàng ở **bất kỳ chi nhánh nào**

---

## 📊 DATABASE SCHEMA LIÊN QUAN

```
products                     product_variants              branch_inventories
+-------+                    +------------------+          +-------------------+
| id    |<------------------>| id               |<-------->| product_variant_id|
| name  |    product_id      | product_id       |          | branch_id         |
| ...   |                    | sku, price, etc  |          | quantity_on_hand  |
+-------+                    +------------------+          | quantity_reserved |
                                                           +-------------------+
```

---

## 🔧 API ENDPOINTS CẦN TẠO

### 1. GET /api/products/in-stock

**Mô tả:** Lấy danh sách sản phẩm có trong kho của chi nhánh

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `branchId` | number | No | ID chi nhánh cụ thể, nếu không truyền thì lấy sản phẩm có hàng ở bất kỳ chi nhánh |
| `categoryId` | number | No | Filter theo category |
| `supplierId` | number | No | Filter theo supplier |
| `page` | number | No | Số trang (default: 1) |
| `pageSize` | number | No | Số sản phẩm/trang (default: 20) |

**Response:**
```json
{
  "Success": true,
  "Data": [
    {
      "Id": 1,
      "Name": "Nendoroid Hatsune Miku",
      "Slug": "nendoroid-hatsune-miku",
      "Description": "...",
      "CategoryId": 1,
      "CategoryName": "Nendoroid",
      "SupplierId": 1,
      "SupplierName": "Good Smile Company",
      "Price": 1500000,
      "OriginalPrice": 1800000,
      "ImageUrl": "https://...",
      "TotalStock": 15,
      "BranchesWithStock": 3
    }
  ],
  "Total": 50,
  "Message": "Lấy sản phẩm có trong kho thành công"
}
```

---

## 📝 CODE C# (ASP.NET MVC5 Web API)

### ApiProductsController.cs

```csharp
using System;
using System.Linq;
using System.Web.Http;
using System.Data.Entity;

namespace YourProject.Controllers.Api
{
    [RoutePrefix("api/products")]
    public class ApiProductsController : ApiController
    {
        private readonly Entities _db = new Entities();

        // ========================================
        // GET /api/products/in-stock
        // Lấy sản phẩm có trong kho của chi nhánh
        // ========================================
        [HttpGet]
        [Route("in-stock")]
        public IHttpActionResult GetProductsInStock(
            [FromUri] long? branchId = null,
            [FromUri] long? categoryId = null,
            [FromUri] long? supplierId = null,
            [FromUri] int page = 1,
            [FromUri] int pageSize = 20)
        {
            try
            {
                // Query sản phẩm có variant tồn tại trong branch_inventories với quantity > 0
                var query = _db.products
                    .Include(p => p.category)
                    .Include(p => p.supplier)
                    .Include(p => p.product_variants)
                    .Where(p => p.deleted_at == null && p.status == "active");

                // Filter: Chỉ lấy sản phẩm có ít nhất 1 variant có tồn kho > 0
                if (branchId.HasValue)
                {
                    // Lọc theo chi nhánh cụ thể
                    query = query.Where(p =>
                        p.product_variants.Any(v =>
                            _db.branch_inventories.Any(bi =>
                                bi.product_variant_id == v.id &&
                                bi.branch_id == branchId.Value &&
                                bi.quantity_on_hand > 0
                            )
                        )
                    );
                }
                else
                {
                    // Lấy sản phẩm có hàng ở BẤT KỲ chi nhánh nào
                    query = query.Where(p =>
                        p.product_variants.Any(v =>
                            _db.branch_inventories.Any(bi =>
                                bi.product_variant_id == v.id &&
                                bi.quantity_on_hand > 0
                            )
                        )
                    );
                }

                // Filter theo category
                if (categoryId.HasValue)
                {
                    query = query.Where(p => p.category_id == categoryId.Value);
                }

                // Filter theo supplier
                if (supplierId.HasValue)
                {
                    query = query.Where(p => p.supplier_id == supplierId.Value);
                }

                // Đếm tổng
                var totalCount = query.Count();

                // Pagination và mapping
                var products = query
                    .OrderByDescending(p => p.created_at)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new
                    {
                        Id = p.id,
                        Name = p.name,
                        Slug = p.slug,
                        Description = p.description,
                        CategoryId = p.category_id,
                        CategoryName = p.category.name,
                        SupplierId = p.supplier_id,
                        SupplierName = p.supplier.name,
                        
                        // Lấy giá thấp nhất từ các variants
                        Price = p.product_variants
                            .Where(v => v.deleted_at == null)
                            .Min(v => (decimal?)v.price) ?? 0,
                        
                        // Lấy giá gốc để hiển thị giảm giá
                        OriginalPrice = p.product_variants
                            .Where(v => v.deleted_at == null)
                            .Min(v => v.original_price),
                        
                        // Lấy ảnh từ variant đầu tiên
                        ImageUrl = p.product_variants
                            .Where(v => v.deleted_at == null)
                            .Select(v => v.image_url)
                            .FirstOrDefault(),
                        
                        // Tổng tồn kho tại các chi nhánh
                        TotalStock = branchId.HasValue
                            ? _db.branch_inventories
                                .Where(bi => 
                                    p.product_variants.Select(v => v.id).Contains(bi.product_variant_id) &&
                                    bi.branch_id == branchId.Value
                                )
                                .Sum(bi => (int?)bi.quantity_on_hand) ?? 0
                            : _db.branch_inventories
                                .Where(bi => 
                                    p.product_variants.Select(v => v.id).Contains(bi.product_variant_id)
                                )
                                .Sum(bi => (int?)bi.quantity_on_hand) ?? 0,
                        
                        // Số chi nhánh có hàng
                        BranchesWithStock = _db.branch_inventories
                            .Where(bi => 
                                p.product_variants.Select(v => v.id).Contains(bi.product_variant_id) &&
                                bi.quantity_on_hand > 0
                            )
                            .Select(bi => bi.branch_id)
                            .Distinct()
                            .Count()
                    })
                    .ToList();

                return Ok(new
                {
                    Success = true,
                    Data = products,
                    Total = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                    Message = $"Lấy {products.Count} sản phẩm có trong kho thành công"
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"GetProductsInStock Error: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // ========================================
        // 🆕 GET /api/products/{id}
        // Lấy chi tiết 1 sản phẩm theo ID
        // ========================================
        [HttpGet]
        [Route("{id:long}")]
        public IHttpActionResult GetById(long id)
        {
            try
            {
                var product = _db.products
                    .Include(p => p.category)
                    .Include(p => p.supplier)
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

                return Ok(new
                {
                    Success = true,
                    Data = new
                    {
                        Id = product.id,
                        Name = product.name,
                        Slug = product.slug,
                        Description = product.description,
                        Status = product.status,
                        Category = new 
                        { 
                            Id = product.category.id, 
                            Name = product.category.name 
                        },
                        Supplier = new 
                        { 
                            Id = product.supplier.id, 
                            Name = product.supplier.name 
                        },
                        Variants = product.product_variants
                            .Where(v => v.deleted_at == null)
                            .Select(v => new
                            {
                                Id = v.id,
                                Name = v.name,
                                Sku = v.sku,
                                Price = v.price,
                                OriginalPrice = v.original_price,
                                ImageUrl = v.image_url
                            }).ToList()
                    }
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"GetById Error: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // ========================================
        // CẬP NHẬT GET /api/products
        // Thêm parameter inStock để filter
        // ========================================
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAll(
            [FromUri] bool inStock = false,
            [FromUri] long? branchId = null)
        {
            try
            {
                var query = _db.products
                    .Include(p => p.category)
                    .Include(p => p.supplier)
                    .Include(p => p.product_variants)
                    .Where(p => p.deleted_at == null && p.status == "active");

                // Nếu yêu cầu chỉ lấy sản phẩm có trong kho
                if (inStock)
                {
                    if (branchId.HasValue)
                    {
                        query = query.Where(p =>
                            p.product_variants.Any(v =>
                                _db.branch_inventories.Any(bi =>
                                    bi.product_variant_id == v.id &&
                                    bi.branch_id == branchId.Value &&
                                    bi.quantity_on_hand > 0
                                )
                            )
                        );
                    }
                    else
                    {
                        query = query.Where(p =>
                            p.product_variants.Any(v =>
                                _db.branch_inventories.Any(bi =>
                                    bi.product_variant_id == v.id &&
                                    bi.quantity_on_hand > 0
                                )
                            )
                        );
                    }
                }

                var products = query
                    .OrderByDescending(p => p.created_at)
                    .Take(50)
                    .Select(p => new
                    {
                        Id = p.id,
                        Name = p.name,
                        Slug = p.slug,
                        Description = p.description,
                        CategoryId = p.category_id,
                        CategoryName = p.category.name,
                        Price = p.product_variants
                            .Where(v => v.deleted_at == null)
                            .Min(v => (decimal?)v.price) ?? 0,
                        OriginalPrice = p.product_variants
                            .Where(v => v.deleted_at == null)
                            .Min(v => v.original_price),
                        ImageUrl = p.product_variants
                            .Where(v => v.deleted_at == null)
                            .Select(v => v.image_url)
                            .FirstOrDefault()
                    })
                    .ToList();

                return Ok(new
                {
                    Success = true,
                    Data = products,
                    Total = products.Count,
                    Message = "Lấy danh sách sản phẩm thành công"
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // ========================================
        // CẬP NHẬT GET /api/products/category/{categoryId}
        // Thêm filter theo branch inventory
        // ========================================
        [HttpGet]
        [Route("category/{categoryId:long}")]
        public IHttpActionResult GetByCategory(
            long categoryId,
            [FromUri] long? branchId = null)
        {
            try
            {
                var query = _db.products
                    .Include(p => p.product_variants)
                    .Where(p => 
                        p.category_id == categoryId &&
                        p.deleted_at == null &&
                        p.status == "active"
                    );

                // Chỉ lấy sản phẩm có trong kho
                if (branchId.HasValue)
                {
                    query = query.Where(p =>
                        p.product_variants.Any(v =>
                            _db.branch_inventories.Any(bi =>
                                bi.product_variant_id == v.id &&
                                bi.branch_id == branchId.Value &&
                                bi.quantity_on_hand > 0
                            )
                        )
                    );
                }
                else
                {
                    query = query.Where(p =>
                        p.product_variants.Any(v =>
                            _db.branch_inventories.Any(bi =>
                                bi.product_variant_id == v.id &&
                                bi.quantity_on_hand > 0
                            )
                        )
                    );
                }

                var products = query
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
        // CẬP NHẬT GET /api/products/search
        // Thêm filter theo branch inventory
        // ========================================
        [HttpGet]
        [Route("search")]
        public IHttpActionResult Search(
            [FromUri] string q,
            [FromUri] long? branchId = null)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return Ok(new { Success = true, Data = new object[] { }, Total = 0 });
                }

                var keyword = q.ToLower().Trim();

                var query = _db.products
                    .Include(p => p.product_variants)
                    .Where(p => 
                        p.deleted_at == null &&
                        p.status == "active" &&
                        (p.name.ToLower().Contains(keyword) ||
                         p.description.ToLower().Contains(keyword))
                    );

                // Chỉ lấy sản phẩm có trong kho
                if (branchId.HasValue)
                {
                    query = query.Where(p =>
                        p.product_variants.Any(v =>
                            _db.branch_inventories.Any(bi =>
                                bi.product_variant_id == v.id &&
                                bi.branch_id == branchId.Value &&
                                bi.quantity_on_hand > 0
                            )
                        )
                    );
                }
                else
                {
                    query = query.Where(p =>
                        p.product_variants.Any(v =>
                            _db.branch_inventories.Any(bi =>
                                bi.product_variant_id == v.id &&
                                bi.quantity_on_hand > 0
                            )
                        )
                    );
                }

                var products = query
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

---

## 🔍 SQL QUERY TƯƠNG ĐƯƠNG

Nếu muốn test trực tiếp trên SQL Server:

```sql
-- Lấy sản phẩm có trong kho tại BẤT KỲ chi nhánh nào
SELECT DISTINCT 
    p.id, 
    p.name, 
    p.slug,
    c.name AS CategoryName,
    MIN(pv.price) AS Price,
    SUM(bi.quantity_on_hand) AS TotalStock
FROM products p
INNER JOIN categories c ON p.category_id = c.id
INNER JOIN product_variants pv ON pv.product_id = p.id
INNER JOIN branch_inventories bi ON bi.product_variant_id = pv.id
WHERE p.deleted_at IS NULL 
    AND p.status = 'active'
    AND pv.deleted_at IS NULL
    AND bi.quantity_on_hand > 0
GROUP BY p.id, p.name, p.slug, c.name
ORDER BY p.created_at DESC;

-- Lấy sản phẩm có trong kho tại CHI NHÁNH CỤ THỂ (branch_id = 1)
SELECT DISTINCT 
    p.id, 
    p.name, 
    p.slug,
    c.name AS CategoryName,
    MIN(pv.price) AS Price,
    SUM(bi.quantity_on_hand) AS TotalStock
FROM products p
INNER JOIN categories c ON p.category_id = c.id
INNER JOIN product_variants pv ON pv.product_id = p.id
INNER JOIN branch_inventories bi ON bi.product_variant_id = pv.id
WHERE p.deleted_at IS NULL 
    AND p.status = 'active'
    AND pv.deleted_at IS NULL
    AND bi.branch_id = 1  -- Chi nhánh cụ thể
    AND bi.quantity_on_hand > 0
GROUP BY p.id, p.name, p.slug, c.name
ORDER BY p.created_at DESC;
```

---

## ✅ CHECKLIST

- [ ] Tạo endpoint `GET /api/products/in-stock`
- [ ] Cập nhật endpoint `GET /api/products` với parameter `inStock` và `branchId`
- [ ] Cập nhật endpoint `GET /api/products/category/{id}` với parameter `branchId`
- [ ] Cập nhật endpoint `GET /api/products/search` với parameter `branchId`
- [ ] Test với Postman/Swagger
- [ ] Verify response format (PascalCase: Success, Data, Total, Message)

---

*Tài liệu tạo bởi Antigravity AI - 21/12/2024*
