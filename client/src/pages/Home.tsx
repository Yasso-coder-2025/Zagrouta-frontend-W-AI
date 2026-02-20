import { Link } from "wouter";

export default function Home() {
  return (
    <>
      <header className="container mx-auto px-6 py-16 md:py-24 text-center flex-1 flex flex-col justify-center">
        <div className="fade-in-up">
          <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            جهزي لفرحك <br />
            <span className="text-pink-600">بضغطة زرار واحدة!</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            "زغروطة" بيجمع لك أحسن قاعات، أتيليهات، ومراكز تجميل في مكان واحد.. عشان ليلة العمر تطلع زي ما حلمتي.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              href="/planner"
              className="bg-pink-600 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:bg-pink-700 transition transform hover:scale-105 inline-block"
            >
              ابدئي التخطيط الآن 💍
            </Link>
            <Link
              href="/services"
              className="bg-white text-pink-600 border-2 border-pink-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-pink-50 transition inline-block"
            >
              استكشفي الخدمات
            </Link>
          </div>
          <div className="mt-8 flex justify-center">
            <a 
              href="/project_code.tar.gz" 
              download 
              className="text-pink-600 font-bold hover:underline flex items-center gap-2"
            >
              📥 تحميل كود المشروع (React + Vite)
            </a>
          </div>
        </div>
      </header>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">ليه تختاري زغروطة؟</h2>
            <div className="w-24 h-1 bg-pink-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/services?category=dresses" className="group bg-gray-50 p-8 rounded-3xl hover:shadow-2xl transition border border-gray-100 hover:border-pink-200 block">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition">👗</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-pink-600 transition">فساتين زفاف</h3>
              <p className="text-gray-500">أحدث كوليكشن من أكبر الأتيليهات مع إمكانية الإيجار أو الشراء.</p>
            </Link>
            <Link href="/services?category=venues" className="group bg-gray-50 p-8 rounded-3xl hover:shadow-2xl transition border border-gray-100 hover:border-pink-200 block">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition">🏨</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-pink-600 transition">قاعات أفراح</h3>
              <p className="text-gray-500">مقارنة أسعار القاعات والفنادق وحجز المواعيد أونلاين.</p>
            </Link>
            <Link href="/services?category=makeup" className="group bg-gray-50 p-8 rounded-3xl hover:shadow-2xl transition border border-gray-100 hover:border-pink-200 block">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition">💄</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-pink-600 transition">ميك أب آرتيست</h3>
              <p className="text-gray-500">شوفي شغلهم السابق وتقييمات العرايس قبل ما تحجزي.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
