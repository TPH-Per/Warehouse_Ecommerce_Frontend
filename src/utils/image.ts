/**
 * Image Helper - Xử lý đường dẫn ảnh từ server ASP.NET
 * File: src/utils/image.ts
 */

// Base URL của API server (không bao gồm /api)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://localhost:44377';

// Có sử dụng API endpoint để load ảnh không?
// Set true nếu static files không hoạt động và bạn đã tạo ApiFilesController
const USE_API_ENDPOINT_FOR_IMAGES = false;

// Placeholder image dạng SVG base64
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,' + btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect fill="#1a1a2e" width="400" height="400"/>
    <rect fill="#16213e" x="50" y="50" width="300" height="300" rx="20"/>
    <path fill="#0f3460" d="M200 120 L280 220 L120 220 Z"/>
    <circle fill="#e94560" cx="260" cy="140" r="25"/>
    <text x="200" y="320" text-anchor="middle" fill="#666" font-family="Arial" font-size="16">No Image</text>
  </svg>
`);

/**
 * Chuyển đổi đường dẫn ảnh từ database thành URL đầy đủ
 * Hỗ trợ nhiều định dạng: png, jpg, jpeg, gif, webp, svg, bmp
 * 
 * Ví dụ:
 * - Input:  "/wwwroot/uploads/products/xxx.png"
 * - Output: "https://localhost:44377/uploads/products/xxx.png"
 *   hoặc:  "https://localhost:44377/api/files/image?path=/uploads/products/xxx.png"
 * 
 * @param imagePath - Đường dẫn ảnh từ database
 * @returns URL đầy đủ để hiển thị ảnh
 */
export function getImageUrl(imagePath: string | null | undefined): string {
    // Kiểm tra có ảnh hay không
    if (!imagePath || imagePath === '' || imagePath === 'null') {
        return PLACEHOLDER_IMAGE;
    }

    let cleanPath = imagePath;

    // KHÔNG xóa /wwwroot - vì đây chỉ là thư mục thường, giữ nguyên path từ database

    // Nếu đường dẫn đã đầy đủ (http/https), trả về nguyên bản
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
        return cleanPath;
    }

    // Sử dụng API endpoint để load ảnh (nếu static files không hoạt động)
    if (USE_API_ENDPOINT_FOR_IMAGES) {
        // Encode path để tránh lỗi với ký tự đặc biệt
        const encodedPath = encodeURIComponent(cleanPath);
        return `${API_BASE_URL}/api/files/image?path=${encodedPath}`;
    }

    // Sử dụng static files trực tiếp - giữ nguyên path từ database
    if (cleanPath.startsWith('/')) {
        return `${API_BASE_URL}${cleanPath}`;
    }

    // Trường hợp còn lại (chỉ có tên file)
    return `${API_BASE_URL}/wwwroot/uploads/products/${cleanPath}`;
}

/**
 * Lấy URL ảnh sản phẩm với fallback placeholder
 * 
 * @param product - Object sản phẩm (hỗ trợ cả PascalCase và camelCase)
 * @returns URL ảnh sản phẩm hoặc placeholder
 */
export function getProductImageUrl(product: any): string {
    const imageUrl = product?.ImageUrl || product?.imageUrl || product?.image_url;
    return getImageUrl(imageUrl);
}

/**
 * Lấy URL ảnh variant với fallback placeholder
 * 
 * @param variant - Object variant sản phẩm
 * @returns URL ảnh variant hoặc placeholder
 */
export function getVariantImageUrl(variant: any): string {
    const imageUrl = variant?.ImageUrl || variant?.imageUrl || variant?.image_url;
    return getImageUrl(imageUrl);
}

/**
 * Kiểm tra xem đường dẫn có phải là ảnh hay không
 * @param path - Đường dẫn file
 */
export function isImagePath(path: string | null | undefined): boolean {
    if (!path) return false;
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.ico'];
    const lowerPath = path.toLowerCase();
    return imageExtensions.some(ext => lowerPath.endsWith(ext));
}

export default {
    PLACEHOLDER_IMAGE,
    getImageUrl,
    getProductImageUrl,
    getVariantImageUrl,
    isImagePath,
};
