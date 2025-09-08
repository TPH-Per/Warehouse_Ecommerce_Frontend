import { faker } from '@faker-js/faker';
import type { Product, Category, Review, User, Order, UserRole, Sensor, AuditLog, Coupon, Shipment, OrderItem } from '@/types';

// --- CENTRALIZED MOCK DATA ---
// By generating the data here once, we ensure all components share the same data set,
// which fixes issues with navigation and finding items by ID.

// Anime series and characters data
const animeData = [
  { series: 'Attack on Titan', characters: ['Mikasa Ackerman', 'Eren Yeager', 'Levi Ackerman', 'Armin Arlert'] },
  { series: 'Demon Slayer', characters: ['Tanjiro Kamado', 'Nezuko Kamado', 'Zenitsu Agatsuma', 'Inosuke Hashibira'] },
  { series: 'My Hero Academia', characters: ['Izuku Midoriya', 'Katsuki Bakugo', 'Ochaco Uraraka', 'Shoto Todoroki'] },
  { series: 'One Piece', characters: ['Monkey D. Luffy', 'Roronoa Zoro', 'Nami', 'Nico Robin'] },
  { series: 'Naruto', characters: ['Naruto Uzumaki', 'Sasuke Uchiha', 'Sakura Haruno', 'Kakashi Hatake'] },
  { series: 'Jujutsu Kaisen', characters: ['Yuji Itadori', 'Megumi Fushiguro', 'Nobara Kugisaki', 'Gojo Satoru'] },
  { series: 'Chainsaw Man', characters: ['Denji', 'Makima', 'Power', 'Aki Hayakawa'] },
  { series: 'Spy x Family', characters: ['Loid Forger', 'Yor Forger', 'Anya Forger', 'Bond'] },
];

const manufacturers = [
  'Good Smile Company', 'Kotobukiya', 'Alter', 'Max Factory', 'Bandai',
  'FREEing', 'Aniplex', 'Prime 1 Studio', 'Megahouse', 'Vertex'
];

const scales = ['1/4', '1/6', '1/7', '1/8', '1/10', '1/12', 'Non-scale'];

export const allCategories: Category[] = [
  {
    id: '1',
    name: 'Figures',
    slug: 'figures',
    image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/ff69b4/ffffff?text=Figures',
    productCount: 0, // Will be updated later
  },
  {
    id: '2',
    name: 'Nendoroids',
    slug: 'nendoroids',
    image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/8b5cf6/ffffff?text=Nendoroids',
    productCount: 0,
  },
  {
    id: '3',
    name: 'Plushies',
    slug: 'plushies',
    image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/06b6d4/ffffff?text=Plushies',
    productCount: 0,
  },
  {
    id: '4',
    name: 'Figma',
    slug: 'figma',
    image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/10b981/ffffff?text=Figma',
    productCount: 0,
  },
];

const generateProducts = (count: number = 100): Product[] => {
  const products: Product[] = [];
  
  for (let i = 0; i < count; i++) {
    const animeEntry = faker.helpers.arrayElement(animeData);
    const character = faker.helpers.arrayElement(animeEntry.characters);
    const categoryType = faker.helpers.arrayElement(['figure', 'plushie', 'nendoroid', 'figma'] as const);
    const condition = faker.helpers.arrayElement(['new', 'used', 'damaged-box'] as const);
    const availability = faker.helpers.arrayElement(['in-stock', 'pre-order', 'out-of-stock'] as const);
    
    const basePrice = faker.number.int({ min: 2000, max: 25000 });
    const hasDiscount = faker.datatype.boolean(0.3);
    const price = hasDiscount ? Math.round(basePrice * 0.8) : basePrice;
    
    const imageUrl = `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x600/ff69b4/ffffff?text=${encodeURIComponent(character)}`;
    
    const categoryNameMap = { figure: 'Figures', plushie: 'Plushies', nendoroid: 'Nendoroids', figma: 'Figma' };
    const category = allCategories.find(c => c.name === categoryNameMap[categoryType]);

    products.push({
      id: faker.string.uuid(),
      sku: `OP-${faker.string.alphanumeric(8).toUpperCase()}`,
      name: `${character} ${categoryType === 'figure' ? 'Figure' : categoryType === 'plushie' ? 'Plushie' : categoryType === 'nendoroid' ? 'Nendoroid' : 'Figma'}`,
      description: `High-quality ${categoryType} of ${character} from ${animeEntry.series}. Meticulously crafted with attention to detail, this collectible is perfect for any fan.`,
      categoryId: category?.id || null,
      price,
      costPrice: price * faker.number.float({ min: 0.5, max: 0.7 }),
      weight_kg: faker.number.float({ min: 0.1, max: 2.5, fractionDigits: 3 }),
      dimensions_json: JSON.stringify({
        length: faker.number.int({ min: 10, max: 30 }),
        width: faker.number.int({ min: 10, max: 30 }),
        height: faker.number.int({ min: 15, max: 40 }),
      }),
      imageUrl,
      isActive: faker.datatype.boolean(0.9),
      isDeleted: false,
      
      series: animeEntry.series,
      character,
      manufacturer: faker.helpers.arrayElement(manufacturers),
      scale: categoryType === 'figure' ? faker.helpers.arrayElement(scales) : 'Non-scale',
      originalPrice: hasDiscount ? basePrice : undefined,
      images: [
        imageUrl,
        `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x600/8b5cf6/ffffff?text=Detail+1`,
        `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x600/06b6d4/ffffff?text=Detail+2`,
      ],
      category: categoryType,
      condition,
      availability,
      eta: availability === 'pre-order' ? faker.date.future().toISOString().split('T')[0] : undefined,
      // NSFW categorization removed
      stock: availability === 'out-of-stock' ? 0 : faker.number.int({ min: 1, max: 50 }),
      rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
      reviewCount: 0, // Will be updated later
      tags: faker.helpers.arrayElements([
        'limited-edition', 'exclusive', 'popular', 'new-release', 'bestseller', 
        'rare', 'collectible', 'detailed', 'articulated', 'painted'
      ], { min: 1, max: 4 }),
      createdAt: faker.date.past().toISOString(),
    });
  }
  return products;
};

