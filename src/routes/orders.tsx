import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchCustomerOrdersRealTime, type Order } from "@/lib/database";
import { menuItems } from "@/lib/menu-data";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders - Bholenath Chai" },
      { name: "description", content: "Track your recent chai and snacks orders." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userEmail = user?.email ?? null;
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    setIsLoading(true);
    let unsubscribe: (() => void) | undefined;

    const setup = async () => {
      unsubscribe = await fetchCustomerOrdersRealTime(userEmail, (nextOrders) => {
        setOrders(nextOrders);
        setIsLoading(false);
      });
    };

    void setup();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userEmail]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const orderStages = ["pending", "preparing", "ready", "completed"] as const;
  const menuItemById = new Map(menuItems.map((item) => [item.id, item]));

  const getStageIndex = (status?: string) => {
    const stageIndex = orderStages.indexOf(
      (status as (typeof orderStages)[number]) || "pending"
    );

    return stageIndex === -1 ? 0 : stageIndex;
  };

  const getItemImage = (item: Order["items"][number]) => {
    if (item.image) return item.image;
    return menuItemById.get(item.id)?.image;
  };

  if (!isAuthLoading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-cream to-white px-4 pb-20 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-saffron-dark">
            Account Needed
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold text-chai-brown">
            Login to see your orders
          </h1>
          <p className="mt-3 text-muted-foreground">
            Your recent orders are shown based on the email linked to your account.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/auth"
              className="rounded-full bg-gradient-saffron px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Login or Sign Up
            </Link>
            <Link
              to="/menu"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground"
            >
              Browse Menu
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-section to-background px-4 pb-16 pt-24">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-saffron-dark">
            My Orders
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-chai-brown">
            Track your recent chai runs
          </h1>
          <p className="mt-2 text-muted-foreground">
            Live updates appear here whenever your order status changes, so users can follow the flow more clearly.
          </p>
        </motion.div>

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <div className="rounded-2xl border bg-white p-6 text-muted-foreground shadow-sm">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-chai-brown">No orders yet</h2>
              <p className="mt-2 text-muted-foreground">
                Place your first order and it will show up here.
              </p>
              <Link
                to="/menu"
                className="mt-6 inline-block rounded-full bg-gradient-saffron px-6 py-3 text-sm font-semibold text-primary-foreground"
              >
                Order Now
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Order #{order.id?.slice(0, 8)}
                    </p>
                    <p className="mt-1 font-heading text-2xl font-bold text-chai-brown">
                      Rs. {order.total_amount}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : "Recently placed"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status || "pending"}
                    </Badge>
                    <Badge variant="outline">{order.order_type || "dine-in"}</Badge>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.id}`}
                      className="flex items-center gap-3 rounded-xl border border-orange-100 bg-secondary/30 px-4 py-3 text-sm"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-orange-100">
                        {getItemImage(item) ? (
                          <img
                            src={getItemImage(item)}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.18em] text-saffron-dark">
                            Chai
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-foreground">{item.name}</div>
                        <div className="text-muted-foreground">
                          Qty {item.quantity} x Rs. {item.price}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-chai-brown">
                          Rs. {item.quantity * item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {order.status !== "cancelled" && (
                  <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-saffron-dark">
                      Order Tracking
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      {orderStages.map((stage, index) => {
                        const activeIndex = getStageIndex(order.status);
                        const isActive = index <= activeIndex;

                        return (
                          <div
                            key={`${order.id}-${stage}`}
                            className={`rounded-xl border px-3 py-3 text-center text-xs font-medium uppercase tracking-[0.16em] ${
                              isActive
                                ? "border-saffron bg-white text-saffron-dark"
                                : "border-orange-100 bg-white/70 text-muted-foreground"
                            }`}
                          >
                            {stage}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {order.special_instructions && (
                  <div className="mt-5 rounded-xl border border-dashed border-orange-200 bg-orange-50/70 px-4 py-3 text-sm text-orange-950">
                    {order.special_instructions}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-8">
          <Button asChild className="bg-gradient-saffron text-white">
            <Link to="/menu">Order Something New</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
