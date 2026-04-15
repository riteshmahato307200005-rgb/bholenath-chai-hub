import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-brown-section">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold">
              <span className="text-saffron">Bholenath</span> Chai
            </h3>
            <p className="mt-3 text-sm text-cream/70 leading-relaxed">
              Har Sip Mein Bhakti aur Swad. Serving authentic Indian chai
              with love, tradition, and a touch of spirituality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-saffron">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              {[
                { to: "/" as const, label: "Home" },
                { to: "/menu" as const, label: "Menu" },
                { to: "/cart" as const, label: "Cart" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-cream/70 transition-colors hover:text-saffron"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-saffron">Contact Us</h4>
            <ul className="mt-4 space-y-2 text-sm text-cream/70">
              <li>📍 Near Temple Road, Main Market</li>
              <li>📞 +91 98765 43210</li>
              <li>✉️ hello@bholenathchai.com</li>
              <li className="pt-2">
                🕐 Open Daily: 6:00 AM – 10:00 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/10 pt-8 text-center">
          <p className="text-sm text-cream/50">
            © {new Date().getFullYear()} Bholenath Chai & Snacks Center. Made with ☕ and devotion.
          </p>
        </div>
      </div>
    </footer>
  );
}