export const allProducts: Product[] = generateProducts(100);

const generateReviews = (products: Product[]): Review[] => {
  const reviews: Review[] = [];
  products.forEach(product => {
    const reviewCount = faker.number.int({ min: 0, max: 25 });
    product.reviewCount = reviewCount; // Update product's review count
    for (let i = 0; i < reviewCount; i++) {
      reviews.push({
        id: faker.string.uuid(),
        productId: product.id,
        productName: product.name,
        productImage: product.images[0],
        userId: faker.string.uuid(),
        userName: faker.person.firstName(),
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
        createdAt: faker.date.past().toISOString(),
        verified: faker.datatype.boolean(0.8),
        status: faker.helpers.arrayElement(['pending', 'approved', 'rejected'] as const),
      });
    }
  });
  return reviews;
};

export const allReviews: Review[] = generateReviews(allProducts);

// Update category product counts
allCategories.forEach(category => {
  category.productCount = allProducts.filter(p => p.categoryId === category.id).length;
});

// --- Other Mock Data Generators ---

export const generateMockUsers = (count: number = 20): User[] => {
  const users: User[] = [];
  const roles: UserRole[] = ['manager', 'staff', 'customer'];

  for (let i = 0; i < count; i++) {
    users.push({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: faker.helpers.arrayElement(roles),
      isActive: faker.datatype.boolean(0.9),
      isAgeVerified: faker.datatype.boolean(0.7),
      preferences: {
        currency: 'JPY',
        language: 'en',
      },
      lastLogin: faker.date.recent().toISOString(),
    });
  }
  return users;
};

