import { useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { X, Trash2, ShoppingBag, Calendar, Users, Award } from "lucide-react";
import { useBookings } from "../../hooks/use-bookings";
import { useLanguage } from "../../context/LanguageContext";

export default function CartDrawer() {
  const { lang, t } = useLanguage();
  const [, setLocation] = useLocation();
  const { bookings, isCartOpen, setCartOpen, removeBooking, updateBooking } = useBookings();
  const drawerRef = useRef(null);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartOpen) {
        setCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setCartOpen]);

  // Helper to parse price string
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const clean = priceStr.replace(/[^\d]/g, '');
    return parseInt(clean, 10) || 0;
  };

  // Calculations
  const totalPrice = bookings.reduce((sum, item) => sum + parsePrice(item.price), 0);
  const formattedTotal = lang === 'ar' 
    ? `${totalPrice.toLocaleString('ar-EG')} ج.م` 
    : `${totalPrice.toLocaleString('en-US')} EGP`;

  const handleCheckoutClick = () => {
    setCartOpen(false);
    setLocation("/checkout");
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Cart Drawer Panel */}
      <div 
        ref={drawerRef}
        className={`fixed top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 transition-transform duration-300 flex flex-col ${
          lang === 'ar' 
            ? `left-0 ${isCartOpen ? 'translate-x-0' : '-translate-x-full'}` 
            : `right-0 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`
        }`}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#8c71af]/10 text-[#8c71af] p-2 rounded-xl">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">
                {lang === 'ar' ? 'عربة التسوق' : 'Shopping Cart'}
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                {bookings.length} {lang === 'ar' ? 'خدمات مضافة' : 'services added'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setCartOpen(false)} 
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {bookings.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
              <div className="text-5xl mb-3">🛒</div>
              <p className="font-bold text-gray-600 mb-1">
                {lang === 'ar' ? 'عربتك فارغة' : 'Your cart is empty'}
              </p>
              <p className="text-xs text-gray-400 max-w-[240px] leading-relaxed">
                {lang === 'ar' ? 'تصفح خدماتنا المميزة وأضفها إلى العربة لبدء التخطيط!' : 'Browse our featured services and add them to your cart to start planning!'}
              </p>
              <button
                onClick={() => { setCartOpen(false); setLocation("/services"); }}
                className="mt-4 bg-gradient-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:opacity-90 transition"
              >
                {lang === 'ar' ? 'تصفح الخدمات' : 'Browse Services'}
              </button>
            </div>
          ) : (
            bookings.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition relative flex flex-col gap-3.5"
              >
                {/* Delete button absolute */}
                <button 
                  onClick={() => removeBooking(item.id)}
                  className="absolute top-4 left-4 lang-ar:left-auto lang-ar:right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                  title={lang === 'ar' ? 'حذف' : 'Remove'}
                  style={{ [lang === 'ar' ? 'left' : 'right']: '1rem' }}
                >
                  <Trash2 size={16} />
                </button>

                {/* Service Details Main Info */}
                <div className="flex gap-3">
                  <img 
                    src={item.image || "https://via.placeholder.com/150"} 
                    className="w-16 h-16 rounded-xl object-cover border shadow-sm flex-shrink-0"
                    alt={item.name}
                  />
                  <div className="text-start pr-6 lang-ar:pr-0 lang-ar:pl-6 max-w-[200px]">
                    <h4 className="font-bold text-sm text-gray-800 truncate" title={item.name}>{t(item.name)}</h4>
                    <p className="text-xs text-[#8c71af] font-semibold mt-0.5">{item.price}</p>
                    <p className="text-[10px] text-gray-400 mt-1">📍 {t(item.location || 'القاهرة')}</p>
                  </div>
                </div>

                <div className="border-t border-gray-50 my-1"></div>

                {/* Edit Section */}
                <div className="grid grid-cols-1 gap-2.5 text-start">
                  {/* Event Date */}
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                    <input 
                      type="date" 
                      value={item.date || ""} 
                      onChange={(e) => updateBooking(item.id, { date: e.target.value })}
                      className="w-full text-xs p-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8c71af] text-gray-600 font-bold"
                    />
                  </div>

                  {/* Event Type & Guests */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <Award size={14} className="text-gray-400 flex-shrink-0" />
                      <select 
                        value={item.eventType || "booking_type_wedding"}
                        onChange={(e) => updateBooking(item.id, { eventType: e.target.value })}
                        className="w-full text-[11px] p-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8c71af] text-gray-600 font-semibold"
                      >
                        <option value="booking_type_wedding">{t("booking_type_wedding")}</option>
                        <option value="booking_type_engagement">{t("booking_type_engagement")}</option>
                        <option value="booking_type_marriage">{t("booking_type_marriage")}</option>
                        <option value="booking_type_graduation">{t("booking_type_graduation")}</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-gray-400 flex-shrink-0" />
                      <select 
                        value={item.guests || "guests_100_300"}
                        onChange={(e) => updateBooking(item.id, { guests: e.target.value })}
                        className="w-full text-[11px] p-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8c71af] text-gray-600 font-semibold"
                      >
                        <option value="guests_under_100">{t("guests_under_100")}</option>
                        <option value="guests_100_300">{t("guests_100_300")}</option>
                        <option value="guests_300_500">{t("guests_300_500")}</option>
                        <option value="guests_over_500">{t("guests_over_500")}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Sum & Checkout Button */}
        {bookings.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-gray-500">
                {lang === 'ar' ? 'السعر الإجمالي للباقات' : 'Total Package Price'}
              </span>
              <span className="text-lg text-gradient-primary font-black">
                {formattedTotal}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-xs font-semibold text-green-600 bg-green-50 p-2.5 rounded-lg">
              <span>💡 {lang === 'ar' ? 'عربون الحجز المطلوب (لكل خدمة)' : 'Required deposit (per service)'}</span>
              <span className="font-bold">
                {lang === 'ar' ? `${(2500 * bookings.length).toLocaleString('ar-EG')} ج.م` : `${(2500 * bookings.length).toLocaleString('en-US')} EGP`}
              </span>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full bg-gradient-primary text-white py-3.5 rounded-xl font-bold shadow-md hover:opacity-95 transition transform hover:-translate-y-0.5 flex justify-center items-center gap-2 cursor-pointer text-base"
            >
              <span>💳</span> {lang === 'ar' ? 'تأكيد وحجز كل الخدمات' : 'Checkout & Book All Services'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
