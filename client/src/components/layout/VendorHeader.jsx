import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Bell, X, MessageSquare } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { API_URL } from "../../config";

/**
 * VendorHeader — شريط الهيدر المشترك لكل صفحات الـ vendor dashboard
 * Props:
 *   title: string
 *   extraContent: ReactNode
 *   onUnreadMessages: (count: number) => void  ← callback للصفحات عشان تعرض badge على الـ sidebar
 */
export default function VendorHeader({ title, extraContent, onUnreadMessages }) {
  const { user } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [unreadMsgs, setUnreadMsgs] = useState([]);   // آخر محادثات فيها رسائل جديدة
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const notifRef = useRef(null);

  // ===== جيب الحجوزات المعلقة =====
  useEffect(() => {
    if (!user?.id) return;
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API_URL}/bookings/vendor/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setPendingBookings(data.filter((b) => b.status === "PENDING"));
        }
      } catch {}
    };
    fetch_();
    const id = setInterval(fetch_, 15000);
    return () => clearInterval(id);
  }, [user]);

  // ===== جيب الرسائل غير المقروءة (كل 5 ثواني) =====
  useEffect(() => {
    if (!user?.id) return;
    const fetchMsgs = async () => {
      try {
        // عدد الرسائل الكلي
        const countRes = await fetch(`${API_URL}/messages/unread-count/${user.id}`);
        if (countRes.ok) {
          const { unreadCount } = await countRes.json();
          setUnreadMsgCount(unreadCount || 0);
          if (onUnreadMessages) onUnreadMessages(unreadCount || 0);
        }
        // قائمة المحادثات عشان نعرض الأسماء في الـ dropdown
        const convRes = await fetch(`${API_URL}/messages/conversations/${user.id}`);
        if (convRes.ok) {
          const convs = await convRes.json();
          setUnreadMsgs(convs.filter((c) => (c.unreadCount || 0) > 0));
        }
      } catch {}
    };
    fetchMsgs();
    const id = setInterval(fetchMsgs, 5000);
    return () => clearInterval(id);
  }, [user]);

  // ===== إغلاق الـ dropdown لما تضغط برا =====
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setIsNotificationsOpen(false);
    };
    if (isNotificationsOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isNotificationsOpen]);

  const initials = user?.fullName
    ? user.fullName.trim().split(" ").slice(0, 2).map((w) => w[0]).join("")
    : "V";

  const totalNotif = pendingBookings.length + unreadMsgCount;

  return (
    <header className="bg-white shadow-sm px-4 md:px-8 py-3 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {extraContent}
        <h2 className="text-lg font-bold text-gray-700">
          {title || <>أهلاً، <span className="text-gradient-primary">{user?.fullName?.split(" ")[0] || "مورد"}</span> 👋</>}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen((v) => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-[#8c71af] hover:bg-[#8c71af]/5 transition cursor-pointer"
          >
            <Bell size={20} />
            {totalNotif > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                {totalNotif}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95">
              {/* Dropdown Header */}
              <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <span className="font-bold text-sm text-gray-700">الإشعارات</span>
                <div className="flex items-center gap-2">
                  {totalNotif > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {totalNotif} جديد
                    </span>
                  )}
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-gray-400 hover:text-red-500 transition">
                    <X size={15} />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {totalNotif === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-3xl mb-2">🔔</div>
                    <p className="text-sm text-gray-500">لا توجد إشعارات جديدة</p>
                  </div>
                ) : (
                  <>
                    {/* رسائل جديدة */}
                    {unreadMsgs.length > 0 && (
                      <>
                        <div className="px-3 py-1.5 bg-blue-50 text-xs font-bold text-blue-600 flex items-center gap-1">
                          <MessageSquare size={12} /> رسائل جديدة
                        </div>
                        {unreadMsgs.map((conv) => (
                          <Link
                            key={conv.userId}
                            href="/vendor-messages"
                            onClick={() => setIsNotificationsOpen(false)}
                            className="block p-3 border-b border-gray-50 hover:bg-[#8c71af]/5 transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-[#8c71af] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {conv.name?.[0] || "؟"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-800">{conv.name}</p>
                                <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                              </div>
                              <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                                {conv.unreadCount} جديد
                              </span>
                            </div>
                          </Link>
                        ))}
                      </>
                    )}

                    {/* حجوزات معلقة */}
                    {pendingBookings.length > 0 && (
                      <>
                        <div className="px-3 py-1.5 bg-yellow-50 text-xs font-bold text-yellow-700 flex items-center gap-1">
                          📅 حجوزات معلقة
                        </div>
                        {pendingBookings.map((b) => (
                          <Link
                            key={b.id}
                            href="/vendor-bookings"
                            onClick={() => setIsNotificationsOpen(false)}
                            className="block p-3 border-b border-gray-50 hover:bg-[#8c71af]/5 transition"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8c71af] to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                                {b.customer?.fullName?.[0] || "؟"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-800">حجز جديد من {b.customer?.fullName || "عميل"}</p>
                                <p className="text-xs text-gray-500 truncate mt-0.5">{b.serviceName}</p>
                                <p className="text-[10px] text-[#8c71af] font-bold mt-1">📅 {b.bookingDate}</p>
                              </div>
                              <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0">معلق</span>
                            </div>
                          </Link>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>

              {totalNotif > 0 && (
                <div className="p-2 border-t border-gray-100 flex gap-2">
                  {unreadMsgCount > 0 && (
                    <Link href="/vendor-messages" onClick={() => setIsNotificationsOpen(false)}
                      className="flex-1 text-center text-xs text-blue-600 font-bold hover:underline py-1">
                      عرض الرسائل ←
                    </Link>
                  )}
                  {pendingBookings.length > 0 && (
                    <Link href="/vendor-bookings" onClick={() => setIsNotificationsOpen(false)}
                      className="flex-1 text-center text-xs text-[#8c71af] font-bold hover:underline py-1">
                      عرض الحجوزات ←
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-800 via-[#8c71af] to-pink-400 flex items-center justify-center text-white text-sm font-bold shadow-sm select-none">
          {initials}
        </div>
      </div>
    </header>
  );
}
