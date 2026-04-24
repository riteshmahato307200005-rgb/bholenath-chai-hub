import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { getUserDisplayName } from "@/lib/auth";
import { getCartCount } from "@/lib/cart-store";
import logo from "@/assets/logo.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user, signOut, isConfigured } = useAuth();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const useSolidNavbar = scrolled || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCartCount(getCartCount()), 300);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { to: "/" as const, label: "Home" },
    { to: "/menu" as const, label: "Menu" },
    { to: "/contact" as const, label: "Contact" },
    { to: "/cart" as const, label: "Cart" },
  ];
  const accountLinks = user ? [{ to: "/orders" as const, label: "My Orders" }] : [];

  const userName = getUserDisplayName({
    email: user?.email,
    fullName: typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "",
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed.");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        useSolidNavbar
          ? "bg-accent/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Bholenath Chai" className="h-8 w-8 md:h-10 md:w-10" width={40} height={40} />
            <span className="text-xl font-bold font-heading md:text-2xl">
              <span className="text-saffron">Bholenath</span>
              <span className={useSolidNavbar ? "text-accent-foreground" : "text-cream"}> Chai</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {[...navLinks, ...accountLinks].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-all hover:text-saffron ${
                  useSolidNavbar
                    ? "text-accent-foreground/85 hover:bg-white/55"
                    : "text-cream/90 hover:bg-white/8"
                }`}
                activeProps={{
                  className: useSolidNavbar
                    ? "!bg-white !text-saffron shadow-sm"
                    : "!bg-white/14 !text-saffron-light backdrop-blur-sm",
                }}
              >
                {link.label}
                {link.label === "Cart" && cartCount > 0 && (
                  <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-saffron text-xs font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Link>
            ))}
            <Link
              to="/menu"
              className="rounded-full bg-gradient-saffron px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Order Now
            </Link>
            {isConfigured && user ? (
              <div className="flex items-center gap-3">
                <div className={`text-sm font-medium ${useSolidNavbar ? "text-accent-foreground" : "text-cream"}`}>
                  Hi, {userName}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSignOut}
                  className={`rounded-full px-4 py-2 text-sm ${
                    useSolidNavbar
                      ? "border-border bg-white/70 text-accent-foreground hover:bg-white"
                      : "border-white/30 bg-white/10 text-cream"
                  }`}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link
                to="/auth"
                className={`rounded-full px-3 py-2 text-sm font-semibold transition-all hover:text-saffron ${
                  useSolidNavbar
                    ? "text-accent-foreground/85 hover:bg-white/55"
                    : "text-cream/90 hover:bg-white/8"
                }`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex flex-col gap-1.5 md:hidden ${useSolidNavbar ? "text-accent-foreground" : "text-cream"}`}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-current"
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-6 bg-current"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-current"
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-accent/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-6">
              {[...navLinks, ...accountLinks].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="rounded-full px-5 py-3 text-lg font-medium text-accent-foreground transition-colors hover:bg-white/70 hover:text-saffron"
                  activeProps={{ className: "!bg-white !text-saffron" }}
                >
                  {link.label}
                  {link.label === "Cart" && cartCount > 0 && ` (${cartCount})`}
                </Link>
              ))}
              <Link
                to="/menu"
                onClick={() => setIsOpen(false)}
                className="mt-2 rounded-full bg-gradient-saffron px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                Order Now
              </Link>
              {isConfigured && user ? (
                <>
                  <div className="text-sm font-medium text-accent-foreground">
                    Logged in as {userName}
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-full border border-border px-5 py-3 text-left text-sm font-semibold text-accent-foreground"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-border px-5 py-3 text-center text-sm font-semibold text-accent-foreground"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
