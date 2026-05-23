import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Scissors, CalendarCheck, MessageSquare, Settings, LogOut, Star } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { API_URL } from "../config";
import VendorHeader from "../components/layout/VendorHeader";

export default function VendorDashboard() {
    const { user, logout } = useAuth();
    const [, setLocation] = useLocation();
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        if (user && user.role === 'VENDOR') {
            fetchBookings();
            fetchReviews();
        }
    }, [user]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/reviews/vendor/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Error fetching vendor reviews:", error);
        }
    };

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : "5.0";

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${API_URL}/bookings/vendor/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (error) {
            console.error("Error fetching vendor bookings:", error);
        }
        setLoading(false);
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await fetch(`${API_URL}/bookings/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchBookings();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const expectedRevenue = bookings
        .filter(b => b.status !== 'CANCELLED' && b.status !== 'REJECTED')
        .reduce((sum, b) => {
            const num = parseInt((b.servicePrice || '').replace(/[^\d]/g, ''), 10);
            return sum + (isNaN(num) ? 0 : num);
        }, 0);

    const pendingBookings = bookings.filter(b => b.status === 'PENDING');

    const handleLogout = () => {
        logout();
        setLocation("/auth");
    };

    return (<div className="bg-gray-100 flex h-screen overflow-hidden w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 via-[#8c71af] to-pink-300 text-white flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 text-2xl font-bold border-b border-white/20 text-center">
          زغروطة للأعمال ✨
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/vendor-dashboard" className="block p-3 rounded-xl bg-white/20 font-bold flex items-center gap-3 shadow-sm border border-white/10">
            <LayoutDashboard size={20}/> الرئيسية
          </Link>
          <Link href="/vendor-services" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
            <Scissors size={20}/> خدماتي
          </Link>
          <Link href="/vendor-bookings" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
            <CalendarCheck size={20}/> الحجوزات
          </Link>
          <Link href="/vendor-messages" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
            <MessageSquare size={20}/> الرسائل
            {unreadMessages > 0 && (
              <span className="mr-auto bg-red-500 text-white text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">{unreadMessages}</span>
            )}
          </Link>
          <Link href="/vendor-reviews" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
            <Star size={20}/> آراء العملاء
          </Link>
          <Link href="/vendor-settings" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
            <Settings size={20}/> الإعدادات
          </Link>
        </nav>
        <div className="p-4 border-t border-white/20">
          <button onClick={handleLogout} className="w-full block p-3 text-center bg-white/10 rounded-xl hover:bg-red-500/80 transition text-sm flex items-center justify-center gap-2 font-bold cursor-pointer">
            <LogOut size={16}/> خروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto w-full h-full pb-12 md:pb-0">
        <VendorHeader onUnreadMessages={setUnreadMessages} />

        <div className="p-4 md:p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-blue-500">
              <p className="text-gray-500 text-sm">إجمالي الحجوزات</p>
              <p className="text-3xl font-bold mt-2">{bookings.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-green-500">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">الأرباح المتوقعة</p>
                <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-md font-bold">بناءً على الحجوزات</span>
              </div>
              <p className="text-3xl font-bold mt-2 text-gradient-primary">
                {expectedRevenue.toLocaleString()} ج.م
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-orange-500">
              <p className="text-gray-500 text-sm">طلبات معلقة</p>
              <p className="text-3xl font-bold mt-2">{bookings.filter(b => b.status === 'PENDING').length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-yellow-500">
              <p className="text-gray-500 text-sm">تقييم المورد</p>
              <div className="flex items-center gap-2 mt-2">
                <Star className="text-yellow-400 fill-yellow-400" size={28} />
                <div>
                  <p className="text-3xl font-bold text-gradient-primary">{averageRating}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{totalReviews} تقييم</p>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout: Recent Orders & Customer Comments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Right Side: Recent Bookings Table (65%) */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 lg:col-span-2">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800">أحدث طلبات الحجز</h3>
                <Link href="/vendor-bookings" className="text-[#8c71af] text-sm hover:underline font-semibold transition">عرض الكل</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse min-w-[500px]">
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
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500 font-bold">جاري تحميل الطلبات...</td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500 font-bold">لا توجد طلبات حجز حالياً</td>
                      </tr>
                    ) : (
                      bookings.slice(0, 5).map(booking => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="p-4 font-semibold">{booking.customer?.fullName || 'عميل'}</td>
                          <td className="p-4 text-gray-600">{booking.serviceName}</td>
                          <td className="p-4 text-gray-600">{booking.bookingDate}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                              booking.status === 'CANCELLED' || booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.status === 'CONFIRMED' ? 'مؤكد' : booking.status === 'CANCELLED' ? 'ملغي من العميل' : booking.status === 'REJECTED' ? 'مرفوض' : 'قيد الانتظار'}
                            </span>
                          </td>
                          <td className="p-4">
                            {booking.status === 'PENDING' ? (
                              <>
                                <button onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')} className="text-green-600 hover:font-bold ml-2 cursor-pointer">قبول</button> / 
                                <button onClick={() => handleUpdateStatus(booking.id, 'REJECTED')} className="text-red-600 hover:font-bold mr-2 cursor-pointer">رفض</button>
                              </>
                            ) : (
                              <button onClick={() => { setSelectedBooking(booking); setIsDetailsModalOpen(true); }} className="text-blue-600 hover:underline cursor-pointer">عرض التفاصيل</button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Left Side: Recent Reviews Widget (35%) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-lg text-gray-800">آخر آراء وتقييمات العرايس 💬</h3>
              </div>
              
              <div className="p-6 flex-1 space-y-4 max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-10 text-gray-400 font-bold text-sm">جاري تحميل الآراء...</div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p className="font-bold text-sm">لا توجد تعليقات حتى الآن</p>
                    <p className="text-xs mt-1">التقييمات الجديدة هتظهر هنا.</p>
                  </div>
                ) : (
                  reviews.slice(0, 3).map(review => (
                    <div key={review.id} className="p-3.5 bg-gray-50 rounded-xl space-y-2 border border-gray-100 hover:border-[#8c71af]/30 transition duration-300">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-700 text-xs">{review.user?.fullName}</span>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={i < review.rating ? "fill-current" : "text-gray-200"} size={12} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold truncate">🏷️ {review.service?.name}</p>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-2">
                        {review.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
                <Link href="/vendor-reviews" className="inline-block bg-gradient-primary text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md hover:opacity-90 transition">
                  عرض جميع الآراء
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Booking Details Modal */}
      {isDetailsModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">تفاصيل الحجز</h3>
              <button onClick={() => {setIsDetailsModalOpen(false); setSelectedBooking(null);}} className="text-gray-400 hover:text-red-500 transition cursor-pointer text-xl">✕</button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 text-right">
              
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#8c71af] mb-3 flex items-center gap-2"><span className="text-lg">👤</span> بيانات العميل</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">الاسم:</span> <span className="font-bold text-gray-800">{selectedBooking.customer?.fullName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">الموبايل:</span> <span className="font-bold text-gray-800" dir="ltr">{selectedBooking.customer?.phone}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">الإيميل:</span> <span className="font-bold text-gray-800">{selectedBooking.customer?.email}</span></div>
                </div>
              </div>

              {/* Service Info */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#8c71af] mb-3 flex items-center gap-2"><span className="text-lg">📋</span> تفاصيل الخدمة</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">الخدمة المطلوبة:</span> <span className="font-bold text-gray-800">{selectedBooking.serviceName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">سعر الخدمة:</span> <span className="font-bold text-gradient-primary">{selectedBooking.servicePrice}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">تاريخ المناسبة:</span> <span className="font-bold text-gray-800">{selectedBooking.bookingDate}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">طريقة الدفع:</span> <span className="font-bold text-gray-800">{selectedBooking.paymentMethod === 'CASH' ? 'دفع نقدي' : selectedBooking.paymentMethod}</span></div>
                </div>
              </div>

              {/* Status Info */}
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-gray-500 font-bold text-sm">حالة الحجز:</span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                    selectedBooking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    selectedBooking.status === 'CANCELLED' || selectedBooking.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedBooking.status === 'CONFIRMED' ? 'مؤكد ✅' : selectedBooking.status === 'CANCELLED' ? 'ملغي من العميل ❌' : selectedBooking.status === 'REJECTED' ? 'مرفوض ❌' : 'قيد الانتظار ⏳'}
                </span>
              </div>
              
              <div className="text-center pt-2">
                 <button onClick={() => {setIsDetailsModalOpen(false); setSelectedBooking(null);}} className="bg-gradient-primary text-white px-8 py-2.5 rounded-xl font-bold shadow-md hover:opacity-90 transition w-full">
                    إغلاق التفاصيل
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav for Dashboard */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-gradient-primary text-white z-50 px-4 py-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <a href="#" className="flex flex-col items-center p-2 text-white bg-white/20 rounded-lg">
          <LayoutDashboard size={20}/>
        </a>
        <Link href="/vendor-services" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
          <Scissors size={20}/>
        </Link>
        <Link href="/vendor-bookings" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
          <CalendarCheck size={20}/>
        </Link>
        <Link href="/vendor-messages" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
          <MessageSquare size={20}/>
        </Link>
        <Link href="/vendor-reviews" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
          <Star size={20}/>
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center p-2 text-white/70 hover:text-red-300 transition cursor-pointer">
          <LogOut size={20}/>
        </button>
      </div>
    </div>);
}
