import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { menuItems, categories } from "@/lib/menu-data";
import { addToCart, useCart } from "@/lib/cart-store";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Bholenath Chai & Snacks Center" },
      { name: "description", content: "Explore our full menu of authentic chai, snacks, and beverages. From masala chai to samosas — order your favorites now." },
      { property: "og:title", content: "Menu — Bholenath Chai & Snacks" },
      { property: "og:description", content: "Authentic chai, snacks & beverages — explore our full menu." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const navigate = useNavigate();
  const { count, total } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("tea");
  const filtered = menuItems.filter((i) => i.category === activeCategory);

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <section className="bg-brown-section py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron-light">
            Explore
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-cream sm:text-5xl">
            Our <span className="text-saffron">Menu</span>
          </h1>
        </motion.div>
      </section>

      {/* Categories */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur-sm md:top-20">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap rounded-full px-6 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-gradient-saffron text-primary-foreground shadow-chai"
                  : "bg-secondary text-secondary-foreground hover:bg-saffron/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-2xl bg-card shadow-md transition-shadow hover:shadow-card-hover"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    width={512}
                    height={512}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-saffron-dark">
                      ₹{item.price}
                    </span>
                    <button
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                        })
                      }
                      className="rounded-full bg-gradient-saffron px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Cart Summary */}
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-sm md:bottom-8 md:right-8 md:w-80 md:rounded-lg md:border md:shadow-lg"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-saffron" />
                <span className="font-semibold text-foreground">{count} items</span>
              </div>
              <span className="text-xl font-bold text-saffron">₹{total}</span>
            </div>
            <Button
              onClick={() => navigate({ to: "/checkout" })}
              className="w-full bg-gradient-saffron text-white"
            >
              Proceed to Checkout →
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
