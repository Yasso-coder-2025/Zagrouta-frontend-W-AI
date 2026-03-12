import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [location, setLocation] = useLocation();
    const { user, logout } = useAuth();
    
    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => {
      setIsMobileMenuOpen(false);
      setIsDropdownOpen(false);
    };

    const handleLogout = () => {
      logout();
      closeMenu();
      setLocation("/");
    };
    
    const navLinks = [
        { name: "الرئيسية", path: "/" },
        { name: "الخدمات", path: "/services" },
        { name: "تواصل معنا", path: "/contact" },
    ];
    
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-extrabold text-gradient-primary tracking-wider flex items-center gap-2">
              <span className="text-white">✨</span> زغروطة
            </Link>

            <ul className="hidden md:flex flex gap-8 font-bold">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className={`transition ${location === link.path ? "text-gradient-primary" : "text-gray-600 hover-text-gradient-primary"}`}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="hidden md:block">
              {!user ? (
                <Link href="/auth" className="bg-gradient-primary text-white px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block">
                  دخول / تسجيل
                </Link>
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-gray-700 font-bold px-4 flex items-center gap-2 hover-text-gradient-primary transition cursor-pointer"
                  >
                    <User size={20} className="text-[#8c71af]" />
                    أهلاً بك، {user.fullName || "يا عروسة"}
                    <ChevronDown size={16} className={`transition-transform text-gray-700 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <Link href="/user-profile" onClick={closeMenu} className="block px-4 py-3 hover:bg-gradient-to-br hover:from-blue-50 hover:to-pink-50 text-gray-700 hover-text-gradient-primary transition font-bold flex items-center gap-2 border-b border-gray-50">
                        <User size={16} className="text-[#8c71af]" />
                        حسابي
                      </Link>
                      <button onClick={handleLogout} className="w-full text-right px-4 py-3 hover:bg-red-50 text-red-600 transition font-bold flex items-center gap-2">
                        <LogOut size={16} className="text-red-500" />
                        تسجيل خروج
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button onClick={toggleMenu} className="md:hidden text-gray-600 focus:outline-none" data-testid="button-mobile-menu">
              {isMobileMenuOpen ? <X size={32}/> : <Menu size={32}/>}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100 animate-fade-in-up">
              <ul className="flex flex-col space-y-4 mt-4 font-bold text-gray-600 text-center">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link href={link.path} onClick={closeMenu} className={`block py-2 rounded-xl transition ${location === link.path ? "text-gradient-primary bg-primary-50" : "hover:bg-gray-50 hover-text-gradient-primary"}`}>
                      {link.name}
                    </Link>
                  </li>
                ))}
                
                {user ? (
                  <>
                    <li className="mt-2 border-t pt-2">
                       <span className="block py-2 text-gray-500 font-bold">
                         أهلاً بك، {user.fullName || "يا عروسة"}
                       </span>
                    </li>
                    <li>
                      <Link href="/user-profile" onClick={closeMenu} className="block py-3 text-[#8c71af] rounded-xl flex items-center justify-center gap-2 font-bold bg-[#8c71af]/10 hover:bg-[#8c71af]/20 transition">
                        <User size={18} />
                        حسابي
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="w-full block py-3 text-red-600 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-red-50 transition border border-transparent">
                        <LogOut size={18} />
                        تسجيل خروج
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link href="/auth" onClick={closeMenu} className="block bg-gradient-primary text-white py-3 rounded-xl shadow-md mt-2 transition hover:opacity-90">
                      دخول / تسجيل
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>
    );
}
