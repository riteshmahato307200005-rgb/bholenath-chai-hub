import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Aarav Patil",
    role: "B.Tech CSE, 3rd Year",
    text: "Bhai subah 7:30 ki lecture se pehle idhar ki cutting chai is a must. Ghar jaisi chai milti hai campus mein. 10/10 recommend!",
    rating: 5,
  },
  {
    name: "Sneha Jadhav",
    role: "MBA 1st Year",
    text: "Samosa + masala chai combo for ₹30 is the best deal near college. Me and my friends come here every evening after class.",
    rating: 5,
  },
  {
    name: "Rohan Kulkarni",
    role: "B.Tech Mech, Final Year",
    text: "Been coming here since first year. The vada pav is crispy and the chai is strong — perfect fuel for exam season. Will miss this place after graduation 🥲",
    rating: 5,
  },
  {
    name: "Prachi Deshmukh",
    role: "B.Sc IT, 2nd Year",
    text: "The kulhad chai here hits different on a rainy day. Also the bhaiya is super friendly and remembers everyone's order. True MVP!",
    rating: 5,
  },
  {
    name: "Vikram Shinde",
    role: "Diploma, 3rd Year",
    text: "Pocket-friendly prices for college students. Cold coffee in summer and adrak chai in winter — they've got everything covered.",
    rating: 4,
  },
  {
    name: "Aisha Khan",
    role: "BBA, 2nd Year",
    text: "Cleanest chai stall near campus. Fresh ingredients, quick service, and the bread pakora is actually SO good. My whole group is addicted.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="bg-cream-section py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron-dark">
            Student Reviews
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            What <span className="text-gradient-saffron">KJ Students</span> Say
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Real reviews from real students at KJ College, Yewalewadi
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl bg-card p-6 shadow-md"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-saffron">★</span>
                ))}
                {Array.from({ length: 5 - t.rating }).map((_, j) => (
                  <span key={j} className="text-muted-foreground/30">★</span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground italic">
                "{t.text}"
              </p>
              <div className="mt-4">
                <p className="font-heading text-sm font-semibold text-foreground">
                  — {t.name}
                </p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
