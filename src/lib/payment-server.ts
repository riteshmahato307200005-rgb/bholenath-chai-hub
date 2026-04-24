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
  orderType?: "dine-in" | "takeaway" | "delivery";
  specialInstructions?: string;
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

type PlaceCashOrderInput = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  total_amount: number;
  order_type?: "dine-in" | "takeaway" | "delivery";
  special_instructions?: string;
};

type PaymentStatus =
  | "created"
  | "authorized"
  | "captured"
  | "failed"
  | "pending";

type StoredOrderPayload = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  total_amount: number;
  order_type?: "dine-in" | "takeaway" | "delivery";
  special_instructions?: string;
  payment_method: "cash" | "online";
  payment_status: PaymentStatus;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
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

function getRazorpayWebhookSecret() {
  return getEnvValue("RAZORPAY_WEBHOOK_SECRET");
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

function isValidOrderPayload(order: PlaceCashOrderInput | VerifyPaymentInput["order"]) {
  return (
    !!order?.customer_name &&
    !!order.customer_email &&
    !!order.customer_phone &&
    isValidAmount(order.total_amount) &&
    isValidItems(order.items)
  );
}

function buildOrderInsert(payload: StoredOrderPayload) {
  return {
    customer_name: payload.customer_name,
    customer_email: payload.customer_email.trim().toLowerCase(),
    customer_phone: payload.customer_phone,
    items: payload.items,
    total_amount: payload.total_amount,
    status: "pending",
    order_type: payload.order_type || "dine-in",
    special_instructions: payload.special_instructions || null,
    payment_method: payload.payment_method,
    payment_status: payload.payment_status,
    razorpay_order_id: payload.razorpay_order_id || null,
    razorpay_payment_id: payload.razorpay_payment_id || null,
  };
}

async function insertOrderRecord(
  supabase: ReturnType<typeof getSupabaseAdminClient>,
  payload: StoredOrderPayload
) {
  if (!supabase) {
    throw new Error("Supabase admin client is unavailable.");
  }

  const nextInsert = buildOrderInsert(payload);
  const { data: insertedOrder, error } = await supabase
    .from("orders")
    .insert([nextInsert])
    .select("id")
    .single();

  if (!error) {
    return insertedOrder;
  }

  // Backward-compatible fallback for schemas that have not yet been migrated.
  if (
    error.message.includes("payment_method") ||
    error.message.includes("payment_status") ||
    error.message.includes("razorpay_order_id") ||
    error.message.includes("razorpay_payment_id")
  ) {
    console.warn(
      "Orders table is missing payment columns. Falling back to legacy order insert."
    );

    const legacyInstructions = [
      payload.payment_method === "online"
        ? `Payment: Online (${payload.payment_status})`
        : "Payment: Cash on pickup",
      payload.razorpay_payment_id
        ? `Payment ID: ${payload.razorpay_payment_id}`
        : "",
      payload.special_instructions || "",
    ]
      .filter(Boolean)
      .join(" | ");

    const { data: legacyOrder, error: legacyError } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: payload.customer_name,
          customer_email: payload.customer_email.trim().toLowerCase(),
          customer_phone: payload.customer_phone,
          items: payload.items,
          total_amount: payload.total_amount,
          status: "pending",
          order_type: payload.order_type || "dine-in",
          special_instructions: legacyInstructions || null,
        },
      ])
      .select("id")
      .single();

    if (legacyError) {
      throw legacyError;
    }

    return legacyOrder;
  }

  throw error;
}

async function safeInsertOrderRecord(
  supabase: ReturnType<typeof getSupabaseAdminClient>,
  payload: StoredOrderPayload
) {
  try {
    const result = await insertOrderRecord(supabase, payload);
    return { data: result, error: null as Error | null };
  } catch (insertError) {
    return { data: null, error: insertError as Error };
  }
}

