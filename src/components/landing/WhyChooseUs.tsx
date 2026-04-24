import { motion } from "framer-motion";
import {
  Flame,
  Leaf,
  PackageCheck,
  Sparkles,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

const reasons: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Sparkles,
    title: "Fresh Spices Daily",
    description: "Hand-ground masalas prepared every morning for a fresher and richer taste.",
  },
  {
    icon: Leaf,
    title: "Pure and Natural",
    description: "Made with pure milk and natural ingredients, without unnecessary additives.",
  },
  {
    icon: Flame,
    title: "Brewed with Care",
    description: "Traditional slow-brew preparation keeps the chai flavor strong and consistent.",
  },
  {
    icon: Wallet,
    title: "Pocket Friendly",
    description: "Student-friendly pricing keeps everyday chai and snack breaks affordable.",
  },
  {
    icon: PackageCheck,
    title: "Track Your Order",
    description: "Customers can follow order progress from placed to ready in a simple tracked flow.",
  },
  {
    icon: Zap,
    title: "Faster Reordering",
    description: "Login, save your details, and place repeat orders much faster next time.",
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

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-cream/10 bg-cream/5 p-6 text-center backdrop-blur-sm transition-colors hover:border-saffron/30"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream/10 text-saffron-light">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-cream">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/60">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
