import { UserRole } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async sendOTP(phone: string) {
    return this.request<{ success: boolean; message: string }>('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOTP(phone: string, code: string) {
    const result = await this.request<{ token: string; refreshToken: string; user: any }>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
    if (result.token) {
      this.setToken(result.token);
    }
    return result;
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  // Orders
  async getOrders(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    return this.request<any[]>(`/orders?${params.toString()}`);
  }

  async getOrder(id: string) {
    return this.request<any>(`/orders/${id}`);
  }

  async createOrder(data: any) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrderStatus(orderId: string, stage: string, data?: any) {
    return this.request<any>(`/orders/${orderId}/status`, {
      method: 'POST',
      body: JSON.stringify({ stage, ...data }),
    });
  }

  // Bookings
  async getSlots(city: string, date?: string) {
    const params = new URLSearchParams({ city, ...(date && { date }) }).toString();
    return this.request<any[]>(`/slots?${params}`);
  }

  async createBooking(data: any) {
    return this.request<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Products
  async getProducts(filters?: any) {
    const params = new URLSearchParams(filters).toString();
    return this.request<any[]>(`/products?${params}`);
  }

  async getProduct(slug: string) {
    return this.request<any>(`/products/${slug}`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;

