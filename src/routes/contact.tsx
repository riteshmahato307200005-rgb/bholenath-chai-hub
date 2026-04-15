import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Bholenath Chai & Snacks Center" },
      { name: "description", content: "Find us at KJ College, Yewalewadi, Pune. Visit our chai stall on campus or reach out for bulk orders and event catering." },
      { property: "og:title", content: "Contact — Bholenath Chai & Snacks Center" },
      { property: "og:description", content: "Located at KJ College campus, Yewalewadi, Pune. Come grab your daily chai!" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-brown-section py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron-light">
              Get In Touch
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-cream sm:text-5xl lg:text-6xl">
              Contact <span className="text-saffron">Us</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-cream/70">
              We'd love to hear from you! Visit us on campus or drop us a message.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info + Map */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Find Us On Campus
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We're the go-to chai stall at KJ College campus. Whether you need a
                quick cutting chai between lectures or a full snack break with friends,
                we've got you covered!
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <span className="mt-1 text-2xl">📍</span>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Address</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Bholenath Chai & Snacks Center<br />
                      KJ College Campus, Near Main Gate<br />
                      Yewalewadi, Pune - 411048<br />
                      Maharashtra, India
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="mt-1 text-2xl">📞</span>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Phone</h3>
                    <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="mt-1 text-2xl">✉️</span>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Email</h3>
                    <p className="text-sm text-muted-foreground">hello@bholenathchai.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="mt-1 text-2xl">🕐</span>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Hours</h3>
                    <p className="text-sm text-muted-foreground">
                      Monday – Saturday: 7:00 AM – 8:00 PM<br />
                      Sunday: 8:00 AM – 6:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="mt-1 text-2xl">📱</span>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Follow Us</h3>
                    <p className="text-sm text-muted-foreground">
                      Instagram: @bholenathchai
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-2xl shadow-chai"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.7936!2d73.8567!3d18.4529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eaf0b5f2a1a1%3A0x1234567890abcdef!2sKJ%20College%2C%20Yewalewadi%2C%20Pune!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "450px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bholenath Chai Location - KJ College Yewalewadi"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-section py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Bulk Orders & Event Catering 🎉
            </h2>
            <p className="mt-4 text-muted-foreground">
              Planning a college event, farewell party, or department gathering?
              We offer special bulk pricing for chai and snacks. Contact us to discuss!
            </p>
            <a
              href="tel:+919876543210"
              className="mt-6 inline-block rounded-full bg-gradient-saffron px-8 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Call Us Now 📞
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
