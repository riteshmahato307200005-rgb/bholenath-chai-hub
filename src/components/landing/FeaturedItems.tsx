import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { menuItems } from "@/lib/menu-data";
import { addToCart } from "@/lib/cart-store";

const featured = menuItems.filter((i) =>
  ["masala-chai", "kulhad-chai", "samosa", "cold-coffee"].includes(i.id)
);

export function FeaturedItems() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron-dark">
            Must Try
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Our <span className="text-gradient-saffron">Bestsellers</span>
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
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
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-saffron-dark">₹{item.price}</span>
                  <button
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    }
                    className="rounded-full bg-gradient-saffron px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/menu"
            className="inline-block rounded-full border-2 border-saffron px-8 py-3 font-semibold text-saffron transition-colors hover:bg-saffron hover:text-primary-foreground"
          >
            View Full Menu →
          </Link>
        </div>
      </div>
    </section>
  );
}