export const generateMockOrders = (count: number = 30): Order[] => {
  const orders: Order[] = [];
  
  for (let i = 0; i < count; i++) {
    const productCount = faker.number.int({ min: 1, max: 5 });
    const items: OrderItem[] = Array.from({ length: productCount }, () => {
      const product = faker.helpers.arrayElement(allProducts);
      return {
        productId: product.id,
        name: product.name,
        image: product.imageUrl || 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/100x100/ff69b4/ffffff?text=Item',
        quantity: faker.number.int({ min: 1, max: 2 }),
        price: product.price,
      };
    });
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = 500;
    const tax = Math.round(subtotal * 0.1);

    // Create shipments
    const shipments: Shipment[] = [];
    const isSplitShipment = items.length > 2 && faker.datatype.boolean(0.4);
    if (isSplitShipment) {
      const splitIndex = Math.floor(items.length / 2);
      const firstShipmentItems = items.slice(0, splitIndex);
      const secondShipmentItems = items.slice(splitIndex);
      
      shipments.push({
        id: `SHP-${faker.string.alphanumeric(8).toUpperCase()}`,
        trackingNumber: `JP${faker.string.alphanumeric(10).toUpperCase()}`,
        carrier: faker.helpers.arrayElement(['VNPost', 'GHN', 'DHL']),
        items: firstShipmentItems,
        status: faker.helpers.arrayElement(['processing', 'in-transit', 'delivered']),
        shippedAt: faker.date.recent().toISOString(),
      });
      shipments.push({
        id: `SHP-${faker.string.alphanumeric(8).toUpperCase()}`,
        trackingNumber: `JP${faker.string.alphanumeric(10).toUpperCase()}`,
        carrier: faker.helpers.arrayElement(['VNPost', 'GHN', 'DHL']),
        items: secondShipmentItems,
        status: faker.helpers.arrayElement(['processing', 'in-transit']),
        shippedAt: faker.date.recent().toISOString(),
      });
    } else {
      shipments.push({
        id: `SHP-${faker.string.alphanumeric(8).toUpperCase()}`,
        trackingNumber: `JP${faker.string.alphanumeric(10).toUpperCase()}`,
        carrier: faker.helpers.arrayElement(['VNPost', 'GHN', 'DHL']),
        items: items,
        status: faker.helpers.arrayElement(['processing', 'in-transit', 'delivered']),
        shippedAt: faker.date.recent().toISOString(),
      });
    }

    let orderStatus: Order['status'] = faker.helpers.arrayElement(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']);
    if (isSplitShipment) {
      orderStatus = 'partially-shipped';
    } else if (shipments.every(s => s.status === 'delivered')) {
      orderStatus = 'delivered';
    } else if (shipments.some(s => s.status !== 'processing')) {
      orderStatus = 'shipped';
    }
    
    orders.push({
      id: `ORD-${faker.string.alphanumeric(8).toUpperCase()}`,
      userId: 'customer-user-01', // Link to our specific customer for testing
      items,
      shipments,
      subtotal,
      shippingCost,
      tax,
      total: subtotal + shippingCost + tax,
      status: orderStatus,
      shippingAddress: {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        type: 'home',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: 'Japan',
        phone: faker.phone.number(),
        isDefault: true,
      },
      paymentMethod: faker.helpers.arrayElement(['VNPay', 'MoMo', 'Pay on Delivery']),
      createdAt: faker.date.past().toISOString(),
      estimatedDelivery: faker.date.future().toISOString().split('T')[0],
    });
  }
  
  return orders;
};

export const allOrders = generateMockOrders(30);

export const generateMockSensors = (count: number = 10): Sensor[] => {
  const sensors: Sensor[] = [];
  for (let i = 0; i < count; i++) {
    const type = faker.helpers.arrayElement(['temperature', 'humidity'] as const);
    sensors.push({
      id: `sensor-${i + 1}`,
      zoneId: `zone-${faker.number.int({ min: 1, max: 3 })}`,
      type,
      status: faker.helpers.arrayElement(['online', 'offline', 'alert'] as const),
      lastReading: type === 'temperature' ? faker.number.float({ min: 18, max: 28, fractionDigits: 1 }) : faker.number.float({ min: 40, max: 60, fractionDigits: 1 }),
      lastReadingTimestamp: faker.date.recent().toISOString(),
    });
  }
  return sensors;
};

export const generateMockAuditLogs = (count: number = 50): AuditLog[] => {
  const logs: AuditLog[] = [];
  const actions = ['created', 'updated', 'deleted'];
  const targetTypes = ['product', 'order', 'user'];

  for (let i = 0; i < count; i++) {
    const targetType = faker.helpers.arrayElement(targetTypes);
    logs.push({
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      userName: faker.person.fullName(),
      action: `${faker.helpers.arrayElement(actions)} ${targetType}`,
      targetId: faker.string.uuid(),
      targetType,
      timestamp: faker.date.recent({ days: 30 }).toISOString(),
    });
  }
  return logs;
};

export const generateMockCoupons = (count: number = 15): Coupon[] => {
  const coupons: Coupon[] = [];
  for (let i = 0; i < count; i++) {
    const type = faker.helpers.arrayElement(['percentage', 'fixed'] as const);
    coupons.push({
      id: faker.string.uuid(),
      code: faker.string.alphanumeric(8).toUpperCase(),
      description: faker.lorem.sentence(),
      type,
      value: type === 'percentage' ? faker.number.int({ min: 5, max: 25 }) : faker.number.int({ min: 500, max: 2000 }),
      minOrderAmount: faker.helpers.maybe(() => faker.number.int({ min: 3000, max: 10000 }), { probability: 0.5 }),
      usageCount: faker.number.int({ min: 0, max: 100 }),
      usageLimit: faker.helpers.maybe(() => 100, { probability: 0.3 }),
      expiresAt: faker.date.future().toISOString(),
      isActive: faker.datatype.boolean(0.8),
    });
  }
  return coupons;
};
