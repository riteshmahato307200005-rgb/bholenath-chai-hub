import crypto from "node:crypto";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CreatePaymentOrderInput = {
  amount: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
};

type VerifyPaymentInput = {
  payment: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
  order: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    items: OrderItem[];
    total_amount: number;
    order_type?: "dine-in" | "takeaway" | "delivery";
    special_instructions?: string;
  };
};

function getEnvValue(name: string) {
  return import.meta.env[name] ?? process.env[name];
}

function getRazorpayClient() {
  const keyId = getEnvValue("VITE_RAZORPAY_KEY_ID");
  const keySecret = getEnvValue("RAZORPAY_KEY_SECRET");

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay is not configured. Add VITE_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
    );
  }

  return {
    keyId,
    keySecret,
    instance: new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    }),
  };
}

function getSupabaseAdminClient() {
  const url = getEnvValue("VITE_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnvValue("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function isValidAmount(amount: unknown) {
  return typeof amount === "number" && Number.isFinite(amount) && amount > 0;
}

function isValidItems(items: unknown): items is OrderItem[] {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number",
    )
  );
}

export const createPaymentOrder = createServerFn({ method: "POST" })
  .inputValidator((data: CreatePaymentOrderInput) => data)
  .handler(async ({ data }) => {
    if (
      !isValidAmount(data.amount) ||
      !data.customer?.name ||
      !data.customer?.email ||
      !data.customer?.phone ||
      !isValidItems(data.items)
    ) {
      throw new Error("Invalid payment order payload.");
    }

    const { keyId, instance } = getRazorpayClient();
    const order = await instance.orders.create({
      amount: Math.round(data.amount * 100),
      currency: "INR",
      receipt: `chai_${Date.now()}`,
      notes: {
        customer_name: data.customer.name,
        customer_email: data.customer.email,
        customer_phone: data.customer.phone,
      },
    });

    return {
      success: true,
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  });

export const verifyPayment = createServerFn({ method: "POST" })
  .inputValidator((data: VerifyPaymentInput) => data)
  .handler(async ({ data }) => {
    const payment = data.payment;
    const order = data.order;

    if (
      !payment?.razorpay_order_id ||
      !payment.razorpay_payment_id ||
      !payment.razorpay_signature ||
      !order?.customer_name ||
      !order.customer_email ||
      !order.customer_phone ||
      !isValidAmount(order.total_amount) ||
      !isValidItems(order.items)
    ) {
      throw new Error("Invalid payment verification payload.");
    }

    const { keySecret } = getRazorpayClient();
    const digest = crypto
      .createHmac("sha256", keySecret)
      .update(
        `${payment.razorpay_order_id}|${payment.razorpay_payment_id}`,
        "utf8",
      )
      .digest("hex");

    if (digest !== payment.razorpay_signature) {
      throw new Error("Payment signature verification failed.");
    }

    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return {
        success: true,
        orderId: `demo-${Date.now()}`,
      };
    }

    const { data: insertedOrder, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          customer_phone: order.customer_phone,
          items: order.items,
          total_amount: order.total_amount,
          status: "pending",
          order_type: order.order_type || "dine-in",
          special_instructions: order.special_instructions || null,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error after payment:", error);
      throw new Error(
        "Payment succeeded, but the order could not be saved to the database.",
      );
    }

    return {
      success: true,
      orderId: insertedOrder.id,
    };
  });
