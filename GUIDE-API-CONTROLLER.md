 # 🔗 HƯỚNG DẪN TẠO API CONTROLLER CHO VUE

## Bạn đã có sẵn:
- ✅ Entity Framework với `PerwDbContext`
- ✅ Logic login/register trong `AccountController`
- ✅ BCrypt để hash password
- ✅ Model `user` và `RegisterViewModel`

## Bạn cần tạo thêm:
- 📁 API Controller mới: `ApiAuthController.cs`
- ⚙️ Cấu hình CORS

---

## BƯỚC 1: Cài đặt CORS Package

Mở **Package Manager Console** trong Visual Studio:

```powershell
Install-Package Microsoft.AspNet.WebApi.Cors
```

---

## BƯỚC 2: Cấu hình CORS

### Mở file `App_Start/WebApiConfig.cs` và thêm:

```csharp
using System.Web.Http;
using System.Web.Http.Cors;

namespace YourProject
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // ========== QUAN TRỌNG: Enable CORS ==========
            var cors = new EnableCorsAttribute(
                origins: "http://localhost:5173",  // URL của Vue dev server
                headers: "*",
                methods: "*"
            );
            cors.SupportsCredentials = true;  // Cho phép gửi cookies
            config.EnableCors(cors);

            // Attribute routing
            config.MapHttpAttributeRoutes();

            // Convention-based routing
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // Đảm bảo trả về JSON
            config.Formatters.JsonFormatter.SupportedMediaTypes
                .Add(new System.Net.Http.Headers.MediaTypeHeaderValue("text/html"));
        }
    }
}
```

### Đảm bảo trong `Global.asax.cs` đã đăng ký WebApi:

```csharp
protected void Application_Start()
{
    AreaRegistration.RegisterAllAreas();
    
    // Đăng ký Web API config - QUAN TRỌNG!
    GlobalConfiguration.Configure(WebApiConfig.Register);
    
    FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
    RouteConfig.RegisterRoutes(RouteTable.Routes);
    BundleConfig.RegisterBundles(BundleTable.Bundles);
}
```

---

## BƯỚC 3: Tạo API Controller

### Tạo file `Controllers/Api/ApiAuthController.cs`:

