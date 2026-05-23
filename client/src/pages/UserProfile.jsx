import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useSearch } from "wouter";
import {
  Camera,
  Edit2,
  LogOut,
  CheckCircle,
  Clock,
  Heart,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Settings,
  MessageSquare,
  Send,
  Search,
  Wallet,
  Plus,
} from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { CustomSelect } from "../components/ui/CustomSelect";
import { API_URL } from "../config";
import { useFavorites } from "../hooks/use-favorites";
import { useToast } from "@/hooks/use-toast";
import { SERVICES_DATA } from "../lib/data";

const DEFAULT_CHECKLIST = [
  { id: "planner", title: "تحديد ميزانية الفرح وموعده التقريبي", category: "planner", desc: "ابدئي بتحديد ميزانيتك الكلية وموعد الزفاف لترتيب باقي الخطوات.", link: "/planner", icon: "💍" },
  { id: "venue", title: "حجز قاعة الأفراح المناسبة", category: "venue", desc: "اختاري القاعة أو الفيلا المفتوحة المناسبة لعدد الضيوف وميزانيتك.", link: "/services?category=venue", icon: "🏨" },
  { id: "dress", title: "اختيار فستان الزفاف", category: "dress", desc: "تصفحي الأتيليهات لتجربة فستان أحلامك مبكراً.", link: "/services?category=dress", icon: "👗" },
  { id: "makeup", title: "حجز الميك أب آرتيست", category: "makeup", desc: "احجزي خبيرة التجميل المفضلة لضمان توفرها في يومك المميز.", link: "/services?category=makeup", icon: "💄" },
  { id: "photography", title: "الاتفاق مع مصور محترف", category: "photography", desc: "احجزي جلسة تصوير لتسجيل لحظات فرحتك العمرية.", link: "/services?category=photography", icon: "📸" },
];

