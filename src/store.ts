import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type RepairStatus =
  | "WAITING_FOR_PARTS"
  | "WORKING_ON_IT"
  | "PENDING"
  | "FIXED"
  | "PICKED_UP";

type OrderService = {
  serviceId: string;
  name: string;
  quantity: number;
  price: number;
  repairServiceType: string;
  imei?: string;
  password?: string;
  status?: string;
  dueDate?: string;
};

type Customer = {
  name: string;
  phone: string;
  email?: string;
};

type Order = {
  id: number;
  price: number;
  tags: string[];
  userId: string;
  orderServices: OrderService[];
  customer: Customer;
  orderNotes?: string;
  repairNotes?: string;
};

interface CartStore {
  order: Order | null;
  setOrder: (order: Order) => void;
  addServices: (services: OrderService[]) => void;
  updateService: (serviceId: string, updates: Partial<OrderService>) => void;
  removeService: (serviceId: string) => void;
  updateCustomer: (customer: Customer) => void;
  updateOrderDetails: (details: Partial<Order>) => void;
  removeOrder: (orderId: number) => void;
  clearOrder: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const initialOrder: Order = {
  id: Date.now(),
  price: 0,
  tags: [],
  userId: "",
  orderServices: [],
  customer: {
    name: "",
    phone: "",
    email: "",
  },
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      order: null,
      setOrder: (order) => set({ order }),
      addServices: (services) =>
        set((state) => {
          if (!state.order) {
            return {
              order: {
                ...initialOrder,
                orderServices: services,
                price: services.reduce(
                  (total, service) => total + service.price * service.quantity,
                  0
                ),
              },
            };
          }

          const updatedServices = [...state.order.orderServices, ...services];

          return {
            order: {
              ...state.order,
              orderServices: updatedServices,
              price: updatedServices.reduce(
                (total, service) => total + service.price * service.quantity,
                0
              ),
            },
          };
        }),
      updateService: (serviceId, updates) =>
        set((state) => {
          if (!state.order) return state;

          const updatedServices = state.order.orderServices.map((service) =>
            service.serviceId === serviceId
              ? { ...service, ...updates }
              : service
          );

          return {
            order: {
              ...state.order,
              orderServices: updatedServices,
              price: updatedServices.reduce(
                (total, service) => total + service.price * service.quantity,
                0
              ),
            },
          };
        }),
      removeService: (serviceId) =>
        set((state) => {
          if (!state.order) return state;

          const updatedServices = state.order.orderServices.filter(
            (service) => service.serviceId !== serviceId
          );

          return {
            order: {
              ...state.order,
              orderServices: updatedServices,
              price: updatedServices.reduce(
                (total, service) => total + service.price * service.quantity,
                0
              ),
            },
          };
        }),
      updateCustomer: (customer) =>
        set((state) => {
          if (!state.order) return state;
          return {
            order: {
              ...state.order,
              customer,
            },
          };
        }),
      updateOrderDetails: (details) =>
        set((state) => {
          if (!state.order) return state;
          return {
            order: {
              ...state.order,
              ...details,
            },
          };
        }),
      removeOrder: (orderId: number) =>
        set((state) => {
          if (!state.order || state.order.id !== orderId) return state;
          return { order: null };
        }),
      clearOrder: () => set({ order: null }),
      getTotalItems: () => {
        const order = get().order;
        if (!order) return 0;
        return order.orderServices.reduce(
          (total, service) => total + service.quantity,
          0
        );
      },
      getTotalPrice: () => {
        const order = get().order;
        if (!order) return 0;
        return order.orderServices.reduce(
          (total, service) => total + service.price * service.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
