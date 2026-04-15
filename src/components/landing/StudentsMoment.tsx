import { motion } from "framer-motion";

export function StudentsMoment() {
  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-cream-section to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron-light">
            Campus Life
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            The Perfect <span className="text-saffron">Tea Break</span> Moment
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join fellow students for authentic chai and meaningful conversations
          </p>
        </motion.div>

        {/* Students Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Student 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-chai-brown/20 to-saffron/10 p-6 backdrop-blur-sm border border-cream/20 hover:border-saffron/50 transition-all"
          >
            <div className="h-40 bg-gradient-to-br from-[#8B6F47]/20 to-[#D4A574]/20 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-5xl">☕</span>
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Morning Study Break
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Refresh between lectures with steaming chai and samosas
            </p>
          </motion.div>

          {/* Student 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-chai-brown/20 to-saffron/10 p-6 backdrop-blur-sm border border-cream/20 hover:border-saffron/50 transition-all"
          >
            <div className="h-40 bg-gradient-to-br from-[#8B6F47]/20 to-[#D4A574]/20 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-5xl">👥</span>
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Friendship Circles
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect with friends over chai and creating lasting memories
            </p>
          </motion.div>

          {/* Student 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-chai-brown/20 to-saffron/10 p-6 backdrop-blur-sm border border-cream/20 hover:border-saffron/50 transition-all sm:col-span-2 lg:col-span-1"
          >
            <div className="h-40 bg-gradient-to-br from-[#8B6F47]/20 to-[#D4A574]/20 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-5xl">🎓</span>
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Campus Tradition
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A beloved ritual for every student's campus experience
            </p>
          </motion.div>
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 rounded-2xl bg-gradient-to-r from-saffron/10 to-chai-brown/10 p-8 border border-saffron/20 text-center"
        >
          <p className="text-lg italic text-foreground">
            "Bholenath chai isn't just a drink, it's the heartbeat of our college life. Every break, every celebration, every difficult moment – our chai is there. 💚"
          </p>
          <p className="mt-4 font-semibold text-saffron">— KJ College Students</p>
        </motion.div>
      </div>
    </section>
  );
}
