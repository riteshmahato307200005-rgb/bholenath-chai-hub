import { motion } from "framer-motion";
import aboutImage from "@/assets/about-chai.jpg";

export function AboutSection() {
  return (
    <section id="about" className="bg-cream-section py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-2xl shadow-chai"
          >
            <img
              src={aboutImage}
              alt="Traditional chai stall with warm lighting"
              className="h-full w-full object-cover"
              loading="lazy"
              width={800}
              height={600}
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron-dark">
              Our Story
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-chai-brown sm:text-4xl lg:text-5xl">
              A Chai Stall Born from{" "}
              <span className="text-gradient-saffron">Devotion</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              What started as a humble roadside chai stall near the temple has grown into
              a beloved community spot. Inspired by the spirit of Lord Bholenath — simplicity,
              warmth, and generosity — we brew every cup with fresh spices, pure milk, and
              heartfelt devotion.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Our recipes are passed down through generations, using hand-ground masalas
              and the finest Assam tea leaves. Every sip is a journey through India's
              rich chai heritage.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-center">
              {[
                { num: "5+", label: "Years Serving" },
                { num: "10K+", label: "Happy Customers" },
                { num: "20+", label: "Menu Items" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-bold text-saffron sm:text-3xl">
                    {stat.num}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
