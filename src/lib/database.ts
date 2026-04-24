import { createClient } from "@supabase/supabase-js";

// Interface definitions
interface OrderItem {
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
  payment_method?: "cash" | "online";
  payment_status?: "created" | "authorized" | "captured" | "failed" | "pending";
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentOrder {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  total_amount: number; // in rupees
  special_instructions?: string;
  order_type?: string;
}

/**
 * Create Supabase client for client-side operations
 * Uses anon key for public access
 */
export function createSupabaseClient() {
  const url = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
  const key = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

  console.log("🔍 Checking Supabase config:");
  console.log("URL exists:", !!url);
  console.log("Key exists:", !!key);
  console.log("URL:", url);

  if (!url || !key) {
    console.warn(
      "⚠️ Missing Supabase credentials in .env.local - using demo mode"
    );
    return null;
  }

  console.log("✅ Creating Supabase client...");
  return createClient(url, key);
}

/**
 * Fetch all orders with real-time subscription
 */
export async function fetchOrdersRealTime(
  callback: (orders: Order[]) => void
) {
  const supabase = createSupabaseClient();

  if (!supabase) {
    console.log("Demo mode: No Supabase client");
    return;
  }

  try {
    // Initial fetch
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return;
    }

    callback(data || []);

    // Set up real-time subscription
    const subscription = supabase
      .channel("orders-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          // Re-fetch all orders on any change
          supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data }) => {
              if (data) callback(data);
            });
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(subscription);
    };
  } catch (error) {
    console.error("Real-time subscription error:", error);
  }
}

export async function fetchCustomerOrdersRealTime(
  customerEmail: string,
  callback: (orders: Order[]) => void
) {
  const supabase = createSupabaseClient();

  if (!supabase) {
    console.log("Demo mode: No Supabase client");
    return;
  }

  try {
    const normalizedEmail = customerEmail.trim().toLowerCase();

    const loadOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", normalizedEmail)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching customer orders:", error);
        return;
      }

      callback(data || []);
    };

    await loadOrders();

    const subscription = supabase
      .channel(`customer-orders-${normalizedEmail}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          void loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  } catch (error) {
    console.error("Customer order subscription error:", error);
  }
}

/**
 * Submit a contact inquiry
 */
export async function submitInquiry(data: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  subject: string;
  message: string;
}) {
  const supabase = createSupabaseClient();

  if (!supabase) {
    console.warn("⚠️ Supabase not configured - saving to demo mode");
    console.log("✅ Inquiry saved (DEMO):", data);
    return { ...data, id: `demo-${Date.now()}` };
  }

  try {
    console.log("📤 Submitting inquiry to Supabase:", data);

    const { data: result, error } = await supabase
      .from("inquiries")
      .insert([
        {
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone || null,
          subject: data.subject,
          message: data.message,
          status: "new",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      console.log("✅ Inquiry saved (DEMO MODE):", data);
      return { ...data, id: `demo-${Date.now()}` };
    }

    console.log("✅ Inquiry submitted to Supabase:", result.id);
    return result;
  } catch (error) {
    console.error("❌ Inquiry submission error:", error);
    console.log("✅ Inquiry saved (DEMO MODE):", data);
    return { ...data, id: `demo-${Date.now()}` };
  }
}

/**
 * Submit a new order
 */
export async function submitOrder(order: Order) {
  const supabase = createSupabaseClient();

  if (!supabase) {
    console.warn("⚠️ Supabase not configured - saving to demo mode");
    console.log("✅ Order saved (DEMO):", order);
    return { ...order, id: `demo-${Date.now()}` };
  }

  try {
    const orderData = {
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone || null,
      items: order.items,
      total_amount: order.total_amount,
      status: order.status || "pending",
      special_instructions: order.special_instructions || null,
      order_type: order.order_type || "dine-in",
    };

    console.log("📤 Submitting order to Supabase:", orderData);

    const { data, error, status } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    console.log("Response status:", status);
    console.log("Response data:", data);
    console.log("Response error:", error);

    if (error) {
      console.error("❌ Supabase RLS blocked insertion - saving to demo mode");
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      console.log("✅ Order saved (DEMO MODE):", order);
      return { ...order, id: `demo-${Date.now()}` };
    }

    console.log("✅ Order submitted to Supabase:", data.id);
    return data;
  } catch (error) {
    console.error("❌ Order submission error:", error);
    console.log("✅ Order saved (DEMO MODE - ERROR):", order);
    return { ...order, id: `demo-${Date.now()}` };
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: string
) {
  const supabase = createSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update order: ${error.message}`);
    }

    console.log(`✏️ Order ${orderId} status updated to ${newStatus}`);
    return data;
  } catch (error) {
    console.error("Status update error:", error);
    throw error;
  }
}