```csharp
using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Data.Entity;
using BCryptNet = BCrypt.Net.BCrypt;

namespace YourProject.Controllers.Api
{
    /// <summary>
    /// API Controller cho Vue Frontend - Login/Register
    /// </summary>
    [RoutePrefix("api/auth")]
    [EnableCors(origins: "http://localhost:5173", headers: "*", methods: "*", SupportsCredentials = true)]
    public class ApiAuthController : ApiController
    {
        private readonly PerwDbContext _db = new PerwDbContext();

        // ================================================
        // POST /api/auth/login
        // ================================================
        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        public IHttpActionResult Login([FromBody] ApiLoginRequest request)
        {
            System.Diagnostics.Debug.WriteLine("========== API LOGIN CALLED ==========");

            try
            {
                // Validation
                if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                {
                    return Content(System.Net.HttpStatusCode.BadRequest, new ApiResponse
                    {
                        Success = false,
                        Message = "Vui lòng nhập email và mật khẩu."
                    });
                }

                // Normalize email
                var normalizedEmail = request.Email.Trim().ToLowerInvariant();
                System.Diagnostics.Debug.WriteLine($"API Login - Email: {normalizedEmail}");

                // Tìm user trong database
                var dbUser = _db.users
                    .Include(u => u.role)
                    .FirstOrDefault(u => u.email.ToLower() == normalizedEmail && u.deleted_at == null);

                if (dbUser == null)
                {
                    System.Diagnostics.Debug.WriteLine("API Login - User not found");
                    return Content(System.Net.HttpStatusCode.Unauthorized, new ApiResponse
                    {
                        Success = false,
                        Message = "Email hoặc mật khẩu không chính xác."
                    });
                }

                // Verify password với BCrypt
                if (!VerifyPassword(request.Password, dbUser.password))
                {
                    System.Diagnostics.Debug.WriteLine("API Login - Password mismatch");
                    return Content(System.Net.HttpStatusCode.Unauthorized, new ApiResponse
                    {
                        Success = false,
                        Message = "Email hoặc mật khẩu không chính xác."
                    });
                }

                // Kiểm tra tài khoản active
                if (!string.Equals(dbUser.status, "active", StringComparison.OrdinalIgnoreCase))
                {
                    System.Diagnostics.Debug.WriteLine("API Login - Account locked");
                    return Content(System.Net.HttpStatusCode.Forbidden, new ApiResponse
                    {
                        Success = false,
                        Message = "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên."
                    });
                }

                // Thành công - Trả về user info
                System.Diagnostics.Debug.WriteLine($"API Login - Success: {dbUser.email}");

                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "Đăng nhập thành công!",
                    Data = new UserDto
                    {
                        Id = dbUser.id,
                        Name = dbUser.name,
                        FullName = dbUser.full_name,
                        Email = dbUser.email,
                        PhoneNumber = dbUser.phone_number,
                        RoleId = dbUser.role_id,
                        RoleName = dbUser.role?.name ?? "customer"
                    }
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"API Login Error: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // ================================================
        // POST /api/auth/register
        // ================================================
        [HttpPost]
        [Route("register")]
        [AllowAnonymous]
        public IHttpActionResult Register([FromBody] ApiRegisterRequest request)
        {
            System.Diagnostics.Debug.WriteLine("========== API REGISTER CALLED ==========");

            try
            {
                // Validation
                var errors = new System.Collections.Generic.Dictionary<string, string[]>();

                if (request == null)
                {
                    return Content(System.Net.HttpStatusCode.BadRequest, new ApiResponse
                    {
                        Success = false,
                        Message = "Dữ liệu không hợp lệ."
                    });
                }

                if (string.IsNullOrWhiteSpace(request.Name))
                    errors["name"] = new[] { "Tên đăng nhập không được để trống." };

                if (string.IsNullOrWhiteSpace(request.FullName))
                    errors["full_name"] = new[] { "Họ và tên không được để trống." };

                if (string.IsNullOrWhiteSpace(request.Email))
                    errors["email"] = new[] { "Email không được để trống." };

                if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
                    errors["password"] = new[] { "Mật khẩu phải có ít nhất 6 ký tự." };

                if (request.Password != request.PasswordConfirmation)
                    errors["password_confirmation"] = new[] { "Mật khẩu xác nhận không khớp." };

                if (errors.Count > 0)
                {
                    return Content(System.Net.HttpStatusCode.UnprocessableEntity, new ApiValidationResponse
                    {
                        Success = false,
                        Message = "Dữ liệu không hợp lệ.",
                        Errors = errors
                    });
                }

                // Normalize
                var normalizedEmail = request.Email.Trim().ToLowerInvariant();
                var normalizedUsername = request.Name.Trim().ToLowerInvariant();

                // Kiểm tra email đã tồn tại
                if (_db.users.Any(u => u.email.ToLower() == normalizedEmail && u.deleted_at == null))
                {
                    return Content(System.Net.HttpStatusCode.UnprocessableEntity, new ApiValidationResponse
                    {
                        Success = false,
                        Message = "Email đã được sử dụng.",
                        Errors = new System.Collections.Generic.Dictionary<string, string[]>
                        {
                            { "email", new[] { "Email này đã được sử dụng." } }
                        }
                    });
                }

                // Kiểm tra username đã tồn tại
                if (_db.users.Any(u => u.name.ToLower() == normalizedUsername && u.deleted_at == null))
                {
                    return Content(System.Net.HttpStatusCode.UnprocessableEntity, new ApiValidationResponse
                    {
                        Success = false,
                        Message = "Tên đăng nhập đã được sử dụng.",
                        Errors = new System.Collections.Generic.Dictionary<string, string[]>
                        {
                            { "name", new[] { "Tên đăng nhập này đã được sử dụng." } }
                        }
                    });
                }

                // Hash password với BCrypt
                var hashedPassword = BCryptNet.HashPassword(request.Password, BCryptNet.GenerateSalt(12));

                // Tạo user mới
                var newUser = new user
                {
                    name = normalizedUsername,
                    full_name = request.FullName.Trim(),
                    email = normalizedEmail,
                    phone_number = !string.IsNullOrWhiteSpace(request.PhoneNumber) ? request.PhoneNumber.Trim() : null,
                    password = hashedPassword,
                    role_id = 4, // Customer role
                    status = "active",
                    created_at = DateTime.Now,
                    updated_at = DateTime.Now
                };

                _db.users.Add(newUser);
                _db.SaveChanges();

                System.Diagnostics.Debug.WriteLine($"API Register - User created: {newUser.id}");

                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "Đăng ký thành công! Vui lòng đăng nhập.",
                    Data = new { Id = newUser.id }
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"API Register Error: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // ================================================
        // GET /api/auth/check - Kiểm tra user đang login
        // ================================================
        [HttpGet]
        [Route("check")]
        [AllowAnonymous]
        public IHttpActionResult CheckAuth()
        {
            // API này dùng để Vue kiểm tra xem có session hợp lệ không (nếu cần)
            return Ok(new ApiResponse
            {
                Success = true,
                Message = "API is working"
            });
        }

        // ================================================
        // Helper: Verify Password
        // ================================================
        private bool VerifyPassword(string inputPassword, string storedHash)
        {
            try
            {
                // Sử dụng BCrypt để verify
                return BCryptNet.Verify(inputPassword, storedHash);
            }
            catch
            {
                return false;
            }
        }

        // ================================================
        // Dispose
        // ================================================
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _db.Dispose();
            }
            base.Dispose(disposing);
        }
    }

    // ================================================
    // REQUEST MODELS
    // ================================================
    public class ApiLoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ApiRegisterRequest
    {
        public string Name { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string PasswordConfirmation { get; set; }
    }

    // ================================================
    // RESPONSE MODELS
    // ================================================
    public class ApiResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }

    public class ApiValidationResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public System.Collections.Generic.Dictionary<string, string[]> Errors { get; set; }
    }

    public class UserDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public long RoleId { get; set; }
        public string RoleName { get; set; }
    }
}
```

