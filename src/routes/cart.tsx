import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart - Bholenath Chai & Snacks Center" },
      { name: "description", content: "Review your cart and checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, total, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="bg-brown-section py-12 text-center">
        <h1 className="font-heading text-4xl font-bold text-cream sm:text-5xl">
          Your <span className="text-saffron">Cart</span>
        </h1>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <span className="text-6xl">Chai</span>
            <h2 className="mt-4 font-heading text-2xl font-bold text-foreground">
              Your cart is empty
            </h2>
            <p className="mt-2 text-muted-foreground">
              Time to add some delicious chai and snacks.
            </p>
            <Link
              to="/menu"
              className="mt-6 inline-block rounded-full bg-gradient-saffron px-8 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Browse Menu
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                    width={64}
                    height={64}
                  />
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-foreground">
                      {item.name}
                    </h3>
                    <p className="text-sm font-medium text-saffron-dark">
                      Rs. {item.price} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-saffron/20"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-saffron/20"
                    >
                      +
                    </button>
                  </div>

                  <p className="w-16 text-right font-bold text-foreground">
                    Rs. {item.price * item.quantity}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Remove item"
                  >
                    x
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-card p-6 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-muted-foreground">
                  Total
                </span>
                <span className="font-heading text-3xl font-bold text-saffron-dark">
                  Rs. {total}
                </span>
              </div>
              <Link
                to="/checkout"
                className="mt-6 block w-full rounded-full bg-gradient-saffron py-4 text-center text-lg font-semibold text-primary-foreground shadow-chai transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Proceed to Checkout
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Cash and Razorpay payments are available at checkout.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
