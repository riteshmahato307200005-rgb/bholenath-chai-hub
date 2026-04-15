import { motion } from "framer-motion";

const promises = [
  {
    icon: "🫖",
    title: "Always Fresh",
    description: "Every cup brewed fresh on order — no pre-made, no reheating, ever.",
  },
  {
    icon: "🧹",
    title: "Clean & Hygienic",
    description: "We maintain spotless counters and use disposable cups for takeaway.",
  },
  {
    icon: "⏱️",
    title: "Quick Service",
    description: "Your chai ready in under 3 minutes — because lecture breaks are short!",
  },
  {
    icon: "💸",
    title: "Student-Friendly Prices",
    description: "Premium taste without burning a hole in your pocket. Prices start at ₹10.",
  },
  {
    icon: "🌿",
    title: "No Artificial Flavors",
    description: "Real elaichi, adrak, tulsi — all spices are natural and freshly ground.",
  },
  {
    icon: "😊",
    title: "Served with a Smile",
    description: "Good vibes only. We treat every customer like family at our stall.",
  },
];

export function OurPromises() {
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
            Our Promise
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            What We <span className="text-gradient-saffron">Promise You</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Every cup comes with these guarantees — no exceptions.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {promises.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex gap-4 rounded-2xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
