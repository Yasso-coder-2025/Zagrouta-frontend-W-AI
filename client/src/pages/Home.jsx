import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { useLanguage } from "../context/LanguageContext";

const Popup = ({ isOpen, onClose, title, message, okText }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 text-sm">{message}</p>
        <button 
          onClick={onClose}
          className="w-full bg-gradient-primary text-white py-2.5 rounded-xl font-bold hover:opacity-90 transition cursor-pointer"
        >
          {okText || "حسناً"}
        </button>
      </div>
    </div>
  );
};

export default function Home() {
    const { user } = useAuth();
    const [, setLocation] = useLocation();
    const { lang, t } = useLanguage();
    const [popupContent, setPopupContent] = useState({ isOpen: false, title: "", message: "" });

    const handleStartPlanning = () => {
      if (user) {
        setLocation('/planner');
      } else {
        setPopupContent({
          isOpen: true,
          title: lang === 'ar' ? "تسجيل الدخول مطلوب" : "Login Required",
          message: lang === 'ar' 
            ? "عشان تبدئي تخطيط فرحك، لازم تعملي حساب الأول أو تدخلي بحسابك." 
            : "To start planning your wedding, you must first create an account or log in."
        });
      }
    };

    const closePopup = () => setPopupContent(prev => ({ ...prev, isOpen: false }));
    
    return (<>
      <Popup 
        isOpen={popupContent.isOpen} 
        onClose={closePopup} 
        title={popupContent.title} 
        message={popupContent.message} 
        okText={lang === 'ar' ? "حسناً" : "Okay"}
      />
      <header className="container mx-auto px-6 py-16 md:py-24 text-center flex-1 flex flex-col justify-center min-h-[85vh]">
        <div className="fade-in-up">
          <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            {lang === 'ar' ? (
              <>
                جهزي لفرحك
                <span className="text-gradient-primary block mt-2 md:mt-3">بضغطة زرار واحدة!</span>
              </>
            ) : (
              <>
                Plan your wedding
                <span className="text-gradient-primary block mt-2 md:mt-3">with a single click!</span>
              </>
            )}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {lang === 'ar' 
              ? '"زغروطة" بيجمع لك أحسن قاعات، أتيليهات، ومراكز تجميل في مكان واحد.. عشان ليلة العمر تطلع زي ما حلمتي.'
              : '"Zagrouta" gathers the best wedding venues, ateliers, and beauty centers in one place... so your special night turns out just as you dreamed.'}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button onClick={handleStartPlanning} className="bg-gradient-primary text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:opacity-90 transition transform hover:scale-105 inline-block cursor-pointer">
              {lang === 'ar' ? "ابدئي التخطيط الآن 💍" : "Start Planning Now 💍"}
            </button>
            <Link href="/services" className="bg-white text-[#8c71af] border-2 border-gray-100 px-10 py-4 rounded-full text-lg font-bold hover:bg-[#8c71af]/10 transition inline-block">
              {lang === 'ar' ? "استكشفي الخدمات" : "Explore Services"}
            </Link>
          </div>
        </div>
      </header>

      <section className="w-full pb-20">
        <div className="fade-in-up px-6" style={{ animationDelay: '0.2s' }}>
          <img 
            src="/hero-banner.jpg" 
            alt={lang === 'ar' ? "كل خدمات زفافك في مكان واحد" : "All your wedding services in one place"} 
            className="w-full max-w-4xl mx-auto rounded-[2rem] shadow-2xl object-cover hover:scale-[1.02] transition-transform duration-500 border-4 border-white/50 cursor-pointer" 
          />
        </div>

        <div className="mt-12 fade-in-up px-4 md:px-8" style={{ animationDelay: '0.4s' }}>
          <video 
            src="/lv_0_20260503135454.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            controls
            className="w-full rounded-[2rem] shadow-2xl object-cover hover:scale-[1.01] transition-transform duration-500 border-4 border-white/50" 
          />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {lang === 'ar' ? "ليه تختاري زغروطة؟" : "Why Choose Zagrouta?"}
            </h2>
            <div className="w-24 h-1 bg-[#8c71af] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/services?category=dress" className="group bg-gray-50 p-8 rounded-3xl hover:shadow-2xl transition border border-gray-100 block text-start">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition">👗</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[#8c71af] transition">
                {lang === 'ar' ? "فساتين زفاف" : "Wedding Dresses"}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {lang === 'ar' 
                  ? "أحدث كوليكشن من أكبر الأتيليهات مع إمكانية الإيجار أو الشراء."
                  : "The latest collections from top ateliers, with options to rent or buy."}
              </p>
            </Link>
            <Link href="/services?category=venue" className="group bg-gray-50 p-8 rounded-3xl hover:shadow-2xl transition border border-gray-100 block text-start">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition">🏨</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[#8c71af] transition">
                {lang === 'ar' ? "قاعات أفراح" : "Wedding Venues"}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {lang === 'ar' 
                  ? "مقارنة أسعار القاعات والفنادق وحجز المواعيد أونلاين."
                  : "Compare wedding venue and hotel packages, and book your date online."}
              </p>
            </Link>
            <Link href="/services?category=makeup" className="group bg-gray-50 p-8 rounded-3xl hover:shadow-2xl transition border border-gray-100 block text-start">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition">💄</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[#8c71af] transition">
                {lang === 'ar' ? "ميك أب آرتيست" : "Makeup Artists"}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {lang === 'ar' 
                  ? "شوفي شغلهم السابق وتقييمات العرايس قبل ما تحجزي."
                  : "Review their portfolio and bride reviews before booking your beauty slot."}
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>);
}