export default function UserProfile() {
  const { user, login, logout } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bookings");

  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const stored = localStorage.getItem("zaghrouta_checklist_completed");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      try {
        localStorage.setItem("zaghrouta_checklist_completed", JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const [organizerTab, setOrganizerTab] = useState("checklist");
  const [totalBudget, setTotalBudget] = useState(() => {
    try {
      const stored = localStorage.getItem("zaghrouta_total_budget");
      return stored ? parseInt(stored, 10) : 80000;
    } catch { return 80000; }
  });
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(totalBudget.toString());

  const [customExpenses, setCustomExpenses] = useState(() => {
    try {
      const stored = localStorage.getItem("zaghrouta_custom_expenses");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpenseName.trim() || !newExpenseAmount.trim()) return;
    const amount = parseInt(newExpenseAmount, 10);
    if (isNaN(amount)) return;

    const newExpense = {
      id: Date.now().toString(),
      name: newExpenseName.trim(),
      amount
    };

    setCustomExpenses((prev) => {
      const next = [...prev, newExpense];
      try {
        localStorage.setItem("zaghrouta_custom_expenses", JSON.stringify(next));
      } catch {}
      return next;
    });

    setNewExpenseName("");
    setNewExpenseAmount("");
  };

  const handleRemoveExpense = (id) => {
    setCustomExpenses((prev) => {
      const next = prev.filter((exp) => exp.id !== id);
      try {
        localStorage.setItem("zaghrouta_custom_expenses", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const val = parseInt(budgetInput, 10);
    if (isNaN(val) || val <= 0) return;
    setTotalBudget(val);
    try {
      localStorage.setItem("zaghrouta_total_budget", val.toString());
    } catch {}
    setIsEditingBudget(false);
  };

  // افتح التاب الصح لو في URL ?tab=
  useEffect(() => {
    const params = new URLSearchParams(search);
    let tab = params.get("tab");
    if (tab === "checklist" || tab === "budget") {
      setOrganizerTab(tab);
      tab = "organizer";
    }
    if (tab) setActiveTab(tab);
  }, [search]);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [deletedNotifications, setDeletedNotifications] = useState(new Set());

  const [editName, setEditName] = useState(user?.fullName || "");
  const [editPhone, setEditPhone] = useState(
    user?.phone?.replace("+20", "") || "",
  );
  const [editGender, setEditGender] = useState(user?.gender || "MALE");
  const [currentPassword, setCurrentPassword] = useState("");
  const [updateStatus, setUpdateStatus] = useState({ type: "", message: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [seenRejections, setSeenRejections] = useState(() => {
    try {
      const stored = localStorage.getItem("zaghrouta_seen_rejections");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  // ===== Messages State =====
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [msgSearch, setMsgSearch] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const chatContainerRef = useRef(null);
  const msgPollRef = useRef(null);

  // ===== Helpers =====
  const MSG_COLORS = [
    "from-pink-400 to-purple-500",
    "from-blue-400 to-cyan-500",
    "from-emerald-400 to-teal-500",
    "from-orange-400 to-red-400",
  ];
  const getMsgColor = (name = "") => MSG_COLORS[name.charCodeAt(0) % MSG_COLORS.length];
  const formatMsgTime = (sentAt) => {
    if (!sentAt) return "";
    const date = new Date(sentAt.replace(" ", "T"));
    const now = new Date();
    const diffDays = Math.floor((now - date) / 86400000);
    if (diffDays === 0) return date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "أمس";
    return date.toLocaleDateString("ar-EG", { weekday: "long" });
  };

  useEffect(() => {
    if (user && activeTab === "bookings") fetchBookings();
    if (user && activeTab === "messages") fetchConversations();
  }, [user, activeTab]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch(`${API_URL}/bookings/customer/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
        generateNotifications(data);

        // Check for new rejections and show toast notifications
        data.forEach((booking) => {
          if (
            booking.status === "REJECTED" &&
            !seenRejections.has(booking.id)
          ) {
            toast({
              title: "تم رفض حجزك 😞",
              description: `للأسف، المورد قام برفض حجزك للخدمة: ${booking.serviceName}. يمكنك البحث عن مورد آخر للخدمة نفسها.`,
              variant: "destructive",
            });
            setSeenRejections((prev) => {
              const next = new Set([...prev, booking.id]);
              try {
                localStorage.setItem("zaghrouta_seen_rejections", JSON.stringify([...next]));
              } catch {}
              return next;
            });
          }
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setLoadingBookings(false);
  };

  // ===== Messages API Calls =====
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoadingConvs(true);
    try {
      const res = await fetch(`${API_URL}/messages/conversations/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        const total = data.reduce((s, c) => s + (c.unreadCount || 0), 0);
        setUnreadMsgCount(total);
      }
    } catch (err) { console.error(err); }
    setLoadingConvs(false);
  }, [user]);

  const fetchChatMessages = useCallback(async (otherUserId, skipLoading = false) => {
    if (!user) return;
    if (!skipLoading) setLoadingMsgs(true);
    try {
      const res = await fetch(`${API_URL}/messages/conversation?userA=${user.id}&userB=${otherUserId}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
        setConversations(prev => prev.map(c => c.userId === otherUserId ? { ...c, unreadCount: 0 } : c));
        setUnreadMsgCount(prev => Math.max(0, prev - (conversations.find(c => c.userId === otherUserId)?.unreadCount || 0)));
      }
    } catch (err) { console.error(err); }
    setLoadingMsgs(false);
  }, [user, conversations]);

  const handleSelectConv = async (conv) => {
    setSelectedConv(conv);
    setChatMessages([]);
    await fetchChatMessages(conv.userId);
  };

  const handleSendMsg = async () => {
    if (!newMessage.trim() || !selectedConv || sendingMsg) return;
    setSendingMsg(true);
    try {
      const res = await fetch(`${API_URL}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: user.id, receiverId: selectedConv.userId, content: newMessage.trim() }),
      });
      if (res.ok) {
        setNewMessage("");
        await fetchChatMessages(selectedConv.userId);
        fetchConversations();
      }
    } catch (err) { console.error(err); }
    setSendingMsg(false);
  };

  // Polling للرسائل
  useEffect(() => {
    if (activeTab !== "messages") return;
    fetchConversations();
    msgPollRef.current = setInterval(fetchConversations, 8000);
    return () => clearInterval(msgPollRef.current);
  }, [activeTab, fetchConversations]);

  useEffect(() => {
    if (!selectedConv || activeTab !== "messages") return;
    const interval = setInterval(() => fetchChatMessages(selectedConv.userId, true), 3000);
    return () => clearInterval(interval);
  }, [selectedConv, activeTab, fetchChatMessages]);

  useEffect(() => {
    if (chatContainerRef.current && chatMessages.length > 0 && selectedConv) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, selectedConv]);

  const generateNotifications = (bookingsList) => {
    const newNotifications = [];
    const now = new Date();

    bookingsList.forEach((booking) => {
      let message = "";
      let icon = "📋";
      let color = "blue";

      if (booking.status === "CONFIRMED") {
        message = `تم قبول حجزك للخدمة: ${booking.serviceName} ✅`;
        icon = "✅";
        color = "green";
      } else if (booking.status === "REJECTED") {
        message = `للأسف، تم رفض حجزك للخدمة: ${booking.serviceName} 😞`;
        icon = "❌";
        color = "red";
      } else if (booking.status === "PENDING") {
        message = `حجزك للخدمة ${booking.serviceName} قيد انتظار الموافقة`;
        icon = "⏳";
        color = "yellow";
      } else if (booking.status === "CANCELLED") {
        message = `تم إلغاء حجزك للخدمة: ${booking.serviceName}`;
        icon = "❌";
        color = "gray";
      }

      if (message) {
        newNotifications.push({
          id: booking.id,
          message,
          icon,
          color,
          serviceName: booking.serviceName,
          vendorName: booking.vendorName,
          status: booking.status,
          timestamp: now,
        });
      }
    });

    setNotifications(newNotifications);
  };

  const deleteNotification = (id) => {
    setDeletedNotifications((prev) => new Set([...prev, id]));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setDeletedNotifications(new Set());
  };

  const visibleNotifications = notifications.filter(
    (n) => !deletedNotifications.has(n.id),
  );

  const handleCancelBooking = async (id) => {
    if (!confirm("هل أنت متأكد من إلغاء الحجز؟")) return;
    try {
      const res = await fetch(`${API_URL}/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (res.ok) {
        fetchBookings();
        toast({ title: "تم إلغاء الحجز بنجاح" });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/auth");
  };

  const renderAvatar = (isSmall = false) => {
    if (user?.role === "VENDOR") {
      return (
        <div
          className={`w-full h-full flex items-center justify-center bg-gray-100 ${isSmall ? "text-2xl" : "text-5xl"}`}
        >
          💼
        </div>
      );
    }
    return (
      <img
        src="https://img.pikbest.com/png-images/20240903/minimalist-wedding-silhouette-bride-and-groom-with-floral-details_10786265.png!w700wp"
        className="w-full h-full object-cover bg-gradient-to-br from-blue-50 to-pink-50 p-1"
        alt="Profile"
      />
    );
  };

  const switchTab = (tab) => setActiveTab(tab);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (editPhone.length !== 10) {
      setUpdateStatus({
        type: "error",
        message: "يرجى إدخال رقم هاتف صحيح مكون من 10 أرقام (بدون الصفر).",
      });
      setIsUpdating(false);
      return;
    }

    setIsUpdating(true);
    setUpdateStatus({ type: "", message: "" });

    try {
      const res = await fetch(`${API_URL}/users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          password: currentPassword, // to verify it's the real user
          fullName: editName,
          phone: "+20" + editPhone,
          gender: editGender,
        }),
      });

      const resultText = await res.text();
      if (res.ok) {
        setUpdateStatus({
          type: "success",
          message: "تم حفظ التغييرات بنجاح!",
        });
        // Update local state with new data
        login({
          ...user,
          fullName: editName,
          phone: "+20" + editPhone,
          gender: editGender,
          password: currentPassword,
        });
        setCurrentPassword(""); // clear password field
      } else {
        setUpdateStatus({
          type: "error",
          message: resultText || "كلمة المرور غير صحيحة أو حدث خطأ.",
        });
      }
    } catch (error) {
      setUpdateStatus({
        type: "error",
        message: "حدث خطأ في الاتصال بالخادم.",
      });
    }
    setIsUpdating(false);
  };

  const handleRemoveFavorite = (serviceId) => {
    toggleFavorite(serviceId);
  };
  return (
    <div className="bg-gray-50 min-h-screen pb-20 md:pb-0">
      <header className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-gradient-primary">بروفايلي</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm">
          {renderAvatar(true)}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar (Desktop) */}
          <aside className="hidden md:block col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-gray-100 sticky top-24">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white shadow-sm">
                {renderAvatar(false)}
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {user?.fullName || "عضو زغروطة"}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {user?.role === "VENDOR"
                  ? "مورد خدمات 🤵"
                  : user?.gender === "FEMALE"
                    ? "عروسة 👰"
                    : "عريس 🎩"}
              </p>

              <nav className="space-y-2 text-right mb-4">
                <button
                  onClick={() => switchTab("bookings")}
                  className={`w-full p-3 rounded-xl font-bold flex items-center gap-3 transition ${activeTab === "bookings" ? "bg-gradient-to-br from-blue-50 to-pink-50 text-[#8c71af] border border-border/20" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <Camera size={20} /> حجوزاتي
                </button>
                {user?.role === "CUSTOMER" && (
                  <button
                    onClick={() => switchTab("organizer")}
                    className={`w-full p-3 rounded-xl font-bold flex items-center gap-3 transition ${activeTab === "organizer" ? "bg-gradient-to-br from-blue-50 to-pink-50 text-[#8c71af] border border-border/20" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <CheckCircle size={20} /> منظم الفرح
                  </button>
                )}
                <button
                  onClick={() => switchTab("favorites")}
                  className={`w-full p-3 rounded-xl font-bold flex items-center gap-3 transition ${activeTab === "favorites" ? "bg-gradient-to-br from-blue-50 to-pink-50 text-[#8c71af] border border-border/20" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <Heart size={20} /> المفضلة
                </button>
                <button
                  onClick={() => switchTab("messages")}
                  className={`w-full p-3 rounded-xl font-bold flex items-center gap-3 transition ${activeTab === "messages" ? "bg-gradient-to-br from-blue-50 to-pink-50 text-[#8c71af] border border-border/20" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <MessageSquare size={20} /> رسائلي
                  {unreadMsgCount > 0 && (
                    <span className="mr-auto bg-red-500 text-white text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                      {unreadMsgCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => switchTab("settings")}
                  className={`w-full p-3 rounded-xl font-bold flex items-center gap-3 transition ${activeTab === "settings" ? "bg-gradient-to-br from-blue-50 to-pink-50 text-[#8c71af] border border-border/20" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <Edit2 size={20} /> إعدادات الحساب
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-1 md:col-span-3">
            {/* Bookings Section */}
            {activeTab === "bookings" && (
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 hidden md:block">
                  حجوزاتي الحالية
                </h2>

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
                      {loadingBookings ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="p-8 text-center text-gray-500 font-bold"
                          >
                            جاري تحميل الحجوزات...
                          </td>
                        </tr>
                      ) : bookings.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="p-8 text-center text-gray-500 font-bold"
                          >
                            <div className="text-4xl mb-3">📅</div>
                            مفيش حجوزات لسة
                          </td>
                        </tr>
                      ) : (
                        bookings.map((booking) => (
                          <tr
                            key={booking.id}
                            className="hover:bg-[#8c71af]/5 transition"
                          >
                            <td className="p-4 font-bold">
                              {booking.serviceName}
                            </td>
                            <td className="p-4 text-gray-500">
                              {booking.vendorName}
                            </td>
                            <td className="p-4">{booking.bookingDate}</td>
                            <td className="p-4 font-bold text-gradient-primary">
                              {booking.servicePrice}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  booking.status === "CONFIRMED"
                                    ? "bg-green-100 text-green-700"
                                    : booking.status === "CANCELLED" ||
                                        booking.status === "REJECTED"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {booking.status === "CONFIRMED"
                                  ? "مؤكد ✅"
                                  : booking.status === "CANCELLED"
                                    ? "ملغي من عندك ❌"
                                    : booking.status === "REJECTED"
                                      ? "مرفوض من المورد 😞"
                                      : "قيد الانتظار ⏳"}
                              </span>
                            </td>
                            <td className="p-4">
                              {booking.status === "PENDING" && (
                                <button
                                  onClick={() =>
                                    handleCancelBooking(booking.id)
                                  }
                                  className="text-red-500 hover:underline"
                                >
                                  إلغاء
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {loadingBookings ? (
                    <div className="bg-white p-8 text-center rounded-2xl shadow-sm border border-gray-100 text-gray-500 font-bold">
                      جاري تحميل الحجوزات...
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="bg-white p-8 text-center rounded-2xl shadow-sm border border-gray-100 text-gray-500 font-bold">
                      <div className="text-4xl mb-3">📅</div>
                      مفيش حجوزات لسة
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">
                              {booking.serviceName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {booking.vendorName}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              booking.status === "CONFIRMED"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "CANCELLED" ||
                                    booking.status === "REJECTED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {booking.status === "CONFIRMED"
                              ? "مؤكد ✅"
                              : booking.status === "CANCELLED"
                                ? "ملغي من عندك ❌"
                                : booking.status === "REJECTED"
                                  ? "مرفوض من المورد 😞"
                                  : "قيد الانتظار ⏳"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl">
                          <span>📅 {booking.bookingDate}</span>
                          <span className="font-bold text-gradient-primary">
                            {booking.servicePrice}
                          </span>
                        </div>
                        {booking.status === "PENDING" && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="w-full border border-red-200 text-red-500 py-2 rounded-xl text-sm font-bold hover:bg-red-50"
                          >
                            إلغاء الحجز
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* Favorites Section */}
            {activeTab === "favorites" && (
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 hidden md:block">
                  قائمة المفضلة ❤️
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="text-4xl mb-3">🤍</div>
                      <p className="font-bold">مفيش حاجة في المفضلة لسة</p>
                      <Link
                        href="/services"
                        className="text-[#8c71af] hover:underline text-sm block mt-2"
                      >
                        تصفح الخدمات
                      </Link>
                    </div>
                  ) : (
                    SERVICES_DATA.filter((s) => favorites.includes(s.id)).map(
                      (service) => (
                        <div
                          key={service.id}
                          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 relative group"
                        >
                          <button
                            onClick={() => handleRemoveFavorite(service.id)}
                            className="cursor-pointer absolute top-3 left-3 bg-white/90 p-2 rounded-full text-red-500 shadow-sm z-10 hover:bg-red-50 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="h-40 bg-gray-200 relative">
                            <img
                              src={service.image}
                              className="w-full h-full object-cover"
                              alt={service.name}
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-gray-800">
                              {service.name}
                            </h3>
                            <p className="text-gradient-primary font-bold text-sm mt-1">
                              {service.price}
                            </p>
                            <Link href={`/services/${service.id}`}>
                              <button className="mt-3 w-full bg-gradient-primary text-white py-2 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition cursor-pointer">
                                التفاصيل
                              </button>
                            </Link>
                          </div>
                        </div>
                      ),
                    )
                  )}
                </div>
              </section>
            )}

            {/* Wedding Organizer Hub */}
            {activeTab === "organizer" && user?.role === "CUSTOMER" && (() => {
              const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED");
              const bookingsSpent = confirmedBookings.reduce((sum, b) => {
                const priceNum = parseInt((b.servicePrice || "").replace(/[^\d]/g, ""), 10);
                return sum + (isNaN(priceNum) ? 0 : priceNum);
              }, 0);

              const customSpent = customExpenses.reduce((sum, exp) => sum + exp.amount, 0);
              const totalSpent = bookingsSpent + customSpent;
              const remainingBudget = totalBudget - totalSpent;

              const getCategorySpending = () => {
                const categories = {
                  venue: { name: "القاعة والفيلا 🏨", spent: 0, limitPercent: 50 },
                  dress: { name: "فستان الزفاف 👗", spent: 0, limitPercent: 20 },
                  makeup: { name: "الميك أب آرتيست 💄", spent: 0, limitPercent: 15 },
                  photography: { name: "التصوير والفيديو 📸", spent: 0, limitPercent: 15 },
                };

                confirmedBookings.forEach((b) => {
                  const service = SERVICES_DATA.find((s) => s.id === b.serviceId);
                  const category = service?.category;
                  if (category && categories[category]) {
                    const priceNum = parseInt((b.servicePrice || "").replace(/[^\d]/g, ""), 10);
                    if (!isNaN(priceNum)) {
                      categories[category].spent += priceNum;
                    }
                  }
                });

                return Object.keys(categories).map((key) => ({
                  key,
                  ...categories[key],
                  allocated: (totalBudget * categories[key].limitPercent) / 100,
                }));
              };

              const categorySpending = getCategorySpending();

              return (
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 text-right" dir="rtl">
                  
                  {/* Hub Header & Subtabs */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">منظم زفاف زغروطة 💍</h2>
                      <p className="text-gray-400 text-xs mt-1">خططي لفرحك، تتبعي المهام، واديري ميزانيتك بكل سهولة.</p>
                    </div>
                    
                    {/* Subtabs Buttons */}
                    <div className="bg-gray-100 p-1 rounded-xl flex gap-1 w-full sm:w-auto shadow-inner">
                      <button
                        onClick={() => setOrganizerTab("checklist")}
                        type="button"
                        className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                          organizerTab === "checklist" 
                            ? "bg-white text-[#8c71af] shadow-sm" 
                            : "text-gray-500 hover:text-gray-800 bg-transparent"
                        }`}
                      >
                        📋 قائمة المهام
                      </button>
                      <button
                        onClick={() => setOrganizerTab("budget")}
                        type="button"
                        className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                          organizerTab === "budget" 
                            ? "bg-white text-[#8c71af] shadow-sm" 
                            : "text-gray-500 hover:text-gray-800 bg-transparent"
                        }`}
                      >
                        💰 حاسبة الميزانية
                      </button>
                    </div>
                  </div>

                  {/* RENDER CHECKLIST TAB */}
                  {organizerTab === "checklist" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      {/* Progress Card */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                        <div className="flex justify-between text-sm font-bold text-gray-700">
                          <span>نسبة التجهيز وفرحة العمر:</span>
                          <span className="text-gradient-primary">
                            {Math.round((completedTasks.size / DEFAULT_CHECKLIST.length) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-primary h-full transition-all duration-500 ease-in-out" 
                            style={{ width: `${(completedTasks.size / DEFAULT_CHECKLIST.length) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 font-bold">
                          {completedTasks.size === DEFAULT_CHECKLIST.length 
                            ? "مبروك! جهزتي كل أساسيات فرحك، ربنا يتمملك على خير يا عروسة زغروطة! 🎉❤️" 
                            : "خطوة بخطوة وكل حاجة هترتب مع زغروطة.. كملي باقي المهام ✨"}
                        </p>
                      </div>

                      {/* Checklist items */}
                      <div className="space-y-4">
                        {DEFAULT_CHECKLIST.map((item) => {
                          const isCompleted = completedTasks.has(item.id);
                          return (
                            <div 
                              key={item.id} 
                              className={`bg-white p-5 rounded-2xl shadow-sm border transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                                isCompleted ? "border-purple-300 bg-purple-50/20" : "border-gray-100 hover:shadow-md"
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className="text-3xl p-2 bg-gray-50 rounded-xl flex-shrink-0">
                                  {item.icon}
                                </div>
                                <div>
                                  <h4 className={`font-bold text-base ${isCompleted ? "text-gray-300 line-through" : "text-gray-800"}`}>
                                    {item.title}
                                  </h4>
                                  <p className={`text-xs mt-1 ${isCompleted ? "text-gray-300" : "text-gray-500"}`}>
                                    {item.desc}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                <Link href={item.link}>
                                  <span className="text-xs font-bold text-[#8c71af] hover:text-pink-500 hover:underline transition flex items-center gap-1 cursor-pointer">
                                    {item.id === "planner" ? "ابدئي التخطيط 💍" : "استكشفي الخدمات 👈"}
                                  </span>
                                </Link>

                                {/* Checkbox button */}
                                <button
                                  onClick={() => toggleTask(item.id)}
                                  type="button"
                                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition cursor-pointer ${
                                    isCompleted 
                                      ? "bg-[#8c71af] border-[#8c71af] text-white" 
                                      : "border-gray-200 hover:border-[#8c71af] text-transparent"
                                  }`}
                                >
                                  ✓
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* RENDER BUDGET TAB */}
                  {organizerTab === "budget" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      
                      {/* Budget Overview Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Total Budget Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                          <span className="text-xs font-bold text-gray-500">الميزانية الكلية 💰</span>
                          {isEditingBudget ? (
                            <form onSubmit={handleSaveBudget} className="flex gap-2 mt-2">
                              <input
                                type="number"
                                value={budgetInput}
                                onChange={(e) => setBudgetInput(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#8c71af]"
                                autoFocus
                              />
                              <button type="submit" className="bg-[#8c71af] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm cursor-pointer border-none outline-none">حفظ</button>
                            </form>
                          ) : (
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-2xl font-black text-[#8c71af]">{totalBudget.toLocaleString()} ج.م</span>
                              <button 
                                onClick={() => { setBudgetInput(totalBudget.toString()); setIsEditingBudget(true); }}
                                type="button"
                                className="text-xs font-bold text-gray-400 hover:text-[#8c71af] underline cursor-pointer bg-transparent border-none outline-none"
                              >
                                تعديل
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Total Spent Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                          <span className="text-xs font-bold text-gray-500">المصاريف الفعلية 💸</span>
                          <span className="text-2xl font-black text-orange-500 mt-2">{totalSpent.toLocaleString()} ج.م</span>
                        </div>

                        {/* Remaining Budget Card */}
                        <div className={`bg-white p-5 rounded-2xl shadow-sm border flex flex-col justify-between ${
                          remainingBudget < 0 ? "border-red-200 bg-red-50/20" : "border-gray-100"
                        }`}>
                          <span className="text-xs font-bold text-gray-500">الميزانية المتبقية ⚖️</span>
                          <span className={`text-2xl font-black mt-2 ${remainingBudget < 0 ? "text-red-500 animate-pulse" : "text-green-600"}`}>
                            {remainingBudget.toLocaleString()} ج.م
                          </span>
                        </div>
                      </div>

                      {/* Budget Warning Alert */}
                      {remainingBudget < 0 && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-xs font-bold flex gap-2 items-center">
                          <span>⚠️</span>
                          <span>تنبيه: لقد تخطيت الميزانية الكلية المحددة! حاولي تقليل المصاريف الجانبية.</span>
                        </div>
                      )}

                      {/* Progress Slider */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                        <div className="flex justify-between text-xs font-bold text-gray-500">
                          <span>النسبة المستهلكة من الميزانية:</span>
                          <span>{Math.min(100, Math.round((totalSpent / totalBudget) * 100))}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${totalSpent > totalBudget ? "bg-red-500" : "bg-orange-500"}`} 
                            style={{ width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Allocation Categories */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-bold text-gray-800 text-sm border-b pb-3 mb-2">توزيع الميزانية المقترح والمستهلك 📊</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {categorySpending.map((cat) => {
                            const percentSpent = cat.allocated > 0 ? Math.round((cat.spent / cat.allocated) * 100) : 0;
                            return (
                              <div key={cat.key} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                  <span className="text-gray-700">{cat.name}</span>
                                  <span className="text-gray-400">
                                    {cat.spent.toLocaleString()} / {cat.allocated.toLocaleString()} ج.م
                                  </span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${cat.spent > cat.allocated ? "bg-red-500" : "bg-[#8c71af]"}`} 
                                    style={{ width: `${Math.min(100, percentSpent)}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                                  <span>النسبة المخصصة: {cat.limitPercent}%</span>
                                  <span className={cat.spent > cat.allocated ? "text-red-500" : "text-gray-400"}>
                                    {percentSpent}% مستهلك
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Left: Custom Expenses Management */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-gray-800 text-sm border-b pb-3 mb-4">إضافة مصاريف أخرى (خارج الموقع) 📝</h3>
                            
                            {/* Form */}
                            <form onSubmit={handleAddExpense} className="flex gap-2 mb-4">
                              <input
                                required
                                type="text"
                                placeholder="اسم المصروف (مثال: الورد)"
                                value={newExpenseName}
                                onChange={e => setNewExpenseName(e.target.value)}
                                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#8c71af]"
                              />
                              <input
                                required
                                type="number"
                                placeholder="المبلغ (جنيه)"
                                value={newExpenseAmount}
                                onChange={e => setNewExpenseAmount(e.target.value)}
                                className="w-24 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#8c71af]"
                              />
                              <button
                                type="submit"
                                className="bg-gradient-primary text-white p-2 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer shadow-sm border-none"
                              >
                                <Plus size={16} />
                              </button>
                            </form>

                            {/* List of Custom Expenses */}
                            <div className="space-y-2 max-h-48 overflow-y-auto pl-1">
                              {customExpenses.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-6 font-bold">لا توجد مصاريف مخصصة مضافة حالياً.</p>
                              ) : (
                                customExpenses.map((exp) => (
                                  <div key={exp.id} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                                    <span className="font-bold text-gray-700">{exp.name}</span>
                                    <div className="flex items-center gap-3">
                                      <span className="font-black text-orange-500">{exp.amount.toLocaleString()} ج.م</span>
                                      <button
                                        onClick={() => handleRemoveExpense(exp.id)}
                                        type="button"
                                        className="text-gray-400 hover:text-red-500 cursor-pointer font-bold bg-transparent border-none outline-none"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Confirmed bookings lists */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-gray-800 text-sm border-b pb-3 mb-4">تفاصيل الحجوزات المدفوعة (داخل الموقع) 💳</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto pl-1">
                              {confirmedBookings.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-6 font-bold">لا توجد حجوزات مؤكدة لجمع تكاليفها بعد.</p>
                              ) : (
                                confirmedBookings.map((booking) => (
                                  <div key={booking.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center text-xs">
                                    <div>
                                      <h5 className="font-bold text-gray-800">{booking.serviceName}</h5>
                                      <p className="text-[10px] text-gray-400 mt-0.5">{booking.vendorName}</p>
                                    </div>
                                    <span className="font-black text-gradient-primary">{booking.servicePrice}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                </section>
              );
            })()}

            {/* Settings Section */}
            {activeTab === "settings" && (
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 hidden md:block">
                  تعديل الملف الشخصي ⚙️
                </h2>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  {updateStatus.message && (
                    <div
                      className={`mb-4 p-3 rounded-xl text-sm font-bold ${updateStatus.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {updateStatus.message}
                    </div>
                  )}
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        الاسم بالكامل
                      </label>
                      <input
                        required
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af] focus: outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        رقم الموبايل
                      </label>
                      <div
                        className="flex rounded-xl bg-gray-50 border border-gray-200 focus-within:ring-2 focus-within:ring-[#8c71af] focus-within: overflow-hidden transition"
                        dir="ltr"
                      >
                        <div className="p-3 bg-gray-200 text-gray-700 font-bold border-r border-gray-300 flex items-center justify-center">
                          +20
                        </div>
                        <input
                          type="tel"
                          required
                          value={editPhone}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            if (val.startsWith("0")) val = val.substring(1);
                            if (val.length > 10) val = val.substring(0, 10);
                            setEditPhone(val);
                          }}
                          placeholder="1xxxxxxxxx"
                          className="w-full p-3 bg-transparent outline-none text-left"
                        />
                      </div>
                    </div>
                    {user?.role === "CUSTOMER" && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          النوع
                        </label>
                        <CustomSelect
                          value={editGender}
                          onChange={(e) => setEditGender(e.target.value)}
                          options={[
                            { value: "MALE", label: "ذكر" },
                            { value: "FEMALE", label: "أنثى" },
                          ]}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#8c71af] focus:ring-2 focus:ring-[#8c71af] font-bold text-gray-700 hover:border-[#8c71af] transition"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          كلمة المرور الحالية (لتأكيد هويتك)
                        </label>
                        <Link href="/auth">
                          <span className="text-xs text-[#8c71af] hover:text-pink-500 hover:underline cursor-pointer transition">
                            نسيت كلمة السر؟
                          </span>
                        </Link>
                      </div>
                      <input
                        required
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af] focus: outline-none transition"
                      />
                    </div>
                    <div className="pt-4">
                      <button
                        disabled={isUpdating}
                        type="submit"
                        className="w-full md:w-auto px-8 py-3 bg-gradient-primary text-white rounded-xl font-bold shadow-lg hover:opacity-90 hover:shadow-xl transform hover:-translate-y-0.5 transition disabled:opacity-50"
                      >
                        {isUpdating ? "جاري الحفظ..." : "حفظ التغييرات"}
                      </button>
                    </div>
                  </form>
                  {/* Mobile-only Logout button inside settings for customer */}
                  {user?.role === "CUSTOMER" && (
                    <div className="mt-8 pt-6 border-t border-gray-100 md:hidden">
                      <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold border border-red-100 hover:bg-red-100 transition flex items-center justify-center gap-2 cursor-pointer bg-transparent border-none"
                      >
                        <LogOut size={18} /> تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}
            {/* Messages Section */}
            {activeTab === "messages" && (
              <section className="animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 hidden md:block">رسائلي 💬</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: '520px' }}>
                  <div className="flex h-full">

                    {/* Conversations List */}
                    <div className={`w-full md:w-72 border-l border-gray-100 flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
                      <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                          <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                          <input
                            type="text"
                            placeholder="ابحث..."
                            value={msgSearch}
                            onChange={e => setMsgSearch(e.target.value)}
                            className="w-full pr-8 pl-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8c71af]/30"
                          />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                        {loadingConvs ? (
                          <div className="p-6 text-center text-gray-400 text-sm">جاري التحميل...</div>
                        ) : conversations.filter(c => c.name?.includes(msgSearch)).length === 0 ? (
                          <div className="p-6 text-center">
                            <div className="text-3xl mb-2">💬</div>
                            <p className="text-sm text-gray-500 font-bold">لا توجد رسائل بعد</p>
                            <p className="text-xs text-gray-400 mt-1">لما تبعت رسالة لمورد هتظهر هنا</p>
                          </div>
                        ) : (
                          conversations.filter(c => c.name?.includes(msgSearch)).map(conv => (
                            <button
                              key={conv.userId}
                              onClick={() => handleSelectConv(conv)}
                              className={`w-full text-right flex items-center gap-3 p-3 hover:bg-gray-50 transition ${selectedConv?.userId === conv.userId ? 'bg-[#8c71af]/5 border-r-4 border-[#8c71af]' : ''}`}
                            >
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getMsgColor(conv.name)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                                {conv.name?.[0] || '؟'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                  <span className="font-bold text-sm text-gray-800 truncate">{conv.name}</span>
                                  <span className="text-[10px] text-gray-400 flex-shrink-0">{formatMsgTime(conv.sentAt)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-xs text-gray-400 truncate ml-1">
                                    {conv.lastSenderId === user?.id ? 'أنت: ' : ''}{conv.lastMessage}
                                  </p>
                                  {conv.unreadCount > 0 && (
                                    <span className="bg-[#8c71af] text-white text-[10px] font-bold rounded-full min-w-4 h-4 flex items-center justify-center px-0.5 flex-shrink-0">
                                      {conv.unreadCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Chat Panel */}
                    <div className={`flex-1 flex flex-col ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
                      {!selectedConv ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8c71af]/20 to-pink-100 flex items-center justify-center mb-3">
                            <MessageSquare size={28} className="text-[#8c71af]" />
                          </div>
                          <p className="font-bold text-gray-700">اختر محادثة</p>
                          <p className="text-sm text-gray-400 mt-1">اضغط على محادثة من القائمة</p>
                        </div>
                      ) : (
                        <>
                          {/* Chat Header */}
                          <div className="bg-gray-50 border-b border-gray-100 p-3 flex items-center gap-3">
                            <button onClick={() => setSelectedConv(null)} className="md:hidden text-gray-400 hover:text-[#8c71af]">
                              ←
                            </button>
                            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getMsgColor(selectedConv.name)} flex items-center justify-center text-white font-bold text-sm`}>
                              {selectedConv.name?.[0]}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{selectedConv.name}</p>
                              <p className="text-xs text-gray-400">مورد خدمات</p>
                            </div>
                          </div>

                          {/* Messages */}
                          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
                            {loadingMsgs ? (
                              <div className="text-center text-gray-400 text-sm py-4">جاري التحميل...</div>
                            ) : chatMessages.length === 0 ? (
                              <div className="text-center py-8">
                                <div className="text-3xl mb-2">👋</div>
                                <p className="text-sm text-gray-400">ابدأ محادثتك مع {selectedConv.name}</p>
                              </div>
                            ) : (
                              chatMessages.map(msg => {
                                const isMe = msg.sender?.id === user?.id;
                                return (
                                  <div key={msg.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm shadow-sm ${
                                      isMe
                                        ? 'bg-gradient-to-br from-[#8c71af] to-purple-600 text-white rounded-tr-sm'
                                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                                    }`}>
                                      <p className="leading-relaxed">{msg.content}</p>
                                      <p className={`text-[10px] mt-0.5 text-left ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                                        {formatMsgTime(msg.sentAt)}{isMe && (msg.read ? ' ✓✓' : ' ✓')}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                            <div />
                          </div>

                          {/* Input */}
                          <div className="p-3 border-t border-gray-100">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendMsg()}
                                placeholder="اكتب رسالتك..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8c71af]/30"
                              />
                              <button
                                onClick={handleSendMsg}
                                disabled={!newMessage.trim() || sendingMsg}
                                className="w-9 h-9 bg-gradient-to-br from-[#8c71af] to-purple-600 text-white rounded-xl flex items-center justify-center disabled:opacity-40 cursor-pointer flex-shrink-0"
                              >
                                <Send size={14} className="rotate-180" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 px-4 py-2 flex justify-between items-center">
        <button
          onClick={() => switchTab("bookings")}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === "bookings" ? "text-[#8c71af]" : "text-gray-400 hover:text-[#8c71af]"}`}
        >
          <Calendar size={22} />
          <span className="text-[10px] font-bold">حجوزاتي</span>
        </button>
        {user?.role === "CUSTOMER" && (
          <button
            onClick={() => switchTab("organizer")}
            className={`flex flex-col items-center gap-1 p-2 transition ${activeTab === "organizer" ? "text-[#8c71af]" : "text-gray-400 hover:text-[#8c71af]"}`}
          >
            <CheckCircle size={22} />
            <span className="text-[10px] font-bold">المنظم</span>
          </button>
        )}
        <button
          onClick={() => switchTab("favorites")}
          className={`flex flex-col items-center gap-1 p-2 transition ${activeTab === "favorites" ? "text-[#8c71af]" : "text-gray-400 hover:text-[#8c71af]"}`}
        >
          <Heart size={22} />
          <span className="text-[10px] font-bold">المفضلة</span>
        </button>
        <button
          onClick={() => switchTab("messages")}
          className={`flex flex-col items-center gap-1 p-2 relative transition ${activeTab === "messages" ? "text-[#8c71af]" : "text-gray-400 hover:text-[#8c71af]"}`}
        >
          <MessageSquare size={22} />
          {unreadMsgCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {unreadMsgCount}
            </span>
          )}
          <span className="text-[10px] font-bold">رسائلي</span>
        </button>
        <button
          onClick={() => switchTab("settings")}
          className={`flex flex-col items-center gap-1 p-2 transition ${activeTab === "settings" ? "text-[#8c71af]" : "text-gray-400 hover:text-[#8c71af]"}`}
        >
          <Settings size={22} />
          <span className="text-[10px] font-bold">إعدادات</span>
        </button>
        {user?.role !== "CUSTOMER" && (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-600 p-2 transition cursor-pointer bg-transparent border-none"
          >
            <LogOut size={22} />
            <span className="text-[10px] font-bold">خروج</span>
          </button>
        )}
      </div>
    </div>
  );
}