async function updateOrderPaymentState(input: {
  supabase: ReturnType<typeof getSupabaseAdminClient>;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  paymentStatus: PaymentStatus;
}) {
  const { supabase, razorpayOrderId, razorpayPaymentId, paymentStatus } = input;

  if (!supabase || (!razorpayOrderId && !razorpayPaymentId)) {
    return;
  }

  const updatePayload = {
    payment_status: paymentStatus,
    razorpay_payment_id: razorpayPaymentId || null,
    updated_at: new Date().toISOString(),
  };

  let query = supabase.from("orders").update(updatePayload);

  if (razorpayOrderId) {
    query = query.eq("razorpay_order_id", razorpayOrderId);
  } else if (razorpayPaymentId) {
    query = query.eq("razorpay_payment_id", razorpayPaymentId);
  }

  const { error } = await query.select("id").maybeSingle();

  if (error) {
    if (
      error.message.includes("payment_status") ||
      error.message.includes("razorpay_order_id") ||
      error.message.includes("razorpay_payment_id")
    ) {
      console.warn(
        "Skipped payment status update because payment columns are missing in orders table."
      );
      return;
    }

    throw error;
  }
}

export async function handleRazorpayWebhook(request: Request) {
  const webhookSecret = getRazorpayWebhookSecret();

  if (!webhookSecret) {
    return new Response(
      JSON.stringify({ success: false, message: "Webhook secret is not configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const signature = request.headers.get("x-razorpay-signature");
  const rawBody = await request.text();

  if (!signature) {
    return new Response(
      JSON.stringify({ success: false, message: "Missing webhook signature." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid webhook signature." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const payload = JSON.parse(rawBody) as {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          status?: string;
        };
      };
    };
  };

  const event = payload.event || "";
  const paymentEntity = payload.payload?.payment?.entity;

  const statusByEvent: Record<string, PaymentStatus> = {
    "payment.authorized": "authorized",
    "payment.captured": "captured",
    "payment.failed": "failed",
  };

  const paymentStatus =
    statusByEvent[event] ||
    (paymentEntity?.status === "captured"
      ? "captured"
      : paymentEntity?.status === "authorized"
        ? "authorized"
        : paymentEntity?.status === "failed"
          ? "failed"
          : "pending");

  const supabase = getSupabaseAdminClient();

  if (supabase && paymentEntity?.order_id) {
    await updateOrderPaymentState({
      supabase,
      razorpayOrderId: paymentEntity.order_id,
      razorpayPaymentId: paymentEntity.id || null,
      paymentStatus,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
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
        order_type: data.orderType || "dine-in",
        special_instructions: data.specialInstructions || "",
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

export const placeCashOrder = createServerFn({ method: "POST" })
  .inputValidator((data: PlaceCashOrderInput) => data)
  .handler(async ({ data }) => {
    if (!isValidOrderPayload(data)) {
      throw new Error("Invalid cash order payload.");
    }

    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      throw new Error(
        "Supabase server credentials are missing. Add VITE_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
      );
    }

    const { data: insertedOrder, error } = await safeInsertOrderRecord(supabase, {
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      items: data.items,
      total_amount: data.total_amount,
      order_type: data.order_type,
      special_instructions: data.special_instructions,
      payment_method: "cash",
      payment_status: "pending",
    });

    if (error || !insertedOrder) {
      console.error("Supabase insert error for cash order:", error);
      throw new Error("Cash order could not be saved to the database.");
    }

    return {
      success: true,
      orderId: insertedOrder.id,
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
      !isValidOrderPayload(order)
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

    const { data: insertedOrder, error } = await safeInsertOrderRecord(supabase, {
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      items: order.items,
      total_amount: order.total_amount,
      order_type: order.order_type,
      special_instructions: order.special_instructions,
      payment_method: "online",
      payment_status: "captured",
      razorpay_order_id: payment.razorpay_order_id,
      razorpay_payment_id: payment.razorpay_payment_id,
    });

    if (error || !insertedOrder) {
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
