import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rahul Sharma",
    text: "Best chai in the city! The kulhad chai takes me back to my nani's kitchen. Truly divine. ☕",
    rating: 5,
  },
  {
    name: "Priya Patel",
    text: "The samosas here are unmatched. Crispy, spicy, and served with the best chutney ever!",
    rating: 5,
  },
  {
    name: "Amit Verma",
    text: "I come here every morning. The masala chai gives me the perfect start to my day. Har Har Mahadev! 🙏",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="bg-cream-section py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron-dark">
            Testimonials
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            What Our <span className="text-gradient-saffron">Customers Say</span>
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="rounded-2xl bg-card p-6 shadow-md"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-saffron">★</span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground italic">
                "{t.text}"
              </p>
              <p className="mt-4 font-heading text-sm font-semibold text-foreground">
                — {t.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
