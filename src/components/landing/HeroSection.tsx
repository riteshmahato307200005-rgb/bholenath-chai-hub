import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-chai.jpg";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Steaming masala chai in a traditional kulhad"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-chai-brown/90 via-transparent to-chai-brown/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-saffron-light">
              ॐ नमः शिवाय
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl">
              Bholenath
              <br />
              <span className="text-gradient-saffron">Chai & Snacks</span>
            </h1>
            <p className="mx-auto lg:mx-0 mt-6 max-w-lg text-lg text-cream/80 sm:text-xl">
              Har Sip Mein Bhakti aur Swad
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row lg:justify-start"
            >
              <Link
                to="/menu"
                className="rounded-full bg-gradient-saffron px-8 py-4 text-lg font-semibold text-primary-foreground shadow-chai transition-transform hover:scale-105"
              >
                Order Now ☕
              </Link>
              <a
                href="#about"
                className="rounded-full border-2 border-cream/30 px-8 py-4 text-lg font-semibold text-cream transition-colors hover:border-saffron hover:text-saffron"
              >
                Our Story
              </a>
            </motion.div>
          </motion.div>

          {/* students drinking chai illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative h-80 flex flex-col gap-4">
              {/* Student 1 - Top */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex items-center gap-3 rounded-lg bg-cream/10 backdrop-blur-sm p-4 border border-cream/20"
              >
                <span className="text-4xl">😊</span>
                <div>
                  <p className="text-sm font-semibold text-cream">Priya</p>
                  <p className="text-xs text-cream/60">Enjoys cutting chai ☕</p>
                </div>
              </motion.div>

              {/* Student 2 - Middle */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="flex items-center gap-3 rounded-lg bg-saffron/10 backdrop-blur-sm p-4 border border-saffron/20 ml-8"
              >
                <span className="text-4xl">😄</span>
                <div>
                  <p className="text-sm font-semibold text-cream">Rohan</p>
                  <p className="text-xs text-cream/60">Studies while sipping 📚</p>
                </div>
              </motion.div>

              {/* Student 3 - Bottom */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="flex items-center gap-3 rounded-lg bg-cream/10 backdrop-blur-sm p-4 border border-cream/20"
              >
                <span className="text-4xl">🙂</span>
                <div>
                  <p className="text-sm font-semibold text-cream">Anaya</p>
                  <p className="text-xs text-cream/60">Friends' favorite spot 👥</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-16 text-center lg:text-left"
        >
          <span className="text-2xl text-cream/50">↓</span>
        </motion.div>
      </div>
    </section>
  );
}
