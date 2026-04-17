import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchOrdersRealTime,
  updateOrderStatus,
  deleteOrder,
  type Order,
} from "@/lib/database";

export function AdminSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousOrderIdsRef = useRef<Set<string>>(new Set());
  const hasLoadedInitialOrdersRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Default owner credentials (update these with your owner details)
  const OWNER_USERNAME = "owner";
  const OWNER_PASSWORD = "bholenath123";

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
          const nextOrderIds = new Set(data.map((order) => order.id));

          if (hasLoadedInitialOrdersRef.current) {
            const newOrders = data.filter(
              (order) => !previousOrderIdsRef.current.has(order.id)
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

    setupRealTime();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === OWNER_USERNAME && adminPassword === OWNER_PASSWORD) {
      setIsLoggedIn(true);
      setAdminUsername("");
      setAdminPassword("");
      setError(null);
    } else {
      setError("❌ Invalid username or password");
      setAdminPassword("");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminUsername("");
    setAdminPassword("");
    setOrders([]);
    setError(null);
    previousOrderIdsRef.current = new Set();
    hasLoadedInitialOrdersRef.current = false;
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

  return (
    <>
      {/* Admin Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 z-40 bg-gradient-saffron text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        title="Admin Dashboard"
      >
        <span className="text-2xl">🔐</span>
      </motion.button>

      {/* Admin Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-4xl z-50 bg-white overflow-y-auto"
            >
              {!isLoggedIn ? (
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-chai-brown to-saffron p-4">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
                  >
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-heading font-bold text-chai-brown">
                        ☕ Admin Portal
                      </h1>
                      <p className="text-sm text-muted-foreground mt-2">
                        Owner Login
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Username
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter username"
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          className="w-full"
                          autoFocus
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Password
                        </label>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full"
                        />
                      </div>

                      {error && (
                        <p className="text-sm text-red-600">{error}</p>
                      )}
                      <Button
                        type="submit"
                        className="w-full bg-gradient-saffron text-white font-semibold"
                      >
                        Login
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        variant="outline"
                        className="w-full"
                      >
                        Close
                      </Button>
                    </form>
                  </motion.div>
                </div>
              ) : (
                <div className="p-8">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-8"
                  >
                    <div>
                      <h1 className="text-3xl font-heading font-bold text-foreground">
                        📊 Dashboard
                      </h1>
                      <p className="text-muted-foreground mt-1">
                        {isLoading ? "Loading..." : `Orders: ${orders.length}`}
                      </p>
                    </div>
                    <Button onClick={handleLogout} variant="outline">
                      Logout
                    </Button>
                  </motion.div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      ⚠️ {error}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 mb-8">
                    {[
                      {
                        label: "💰 Revenue",
                        value: `₹${totalRevenue}`,
                        color: "bg-purple-100",
                      },
                      {
                        label: "⏳ Pending",
                        value: orders.filter((o) => o.status === "pending").length,
                        color: "bg-yellow-100",
                      },
                      {
                        label: "🔥 Preparing",
                        value: orders.filter((o) => o.status === "preparing").length,
                        color: "bg-blue-100",
                      },
                      {
                        label: "✅ Ready",
                        value: orders.filter((o) => o.status === "ready").length,
                        color: "bg-green-100",
                      },
                    ].map((stat) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${stat.color} rounded-lg p-4 text-center`}
                      >
                        <p className="text-lg font-bold text-chai-brown">
                          {stat.value}
                        </p>
                        <p className="text-xs font-medium text-foreground mt-1">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Filters */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-cream-section rounded-lg p-4 mb-6"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Status Filter
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
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Search
                        </label>
                        <Input
                          placeholder="Customer name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Orders Table */}
                  {orders.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <p className="text-muted-foreground text-lg">
                        {isLoading
                          ? "Loading orders..."
                          : "No orders yet. Orders will appear here when customers place them."}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-lg shadow overflow-hidden"
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">ID</th>
                              <th className="px-4 py-3 text-left font-semibold">Customer</th>
                              <th className="px-4 py-3 text-left font-semibold">Items</th>
                              <th className="px-4 py-3 text-left font-semibold">Total</th>
                              <th className="px-4 py-3 text-left font-semibold">Status</th>
                              <th className="px-4 py-3 text-center font-semibold">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOrders.map((order) => (
                              <motion.tr
                                key={order.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="px-4 py-3 font-mono text-xs">
                                  {order.id?.slice(0, 8)}
                                </td>
                                <td className="px-4 py-3">
                                  <p className="font-medium">{order.customer_name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {order.customer_email}
                                  </p>
                                </td>
                                <td className="px-4 py-3 text-xs">
                                  {order.items.map((item) => (
                                    <div key={item.id}>
                                      {item.name} x{item.quantity}
                                    </div>
                                  ))}
                                </td>
                                <td className="px-4 py-3 font-bold text-saffron">
                                  ₹{order.total_amount}
                                </td>
                                <td className="px-4 py-3">
                                  <Select
                                    value={order.status || "pending"}
                                    onValueChange={(value) =>
                                      handleStatusChange(order.id || "", value)
                                    }
                                  >
                                    <SelectTrigger
                                      className={`w-24 text-xs ${getStatusColor(
                                        order.status
                                      )}`}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="preparing">Preparing</SelectItem>
                                      <SelectItem value="ready">Ready</SelectItem>
                                      <SelectItem value="completed">Done</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      handleDeleteOrder(order.id || "")
                                    }
                                    className="text-red-600"
                                  >
                                    🗑️
                                  </Button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
