import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Scissors,
  CalendarCheck,
  MessageSquare,
  Settings,
  LogOut,
  Send,
  Search,
  ArrowRight,
  Star,
} from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { API_URL } from "../config";
import VendorHeader from "../components/layout/VendorHeader";

// ===== Helper: avatar color من الاسم =====
const COLORS = [
  "from-pink-400 to-purple-500",
  "from-blue-400 to-cyan-500",
  "from-emerald-400 to-teal-500",
  "from-orange-400 to-red-400",
  "from-yellow-400 to-orange-500",
  "from-violet-400 to-indigo-500",
];
const getColor = (name = "") =>
  COLORS[name.charCodeAt(0) % COLORS.length];

// ===== تنسيق الوقت =====
const formatTime = (sentAt) => {
  if (!sentAt) return "";
  const date = new Date(sentAt.replace(" ", "T"));
  const now = new Date();
  const diffDays = Math.floor((now - date) / 86400000);
  if (diffDays === 0)
    return date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "أمس";
  if (diffDays < 7)
    return date.toLocaleDateString("ar-EG", { weekday: "long" });
  return date.toLocaleDateString("ar-EG");
};

export default function VendorMessages() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null); // { userId, name, ... }
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileChat, setIsMobileChat] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  const handleLogout = () => {
    logout();
    setLocation("/auth");
  };

  // ===== جيب قائمة المحادثات =====
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/messages/conversations/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoadingConvs(false);
    }
  }, [user]);

  // ===== جيب رسائل محادثة معينة =====
  const fetchMessages = useCallback(async (otherUserId, skipLoading = false) => {
    if (!user) return;
    if (!skipLoading) setLoadingMsgs(true);
    try {
      const res = await fetch(
        `${API_URL}/messages/conversation?userA=${user.id}&userB=${otherUserId}`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        // نحدث العداد في قائمة المحادثات
        setConversations((prev) =>
          prev.map((c) =>
            c.userId === otherUserId ? { ...c, unreadCount: 0 } : c
          )
        );
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMsgs(false);
    }
  }, [user]);

  // ===== Polling: تحديث الرسائل كل 5 ثواني =====
  useEffect(() => {
    fetchConversations();
    pollRef.current = setInterval(fetchConversations, 8000);
    return () => clearInterval(pollRef.current);
  }, [fetchConversations]);

  // تحديث الرسائل كل 3 ثواني لما تكون محادثة مفتوحة
  useEffect(() => {
    if (!selectedConv) return;
    const interval = setInterval(() => fetchMessages(selectedConv.userId, true), 3000);
    return () => clearInterval(interval);
  }, [selectedConv, fetchMessages]);

  // Scroll to bottom لما تجي رسائل جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===== اختيار محادثة =====
  const handleSelectConv = async (conv) => {
    setSelectedConv(conv);
    setIsMobileChat(true);
    setMessages([]);
    await fetchMessages(conv.userId);
  };

  // ===== إرسال رسالة =====
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConv || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: selectedConv.userId,
          content: newMessage.trim(),
        }),
      });
      if (res.ok) {
        setNewMessage("");
        await fetchMessages(selectedConv.userId);
        await fetchConversations();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const filteredConvs = conversations.filter(
    (c) =>
      c.name?.includes(searchQuery) ||
      c.lastMessage?.includes(searchQuery)
  );

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="bg-gray-100 flex h-screen overflow-hidden w-full" dir="rtl">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 via-[#8c71af] to-pink-300 text-white flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 text-2xl font-bold border-b border-white/20 text-center">
          زغروطة للأعمال ✨
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/vendor-dashboard" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
            <LayoutDashboard size={20} /> الرئيسية
          </Link>
          <Link href="/vendor-services" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
            <Scissors size={20} /> خدماتي
          </Link>
          <Link href="/vendor-bookings" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
            <CalendarCheck size={20} /> الحجوزات
          </Link>
          <Link href="/vendor-messages" className="block p-3 rounded-xl bg-white/20 font-bold flex items-center gap-3 shadow-sm border border-white/10">
            <MessageSquare size={20} /> الرسائل
            {totalUnread > 0 && (
              <span className="mr-auto bg-red-500 text-white text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                {totalUnread}
              </span>
            )}
          </Link>
          <Link href="/vendor-reviews" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
            <Star size={20} /> آراء العملاء
          </Link>
          <Link href="/vendor-settings" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
            <Settings size={20} /> الإعدادات
          </Link>
        </nav>
        <div className="p-4 border-t border-white/20">
          <button onClick={handleLogout} className="w-full p-3 text-center bg-white/10 rounded-xl hover:bg-red-500/80 transition text-sm flex items-center justify-center gap-2 font-bold cursor-pointer">
            <LogOut size={16} /> خروج
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 flex flex-col overflow-hidden h-full">
        <VendorHeader
          title={isMobileChat && selectedConv ? selectedConv.name : "الرسائل 💬"}
          extraContent={
            isMobileChat ? (
              <button
                onClick={() => { setIsMobileChat(false); setSelectedConv(null); }}
                className="md:hidden text-gray-500 hover:text-[#8c71af] mr-1"
              >
                <ArrowRight size={22} />
              </button>
            ) : null
          }
        />

        {/* Chat Layout */}
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-65px)]">

          {/* === Conversations List === */}
          <div className={`w-full md:w-80 lg:w-96 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 ${isMobileChat ? "hidden md:flex" : "flex"}`}>
            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث في الرسائل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8c71af]/30 focus:border-[#8c71af] transition"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {loadingConvs ? (
                <div className="p-8 text-center text-gray-400">
                  <div className="animate-spin text-3xl mb-2">⏳</div>
                  <p className="text-sm">جاري التحميل...</p>
                </div>
              ) : filteredConvs.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-sm font-bold">لا توجد رسائل بعد</p>
                  <p className="text-xs mt-1">الرسائل هتظهر هنا لما العملاء يتواصلوا معاك</p>
                </div>
              ) : (
                filteredConvs.map((conv) => (
                  <button
                    key={conv.userId}
                    onClick={() => handleSelectConv(conv)}
                    className={`w-full text-right flex items-center gap-3 p-4 hover:bg-gray-50 transition ${selectedConv?.userId === conv.userId ? "bg-[#8c71af]/5 border-r-4 border-[#8c71af]" : ""}`}
                  >
                    {/* Avatar */}
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getColor(conv.name)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                      {conv.name?.[0] || "؟"}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-bold text-sm ${conv.unreadCount > 0 ? "text-gray-900" : "text-gray-700"}`}>
                          {conv.name}
                        </span>
                        <span className="text-[11px] text-gray-400 flex-shrink-0">{formatTime(conv.sentAt)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate ml-2 ${conv.unreadCount > 0 ? "text-gray-700 font-semibold" : "text-gray-400"}`}>
                          {conv.lastSenderId === user?.id ? "أنت: " : ""}
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-[#8c71af] text-white text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 flex-shrink-0">
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

          {/* === Chat Panel === */}
          <div className={`flex-1 flex flex-col bg-gray-50 ${!isMobileChat ? "hidden md:flex" : "flex"}`}>
            {!selectedConv ? (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8c71af]/20 to-pink-100 flex items-center justify-center mb-6">
                  <MessageSquare size={40} className="text-[#8c71af]" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">رسائلك هنا</h3>
                <p className="text-gray-400 text-sm max-w-xs">اختر محادثة من القائمة لتبدأ في الرد على عملائك</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColor(selectedConv.name)} flex items-center justify-center text-white font-bold`}>
                    {selectedConv.name?.[0] || "؟"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{selectedConv.name}</p>
                    <p className="text-xs text-gray-400 font-medium capitalize">{selectedConv.role === "CUSTOMER" ? "عميل" : "مورد"}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
                  {loadingMsgs ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="text-gray-400 text-sm">جاري تحميل الرسائل...</div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-full text-gray-400">
                      <div className="text-4xl mb-2">👋</div>
                      <p className="text-sm">ابدأ المحادثة مع {selectedConv.name}</p>
                    </div>
                  ) : (
                    <>
                      {/* Date Divider */}
                      <div className="flex items-center gap-3 my-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">المحادثة</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      {messages.map((msg) => {
                        const isVendor = msg.sender?.id === user?.id;
                        return (
                          <div key={msg.id} className={`flex ${isVendor ? "justify-start" : "justify-end"}`}>
                            <div
                              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                isVendor
                                  ? "bg-gradient-to-br from-[#8c71af] to-purple-600 text-white rounded-tr-sm"
                                  : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                              }`}
                            >
                              <p className="leading-relaxed">{msg.content}</p>
                              <p className={`text-[10px] mt-1 text-left ${isVendor ? "text-white/60" : "text-gray-400"}`}>
                                {formatTime(msg.sentAt)}
                                {isVendor && (
                                  <span className="mr-1">{msg.read ? " ✓✓" : " ✓"}</span>
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="bg-white border-t border-gray-200 p-3 md:p-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="اكتب رسالتك هنا..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8c71af]/30 focus:border-[#8c71af] transition"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim() || sending}
                      className="w-10 h-10 bg-gradient-to-br from-[#8c71af] to-purple-600 text-white rounded-xl flex items-center justify-center shadow-md hover:opacity-90 transition disabled:opacity-40 flex-shrink-0 cursor-pointer"
                    >
                      <Send size={16} className="rotate-180" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-gradient-primary text-white z-50 px-4 py-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Link href="/vendor-dashboard" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
          <LayoutDashboard size={20} />
        </Link>
        <Link href="/vendor-services" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
          <Scissors size={20} />
        </Link>
        <Link href="/vendor-bookings" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
          <CalendarCheck size={20} />
        </Link>
        <Link href="/vendor-messages" className="flex flex-col items-center p-2 text-white bg-white/20 rounded-lg relative">
          <MessageSquare size={20} />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {totalUnread}
            </span>
          )}
        </Link>
        <Link href="/vendor-reviews" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
          <Star size={20} />
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center p-2 text-white/70 hover:text-red-300 transition cursor-pointer">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
