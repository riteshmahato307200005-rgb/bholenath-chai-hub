import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clearCart, useCartSnapshot } from "@/lib/cart-store";
import { saveInvoice } from "@/lib/invoice";
import {
  createPaymentOrder,
  placeCashOrder,
  verifyPayment,
} from "@/lib/payment-server";

type PaymentMethod = "cash" | "online";

type PaymentStatus = {
  type: "success" | "error" | null;
  message: string;
};

type RazorpayCreateOrderResponse = {
  success: true;
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
};

type RazorpayVerifyResponse = {
  success: true;
  orderId: string;
};

type RazorpaySuccessPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessPayload) => void | Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const cartItems = useCartSnapshot();
  const { user, isLoading: isAuthLoading } = useAuth();
  const createPaymentOrderFn = useServerFn(createPaymentOrder);
  const placeCashOrderFn = useServerFn(placeCashOrder);
  const verifyPaymentFn = useServerFn(verifyPayment);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    instructions: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<PaymentStatus>({
    type: null,
    message: "",
  });

  useEffect(() => {
    if (!user) return;

    setFormData((current) => ({
      ...current,
      name:
        current.name ||
        (typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : ""),
      email: current.email || user.email || "",
      phone:
        current.phone ||
        (typeof user.user_metadata?.phone === "string"
          ? user.user_metadata.phone
          : ""),
    }));
  }, [user]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const setField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      throw new Error("Please enter your full name.");
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      throw new Error("Please enter a valid email address.");
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      throw new Error("Please enter a valid 10-digit phone number.");
    }
  };

  const buildSpecialInstructions = (paymentLabel: string, extra?: string) => {
    const details = [paymentLabel];

    if (formData.address.trim()) {
      details.push(`Address: ${formData.address.trim()}`);
    }

    if (extra) {
      details.push(extra);
    }

    if (formData.instructions.trim()) {
      details.push(`Notes: ${formData.instructions.trim()}`);
    }

    return details.join(" | ");
  };

  const submitCashOrder = async () => {
    await placeCashOrderFn({
      data: {
        customer_name: formData.name.trim(),
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.replace(/\D/g, ""),
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total_amount: totalAmount,
        order_type: "dine-in",
        special_instructions: buildSpecialInstructions("Payment: Cash on pickup"),
      },
    });

    setSubmitStatus({
      type: "success",
      message: "Order placed successfully. Please pay at the counter.",
    });

    clearCart();
    window.setTimeout(() => {
      navigate({ to: "/" });
    }, 1800);
  };

  const loadRazorpayScript = async () => {
    if (window.Razorpay) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Could not load Razorpay checkout script."));
      document.body.appendChild(script);
    });
  };

  const startOnlinePayment = async () => {
    const createOrderData = (await createPaymentOrderFn({
      data: {
        amount: totalAmount,
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.replace(/\D/g, ""),
        },
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    })) as RazorpayCreateOrderResponse;

    await loadRazorpayScript();

    if (!window.Razorpay) {
      throw new Error("Razorpay checkout is unavailable right now.");
    }

    const razorpay = new window.Razorpay({
      key: createOrderData.keyId,
      amount: createOrderData.amount,
      currency: createOrderData.currency,
      name: "Bholenath Chai Hub",
      description: "Online order payment",
      order_id: createOrderData.orderId,
      prefill: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        contact: formData.phone.replace(/\D/g, ""),
      },
      notes: {
        address: formData.address.trim() || "Pickup at counter",
      },
      theme: {
        color: "#d97706",
      },
      modal: {
        ondismiss: () => {
          setIsLoading(false);
          setSubmitStatus({
            type: "error",
            message: "Payment window was closed before the payment completed.",
          });
        },
      },
      handler: async (paymentResponse) => {
        try {
          const verificationResult = (await verifyPaymentFn({
            data: {
              payment: paymentResponse,
              order: {
                customer_name: formData.name.trim(),
                customer_email: formData.email.trim(),
                customer_phone: formData.phone.replace(/\D/g, ""),
                items: cartItems.map((item) => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                })),
                total_amount: totalAmount,
                order_type: "dine-in",
                special_instructions: buildSpecialInstructions(
                  "Payment: Razorpay",
                  `Payment ID: ${paymentResponse.razorpay_payment_id}`
                ),
              },
            },
          })) as RazorpayVerifyResponse;

          saveInvoice({
            invoiceId: `INV-${Date.now()}`,
            orderId: verificationResult.orderId,
            paymentId: paymentResponse.razorpay_payment_id,
            customerName: formData.name.trim(),
            customerEmail: formData.email.trim(),
            customerPhone: formData.phone.replace(/\D/g, ""),
            address: formData.address.trim(),
            notes: formData.instructions.trim(),
            items: cartItems.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            totalAmount,
            paymentMethod: "Razorpay",
            createdAt: new Date().toISOString(),
          });

          setSubmitStatus({
            type: "success",
            message: "Payment received and invoice generated successfully.",
          });

          clearCart();
          window.setTimeout(() => {
            navigate({ to: "/invoice" });
          }, 1800);
        } catch (error) {
          console.error("Payment verification error:", error);
          setSubmitStatus({
            type: "error",
            message:
              error instanceof Error
                ? error.message
                : "Payment was received but order confirmation failed.",
          });
        } finally {
          setIsLoading(false);
        }
      },
    });

    razorpay.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });
    setIsLoading(true);

    try {
      validateForm();

      if (paymentMethod === "cash") {
        await submitCashOrder();
        return;
      }

      await startOnlinePayment();
    } catch (error) {
      console.error("Checkout error:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong during checkout.",
      });
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-cream to-white px-4 pb-20 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="mb-4 text-2xl font-bold text-chai-brown">
            Your cart is empty.
          </p>
          <Button
            onClick={() => navigate({ to: "/menu" })}
            className="bg-gradient-saffron text-white"
          >
            Browse menu
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!isAuthLoading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-cream to-white px-4 pb-20 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-saffron-dark">
            Login Required
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold text-chai-brown">
            Sign in before checkout
          </h1>
          <p className="mt-3 text-muted-foreground">
            We use login to prefill your details and keep your order history tied to your account.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/auth"
              className="rounded-full bg-gradient-saffron px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Login or Sign Up
            </Link>
            <Link
              to="/cart"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground"
            >
              Back to Cart
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white pb-20 pt-24">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-4xl font-heading font-bold text-chai-brown"
        >
          Checkout
        </motion.h1>

        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2"
          >
            <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Your details
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setField("name", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setField("email", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="10-digit phone number"
                    value={formData.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Pickup Notes / Address</Label>
                  <Input
                    id="address"
                    placeholder="Counter pickup, table no., or delivery note"
                    value={formData.address}
                    onChange={(e) => setField("address", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block text-lg font-semibold">
                    Payment Method *
                  </Label>
                  <div className="space-y-3">
                    <label
                      className="flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all"
                      style={{
                        borderColor:
                          paymentMethod === "cash" ? "#d4af37" : "#e5e7eb",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={() => setPaymentMethod("cash")}
                        className="h-4 w-4"
                        disabled={isLoading}
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-semibold text-foreground">
                          Pay by cash
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Confirm the order now and pay at pickup.
                        </p>
                      </div>
                    </label>

                    <label
                      className="flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all"
                      style={{
                        borderColor:
                          paymentMethod === "online" ? "#d4af37" : "#e5e7eb",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="h-4 w-4"
                        disabled={isLoading}
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-semibold text-foreground">
                          Pay online with Razorpay
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Accept UPI, cards, net banking, and wallets.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any special requests for your order?"
                    value={formData.instructions}
                    onChange={(e) => setField("instructions", e.target.value)}
                    disabled={isLoading}
                    className="min-h-24"
                  />
                </div>
              </div>

              {submitStatus.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 rounded-lg p-4 ${
                    submitStatus.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <p className="font-medium">{submitStatus.message}</p>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full bg-gradient-saffron text-white"
              >
                {isLoading
                  ? "Processing..."
                  : paymentMethod === "online"
                    ? "Pay with Razorpay"
                    : "Place Order"}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24 h-fit rounded-lg bg-white p-6 shadow"
          >
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Order summary
            </h2>

            <div className="mb-6 space-y-3 border-b pb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold text-saffron">
                  Rs. {totalAmount}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-6 w-full"
              onClick={() => navigate({ to: "/menu" })}
            >
              Back to menu
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
