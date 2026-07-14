import { PRODUCTS, Product } from "@/data/products";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  date: string;
  status: "Pending" | "Crating" | "Shipped" | "Delivered";
}

// Stored Products (Local Storage DB)
export const getStoredProducts = (): Product[] => {
  if (typeof window === "undefined") return PRODUCTS;
  const stored = localStorage.getItem("shree_sai_db_products");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored products", e);
    }
  }
  // Initialize on first call if not present
  if (typeof window !== "undefined") {
    localStorage.setItem("shree_sai_db_products", JSON.stringify(PRODUCTS));
  }
  return PRODUCTS;
};

export const saveStoredProducts = (products: Product[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("shree_sai_db_products", JSON.stringify(products));
  }
};

// Stored Orders (Local Storage DB)
export const getStoredOrders = (): Order[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("shree_sai_db_orders");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored orders", e);
    }
  }
  return [];
};

export const saveStoredOrders = (orders: Order[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("shree_sai_db_orders", JSON.stringify(orders));
  }
};

export const addOrder = (order: Omit<Order, "status" | "date">): void => {
  const orders = getStoredOrders();
  const newOrder: Order = {
    ...order,
    status: "Pending",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }),
  };
  orders.unshift(newOrder);
  saveStoredOrders(orders);
};
