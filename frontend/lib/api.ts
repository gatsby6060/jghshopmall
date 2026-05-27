import axios, { AxiosInstance } from 'axios';

// 브라우저 환경에서는 상대 경로를 사용하여 Next.js rewrites 프록시를 통하도록 함
function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    // 브라우저 환경: 상대 경로 사용 (next.config.ts의 rewrites가 /api, /oauth2 등을 백엔드로 프록시함)
    return '';
  }
  // 서버 사이드 렌더링: 컨테이너 내부 주소
  return process.env.INTERNAL_API_URL || 'http://backend:8080';
}

const api: AxiosInstance = axios.create({
  baseURL: typeof window !== 'undefined' ? getApiUrl() : (process.env.INTERNAL_API_URL || 'http://backend:8080'),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 요청 인터셉터 - JWT 토큰 자동 첨부 + 동적 baseURL 설정
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // 매 요청마다 현재 baseURL 재계산 (프록시 환경 대응)
      config.baseURL = getApiUrl();
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 토큰 만료 시 자동 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const apiUrl = getApiUrl();
        const response = await axios.post(`${apiUrl}/api/auth/refresh`, null, {
          params: { refreshToken },
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.baseURL = apiUrl;

        return api(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ===== API 함수들 =====

export const productApi = {
  getProducts: (params?: { page?: number; size?: number; sort?: string }) =>
    api.get('/api/products', { params }),
  getProductsByCategory: (categoryId: number, params?: { page?: number; size?: number }) =>
    api.get(`/api/products/category/${categoryId}`, { params }),
  searchProducts: (keyword: string, params?: { page?: number; size?: number }) =>
    api.get('/api/products/search', { params: { keyword, ...params } }),
  getProduct: (id: number) => api.get(`/api/products/${id}`),
  getFeaturedProducts: () => api.get('/api/products/featured'),
  getNewProducts: () => api.get('/api/products/new'),
  getBestProducts: () => api.get('/api/products/best'),
  createProduct: (data: unknown) => api.post('/api/products', data),
  updateProduct: (id: number, data: unknown) => api.put(`/api/products/${id}`, data),
  deleteProduct: (id: number) => api.delete(`/api/products/${id}`),
};

export const categoryApi = {
  getCategories: () => api.get('/api/categories'),
  getAllCategories: () => api.get('/api/categories/all'),
  getCategory: (id: number) => api.get(`/api/categories/${id}`),
  createCategory: (data: unknown) => api.post('/api/categories', data),
  updateCategory: (id: number, data: unknown) => api.put(`/api/categories/${id}`, data),
  deleteCategory: (id: number) => api.delete(`/api/categories/${id}`),
};

export const authApi = {
  signup: (data: { email: string; password: string; name: string; phone?: string }) =>
    api.post('/api/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  refresh: (refreshToken: string) =>
    api.post('/api/auth/refresh', null, { params: { refreshToken } }),
};

export const cartApi = {
  getCartItems: () => api.get('/api/cart', {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    params: {
      _t: Date.now()
    }
  }),
  addToCart: (data: { productId: number; quantity: number }) =>
    api.post('/api/cart', data),
  updateQuantity: (id: number, quantity: number) =>
    api.patch(`/api/cart/${id}`, null, { params: { quantity } }),
  removeFromCart: (id: number) => api.delete(`/api/cart/${id}`),
  clearCart: () => api.delete('/api/cart'),
};

export const orderApi = {
  getMyOrders: (params?: { page?: number; size?: number }) =>
    api.get('/api/orders', { params }),
  getOrder: (id: number) => api.get(`/api/orders/${id}`),
  createOrder: (data: unknown) => api.post('/api/orders', data),
  cancelOrder: (id: number) => api.post(`/api/orders/${id}/cancel`),
};

export const paymentApi = {
  confirmPayment: (data: { paymentKey: string; orderId: string; amount: number }) =>
    api.post('/api/payments/confirm', data),
  getPaymentByOrder: (orderId: number) => api.get(`/api/payments/order/${orderId}`),
};

export const adminApi = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getUsers: (params?: { page?: number; size?: number }) =>
    api.get('/api/admin/users', { params }),
  updateUserRole: (id: number, role: string) =>
    api.patch(`/api/admin/users/${id}/role`, null, { params: { role } }),
  getOrders: (params?: { page?: number; size?: number }) =>
    api.get('/api/admin/orders', { params }),
  updateOrderStatus: (id: number, status: string) =>
    api.patch(`/api/admin/orders/${id}/status`, null, { params: { status } }),
  getAccessLogs: (params?: { page?: number; size?: number }) =>
    api.get('/api/admin/access-logs', { params }),
  getBlockedIps: () => api.get('/api/admin/blocked-ips'),
  blockIp: (ipAddress: string, reason?: string) =>
    api.post('/api/admin/blocked-ips', null, { params: { ipAddress, reason: reason || '' } }),
  unblockIp: (id: number) => api.delete(`/api/admin/blocked-ips/${id}`),
  getSalesStats: () => api.get('/api/admin/sales-stats'),
};
