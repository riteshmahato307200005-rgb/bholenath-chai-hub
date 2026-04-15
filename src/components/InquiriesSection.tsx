import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  fetchInquiriesRealTime,
  updateInquiryStatus,
  deleteInquiry,
  type Inquiry,
} from "@/lib/database";

export function InquiriesSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Same owner credentials as AdminSection
  const OWNER_USERNAME = "owner";
  const OWNER_PASSWORD = "bholenath123";

  useEffect(() => {
    if (!isLoggedIn) return;

    setIsLoading(true);
    let unsubscribe: (() => void) | undefined;

    const setupRealTime = async () => {
      try {
        unsubscribe = await fetchInquiriesRealTime((data) => {
          setInquiries(data);
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
    setInquiries([]);
    setError(null);
  };

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    try {
      await updateInquiryStatus(inquiryId, newStatus);
    } catch (err) {
      setError("Failed to update inquiry status");
      console.error("Status update error:", err);
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      await deleteInquiry(inquiryId);
    } catch (err) {
      setError("Failed to delete inquiry");
      console.error("Delete error:", err);
    }
  };

  const filteredInquiries = inquiries
    .filter((inquiry) => {
      if (filter !== "all" && inquiry.status !== filter) return false;
      if (
        searchTerm &&
        !inquiry.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !inquiry.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
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
      case "new":
        return "bg-red-100 text-red-800";
      case "replied":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Inquiries Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-24 right-6 z-40 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        title="Inquiries Management"
      >
        <span className="text-2xl">📧</span>
      </motion.button>

      {/* Inquiries Panel */}
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
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400 p-4">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
                  >
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-heading font-bold text-blue-600">
                        📧 Inquiries
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
                        className="w-full bg-blue-500 text-white font-semibold hover:bg-blue-600"
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
                        📧 Inquiries Management
                      </h1>
                      <p className="text-muted-foreground mt-1">
                        {isLoading ? "Loading..." : `Total: ${inquiries.length}`}
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
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 mb-8">
                    {[
                      {
                        label: "🆕 New",
                        value: inquiries.filter((i) => i.status === "new").length,
                        color: "bg-red-100",
                      },
                      {
                        label: "💬 Replied",
                        value: inquiries.filter((i) => i.status === "replied").length,
                        color: "bg-blue-100",
                      },
                      {
                        label: "✅ Resolved",
                        value: inquiries.filter((i) => i.status === "resolved").length,
                        color: "bg-green-100",
                      },
                    ].map((stat) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${stat.color} rounded-lg p-4 text-center`}
                      >
                        <p className="text-lg font-bold text-foreground">
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
                    className="bg-blue-50 rounded-lg p-4 mb-6"
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
                            <SelectItem value="all">All Inquiries</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="replied">Replied</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Search
                        </label>
                        <Input
                          type="text"
                          placeholder="Search by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Inquiries List */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {filteredInquiries.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-lg">No inquiries found</p>
                      </div>
                    ) : (
                      filteredInquiries.map((inquiry, index) => (
                        <motion.div
                          key={inquiry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">
                                {inquiry.customer_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {inquiry.customer_email}
                              </p>
                              {inquiry.customer_phone && (
                                <p className="text-sm text-muted-foreground">
                                  📱 {inquiry.customer_phone}
                                </p>
                              )}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                inquiry.status
                              )}`}
                            >
                              {inquiry.status?.toUpperCase()}
                            </span>
                          </div>

                          <div className="mb-3 bg-gray-50 p-3 rounded">
                            <p className="text-sm font-medium text-foreground mb-1">
                              Subject: {inquiry.subject}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {inquiry.message}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            {inquiry.created_at && (
                              <span>
                                📅 {new Date(inquiry.created_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Select
                              value={inquiry.status || "new"}
                              onValueChange={(value) =>
                                handleStatusChange(inquiry.id || "", value)
                              }
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="replied">Replied</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={() => handleDeleteInquiry(inquiry.id || "")}
                              variant="destructive"
                              size="sm"
                            >
                              Delete
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
