import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/ContactForm";

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

      {/* Contact Info + Form */}
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

              {/* Map */}
              <motion.div
                className="mt-8 overflow-hidden rounded-2xl shadow-chai"
              >
                <iframe
                  src="https://www.google.com/maps?q=KJ%20College%20Campus%2C%20Yewalewadi%2C%20Pune%20411048&z=16&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bholenath Chai Location - KJ College Yewalewadi"
                />
              </motion.div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=KJ%20College%20Campus%2C%20Yewalewadi%2C%20Pune%20411048"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-saffron-dark hover:text-saffron"
              >
                Open in Google Maps
              </a>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl bg-cream-section p-8 shadow-chai"
            >
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Get In Touch 💬
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Have questions about bulk orders, event catering, or anything else? Fill out the form below and we'll get back to you!
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
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
              We offer special bulk pricing for chai and snacks. Fill out the form above with your event details and we'll send you a custom quote!
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
