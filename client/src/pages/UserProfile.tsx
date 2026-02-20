import { useState } from "react";
import { Link } from "wouter";
import { Calendar, Heart, Settings, LogOut, X } from "lucide-react";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites' | 'settings'>('bookings');

  const switchTab = (tab: typeof activeTab) => setActiveTab(tab);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 md:pb-0">
      <header className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-pink-600">بروفايلي</h1>
        <div className="w-8 h-8 rounded-full bg-pink-100 overflow-hidden border border-pink-200">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=60" className="w-full h-full object-cover" alt="Profile" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar (Desktop) */}
          <aside className="hidden md:block col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-gray-100 sticky top-24">
              <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden mb-4 border-4 border-pink-50">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=60" className="w-full h-full object-cover" alt="Profile" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">أحمد محمد</h2>
              <p className="text-gray-500 text-sm mb-6">عريس جديد 🎩</p>
              
              <nav className="space-y-2 text-right">
                <button 
                  onClick={() => switchTab('bookings')} 
                  className={`w-full p-3 rounded-xl font-bold flex items-center gap-3 transition ${activeTab === 'bookings' ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Calendar size={20} /> حجوزاتي
                </button>
                <button 
                  onClick={() => switchTab('favorites')} 
                  className={`w-full p-3 rounded-xl font-bold flex items-center gap-3 transition ${activeTab === 'favorites' ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Heart size={20} /> المفضلة
                </button>
                <button 
                  onClick={() => switchTab('settings')} 
                  className={`w-full p-3 rounded-xl font-bold flex items-center gap-3 transition ${activeTab === 'settings' ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Settings size={20} /> إعدادات الحساب
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-1 md:col-span-3">
            
            {/* Bookings Section */}
            {activeTab === 'bookings' && (
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 hidden md:block">حجوزاتي الحالية</h2>
                
                {/* Desktop Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden hidden md:block border border-gray-100">
                  <table className="w-full text-right">
                    <thead className="bg-gray-50 text-gray-500 font-bold text-sm">
                      <tr>
                        <th className="p-4">الخدمة</th>
                        <th className="p-4">المورد</th>
                        <th className="p-4">التاريخ</th>
                        <th className="p-4">السعر</th>
                        <th className="p-4">الحالة</th>
                        <th className="p-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      <tr className="hover:bg-pink-50 transition">
                        <td className="p-4 font-bold">قاعة الزمردة</td>
                        <td className="p-4 text-gray-500">فندق الماسة</td>
                        <td className="p-4">20 مارس 2026</td>
                        <td className="p-4 font-bold text-pink-600">25,000 ج.م</td>
                        <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">قيد الانتظار</span></td>
                        <td className="p-4"><button className="text-red-500 hover:underline">إلغاء</button></td>
                      </tr>
                      <tr className="hover:bg-pink-50 transition">
                        <td className="p-4 font-bold">سيشن تصوير</td>
                        <td className="p-4 text-gray-500">استوديو لايف</td>
                        <td className="p-4">15 أبريل 2026</td>
                        <td className="p-4 font-bold text-pink-600">3,000 ج.م</td>
                        <td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">مؤكد</span></td>
                        <td className="p-4"><button className="text-blue-500 hover:underline">فاتورة</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">قاعة الزمردة</h3>
                        <p className="text-sm text-gray-500">فندق الماسة</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">قيد الانتظار</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl">
                      <span>📅 20 مارس</span>
                      <span className="font-bold text-pink-600">25,000 ج.م</span>
                    </div>
                    <button className="w-full border border-red-200 text-red-500 py-2 rounded-xl text-sm font-bold hover:bg-red-50">إلغاء الحجز</button>
                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">سيشن تصوير خارجي</h3>
                        <p className="text-sm text-gray-500">استوديو لايف</p>
                      </div>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">مؤكد ✅</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl">
                      <span>📅 15 أبريل</span>
                      <span className="font-bold text-pink-600">3,000 ج.م</span>
                    </div>
                    <button className="w-full bg-pink-600 text-white py-2 rounded-xl text-sm font-bold shadow-md">عرض الفاتورة</button>
                  </div>
                </div>
              </section>
            )}

            {/* Favorites Section */}
            {activeTab === 'favorites' && (
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 hidden md:block">قائمة المفضلة ❤️</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 relative group">
                    <button className="absolute top-3 left-3 bg-white/90 p-2 rounded-full text-red-500 shadow-sm z-10 hover:bg-red-50">
                      <X size={16} />
                    </button>
                    <div className="h-40 bg-gray-200 relative">
                      <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=60" className="w-full h-full object-cover" alt="Dress" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800">فستان زفاف ملكي</h3>
                      <p className="text-pink-600 font-bold text-sm mt-1">12,000 ج.م</p>
                      <button className="mt-3 w-full bg-pink-600 text-white py-2 rounded-xl text-sm font-bold shadow-md hover:bg-pink-700">احجز الآن</button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 relative group">
                    <button className="absolute top-3 left-3 bg-white/90 p-2 rounded-full text-red-500 shadow-sm z-10 hover:bg-red-50">
                      <X size={16} />
                    </button>
                    <div className="h-40 bg-gray-200 relative">
                      <img src="https://images.unsplash.com/photo-1464013778555-8e723c2f01f8?auto=format&fit=crop&w=500&q=60" className="w-full h-full object-cover" alt="Hall" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800">قاعة اللؤلؤة</h3>
                      <p className="text-pink-600 font-bold text-sm mt-1">18,000 ج.م</p>
                      <button className="mt-3 w-full bg-pink-600 text-white py-2 rounded-xl text-sm font-bold shadow-md hover:bg-pink-700">احجز الآن</button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Settings Section */}
            {activeTab === 'settings' && (
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 hidden md:block">تعديل الملف الشخصي ⚙️</h2>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الاسم بالكامل</label>
                      <input type="text" defaultValue="أحمد محمد" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">رقم الموبايل</label>
                      <input type="tel" defaultValue="01012345678" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور الجديدة</label>
                      <input type="password" placeholder="اتركها فارغة لو مش عايز تغيرها" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                    </div>
                    <div className="pt-4">
                      <button type="button" className="w-full md:w-auto px-8 py-3 bg-pink-600 text-white rounded-xl font-bold shadow-lg hover:bg-pink-700 transition">حفظ التغييرات</button>
                    </div>
                  </form>
                </div>
              </section>
            )}

          </main>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 px-6 py-2 flex justify-between items-center">
        <button 
          onClick={() => switchTab('bookings')} 
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'bookings' ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
        >
          <Calendar size={24} />
          <span className="text-[10px] font-bold">حجوزاتي</span>
        </button>
        <button 
          onClick={() => switchTab('favorites')} 
          className={`flex flex-col items-center gap-1 p-2 transition ${activeTab === 'favorites' ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
        >
          <Heart size={24} />
          <span className="text-[10px] font-bold">المفضلة</span>
        </button>
        <button 
          onClick={() => switchTab('settings')} 
          className={`flex flex-col items-center gap-1 p-2 transition ${activeTab === 'settings' ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
        >
          <Settings size={24} />
          <span className="text-[10px] font-bold">إعدادات</span>
        </button>
        <Link href="/">
          <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-600 p-2 transition cursor-pointer">
            <LogOut size={24} />
            <span className="text-[10px] font-bold">خروج</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
