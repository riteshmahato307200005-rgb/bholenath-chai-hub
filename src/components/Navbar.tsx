import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCartCount } from "@/lib/cart-store";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Poll cart count (simple approach)
  useEffect(() => {
    const interval = setInterval(() => setCartCount(getCartCount()), 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-accent/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold font-heading md:text-2xl">
              <span className={scrolled ? "text-saffron" : "text-saffron"}>Bholenath</span>
              <span className={scrolled ? "text-accent-foreground" : "text-cream"}> Chai</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {[
              { to: "/", label: "Home" },
              { to: "/menu", label: "Menu" },
              { to: "/cart", label: "Cart" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-saffron ${
                  scrolled ? "text-accent-foreground" : "text-cream"
                }`}
                activeProps={{ className: "!text-saffron" }}
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
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex flex-col gap-1.5 md:hidden ${scrolled ? "text-accent-foreground" : "text-cream"}`}
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
              {[
                { to: "/" as const, label: "Home" },
                { to: "/menu" as const, label: "Menu" },
                { to: "/cart" as const, label: "Cart" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-accent-foreground transition-colors hover:text-saffron"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
