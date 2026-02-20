import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "الخدمات", path: "/services" },
    { name: "تواصل معنا", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold text-pink-600 tracking-wider flex items-center gap-2">
            <span>✨</span> زغروطة
          </Link>

          <ul className="hidden md:flex space-x-reverse space-x-8 font-bold text-gray-600">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`transition ${location === link.path ? "text-pink-600" : "hover:text-pink-600"}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/user-profile" className="text-gray-400 hover:text-pink-600 transition text-sm pt-1 flex items-center gap-1">
                <User size={16} /> حسابي
              </Link>
            </li>
          </ul>

          <div className="hidden md:block">
            <Link
              href="/auth"
              className="bg-pink-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-pink-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
            >
              دخول / تسجيل
            </Link>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-600 focus:outline-none"
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 animate-fade-in-up">
            <ul className="flex flex-col space-y-4 mt-4 font-bold text-gray-600 text-center">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    onClick={closeMenu}
                    className={`block py-2 rounded-xl transition ${
                      location === link.path ? "text-pink-600 bg-pink-50" : "hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/user-profile" onClick={closeMenu} className="block py-2 hover:bg-gray-50 rounded-xl flex items-center justify-center gap-2">
                  <User size={18} /> حسابي
                </Link>
              </li>
              <li>
                <Link
                  href="/auth"
                  onClick={closeMenu}
                  className="block bg-pink-600 text-white py-3 rounded-xl shadow-md mt-2"
                >
                  دخول / تسجيل
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
