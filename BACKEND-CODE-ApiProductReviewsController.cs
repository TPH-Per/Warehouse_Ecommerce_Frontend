// ==========================================
// ApiProductReviewsController.cs
// Controller xử lý API cho Product Reviews
// Đặt file này trong thư mục: Controllers/Api/
// ==========================================
//
// LƯU Ý: File này dùng cho ASP.NET Web API (ApiController)
// giống như ApiAuthController.cs đã có trong project
//
// ==========================================

using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Security;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace DoAnLTWHQT.Controllers.Api
{
    // ==========================================
    // DTO Classes
    // ==========================================
    
    /// <summary>
    /// Request body khi tạo review mới
    /// </summary>
    public class ReviewCreateRequest
    {
        [Required(ErrorMessage = "Rating là bắt buộc")]
        [Range(1, 5, ErrorMessage = "Rating phải từ 1 đến 5")]
        public int Rating { get; set; }

        [MaxLength(2000, ErrorMessage = "Comment không được quá 2000 ký tự")]
        public string Comment { get; set; }
    }

    /// <summary>
    /// Response trả về cho mỗi review
    /// </summary>
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

    // ==========================================
    // CONTROLLER - dùng ApiController giống ApiAuthController
    // ==========================================
    
    [RoutePrefix("api/products")]
    [EnableCors(origins: "*", headers: "*", methods: "*", SupportsCredentials = true)]
    public class ApiProductReviewsController : ApiController
    {
        private readonly DoAnLTWHQTEntities db = new DoAnLTWHQTEntities();

        // ==========================================
        // Helper: Lấy User ID từ FormsAuthentication
        // ==========================================
        private long? GetCurrentUserId()
        {
            try
            {
                var httpContext = System.Web.HttpContext.Current;
                if (httpContext?.Request?.Cookies == null) return null;

                var authCookie = httpContext.Request.Cookies[FormsAuthentication.FormsCookieName];
                if (authCookie == null) return null;

                var ticket = FormsAuthentication.Decrypt(authCookie.Value);
                if (ticket == null) return null;

                // UserData chứa user ID
                if (long.TryParse(ticket.UserData, out long userId))
                {
                    return userId;
                }

                // Fallback: tìm user theo email (ticket.Name)
                var user = db.users.FirstOrDefault(u => u.email == ticket.Name);
                return user?.id;
            }
            catch
            {
                return null;
            }
        }

        // ==========================================
        // GET: /api/products/{productId}/reviews
        // Lấy danh sách đánh giá của sản phẩm
        // ==========================================
        [HttpGet]
        [Route("{productId}/reviews")]
        public IHttpActionResult GetReviews(long productId)
        {
            try
            {
                System.Diagnostics.Debug.WriteLine($"[GetReviews] ProductId: {productId}");
                
                var currentUserId = GetCurrentUserId();

                // Kiểm tra product tồn tại
                var product = db.products.Find(productId);
                if (product == null)
                {
                    return Content(System.Net.HttpStatusCode.NotFound, new
                    {
                        Success = false,
                        Message = "Sản phẩm không tồn tại"
                    });
                }

                // Lấy danh sách reviews
                // CHẾ ĐỘ TEST: Lấy tất cả reviews không cần duyệt
                var reviewsQuery = db.product_reviews
                    .Where(r => r.product_id == productId && r.deleted_at == null)
                    // PRODUCTION: Bỏ comment dòng dưới
                    // .Where(r => r.is_approved == true || r.user_id == currentUserId)
                    .OrderByDescending(r => r.created_at)
                    .ToList();

                System.Diagnostics.Debug.WriteLine($"[GetReviews] Found {reviewsQuery.Count} reviews");

                // Map sang DTO
                var reviews = new List<ReviewResponse>();
                foreach (var r in reviewsQuery)
                {
                    var user = db.users.Find(r.user_id);
                    var userName = user?.full_name ?? "Ẩn danh";

                    // Kiểm tra verified purchase (đơn giản hóa để tránh lỗi)
                    var isVerifiedPurchase = false;
                    try
                    {
                        isVerifiedPurchase = db.purchase_orders
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
                    }
                    catch
                    {
                        // Nếu lỗi join, để false
                    }

                    reviews.Add(new ReviewResponse
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
                    });
                }

                return Ok(new
                {
                    Success = true,
                    Data = reviews,
                    Message = (string)null
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[GetReviews] Error: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"[GetReviews] StackTrace: {ex.StackTrace}");
                return InternalServerError(new Exception("Đã xảy ra lỗi khi lấy danh sách đánh giá"));
            }
        }

        // ==========================================
        // POST: /api/products/{productId}/reviews
        // Tạo đánh giá mới
        // ==========================================
        [HttpPost]
        [Route("{productId}/reviews")]
        public IHttpActionResult CreateReview(long productId, [FromBody] ReviewCreateRequest request)
        {
            try
            {
                System.Diagnostics.Debug.WriteLine($"[CreateReview] ProductId: {productId}");
                System.Diagnostics.Debug.WriteLine($"[CreateReview] Rating: {request?.Rating}, Comment: {request?.Comment}");

                // 1. Kiểm tra đăng nhập
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    System.Diagnostics.Debug.WriteLine("[CreateReview] User not authenticated");
                    return Content(System.Net.HttpStatusCode.Unauthorized, new
                    {
                        Success = false,
                        Message = "Vui lòng đăng nhập để đánh giá"
                    });
                }

                System.Diagnostics.Debug.WriteLine($"[CreateReview] UserId: {userId}");

                // 2. Validate rating
                if (request == null || request.Rating < 1 || request.Rating > 5)
                {
                    return Content(System.Net.HttpStatusCode.BadRequest, new
                    {
                        Success = false,
                        Message = "Rating phải từ 1 đến 5"
                    });
                }

                // 3. Kiểm tra product tồn tại
                var product = db.products.Find(productId);
                if (product == null)
                {
                    return Content(System.Net.HttpStatusCode.NotFound, new
                    {
                        Success = false,
                        Message = "Sản phẩm không tồn tại"
                    });
                }

                // 4. Kiểm tra user đã review chưa
                var existingReview = db.product_reviews
                    .FirstOrDefault(r => r.user_id == userId && r.product_id == productId && r.deleted_at == null);

                if (existingReview != null)
                {
                    return Content(System.Net.HttpStatusCode.Conflict, new
                    {
                        Success = false,
                        Message = "Bạn đã đánh giá sản phẩm này rồi"
                    });
                }

                // 5. Tạo review mới
                // CHẾ ĐỘ TEST: Auto approved
                var review = new product_review
                {
                    user_id = userId.Value,
                    product_id = productId,
                    rating = (byte)request.Rating,
                    comment = request.Comment ?? "",
                    is_approved = true,      // TEST: Auto approve
                    status = "approved",     // TEST: Auto approve
                    created_at = DateTime.Now
                };

                db.product_reviews.Add(review);
                db.SaveChanges();

                System.Diagnostics.Debug.WriteLine($"[CreateReview] Review created successfully");

                // Lấy thông tin user để trả về
                var user = db.users.Find(userId.Value);

                // Kiểm tra verified purchase
                var isVerifiedPurchase = false;
                try
                {
                    isVerifiedPurchase = db.purchase_orders
                        .Join(db.purchase_order_details,
                            po => po.id,
                            pod => pod.order_id,
                            (po, pod) => new { po, pod })
                        .Join(db.product_variants,
                            x => x.pod.product_variant_id,
                            pv => pv.id,
                            (x, pv) => new { x.po, pv })
                        .Any(x => x.po.user_id == userId.Value
                               && x.pv.product_id == productId
                               && x.po.status == "delivered");
                }
                catch { }

                var response = new ReviewResponse
                {
                    UserId = review.user_id,
                    ProductId = review.product_id,
                    UserName = user?.full_name ?? "Ẩn danh",
                    Rating = review.rating,
                    Comment = review.comment,
                    IsApproved = review.is_approved,
                    IsVerifiedPurchase = isVerifiedPurchase,
                    Status = review.status,
                    CreatedAt = review.created_at,
                    UpdatedAt = review.updated_at
                };

                return Ok(new
                {
                    Success = true,
                    Message = "Đánh giá đã được gửi thành công!",
                    Data = response
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[CreateReview] Error: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"[CreateReview] StackTrace: {ex.StackTrace}");
                return InternalServerError(new Exception("Đã xảy ra lỗi khi gửi đánh giá: " + ex.Message));
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
