// Simple localStorage-based storage for demo

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
}

export interface Order {
  id: string;
  orderId: string;
  customerId: string;
  customerPhone: string;
  type: 'FAST' | 'STANDARD';
  serviceType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  currentStage: string;
  startedAt: Date;
  targetMinutes: number;
  timeline: Array<{
    stage: string;
    timestamp: Date;
    userName: string;
  }>;
  assignedStaffName?: string;
  address: {
    full: string;
    landmark?: string;
  };
  createdAt: Date;
}

export const storage = {
  // User
  setUser(user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eyekra_user', JSON.stringify(user));
    }
  },

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('eyekra_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  clearUser() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('eyekra_user');
    }
  },

  // Orders
  saveOrder(order: Order) {
    if (typeof window !== 'undefined') {
      const orders = this.getOrders();
      const existingIndex = orders.findIndex((o) => o.id === order.id);
      if (existingIndex >= 0) {
        orders[existingIndex] = order;
      } else {
        orders.push(order);
      }
      localStorage.setItem('eyekra_orders', JSON.stringify(orders));
    }
  },

  getOrders(): Order[] {
    if (typeof window !== 'undefined') {
      const orders = localStorage.getItem('eyekra_orders');
      return orders ? JSON.parse(orders) : [];
    }
    return [];
  },

  getOrder(orderId: string): Order | null {
    const orders = this.getOrders();
    return orders.find((o) => o.orderId === orderId || o.id === orderId) || null;
  },

  getUserOrders(userId: string): Order[] {
    const orders = this.getOrders();
    return orders.filter((o) => o.customerId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
};

