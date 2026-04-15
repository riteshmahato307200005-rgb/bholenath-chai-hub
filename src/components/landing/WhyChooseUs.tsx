import { motion } from "framer-motion";

const reasons = [
  {
    icon: "🍃",
    title: "Fresh Spices Daily",
    description: "Hand-ground masalas prepared every morning for the freshest flavor",
  },
  {
    icon: "🥛",
    title: "Pure & Natural",
    description: "Only pure milk and natural ingredients — no artificial additives",
  },
  {
    icon: "🔥",
    title: "Brewed with Love",
    description: "Traditional slow-brew method on open flame for the perfect taste",
  },
  {
    icon: "💰",
    title: "Pocket Friendly",
    description: "Premium taste at prices everyone can enjoy, every single day",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-brown-section py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron-light">
            Why Us
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-cream sm:text-4xl lg:text-5xl">
            Why <span className="text-saffron">Bholenath</span> Chai?
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-cream/10 bg-cream/5 p-6 text-center backdrop-blur-sm transition-colors hover:border-saffron/30"
            >
              <span className="text-4xl">{item.icon}</span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-cream">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/60">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
