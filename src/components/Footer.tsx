import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-brown-section">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Bholenath Chai logo" className="h-10 w-10" width={40} height={40} loading="lazy" />
              <h3 className="font-heading text-xl font-bold">
                <span className="text-saffron">Bholenath</span> Chai
              </h3>
            </div>
            <p className="mt-3 text-sm text-cream/70 leading-relaxed">
              Har Sip Mein Bhakti aur Swad. Your favourite campus chai stall
              at KJ College, Yewalewadi.
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
                { to: "/contact" as const, label: "Contact Us" },
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

          {/* Location */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-saffron">Find Us</h4>
            <ul className="mt-4 space-y-2 text-sm text-cream/70">
              <li>📍 KJ College Campus, Near Main Gate</li>
              <li>Yewalewadi, Pune - 411048</li>
              <li>Maharashtra, India</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-saffron">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm text-cream/70">
              <li>📞 +91 98765 43210</li>
              <li>✉️ hello@bholenathchai.com</li>
              <li>📱 @bholenathchai</li>
              <li className="pt-2">
                🕐 Mon-Sat: 7 AM – 8 PM
              </li>
              <li>🕐 Sun: 8 AM – 6 PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/10 pt-8 text-center">
          <p className="text-sm text-cream/50">
            © {new Date().getFullYear()} Bholenath Chai & Snacks Center, KJ College Yewalewadi. Made with ☕ and devotion.
          </p>
        </div>
      </div>
    </footer>
  );
}
