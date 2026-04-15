/**
 * Demo Orders Data & Types
 * No Supabase needed - this uses mock data for demo
 */

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  items: OrderItem[];
  total_amount: number;
  status?: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  special_instructions?: string;
  order_type?: "dine-in" | "takeaway" | "delivery";
  created_at?: string;
  updated_at?: string;
}

// Mock demo orders - shown in admin dashboard
export const mockOrders: Order[] = [
  {
    id: "1",
    customer_name: "Priya Sharma",
    customer_email: "priya@kj.edu.in",
    customer_phone: "9876543210",
    items: [
      { id: "1", name: "Cutting Chai", price: 10, quantity: 2 },
      { id: "2", name: "Samosa", price: 15, quantity: 1 },
    ],
    total_amount: 35,
    status: "ready",
    order_type: "dine-in",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    customer_name: "Rohan Verma",
    customer_email: "rohan@kj.edu.in",
    customer_phone: "9876543211",
    items: [
      { id: "1", name: "Masala Chai", price: 15, quantity: 3 },
      { id: "8", name: "Vada Pav", price: 20, quantity: 2 },
    ],
    total_amount: 85,
    status: "preparing",
    order_type: "takeaway",
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "3",
    customer_name: "Anaya Patel",
    customer_email: "anaya@kj.edu.in",
    customer_phone: "9876543212",
    items: [
      { id: "3", name: "Pakora", price: 20, quantity: 1 },
      { id: "6", name: "Chai Latte", price: 25, quantity: 1 },
    ],
    total_amount: 45,
    status: "pending",
    order_type: "dine-in",
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
];

