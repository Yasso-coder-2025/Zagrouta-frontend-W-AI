import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Scissors, CalendarCheck, MessageSquare, Settings, LogOut, Star, ChevronRight, ChevronLeft, Calendar } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { API_URL } from "../config";
import VendorHeader from "../components/layout/VendorHeader";

export default function VendorBookings() {
    const { user, logout } = useAuth();
    const [, setLocation] = useLocation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);

    const [viewMode, setViewMode] = useState("table");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const monthsArabic = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];

    const daysOfWeek = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

    const handlePrevMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getCalendarCells = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      // JS Sunday is 0. Saturday is index 0 in daysOfWeek.
      // So Sunday -> 1, Monday -> 2, ..., Saturday -> 0.
      const firstDayIndex = (firstDay.getDay() + 1) % 7; 
      const totalDays = new Date(year, month + 1, 0).getDate();
      
      const cells = [];
      for (let i = 0; i < firstDayIndex; i++) {
        cells.push(null);
      }
      for (let day = 1; day <= totalDays; day++) {
        cells.push(day);
      }
      return cells;
    };

    const getBookingsForDate = (dayNum) => {
      if (!dayNum) return [];
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(dayNum).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      return bookings.filter(b => b.bookingDate === dateString);
    };

    const cells = getCalendarCells();

    useEffect(() => {
        if (user && user.role === 'VENDOR') {
            fetchBookings();
        }
    }, [user]);

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
          <Link href="/vendor-dashboard" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
            <LayoutDashboard size={20}/> الرئيسية
          </Link>
          <Link href="/vendor-services" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
            <Scissors size={20}/> خدماتي
          </Link>
          <Link href="/vendor-bookings" className="block p-3 rounded-xl bg-white/20 font-bold flex items-center gap-3 shadow-sm border border-white/10">
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
        <VendorHeader title="إدارة الحجوزات" onUnreadMessages={setUnreadMessages} />

        <div className="p-4 md:p-8 space-y-8" dir="rtl">

          {/* Header & Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-800">إدارة الحجوزات 📋</h2>
              <p className="text-xs text-gray-400 mt-1">تتبعي مواعيد حجز العرايس لخدماتك وقومي بتأكيدها أو رفضها.</p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="bg-white p-1 rounded-xl border border-gray-100 flex gap-1 shadow-sm w-full sm:w-auto">
              <button
                onClick={() => setViewMode("table")}
                type="button"
                className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer border-none outline-none ${
                  viewMode === "table" 
                    ? "bg-[#8c71af] text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-800 bg-transparent"
                }`}
              >
                📋 جدول الحجوزات
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                type="button"
                className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer border-none outline-none ${
                  viewMode === "calendar" 
                    ? "bg-[#8c71af] text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-800 bg-transparent"
                }`}
              >
                📅 تقويم الحجوزات
              </button>
            </div>
          </div>

          {/* Table View */}
          {viewMode === "table" && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-in fade-in duration-300">
              <div className="p-6 border-b">
                <h3 className="font-bold text-lg text-gray-800">جدول الطلبات والحجوزات</h3>
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
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500 font-bold">جاري تحميل الطلبات...</td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500 font-bold">لا توجد طلبات حجز حالياً</td>
                      </tr>
                    ) : (
                      bookings.map(booking => (
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
                                <button onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')} className="text-green-600 hover:font-bold ml-2 cursor-pointer bg-transparent border-none outline-none">قبول</button> / 
                                <button onClick={() => handleUpdateStatus(booking.id, 'REJECTED')} className="text-red-600 hover:font-bold mr-2 cursor-pointer bg-transparent border-none outline-none">رفض</button>
                              </>
                            ) : (
                              <button onClick={() => { setSelectedBooking(booking); setIsDetailsModalOpen(true); }} className="text-blue-600 hover:underline cursor-pointer bg-transparent border-none outline-none">عرض التفاصيل</button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Calendar View Container */}
          {viewMode === "calendar" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 animate-in fade-in duration-300">
              
              {/* Calendar Controls */}
              <div className="flex justify-between items-center" dir="rtl">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-xl text-gray-800">
                    {monthsArabic[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrevMonth}
                    type="button"
                    className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer text-gray-600 bg-transparent outline-none"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button 
                    onClick={() => setCurrentDate(new Date())}
                    type="button"
                    className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer text-xs font-bold text-gray-500 bg-transparent outline-none"
                  >
                    اليوم
                  </button>
                  <button 
                    onClick={handleNextMonth}
                    type="button"
                    className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer text-gray-600 bg-transparent outline-none"
                  >
                    <ChevronLeft size={18} />
                  </button>
                </div>
              </div>

              {/* Grid Header (Days of week) */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-400 pb-2 border-b" dir="rtl">
                {daysOfWeek.map(day => (
                  <div key={day} className="py-2">{day}</div>
                ))}
              </div>

              {/* Grid Days */}
              <div className="grid grid-cols-7 gap-2" dir="rtl">
                {cells.map((day, idx) => {
                  const dayBookings = getBookingsForDate(day);
                  const isSelected = day && selectedDate && 
                    selectedDate.getDate() === day && 
                    selectedDate.getMonth() === currentDate.getMonth() && 
                    selectedDate.getFullYear() === currentDate.getFullYear();
                  const isToday = day && 
                    new Date().getDate() === day && 
                    new Date().getMonth() === currentDate.getMonth() && 
                    new Date().getFullYear() === currentDate.getFullYear();

                  return (
                    <div 
                      key={idx}
                      onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                      className={`min-h-[90px] md:min-h-[120px] p-2 border rounded-xl flex flex-col justify-between transition ${
                        day 
                          ? "bg-white border-gray-100 hover:border-[#8c71af]/50 cursor-pointer" 
                          : "bg-gray-50/50 border-transparent text-transparent select-none pointer-events-none"
                      } ${isSelected ? "ring-2 ring-[#8c71af] border-[#8c71af]" : ""} ${
                        isToday ? "bg-blue-50/30 border-blue-200" : ""
                      }`}
                    >
                      {/* Day Number */}
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold ${
                          isToday ? "bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-sm" : "text-gray-700"
                        }`}>
                          {day}
                        </span>
                        {/* Mobile indicator dots */}
                        {dayBookings.length > 0 && (
                          <div className="flex gap-1 md:hidden">
                            {dayBookings.slice(0, 3).map((b) => (
                              <span 
                                key={b.id} 
                                className={`w-1.5 h-1.5 rounded-full ${
                                  b.status === 'CONFIRMED' ? 'bg-green-500' :
                                  b.status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} 
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Desktop Bookings list inside cell */}
                      <div className="hidden md:flex flex-col gap-1 mt-2 overflow-y-auto max-h-[70px] pr-1">
                        {dayBookings.map((b) => (
                          <div 
                            key={b.id}
                            onClick={(e) => { e.stopPropagation(); setSelectedBooking(b); setIsDetailsModalOpen(true); }}
                            className={`p-1.5 rounded-lg text-[10px] font-bold truncate transition hover:opacity-90 ${
                              b.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-r-2 border-green-500' :
                              b.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-r-2 border-yellow-500' :
                              'bg-red-50 text-red-700 border-r-2 border-red-500'
                            }`}
                            title={`${b.customer?.fullName} - ${b.serviceName}`}
                          >
                            {b.customer?.fullName?.[0] || 'ع'}: {b.serviceName}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile details panel below calendar */}
              {selectedDate && (
                <div className="md:hidden border-t pt-4 mt-4 space-y-3" dir="rtl">
                  <h4 className="font-extrabold text-sm text-[#8c71af]">
                    حجوزات يوم {selectedDate.getDate()} {monthsArabic[selectedDate.getMonth()]} 🗓️
                  </h4>
                  <div className="space-y-2">
                    {(() => {
                      const dayBookings = bookings.filter(b => {
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        const day = String(selectedDate.getDate()).padStart(2, '0');
                        return b.bookingDate === `${year}-${month}-${day}`;
                      });
                      
                      if (dayBookings.length === 0) {
                        return <p className="text-xs text-gray-400 text-center py-4 font-semibold">لا توجد حجوزات في هذا اليوم.</p>;
                      }
                      
                      return dayBookings.map(b => (
                        <div 
                          key={b.id}
                          onClick={() => { setSelectedBooking(b); setIsDetailsModalOpen(true); }}
                          className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center text-xs"
                        >
                          <div>
                            <h5 className="font-bold text-gray-800">{b.customer?.fullName}</h5>
                            <p className="text-gray-500 text-[10px] mt-0.5">{b.serviceName}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {b.status === 'CONFIRMED' ? 'مؤكد' : b.status === 'PENDING' ? 'انتظار' : 'ملغي'}
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

            </div>
          )}
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
                  <div className="flex justify-between">
                    <span className="text-gray-500">طريقة الدفع:</span> 
                    <span className="font-bold text-gray-800">
                      {selectedBooking.paymentMethod === 'CASH' && 'دفع نقدي (في المقر) 💵'}
                      {selectedBooking.paymentMethod === 'INSTAPAY' && 'انستا باي (InstaPay) 📱'}
                      {selectedBooking.paymentMethod === 'VODAFONE_CASH' && 'فودافون كاش (Vodafone Cash) 🔴'}
                    </span>
                  </div>
                  {selectedBooking.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">حساب/رقم المحول:</span> 
                      <span className="font-bold text-gray-800">{selectedBooking.transactionId}</span>
                    </div>
                  )}
                  {selectedBooking.paymentReceiptUrl && (
                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      <span className="text-gray-500 block text-xs">إيصال التحويل (اضغط للتكبير):</span>
                      <a 
                        href={selectedBooking.paymentReceiptUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:opacity-95 transition bg-white"
                      >
                        <img 
                          src={selectedBooking.paymentReceiptUrl} 
                          className="w-full max-h-56 object-contain" 
                          alt="إيصال التحويل" 
                        />
                      </a>
                    </div>
                  )}
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
        <Link href="/vendor-dashboard" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
          <LayoutDashboard size={20}/>
        </Link>
        <Link href="/vendor-services" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
          <Scissors size={20}/>
        </Link>
        <Link href="/vendor-bookings" className="flex flex-col items-center p-2 text-white bg-white/20 rounded-lg">
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
