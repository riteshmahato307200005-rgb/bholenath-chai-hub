import { motion } from "framer-motion";
import shopFrontImage from "@/assets/shop-front.jpg";

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
            className="group relative overflow-hidden rounded-xl shadow-chai"
          >
            <img
              src={shopFrontImage}
              alt="Bholenath Tea and Snacks Centre storefront near Brew Beans Cafe parking"
              className="aspect-[4/3] h-full w-full object-cover object-[50%_64%] transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              width={800}
              height={600}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-chai-brown/80 via-chai-brown/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-cream sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron-light">
                Our Real Stall
              </p>
              <p className="mt-2 font-heading text-2xl font-bold">
                Bholenath Tea and Snacks Centre
              </p>
              <p className="mt-1 max-w-md text-sm text-cream/80">
                Find us in the parking area near Brew Beans Cafe at KJ College.
              </p>
            </div>
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
              The Campus Chai Stall Built on{" "}
              <span className="text-gradient-saffron">Devotion</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              What started as a small chai stall at KJ College, Yewalewadi has
              become a familiar campus stop in the parking area near Brew Beans
              Cafe. Inspired by the spirit of Lord Bholenath - simplicity,
              warmth, and generosity - we brew every cup with fresh spices, pure
              milk, and a whole lot of love.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              From early morning lectures to late-night study sessions, students count
              on us for their daily chai fix. Our recipes use hand-ground masalas and
              the finest Assam tea leaves - because college students deserve premium
              chai at student-friendly prices.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-center">
              {[
                { num: "3+", label: "Years at KJ" },
                { num: "5K+", label: "Happy Students" },
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
