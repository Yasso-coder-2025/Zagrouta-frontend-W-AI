import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-pink-500 mb-4">زغروطة</h3>
            <p className="text-gray-400 leading-relaxed">
              منصتك الأولى لتجهيز الفرح من الإبرة للصاروخ. إحنا معاكي خطوة بخطوة.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block">
              روابط هامة
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-pink-500 transition">الرئيسية</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-pink-500 transition">الخدمات</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-pink-500 transition">تواصل معنا</Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-pink-500 transition">تسجيل الدخول</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block text-yellow-500">
              اختصارات (للمطور)
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/vendor-dashboard" className="hover:text-yellow-400 transition">🛠️ لوحة تحكم المورد</Link>
              </li>
              <li>
                <Link href="/user-profile" className="hover:text-yellow-400 transition">👤 بروفايل العروسة</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block">
              تواصل معنا
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>📞 19xxx - الخط الساخن</li>
              <li>📧 hello@zagrouta.com</li>
              <li>📍 القاهرة، مصر</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          &copy; 2026 جميع الحقوق محفوظة لمشروع زغروطة.
        </div>
      </div>
    </footer>
  );
}
