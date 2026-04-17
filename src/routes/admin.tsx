import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteOrder,
  fetchOrdersRealTime,
  updateOrderStatus,
  type Order,
} from "@/lib/database";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard - Bholenath Chai" },
      { name: "description", content: "Admin dashboard for order management" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousOrderIdsRef = useRef<Set<string>>(new Set());
  const hasLoadedInitialOrdersRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const ADMIN_PASSWORD = "chai123";

  const playNotificationSound = async () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      const startTime = context.currentTime;

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, startTime);
      oscillator.frequency.exponentialRampToValueAtTime(660, startTime + 0.18);

      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.18, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.22);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.22);
    } catch (soundError) {
      console.error("Notification sound failed:", soundError);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    setIsLoading(true);
    let unsubscribe: (() => void) | undefined;

    const setupRealTime = async () => {
      try {
        unsubscribe = await fetchOrdersRealTime((data) => {
          const nextOrderIds = new Set(
            data.map((order) => order.id).filter(Boolean) as string[]
          );

          if (hasLoadedInitialOrdersRef.current) {
            const newOrders = data.filter(
              (order) => order.id && !previousOrderIdsRef.current.has(order.id)
            );

            if (newOrders.length > 0) {
              const latestOrder = newOrders.sort(
                (a, b) =>
                  new Date(b.created_at || 0).getTime() -
                  new Date(a.created_at || 0).getTime()
              )[0];

              void playNotificationSound();
              toast.success("New order received", {
                description: `${latestOrder.customer_name} placed an order for Rs. ${latestOrder.total_amount}.`,
              });
            }
          } else {
            hasLoadedInitialOrdersRef.current = true;
          }

          previousOrderIdsRef.current = nextOrderIds;
          setOrders(data);
          setError(null);
          setIsLoading(false);
        });
      } catch (err) {
        setError("Failed to connect to database");
        setIsLoading(false);
        console.error("Real-time setup error:", err);
      }
    };

    void setupRealTime();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setAdminPassword("");
      setError(null);
      return;
    }

    setError("Incorrect password");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminPassword("");
    setOrders([]);
    setError(null);
    previousOrderIdsRef.current = new Set();
    hasLoadedInitialOrdersRef.current = false;
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      setError("Failed to update order status");
      console.error("Status update error:", err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      await deleteOrder(orderId);
    } catch (err) {
      setError("Failed to delete order");
      console.error("Delete error:", err);
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      if (filter !== "all" && order.status !== filter) return false;
      if (
        searchTerm &&
        !order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    );

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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chai-brown to-saffron flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-chai-brown">
              Admin Portal
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Bholenath Chai & Snacks
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Admin Password
              </label>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Demo: chai123
              </p>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-gradient-saffron text-white font-semibold"
            >
              Login
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-section to-background pt-24 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Order Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              {isLoading ? "Loading..." : `Total Orders: ${orders.length}`}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </motion.div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          {[
            {
              label: "Pending",
              count: orders.filter((o) => o.status === "pending").length,
              color: "bg-yellow-100",
            },
            {
              label: "Preparing",
              count: orders.filter((o) => o.status === "preparing").length,
              color: "bg-blue-100",
            },
            {
              label: "Ready",
              count: orders.filter((o) => o.status === "ready").length,
              color: "bg-green-100",
            },
            {
              label: "Completed",
              count: orders.filter((o) => o.status === "completed").length,
              color: "bg-emerald-100",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${stat.color} rounded-lg p-4`}
            >
              <p className="text-sm font-medium text-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-chai-brown mt-1">
                {stat.count}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Filter by Status
              </label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Search Customer
              </label>
              <Input
                placeholder="Name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto"
        >
          {filteredOrders.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-mono font-semibold">
                        {order.id?.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium text-foreground">
                            {order.customer_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.customer_email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {order.items.map((item) => (
                          <div key={item.id} className="text-xs">
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        Rs. {order.total_amount}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Select
                          value={order.status || "pending"}
                          onValueChange={(value) =>
                            handleStatusChange(order.id || "", value)
                          }
                        >
                          <SelectTrigger
                            className={`w-32 ${getStatusColor(order.status)}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">
                          {order.order_type || "dine-in"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleTimeString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteOrder(order.id || "")}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
