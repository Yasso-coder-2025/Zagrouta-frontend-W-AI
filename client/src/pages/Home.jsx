import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";

const Popup = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button 
          onClick={onClose}
          className="w-full bg-primary text-primary-foreground py-2 rounded-xl font-bold hover:bg-primary-hover transition"
        >
          حسناً
        </button>
      </div>
    </div>
  );
};

export default function Home() {
    const { user } = useAuth();
    const [, setLocation] = useLocation();
    const [popupContent, setPopupContent] = useState({ isOpen: false, title: "", message: "" });

    const handleStartPlanning = () => {
      if (user) {
        setLocation('/planner');
      } else {
        setPopupContent({
          isOpen: true,
          title: "تسجيل الدخول مطلوب",
          message: "عشان تبدئي تخطيط فرحك، لازم تعملي حساب الأول أو تدخلي بحسابك."
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
      />
      <header className="container mx-auto px-6 py-16 md:py-24 text-center flex-1 flex flex-col justify-center">
        <div className="fade-in-up">
          <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            جهزي لفرحك
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-900 via-[#8c71af] to-pink-300 block mt-2 md:mt-3">بضغطة زرار واحدة!</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            "زغروطة" بيجمع لك أحسن قاعات، أتيليهات، ومراكز تجميل في مكان واحد.. عشان ليلة العمر تطلع زي ما حلمتي.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button onClick={handleStartPlanning} className="bg-gradient-to-l from-blue-900 via-[#8c71af] to-pink-300 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:opacity-90 transition transform hover:scale-105 inline-block cursor-pointer">
              ابدئي التخطيط الآن 💍
            </button>
            <Link href="/services" className="bg-white text-[#8c71af] border-2 border-[#8c71af] px-10 py-4 rounded-full text-lg font-bold hover:bg-[#8c71af]/10 transition inline-block">
              استكشفي الخدمات
            </Link>
          </div>
          {/* <div className="mt-8 flex justify-center">
            <a href="/project_code.tar.gz" download className="text-primary font-bold hover:underline flex items-center gap-2">
              📥 تحميل كود المشروع (React + Vite)
            </a>
          </div> */}
        </div>
      </header>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">ليه تختاري زغروطة؟</h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/services?category=dresses" className="group bg-gray-50 p-8 rounded-3xl hover:shadow-2xl transition border border-gray-100 hover:border-[#8c71af] block">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition">👗</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[#8c71af] transition">فساتين زفاف</h3>
              <p className="text-gray-500">أحدث كوليكشن من أكبر الأتيليهات مع إمكانية الإيجار أو الشراء.</p>
            </Link>
            <Link href="/services?category=venues" className="group bg-gray-50 p-8 rounded-3xl hover:shadow-2xl transition border border-gray-100 hover:border-[#8c71af] block">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition">🏨</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[#8c71af] transition">قاعات أفراح</h3>
              <p className="text-gray-500">مقارنة أسعار القاعات والفنادق وحجز المواعيد أونلاين.</p>
            </Link>
            <Link href="/services?category=makeup" className="group bg-gray-50 p-8 rounded-3xl hover:shadow-2xl transition border border-gray-100 hover:border-[#8c71af] block">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition">💄</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[#8c71af] transition">ميك أب آرتيست</h3>
              <p className="text-gray-500">شوفي شغلهم السابق وتقييمات العرايس قبل ما تحجزي.</p>
            </Link>
          </div>
        </div>
      </section>
    </>);
}
