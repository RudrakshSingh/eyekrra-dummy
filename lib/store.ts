'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
}

interface Order {
  id: string;
  orderId: string;
  customerId: string;
  serviceType: string;
  city: string;
  pincode: string;
  address: string;
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
  payment: {
    amount: number;
    method: string;
  };
}

interface AppState {
  user: User | null;
  orders: Order[];
  login: (phone: string, name?: string) => void;
  logout: () => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderId' | 'customerId' | 'startedAt' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, stage: string) => void;
  getOrder: (orderId: string) => Order | undefined;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      orders: [],

      login: (phone: string, name?: string) => {
        const user: User = {
          id: `user_${Date.now()}`,
          phone,
          name: name || `User ${phone.slice(-4)}`,
        };
        set({ user });
      },

      logout: () => {
        set({ user: null });
      },

      createOrder: (orderData) => {
        const state = get();
        if (!state.user) throw new Error('User not logged in');

        const orderId = `EKR-${Math.floor(10000 + Math.random() * 90000)}`;
        const order: Order = {
          id: `order_${Date.now()}`,
          orderId,
          customerId: state.user.id,
          startedAt: new Date(),
          timeline: [
            {
              stage: 'confirmed',
              timestamp: new Date(),
              userName: 'System',
            },
          ],
          ...orderData,
        };

        set((state) => ({
          orders: [...state.orders, order],
        }));

        return order;
      },

      updateOrderStatus: (orderId: string, stage: string) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id === orderId || order.orderId === orderId) {
              return {
                ...order,
                currentStage: stage,
                timeline: [
                  ...order.timeline,
                  {
                    stage,
                    timestamp: new Date(),
                    userName: 'System',
                  },
                ],
              };
            }
            return order;
          }),
        }));
      },

      getOrder: (orderId: string) => {
        const state = get();
        return state.orders.find(
          (order) => order.id === orderId || order.orderId === orderId
        );
      },
    }),
    {
      name: 'eyekra-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