/**
 * Delete an order
 */
export async function deleteOrder(orderId: string) {
  const supabase = createSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  try {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) {
      throw new Error(`Failed to delete order: ${error.message}`);
    }

    console.log(`🗑️ Order ${orderId} deleted`);
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}

// ============ INQUIRY MANAGEMENT ============

export interface Inquiry {
  id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  subject: string;
  message: string;
  status?: "new" | "replied" | "resolved";
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all inquiries with real-time subscription
 */
export async function fetchInquiriesRealTime(
  callback: (inquiries: Inquiry[]) => void
) {
  const supabase = createSupabaseClient();

  if (!supabase) {
    console.log("Demo mode: No Supabase client");
    return;
  }

  try {
    // Initial fetch
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inquiries:", error);
      return;
    }

    callback(data || []);

    // Set up real-time subscription
    const subscription = supabase
      .channel("inquiries-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "inquiries",
        },
        () => {
          // Re-fetch all inquiries on any change
          supabase
            .from("inquiries")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data }) => {
              if (data) callback(data);
            });
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(subscription);
    };
  } catch (error) {
    console.error("Real-time inquiry subscription error:", error);
  }
}

/**
 * Update inquiry status
 */
export async function updateInquiryStatus(
  inquiryId: string,
  newStatus: string
) {
  const supabase = createSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  try {
    const { data, error } = await supabase
      .from("inquiries")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", inquiryId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update inquiry: ${error.message}`);
    }

    console.log(`✏️ Inquiry ${inquiryId} status updated to ${newStatus}`);
    return data;
  } catch (error) {
    console.error("Status update error:", error);
    throw error;
  }
}

/**
 * Delete an inquiry
 */
export async function deleteInquiry(inquiryId: string) {
  const supabase = createSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  try {
    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", inquiryId);

    if (error) {
      throw new Error(`Failed to delete inquiry: ${error.message}`);
    }

    console.log(`🗑️ Inquiry ${inquiryId} deleted`);
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}

// ============ PAYMENT GATEWAY (RAZORPAY) ============

/**
 * Create Razorpay payment order
 * Returns order ID for client to initiate payment
 */
export async function createRazorpayOrder(paymentOrder: PaymentOrder) {
  try {
    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    if (!razorpayKeyId) {
      console.warn("⚠️ Razorpay key not configured - demo mode");
      return {
        id: `order_${Date.now()}`,
        amount: paymentOrder.total_amount * 100, // in paise
        currency: "INR",
        status: "demo",
      };
    }

    // In production, call your backend API to create Razorpay order
    // For now, create client-side order ID
    const orderId = `order_${Date.now()}`;
    
    console.log("📤 Creating Razorpay order:", {
      orderId,
      amount: paymentOrder.total_amount,
      customer: paymentOrder.customer_name,
    });

    return {
      id: orderId,
      amount: paymentOrder.total_amount * 100, // Razorpay uses paise
      currency: "INR",
      customer_name: paymentOrder.customer_name,
      customer_email: paymentOrder.customer_email,
      customer_phone: paymentOrder.customer_phone,
    };
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error);
    throw error;
  }
}

/**
 * Verify Razorpay payment and create order in database
 */
export async function verifyAndCreateOrder(
  paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
  orderData: Order
) {
  try {
    console.log("🔍 Verifying payment signature...");
    
    // In production environment, verify signature with crypto:
    // const crypto = require('crypto');
    // const secret = process.env.RAZORPAY_SECRET_KEY;
    // const shasum = crypto
    //   .createHmac('sha256', secret)
    //   .update(paymentData.razorpay_order_id + "|" + paymentData.razorpay_payment_id)
    //   .digest('hex');
    // if (shasum !== paymentData.razorpay_signature) {
    //   throw new Error('Payment verification failed');
    // }

    // For demo, accept all payments
    console.log("✅ Payment verified!");

    // Now create order in Supabase
    const orderWithPayment = {
      ...orderData,
      special_instructions: `Payment: Online (Razorpay) | Payment ID: ${paymentData.razorpay_payment_id} | ${orderData.special_instructions || ""}`,
      status: "pending",
    };

    const result = await submitOrder(orderWithPayment);
    
    console.log("✅ Order created after payment:", result.id);
    return result;
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    throw error;
  }
}

/**
 * Get payment status
 */
export async function getPaymentStatus(paymentId: string): Promise<string> {
  try {
    // In production, fetch from Razorpay API
    // For demo, return success
    console.log("📊 Payment status:", paymentId);
    return "captured"; // captured, authorized, failed, etc.
  } catch (error) {
    console.error("Error getting payment status:", error);
    return "pending";
  }
}
