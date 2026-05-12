// ===== 공통 타입 =====
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ===== 사용자 타입 =====
export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  profileImageUrl?: string;
  role: 'USER' | 'ADMIN';
  provider: 'LOCAL' | 'GOOGLE' | 'NAVER' | 'KAKAO' | 'APPLE';
  createdAt: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  name: string;
  role: string;
}

// ===== 카테고리 타입 =====
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  sortOrder: number;
  active: boolean;
}

// ===== 상품 타입 =====
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  thumbnailUrl?: string;
  categoryId: number;
  categoryName: string;
  brand?: string;
  featured: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  viewCount: number;
  salesCount: number;
  createdAt: string;
}

// ===== 장바구니 타입 =====
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productThumbnail?: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  stock: number;
}

// ===== 주문 타입 =====
export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  receiverName: string;
  receiverPhone: string;
  zipCode: string;
  address: string;
  addressDetail?: string;
  orderMemo?: string;
  items: OrderItem[];
  createdAt: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_DONE'
  | 'PREPARING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productThumbnail?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ===== 결제 타입 =====
export interface Payment {
  id: number;
  orderId: number;
  paymentKey: string;
  method: string;
  status: string;
  amount: number;
  pgProvider: string;
  paidAt?: string;
  createdAt: string;
}

// ===== 리뷰 타입 =====
export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  content: string;
  imageUrl?: string;
  visible: boolean;
  createdAt: string;
}

// ===== 주소 타입 =====
export interface Address {
  id: number;
  alias: string;
  receiverName: string;
  receiverPhone: string;
  zipCode: string;
  address: string;
  addressDetail?: string;
  isDefault: boolean;
}
