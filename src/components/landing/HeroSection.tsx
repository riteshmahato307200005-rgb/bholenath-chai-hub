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

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-saffron-light">
            ॐ नमः शिवाय
          </p>
          <h1 className="font-heading text-5xl font-bold leading-tight text-cream sm:text-6xl md:text-7xl lg:text-8xl">
            Bholenath
            <br />
            <span className="text-gradient-saffron">Chai & Snacks</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg text-cream/80 sm:text-xl">
            Har Sip Mein Bhakti aur Swad
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
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

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-16"
        >
          <span className="text-2xl text-cream/50">↓</span>
        </motion.div>
      </div>
    </section>
  );
}
