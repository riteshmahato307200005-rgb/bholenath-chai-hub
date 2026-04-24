import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-chai.jpg";

const studentMoments = [
  {
    name: "Priya",
    note: "Enjoys cutting chai",
    emoji: "😊",
    accentClassName: "border-cream/20 bg-cream/10",
    delay: 0,
    offset: [0, -10, 0],
  },
  {
    name: "Rohan",
    note: "Studies while sipping",
    emoji: "😄",
    accentClassName: "border-saffron/20 bg-saffron/10",
    delay: 0.5,
    offset: [0, 10, 0],
  },
  {
    name: "Anaya",
    note: "Friends' favorite spot",
    emoji: "🙂",
    accentClassName: "border-cream/20 bg-cream/10",
    delay: 1,
    offset: [0, -10, 0],
  },
] as const;

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
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

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:mx-auto lg:max-w-xl lg:text-center xl:mx-0 xl:text-left"
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-saffron-light">
              Om Namah Shivaya
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl">
              Bholenath
              <br />
              <span className="text-gradient-saffron">Chai & Snacks</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-lg text-cream/80 sm:text-xl xl:mx-0">
              Har Sip Mein Bhakti aur Swad
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center xl:justify-start"
            >
              <Link
                to="/menu"
                className="rounded-full bg-gradient-saffron px-8 py-4 text-lg font-semibold text-primary-foreground shadow-chai transition-transform hover:scale-105"
              >
                Order Now
              </Link>
              <a
                href="#about"
                className="rounded-full border-2 border-cream/30 px-8 py-4 text-lg font-semibold text-cream transition-colors hover:border-saffron hover:text-saffron"
              >
                Our Story
              </a>
            </motion.div>

            <div className="mt-8 grid gap-3 lg:hidden">
              {studentMoments.map((student) => (
                <motion.div
                  key={student.name}
                  animate={{ y: student.offset }}
                  transition={{ duration: 3, repeat: Infinity, delay: student.delay }}
                  className={`mx-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border p-4 text-left backdrop-blur-sm ${student.accentClassName}`}
                >
                  <span className="text-3xl">{student.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-cream">{student.name}</p>
                    <p className="text-xs text-cream/70">{student.note} with chai</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative flex h-80 flex-col gap-4">
              {studentMoments.map((student, index) => (
                <motion.div
                  key={student.name}
                  animate={{ y: student.offset }}
                  transition={{ duration: 3, repeat: Infinity, delay: student.delay }}
                  className={`flex items-center gap-3 rounded-lg border p-4 backdrop-blur-sm ${student.accentClassName} ${index === 1 ? "ml-8" : ""}`}
                >
                  <span className="text-4xl">{student.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-cream">{student.name}</p>
                    <p className="text-xs text-cream/60">{student.note} with chai</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

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
