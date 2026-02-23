import { Link } from "wouter";
import { LayoutDashboard, Scissors, CalendarCheck, MessageSquare, Settings, Bell, LogOut } from "lucide-react";
export default function VendorDashboard() {
    return (<div className="bg-gray-100 flex min-h-screen overflow-hidden w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-hover text-primary-foreground flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 text-2xl font-bold border-b border-pink-500 text-center">
          زغروطة للأعمال ✨
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/vendor-dashboard" className="block p-3 rounded-xl bg-primary-800 font-bold flex items-center gap-3">
            <LayoutDashboard size={20}/> الرئيسية
          </Link>
          <a href="#" className="block p-3 rounded-xl hover:bg-primary transition flex items-center gap-3">
            <Scissors size={20}/> خدماتي
          </a>
          <a href="#" className="block p-3 rounded-xl hover:bg-primary transition flex items-center gap-3">
            <CalendarCheck size={20}/> الحجوزات
          </a>
          <a href="#" className="block p-3 rounded-xl hover:bg-primary transition flex items-center gap-3">
            <MessageSquare size={20}/> الرسائل
          </a>
          <a href="#" className="block p-3 rounded-xl hover:bg-primary transition flex items-center gap-3">
            <Settings size={20}/> الإعدادات
          </a>
        </nav>
        <div className="p-4 border-t border-pink-500">
          <Link href="/" className="block p-3 text-center bg-primary-900 rounded-xl hover:bg-red-900 transition text-sm flex items-center justify-center gap-2">
            <LogOut size={16}/> خروج
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto w-full min-h-screen pb-12 md:pb-0">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center px-4 md:px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-700">أهلاً بك، أتيليه الملكة 👋</h2>
          <div className="flex items-center gap-4">
            <span className="relative text-gray-500 hover:text-primary cursor-pointer">
              <Bell size={24}/>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 min-w-[1.25rem] text-center">3</span>
            </span>
            <div className="w-10 h-10 bg-primary-200 rounded-full border-2 border-pink-500"></div>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-blue-500">
              <p className="text-gray-500 text-sm">إجمالي الحجوزات</p>
              <p className="text-3xl font-bold mt-2">124</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-green-500">
              <p className="text-gray-500 text-sm">أرباح الشهر</p>
              <p className="text-3xl font-bold mt-2">15,400 ج.م</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-orange-500">
              <p className="text-gray-500 text-sm">طلبات معلقة</p>
              <p className="text-3xl font-bold mt-2">5</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-pink-500">
              <p className="text-gray-500 text-sm">تقييم المورد</p>
              <p className="text-3xl font-bold mt-2">4.9 ⭐</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">أحدث طلبات الحجز</h3>
              <button className="text-primary text-sm hover:underline font-semibold">عرض الكل</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[600px]">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-4">اسم العروسة</th>
                    <th className="p-4">الخدمة</th>
                    <th className="p-4">التاريخ</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-semibold">سارة أحمد</td>
                    <td className="p-4 text-gray-600">فستان زفاف ملكي</td>
                    <td className="p-4 text-gray-600">20 مارس 2026</td>
                    <td className="p-4">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">قيد الانتظار</span>
                    </td>
                    <td className="p-4">
                      <button className="text-green-600 hover:font-bold ml-2">قبول</button> / 
                      <button className="text-red-600 hover:font-bold mr-2">رفض</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-semibold">منى زكي</td>
                    <td className="p-4 text-gray-600">فستان خطوبة ذهبي</td>
                    <td className="p-4 text-gray-600">25 مارس 2026</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">تم التأكيد</span>
                    </td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:underline">عرض التفاصيل</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Nav for Dashboard */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-primary-hover text-primary-foreground z-50 px-4 py-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <a href="#" className="flex flex-col items-center p-2 text-white">
          <LayoutDashboard size={20}/>
        </a>
        <a href="#" className="flex flex-col items-center p-2 text-pink-300 hover:text-white">
          <Scissors size={20}/>
        </a>
        <a href="#" className="flex flex-col items-center p-2 text-pink-300 hover:text-white">
          <CalendarCheck size={20}/>
        </a>
        <a href="#" className="flex flex-col items-center p-2 text-pink-300 hover:text-white">
          <MessageSquare size={20}/>
        </a>
        <Link href="/">
          <div className="flex flex-col items-center p-2 text-pink-300 hover:text-white cursor-pointer">
            <LogOut size={20}/>
          </div>
        </Link>
      </div>
    </div>);
}
