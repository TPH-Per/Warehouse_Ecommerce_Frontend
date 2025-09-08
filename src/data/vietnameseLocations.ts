// Vietnamese location data for shipping estimation
export interface District {
  id: string;
  name: string;
  shippingCost: number; // Base shipping cost in VND
  estimatedDays: number; // Estimated delivery days
}

export interface City {
  id: string;
  name: string;
  districts: District[];
}

export const vietnameseLocations: City[] = [
  // Miền Bắc (Northern Region)
  {
    id: 'hanoi',
    name: 'Hà Nội',
    districts: [
      { id: 'ba-dinh', name: 'Quận Ba Đình', shippingCost: 30000, estimatedDays: 2 },
      { id: 'hoan-kiem', name: 'Quận Hoàn Kiếm', shippingCost: 30000, estimatedDays: 2 },
      { id: 'tay-ho', name: 'Quận Tây Hồ', shippingCost: 35000, estimatedDays: 2 },
      { id: 'long-bien', name: 'Quận Long Biên', shippingCost: 35000, estimatedDays: 3 },
      { id: 'cau-giay', name: 'Quận Cầu Giấy', shippingCost: 30000, estimatedDays: 2 },
      { id: 'dong-da', name: 'Quận Đống Đa', shippingCost: 30000, estimatedDays: 2 },
      { id: 'hai-ba-trung', name: 'Quận Hai Bà Trưng', shippingCost: 30000, estimatedDays: 2 },
      { id: 'hoang-mai', name: 'Quận Hoàng Mai', shippingCost: 35000, estimatedDays: 3 },
      { id: 'thanh-xuan', name: 'Quận Thanh Xuân', shippingCost: 30000, estimatedDays: 2 },
      { id: 'nam-tu-liem', name: 'Quận Nam Từ Liêm', shippingCost: 35000, estimatedDays: 3 },
      { id: 'bac-tu-liem', name: 'Quận Bắc Từ Liêm', shippingCost: 35000, estimatedDays: 3 },
      { id: 'ha-dong', name: 'Quận Hà Đông', shippingCost: 40000, estimatedDays: 3 },
      { id: 'son-tay', name: 'Thị xã Sơn Tây', shippingCost: 45000, estimatedDays: 4 },
      { id: 'ba-vi', name: 'Huyện Ba Vì', shippingCost: 50000, estimatedDays: 4 },
      { id: 'chuong-my', name: 'Huyện Chương Mỹ', shippingCost: 50000, estimatedDays: 4 },
      { id: 'dan-phuong', name: 'Huyện Đan Phượng', shippingCost: 45000, estimatedDays: 4 },
      { id: 'dong-anh', name: 'Huyện Đông Anh', shippingCost: 40000, estimatedDays: 3 },
      { id: 'gia-lam', name: 'Huyện Gia Lâm', shippingCost: 40000, estimatedDays: 3 },
      { id: 'hoai-duc', name: 'Huyện Hoài Đức', shippingCost: 45000, estimatedDays: 4 },
      { id: 'me-linh', name: 'Huyện Mê Linh', shippingCost: 50000, estimatedDays: 4 },
      { id: 'my-duc', name: 'Huyện Mỹ Đức', shippingCost: 50000, estimatedDays: 4 },
      { id: 'phuc-tho', name: 'Huyện Phúc Thọ', shippingCost: 45000, estimatedDays: 4 },
      { id: 'phu-xuyen', name: 'Huyện Phú Xuyên', shippingCost: 50000, estimatedDays: 4 },
      { id: 'quoc-oai', name: 'Huyện Quốc Oai', shippingCost: 50000, estimatedDays: 4 },
      { id: 'soc-son', name: 'Huyện Sóc Sơn', shippingCost: 50000, estimatedDays: 4 },
      { id: 'thach-that', name: 'Huyện Thạch Thất', shippingCost: 50000, estimatedDays: 4 },
      { id: 'thanh-oai', name: 'Huyện Thanh Oai', shippingCost: 50000, estimatedDays: 4 },
      { id: 'thanh-tri', name: 'Huyện Thanh Trì', shippingCost: 40000, estimatedDays: 3 },
      { id: 'thuong-tin', name: 'Huyện Thường Tín', shippingCost: 50000, estimatedDays: 4 },
      { id: 'ung-hoa', name: 'Huyện Ứng Hòa', shippingCost: 50000, estimatedDays: 4 }
    ]
  },
  {
    id: 'cao-bang',
    name: 'Tỉnh Cao Bằng',
    districts: [{ id: 'cao-bang-city', name: 'Thành phố Cao Bằng', shippingCost: 80000, estimatedDays: 5 }]
  },
  {
    id: 'dien-bien',
    name: 'Tỉnh Điện Biên',
    districts: [{ id: 'dien-bien-phu', name: 'Thành phố Điện Biên Phủ', shippingCost: 90000, estimatedDays: 6 }]
  },
  {
    id: 'ha-tinh',
    name: 'Tỉnh Hà Tĩnh',
    districts: [{ id: 'ha-tinh-city', name: 'Thành phố Hà Tĩnh', shippingCost: 75000, estimatedDays: 5 }]
  },
  {
    id: 'lai-chau',
    name: 'Tỉnh Lai Châu',
    districts: [{ id: 'lai-chau-city', name: 'Thành phố Lai Châu', shippingCost: 95000, estimatedDays: 6 }]
  },
  {
    id: 'lang-son',
    name: 'Tỉnh Lạng Sơn',
    districts: [{ id: 'lang-son-city', name: 'Thành phố Lạng Sơn', shippingCost: 85000, estimatedDays: 5 }]
  },
  {
    id: 'lao-cai',
    name: 'Tỉnh Lào Cai',
    districts: [{ id: 'lao-cai-city', name: 'Thành phố Lào Cai', shippingCost: 90000, estimatedDays: 6 }]
  },
  {
    id: 'phu-tho',
    name: 'Tỉnh Phú Thọ',
    districts: [{ id: 'viet-tri', name: 'Thành phố Việt Trì', shippingCost: 70000, estimatedDays: 4 }]
  },
  {
    id: 'quang-ninh',
    name: 'Tỉnh Quảng Ninh',
    districts: [{ id: 'ha-long', name: 'Thành phố Hạ Long', shippingCost: 65000, estimatedDays: 4 }]
  },
  {
    id: 'son-la',
    name: 'Tỉnh Sơn La',
    districts: [{ id: 'son-la-city', name: 'Thành phố Sơn La', shippingCost: 95000, estimatedDays: 6 }]
  },
  {
    id: 'thai-nguyen',
    name: 'Tỉnh Thái Nguyên',
    districts: [{ id: 'thai-nguyen-city', name: 'Thành phố Thái Nguyên', shippingCost: 70000, estimatedDays: 4 }]
  },
  
  // Miền Trung (Central Region)
  {
    id: 'da-nang',
    name: 'Thành phố Đà Nẵng',
    districts: [
      { id: 'hai-chau', name: 'Quận Hải Châu', shippingCost: 60000, estimatedDays: 4 },
      { id: 'thanh-khe', name: 'Quận Thanh Khê', shippingCost: 60000, estimatedDays: 4 },
      { id: 'son-tra', name: 'Quận Sơn Trà', shippingCost: 65000, estimatedDays: 4 },
      { id: 'ngu-hanh-son', name: 'Quận Ngũ Hành Sơn', shippingCost: 65000, estimatedDays: 4 },
      { id: 'lien-chieu', name: 'Quận Liên Chiểu', shippingCost: 65000, estimatedDays: 4 },
      { id: 'cam-le', name: 'Quận Cẩm Lệ', shippingCost: 65000, estimatedDays: 4 }
    ]
  },
  {
    id: 'hue',
    name: 'Thành phố Huế',
    districts: [{ id: 'hue-city', name: 'Thành phố Huế', shippingCost: 70000, estimatedDays: 4 }]
  },
  {
    id: 'gia-lai',
    name: 'Tỉnh Gia Lai',
    districts: [{ id: 'pleiku', name: 'Thành phố Pleiku', shippingCost: 85000, estimatedDays: 5 }]
  },
  {
    id: 'khanh-hoa',
    name: 'Tỉnh Khánh Hòa',
    districts: [{ id: 'nha-trang', name: 'Thành phố Nha Trang', shippingCost: 70000, estimatedDays: 4 }]
  },
  {
    id: 'lam-dong',
    name: 'Tỉnh Lâm Đồng',
    districts: [{ id: 'da-lat', name: 'Thành phố Đà Lạt', shippingCost: 75000, estimatedDays: 5 }]
  },
  {
    id: 'nghe-an',
    name: 'Tỉnh Nghệ An',
    districts: [{ id: 'vinh', name: 'Thành phố Vinh', shippingCost: 75000, estimatedDays: 5 }]
  },
  {
    id: 'quang-ngai',
    name: 'Tỉnh Quảng Ngãi',
    districts: [{ id: 'quang-ngai-city', name: 'Thành phố Quảng Ngãi', shippingCost: 75000, estimatedDays: 5 }]
  },
  {
    id: 'quang-tri',
    name: 'Tỉnh Quảng Trị',
    districts: [{ id: 'dong-ha', name: 'Thành phố Đông Hà', shippingCost: 75000, estimatedDays: 5 }]
  },
  {
    id: 'thanh-hoa',
    name: 'Tỉnh Thanh Hóa',
    districts: [{ id: 'thanh-hoa-city', name: 'Thành phố Thanh Hóa', shippingCost: 70000, estimatedDays: 4 }]
  },
  
  // Miền Nam (Southern Region)
  {
    id: 'ho-chi-minh',
    name: 'Thành phố Hồ Chí Minh',
    districts: [
      { id: 'quan-1', name: 'Quận 1', shippingCost: 25000, estimatedDays: 1 },
      { id: 'quan-3', name: 'Quận 3', shippingCost: 25000, estimatedDays: 1 },
      { id: 'quan-4', name: 'Quận 4', shippingCost: 30000, estimatedDays: 2 },
      { id: 'quan-5', name: 'Quận 5', shippingCost: 25000, estimatedDays: 1 },
      { id: 'quan-6', name: 'Quận 6', shippingCost: 30000, estimatedDays: 2 },
      { id: 'quan-7', name: 'Quận 7', shippingCost: 30000, estimatedDays: 2 },
      { id: 'quan-8', name: 'Quận 8', shippingCost: 30000, estimatedDays: 2 },
      { id: 'quan-10', name: 'Quận 10', shippingCost: 25000, estimatedDays: 1 },
      { id: 'quan-11', name: 'Quận 11', shippingCost: 25000, estimatedDays: 2 },
      { id: 'quan-12', name: 'Quận 12', shippingCost: 35000, estimatedDays: 3 },
      { id: 'quan-binh-thanh', name: 'Quận Bình Thạnh', shippingCost: 25000, estimatedDays: 2 },
      { id: 'quan-go-vap', name: 'Quận Gò Vấp', shippingCost: 30000, estimatedDays: 2 },
      { id: 'quan-phu-nhuan', name: 'Quận Phú Nhuận', shippingCost: 25000, estimatedDays: 1 },
      { id: 'quan-tan-binh', name: 'Quận Tân Bình', shippingCost: 25000, estimatedDays: 2 },
      { id: 'quan-tan-phu', name: 'Quận Tân Phú', shippingCost: 30000, estimatedDays: 2 },
      { id: 'quan-thu-duc', name: 'Thành phố Thủ Đức', shippingCost: 30000, estimatedDays: 2 },
      { id: 'quan-binh-tan', name: 'Quận Bình Tân', shippingCost: 35000, estimatedDays: 3 },
      { id: 'huyen-binh-chanh', name: 'Huyện Bình Chánh', shippingCost: 40000, estimatedDays: 3 },
      { id: 'huyen-can-gio', name: 'Huyện Cần Giờ', shippingCost: 50000, estimatedDays: 4 },
      { id: 'huyen-cu-chi', name: 'Huyện Củ Chi', shippingCost: 45000, estimatedDays: 4 },
      { id: 'huyen-hoc-mon', name: 'Huyện Hóc Môn', shippingCost: 40000, estimatedDays: 3 },
      { id: 'huyen-nha-be', name: 'Huyện Nhà Bè', shippingCost: 40000, estimatedDays: 3 }
    ]
  },
  {
    id: 'can-tho',
    name: 'Thành phố Cần Thơ',
    districts: [
      { id: 'ninh-kieu', name: 'Quận Ninh Kiều', shippingCost: 65000, estimatedDays: 4 },
      { id: 'binh-thuy', name: 'Quận Bình Thủy', shippingCost: 65000, estimatedDays: 4 },
      { id: 'cai-rang', name: 'Quận Cái Răng', shippingCost: 65000, estimatedDays: 4 },
      { id: 'o-mon', name: 'Quận Ô Môn', shippingCost: 70000, estimatedDays: 4 },
      { id: 'thot-not', name: 'Quận Thốt Nốt', shippingCost: 70000, estimatedDays: 4 }
    ]
  },
  {
    id: 'an-giang',
    name: 'Tỉnh An Giang',
    districts: [{ id: 'long-xuyen', name: 'Thành phố Long Xuyên', shippingCost: 80000, estimatedDays: 5 }]
  },
  {
    id: 'bac-ninh',
    name: 'Tỉnh Bắc Ninh',
    districts: [{ id: 'bac-ninh-city', name: 'Thành phố Bắc Ninh', shippingCost: 55000, estimatedDays: 3 }]
  },
  {
    id: 'ca-mau',
    name: 'Tỉnh Cà Mau',
    districts: [{ id: 'ca-mau-city', name: 'Thành phố Cà Mau', shippingCost: 90000, estimatedDays: 6 }]
  },
  {
    id: 'dak-lak',
    name: 'Tỉnh Đắk Lắk',
    districts: [{ id: 'buon-ma-thuot', name: 'Thành phố Buôn Ma Thuột', shippingCost: 85000, estimatedDays: 5 }]
  },
  {
    id: 'dong-nai',
    name: 'Tỉnh Đồng Nai',
    districts: [{ id: 'bien-hoa', name: 'Thành phố Biên Hòa', shippingCost: 45000, estimatedDays: 3 }]
  },
  {
    id: 'dong-thap',
    name: 'Tỉnh Đồng Tháp',
    districts: [{ id: 'cao-lanh', name: 'Thành phố Cao Lãnh', shippingCost: 75000, estimatedDays: 5 }]
  },
  {
    id: 'hung-yen',
    name: 'Tỉnh Hưng Yên',
    districts: [{ id: 'hung-yen-city', name: 'Thành phố Hưng Yên', shippingCost: 60000, estimatedDays: 4 }]
  },
  {
    id: 'long-an',
    name: 'Tỉnh Long An',
    districts: [{ id: 'tan-an', name: 'Thành phố Tân An', shippingCost: 55000, estimatedDays: 4 }]
  },
  {
    id: 'ninh-binh',
    name: 'Tỉnh Ninh Bình',
    districts: [{ id: 'ninh-binh-city', name: 'Thành phố Ninh Bình', shippingCost: 70000, estimatedDays: 4 }]
  },
  {
    id: 'tay-ninh',
    name: 'Tỉnh Tây Ninh',
    districts: [{ id: 'tay-ninh-city', name: 'Thành phố Tây Ninh', shippingCost: 70000, estimatedDays: 4 }]
  },
  {
    id: 'vinh-long',
    name: 'Tỉnh Vĩnh Long',
    districts: [{ id: 'vinh-long-city', name: 'Thành phố Vĩnh Long', shippingCost: 75000, estimatedDays: 5 }]
  }
];

// Helper functions for shipping calculations
export const getCityById = (cityId: string): City | undefined => {
  return vietnameseLocations.find(city => city.id === cityId);
};

export const getDistrictById = (cityId: string, districtId: string): District | undefined => {
  const city = getCityById(cityId);
  return city?.districts.find(district => district.id === districtId);
};

export const calculateShippingCost = (cityId: string, districtId: string, productWeight: number = 1): number => {
  const district = getDistrictById(cityId, districtId);
  if (!district) return 50000; // Default shipping cost if location not found
  
  // Base cost + weight surcharge (5000 VND per kg above 1kg)
  const weightSurcharge = productWeight > 1 ? (productWeight - 1) * 5000 : 0;
  return district.shippingCost + weightSurcharge;
};

export const getEstimatedDeliveryDays = (cityId: string, districtId: string): number => {
  const district = getDistrictById(cityId, districtId);
  return district?.estimatedDays || 5; // Default 5 days if location not found
};

// Convert VND to JPY for display (approximate exchange rate)
export const convertVNDtoJPY = (vndAmount: number): number => {
  const exchangeRate = 0.0055; // Approximate VND to JPY rate
  return Math.round(vndAmount * exchangeRate);
};