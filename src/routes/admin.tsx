import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Bholenath Chai" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

// Demo orders data (will be replaced with real DB when Cloud is enabled)
const demoOrders = [
  { id: "ORD-001", customer: "Rahul S.", items: ["Masala Chai x2", "Samosa x3"], total: 110, status: "completed" as const, time: "10:32 AM" },
  { id: "ORD-002", customer: "Priya P.", items: ["Kulhad Chai x1", "Bread Pakora x2"], total: 90, status: "completed" as const, time: "10:45 AM" },
  { id: "ORD-003", customer: "Amit V.", items: ["Cold Coffee x2"], total: 120, status: "preparing" as const, time: "11:02 AM" },
  { id: "ORD-004", customer: "Sneha K.", items: ["Masala Chai x4", "Vada Pav x4"], total: 220, status: "preparing" as const, time: "11:15 AM" },
  { id: "ORD-005", customer: "Rohan M.", items: ["Cutting Chai x6"], total: 90, status: "pending" as const, time: "11:20 AM" },
  { id: "ORD-006", customer: "Anjali D.", items: ["Kulhad Chai x1", "Samosa x1"], total: 55, status: "pending" as const, time: "11:28 AM" },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

function AdminDashboard() {
  const [orders, setOrders] = useState(demoOrders);
  const [filter, setFilter] = useState<"all" | "pending" | "preparing" | "completed">("all");

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const todayTotal = orders.reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  const updateStatus = (id: string, status: "pending" | "preparing" | "completed") => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Today's orders at Bholenath Chai — KJ College Campus
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: "Today's Revenue", value: `₹${todayTotal}`, icon: "💰", color: "bg-saffron/10 border-saffron/20" },
            { label: "Pending", value: pendingCount, icon: "⏳", color: "bg-yellow-50 border-yellow-200" },
            { label: "Preparing", value: preparingCount, icon: "🔥", color: "bg-blue-50 border-blue-200" },
            { label: "Completed", value: completedCount, icon: "✅", color: "bg-green-50 border-green-200" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-5 ${stat.color}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "pending", "preparing", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-gradient-saffron text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {f} {f === "all" ? `(${orders.length})` : `(${orders.filter((o) => o.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {filtered.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-heading font-bold text-foreground">{order.id}</span>
                    <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{order.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Customer: {order.customer}</p>
                  <p className="mt-1 text-sm text-foreground">{order.items.join(", ")}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className="text-lg font-bold text-saffron-dark">₹{order.total}</span>
                  <div className="flex gap-1">
                    {order.status === "pending" && (
                      <button
                        onClick={() => updateStatus(order.id, "preparing")}
                        className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === "preparing" && (
                      <button
                        onClick={() => updateStatus(order.id, "completed")}
                        className="rounded-lg bg-green-500 px-3 py-1 text-xs font-semibold text-white hover:bg-green-600"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          This is a demo dashboard. Enable Lovable Cloud to connect a real database for live order management.
        </p>
      </div>
    </div>
  );
}