---

## BƯỚC 4: Cập nhật Vue Frontend

### 4.1 Cập nhật `.env`:

```env
VITE_API_BASE_URL=http://localhost:xxxx/api
```

**Lưu ý:** Thay `xxxx` bằng port thực tế của ASP.NET (xem trong Visual Studio khi run project).

### 4.2 File `src/api/index.ts` đã OK:

Đảm bảo có `withCredentials: true`:

```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});
```

---

## BƯỚC 5: Test API

### Dùng Postman hoặc trình duyệt:

**Test Login:**
```
POST http://localhost:xxxx/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```

**Response thành công (200):**
```json
{
  "Success": true,
  "Message": "Đăng nhập thành công!",
  "Data": {
    "Id": 1,
    "Name": "testuser",
    "FullName": "Nguyen Van A",
    "Email": "test@example.com",
    "PhoneNumber": "0901234567",
    "RoleId": 4,
    "RoleName": "customer"
  }
}
```

**Response lỗi (401):**
```json
{
  "Success": false,
  "Message": "Email hoặc mật khẩu không chính xác."
}
```

---

## BƯỚC 6: Chạy cả 2 project

### Terminal 1 - ASP.NET:
- Mở Visual Studio
- F5 hoặc Ctrl+F5 để run
- Ghi nhớ port (vd: http://localhost:54321)

### Terminal 2 - Vue:
```bash
cd d:\vue\base_vue\do_an_ltw_fe\wibu-shop\wibu-shop
npm run dev
```
- Chạy ở http://localhost:5173

### Truy cập:
- http://localhost:5173/login

---

## ❗ TROUBLESHOOTING

### Lỗi CORS:
```
Access to XMLHttpRequest blocked by CORS policy
```
**Giải pháp:**
1. Kiểm tra đã cài `Microsoft.AspNet.WebApi.Cors`
2. Kiểm tra `WebApiConfig.cs` đã enable CORS
3. Kiểm tra origin URL đúng chưa (http://localhost:5173)
4. Restart Visual Studio

### Lỗi 404:
**Giải pháp:**
1. Kiểm tra route prefix: `/api/auth/login`
2. Kiểm tra `Global.asax` đã đăng ký `WebApiConfig`
3. Kiểm tra namespace và class name

### Lỗi 500:
**Giải pháp:**
1. Xem Output window trong Visual Studio
2. Kiểm tra connection string
3. Kiểm tra có using đúng namespace không

### Vue không nhận response:
**Giải pháp:**
1. Trong Vue, response từ C# có dạng `response.data` (không phải `response.data.data`)
2. Kiểm tra property names: C# dùng PascalCase (`Success`), Vue expect camelCase (`success`)

**Sửa trong `LoginPage.vue`:**
```typescript
// Thay đổi từ:
if (response.data.success) {

// Thành:
if (response.data.Success) {
  authStore.login(response.data.Data);
```

---

## 📝 CHECKLIST HOÀN THÀNH

### Backend (ASP.NET):
- [ ] Cài `Microsoft.AspNet.WebApi.Cors`
- [ ] Cấu hình CORS trong `WebApiConfig.cs`
- [ ] Đăng ký WebApi trong `Global.asax`
- [ ] Tạo `ApiAuthController.cs`
- [ ] Test API bằng Postman

### Frontend (Vue):
- [ ] Cập nhật `.env` với đúng port
- [ ] Đảm bảo axios có `withCredentials: true`
- [ ] Sửa property names nếu cần (PascalCase vs camelCase)
- [ ] Test login/register trên Vue

---

## 💡 GHI CHÚ

1. **Không cần tạo SQL User** cho API login (khác với MVC Register). API chỉ verify và trả JSON.

2. **Property naming:** C# mặc định dùng PascalCase. Nếu muốn camelCase, thêm vào `WebApiConfig.cs`:
```csharp
config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = 
    new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
```

3. **Session vs Stateless:** API này là stateless - Vue lưu user info trong Pinia/localStorage, không dùng session của ASP.NET.
