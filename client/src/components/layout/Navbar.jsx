import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, LogOut, ChevronDown, Bell, MessageSquare, ShoppingCart } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { useBookings } from "../../hooks/use-bookings";
import { API_URL } from "../../config";
import { useLanguage } from "../../context/LanguageContext";

export default function Navbar() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { bookings, isCartOpen, setCartOpen } = useBookings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [deletedNotifications, setDeletedNotifications] = useState(new Set());
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const notificationsRef = useRef(null);
  const dropdownRef = useRef(null);

  // جيب عدد الرسائل غير المقروءة للعميل
  useEffect(() => {
    if (!user || user.role === 'VENDOR') return;
    const fetchUnread = async () => {
      try {
        const res = await fetch(`${API_URL}/messages/unread-count/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setUnreadMsgCount(data.unreadCount || 0);
        }
      } catch (err) { /* silent */ }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationsOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

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

  const deleteNotification = (id) => {
    setDeletedNotifications((prev) => new Set([...prev, id]));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setDeletedNotifications(new Set());
  };

  const visibleNotifications = notifications.filter(
    (n) => !deletedNotifications.has(n.id),
  );

  const navLinks = [
    { name: t("nav_home"), path: "/" },
    { name: t("nav_services"), path: "/services" },
    { name: t("nav_contact"), path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between relative">
          
          {/* Logo Section */}
          <div className="flex-1 flex justify-start">
            <Link
              href="/"
              className="text-3xl font-extrabold text-gradient-primary tracking-wider flex items-center gap-2"
            >
              <span className="text-white">✨</span> {lang === 'ar' ? 'زغروطة' : 'Zagrouta'}
            </Link>
          </div>

          {/* Navigation Links (Centered) */}
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <ul className="flex gap-8 font-bold">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className={`transition ${location === link.path ? "text-gradient-primary" : "text-gray-600 hover-text-gradient-primary"}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Action / User Menu Section */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 text-gray-600 hover-text-gradient-primary font-bold px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#8c71af]/30 transition shadow-sm bg-white cursor-pointer text-sm"
              >
                <span>🌐</span> {lang === "ar" ? "عربي" : "English"}
              </button>
              {(!user || user.role !== 'VENDOR') && (
                <button
                  onClick={() => setCartOpen(!isCartOpen)}
                  className="relative text-gray-500 hover:text-[#8c71af] transition flex items-center justify-center cursor-pointer px-2"
                  title={lang === 'ar' ? "عربة التسوق" : "Shopping Cart"}
                >
                  <ShoppingCart size={20} />
                  {bookings.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-primary text-white text-[10px] rounded-full px-1.5 min-w-5 text-center font-bold animate-pulse">
                      {bookings.length}
                    </span>
                  )}
                </button>
              )}
              {!user ? (
                <Link
                  href="/auth"
                  className="bg-gradient-primary text-white px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
                >
                  {t("nav_login")}
                </Link>
              ) : (
                <div className="flex items-center">
                  {/* Notifications Button */}
                  <div className="relative " ref={notificationsRef}>
                    <button
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      className="relative text-gray-500 hover:text-[#8c71af] transition flex items-center justify-center cursor-pointer"
                    >
                      <Bell size={20} />
                      {visibleNotifications.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1.5 min-w-5 text-center font-bold">
                          {visibleNotifications.length}
                        </span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    {isNotificationsOpen && (
                      <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 max-h-96 flex flex-col">
                        <div className="p-3 border-b border-gray-100 bg-gray-50 font-bold text-sm text-gray-700 flex justify-between items-center">
                          {t("nav_notifications")}
                          {visibleNotifications.length > 0 && (
                            <button
                              onClick={clearAllNotifications}
                              className="text-xs text-border hover:underline font-semibold"
                            >
                              {t("nav_clear_all")}
                            </button>
                          )}
                        </div>
                        <div className="overflow-y-auto flex-1 max-h-80">
                          {visibleNotifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                              <div className="text-3xl mb-2">🔔</div>
                              {t("nav_no_notifications")}
                            </div>
                          ) : (
                            visibleNotifications.map((notif) => (
                              <div
                                key={notif.id}
                                className="p-3 border-b border-gray-50 hover:bg-gray-50 transition relative group"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-lg">{notif.icon}</span>
                                  <button
                                    onClick={() => deleteNotification(notif.id)}
                                    className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                    title="حذف"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                                <p className="text-sm text-gray-800 font-semibold mb-1">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-500">
                                  من: {notif.vendorName}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Messages Icon — للعميل فقط */}
                  {unreadMsgCount > 0 && user.role !== 'VENDOR' && (
                    <Link
                      href="/user-profile?tab=messages"
                      className="relative mx-3 text-gray-500 hover:text-[#8c71af] transition flex items-center justify-center cursor-pointer"
                      title={t("nav_messages")}
                    >
                      <MessageSquare size={20} />
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1.5 min-w-5 text-center font-bold">
                        {unreadMsgCount}
                      </span>
                    </Link>
                  )}

                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="text-gray-700 font-bold px-4 flex items-center gap-2 hover-text-gradient-primary transition cursor-pointer"
                    >
                      <User size={20} className="text-border" />
                      {t("nav_welcome")}{user.fullName || t("nav_guest")}
                      <ChevronDown
                        size={16}
                        className={`transition-transform text-gray-700 ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <Link
                          href="/user-profile"
                          onClick={closeMenu}
                          className="block px-4 py-3 hover:bg-gradient-to-br hover:from-blue-50 hover:to-pink-50 text-gray-700 hover-text-gradient-primary transition font-bold flex items-center gap-2 border-b border-gray-50"
                        >
                          <User size={16} className="text-border" />
                          {t("nav_profile")}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-right px-4 py-3 hover:bg-red-50 text-red-600 transition font-bold flex items-center gap-2"
                        >
                          <LogOut size={16} className="text-red-500" />
                          {t("nav_logout")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 focus:outline-none"
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
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
                    className={`block py-2 rounded-xl transition ${location === link.path ? "text-gradient-primary bg-primary-50" : "hover:bg-gray-50 hover-text-gradient-primary"}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              <li>
                <button
                  onClick={() => { toggleLanguage(); closeMenu(); }}
                  className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <span>🌐</span> {lang === "ar" ? "عربي" : "English"}
                </button>
              </li>
              {(!user || user.role !== 'VENDOR') && (
                <li>
                  <button
                    onClick={() => { setCartOpen(true); closeMenu(); }}
                    className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    <ShoppingCart size={18} className="text-[#8c71af]" />
                    {lang === 'ar' ? 'عربة التسوق' : 'Shopping Cart'}
                    {bookings.length > 0 && (
                      <span className="bg-gradient-primary text-white text-[10px] rounded-full px-1.5 min-w-5 text-center font-bold">
                        {bookings.length}
                      </span>
                    )}
                  </button>
                </li>
              )}

              {user ? (
                <>
                  <li className="mt-2 border-t pt-2">
                    <span className="block py-2 text-gray-500 font-bold">
                      {t("nav_welcome")}{user.fullName || t("nav_guest")}
                    </span>
                  </li>
                  <li>
                    <Link
                      href="/user-profile"
                      onClick={closeMenu}
                      className="block py-3 text-[#8c71af] rounded-xl flex items-center justify-center gap-2 font-bold bg-[#8c71af]/10 hover:bg-[#8c71af]/20 transition text-sm"
                    >
                      <User size={18} />
                      {t("nav_profile")}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full block py-3 text-red-600 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-red-50 transition border border-transparent cursor-pointer text-sm"
                    >
                      <LogOut size={18} />
                      {t("nav_logout")}
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/auth"
                    onClick={closeMenu}
                    className="block bg-gradient-primary text-white py-3 rounded-xl shadow-md mt-2 transition hover:opacity-90 text-sm"
                  >
                    {t("nav_login")}
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
