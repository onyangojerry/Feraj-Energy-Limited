import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  FileText,
  Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative mt-16 border-t border-white/10 bg-[#0a0b11] text-white/68">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(49,209,122,0.14),transparent_42%),radial-gradient(circle_at_82%_100%,rgba(73,201,255,0.12),transparent_45%)]" />
      <div className="relative mx-auto w-full max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/logos/feraj-solar-logo.png"
                alt="Feraj Solar Limited Logo"
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-semibold tracking-tight text-white/92">
                Feraj Solar Limited
              </span>
            </div>
            <p className="text-sm mb-4 text-white/64">
              Leading Kenya&apos;s clean energy revolution with innovative solar
              solutions for a sustainable and energy-independent future.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="rounded-md p-1 text-white/55 transition hover:bg-white/10 hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-md p-1 text-white/55 transition hover:bg-white/10 hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-md p-1 text-white/55 transition hover:bg-white/10 hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-md p-1 text-white/55 transition hover:bg-white/10 hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4 text-white/90">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/products"
                  className="hover:text-primary transition text-white/70"
                >
                  Solar Panels
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-primary transition text-white/70"
                >
                  Inverters
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-primary transition text-white/70"
                >
                  Battery Storage
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-primary transition text-white/70"
                >
                  Mounting Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-white/90">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition text-white/70"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  className="hover:text-primary transition text-white/70"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-primary transition text-white/70"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/partnerships"
                  className="hover:text-primary transition text-white/70"
                >
                  Partnerships
                </Link>
              </li>
              <li>
                <Link
                  to="/energy-stats"
                  className="hover:text-primary transition text-white/70"
                >
                  Energy Statistics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white/90">Contact</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Email: ferajsolarlimited@gmail.com</li>
              <li>Phone: +254720944707 (Exec)</li>
              <li>Address: Timshack 5th Floor, Ngong Road,</li>
              <li>002 Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/52">
          <p>
            &copy; {new Date().getFullYear()} Feraj Solar. All rights reserved.
            Powering a sustainable future.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/terms-of-service"
              className="hover:text-primary transition flex items-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              Terms of Service
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:text-primary transition flex items-center gap-1.5"
            >
              <Globe className="h-3.5 w-3.5" />
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
