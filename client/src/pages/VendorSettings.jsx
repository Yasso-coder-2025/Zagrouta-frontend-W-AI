import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
    LayoutDashboard, Scissors, CalendarCheck, MessageSquare, Settings, LogOut,
    User, Briefcase, Share2, Camera, Instagram, Facebook, MapPin, Mail, FileText, Lock 
} from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { API_URL } from "../config";
import VendorHeader from "../components/layout/VendorHeader";

const GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "الشرقية", "الدقهلية",
  "المنوفية", "الغربية", "البحيرة", "كفر الشيخ", "دمياط", "بورسعيد",
  "الإسماعيلية", "السويس", "شمال سيناء", "جنوب سيناء", "البحر الأحمر",
  "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر",
  "أسوان", "الوادي الجديد", "مطروح"
];

export default function VendorSettings() {
    const { user, login, logout } = useAuth();
    const [, setLocation] = useLocation();
    
    const [activeTab, setActiveTab] = useState("account");

    const [editName, setEditName] = useState(user?.fullName || "");
    const [editPhone, setEditPhone] = useState(user?.phone?.replace("+20", "") || "");
    const [editEmail, setEditEmail] = useState(user?.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    
    // Business Profile State
    const [editBio, setEditBio] = useState("");
    const [editGovernorate, setEditGovernorate] = useState("القاهرة");
    const [editAddress, setEditAddress] = useState("");
    const [logoUrl, setLogoUrl] = useState(null);

    // Social Links State
    const [editInstagram, setEditInstagram] = useState("");
    const [editFacebook, setEditFacebook] = useState("");
    
    const [updateStatus, setUpdateStatus] = useState({ type: "", message: "" });
    const [isUpdating, setIsUpdating] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);

    const handleLogout = () => {
        logout();
        setLocation("/auth");
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setLogoUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (editPhone.length !== 10) {
            setUpdateStatus({
                type: "error",
                message: "يرجى إدخال رقم هاتف صحيح مكون من 10 أرقام (بدون الصفر).",
            });
            return;
        }

        setIsUpdating(true);
        setUpdateStatus({ type: "", message: "" });

        try {
            const res = await fetch(`${API_URL}/users/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: editEmail,
                    password: currentPassword, // to verify identity
                    fullName: editName,
                    phone: "+20" + editPhone,
                    gender: user?.gender || "MALE", // Keep existing gender
                }),
            });

            const resultText = await res.text();
            if (res.ok) {
                setUpdateStatus({
                    type: "success",
                    message: "تم حفظ الإعدادات بنجاح! ✨",
                });
                login({
                    ...user,
                    email: editEmail,
                    fullName: editName,
                    phone: "+20" + editPhone,
                    password: currentPassword,
                });
                setCurrentPassword(""); 
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

    const tabs = [
        { id: "account", label: "البيانات الأساسية", icon: <User size={18} /> },
        { id: "business", label: "بيانات العمل", icon: <Briefcase size={18} /> },
        { id: "social", label: "روابط التواصل", icon: <Share2 size={18} /> },
    ];

    return (
        <div className="bg-gray-100 flex min-h-screen overflow-hidden w-full" dir="rtl">
            {/* Sidebar */}
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
                    <Link href="/vendor-messages" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
                        <MessageSquare size={20} /> الرسائل
                        {unreadMessages > 0 && (
                            <span className="mr-auto bg-red-500 text-white text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                                {unreadMessages}
                            </span>
                        )}
                    </Link>
                    <Link href="/vendor-settings" className="block p-3 rounded-xl bg-white/20 font-bold flex items-center gap-3 shadow-sm border border-white/10">
                        <Settings size={20} /> الإعدادات
                    </Link>
                </nav>
                <div className="p-4 border-t border-white/20">
                    <button onClick={handleLogout} className="w-full block p-3 text-center bg-white/10 rounded-xl hover:bg-red-500/80 transition text-sm flex items-center justify-center gap-2 font-bold cursor-pointer">
                        <LogOut size={16} /> خروج
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto w-full min-h-screen pb-12 md:pb-0">
                <VendorHeader onUnreadMessages={setUnreadMessages} title="الإعدادات ⚙️" />

                <div className="p-4 md:p-8 max-w-3xl mx-auto w-full">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        
                        {/* Tabs Navigation */}
                        <div className="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto hide-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-bold transition whitespace-nowrap outline-none
                                        ${activeTab === tab.id 
                                            ? "text-[#8c71af] border-b-2 border-[#8c71af] bg-white" 
                                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 md:p-8">
                            {updateStatus.message && (
                                <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${updateStatus.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                                    {updateStatus.type === "success" ? "✅" : "⚠️"} {updateStatus.message}
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile}>
                                {/* Tab 1: Account Info */}
                                {activeTab === "account" && (
                                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                الاسم بالكامل (أو اسم العمل)
                                            </label>
                                            <div className="relative">
                                                <User size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                                                <input
                                                    required
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full pr-10 pl-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af]/50 focus:border-[#8c71af] outline-none transition"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                البريد الإلكتروني
                                            </label>
                                            <div className="relative">
                                                <Mail size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                                                <input
                                                    required
                                                    type="email"
                                                    value={editEmail}
                                                    onChange={(e) => setEditEmail(e.target.value)}
                                                    className="w-full pr-10 pl-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af]/50 focus:border-[#8c71af] outline-none transition text-left"
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                رقم الموبايل للتواصل
                                            </label>
                                            <div className="flex rounded-xl bg-gray-50 border border-gray-200 focus-within:ring-2 focus-within:ring-[#8c71af]/50 focus-within:border-[#8c71af] overflow-hidden transition" dir="ltr">
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
                                                    className="w-full p-3 bg-transparent outline-none text-left font-semibold text-gray-800 tracking-wider"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tab 2: Business Profile */}
                                {activeTab === "business" && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                                                    {logoUrl ? (
                                                        <img src={logoUrl} alt="Business Logo" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Briefcase size={32} className="text-gray-300" />
                                                    )}
                                                </div>
                                                <label className="absolute -bottom-2 -right-2 bg-gradient-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:opacity-90 transition">
                                                    <Camera size={14} />
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                                </label>
                                            </div>
                                            <div className="flex-1 text-center sm:text-right mt-2">
                                                <h3 className="font-bold text-gray-800">لوجو العمل / صورتك</h3>
                                                <p className="text-sm text-gray-500 mt-1">يُفضل رفع صورة مربعة بجودة عالية ليتم عرضها للعملاء في صفحتك الشخصية.</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                نبذة عن الخدمة (Bio)
                                            </label>
                                            <div className="relative">
                                                <FileText size={18} className="absolute top-4 right-3 text-gray-400" />
                                                <textarea
                                                    rows={4}
                                                    value={editBio}
                                                    onChange={(e) => setEditBio(e.target.value)}
                                                    placeholder="اكتب نبذة مختصرة عن الخدمات اللي بتقدمها للعملاء..."
                                                    className="w-full pr-10 pl-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af]/50 focus:border-[#8c71af] outline-none transition resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    المحافظة
                                                </label>
                                                <div className="relative">
                                                    <MapPin size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none" />
                                                    <select
                                                        value={editGovernorate}
                                                        onChange={(e) => setEditGovernorate(e.target.value)}
                                                        className="w-full pr-10 pl-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af]/50 focus:border-[#8c71af] outline-none transition appearance-none cursor-pointer text-gray-700 font-medium"
                                                    >
                                                        {GOVERNORATES.map(gov => (
                                                            <option key={gov} value={gov}>{gov}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    العنوان بالتفصيل
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editAddress}
                                                    onChange={(e) => setEditAddress(e.target.value)}
                                                    placeholder="شارع، منطقة، معلم قريب..."
                                                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af]/50 focus:border-[#8c71af] outline-none transition"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tab 3: Social Links */}
                                {activeTab === "social" && (
                                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100 mb-6">
                                            <p className="text-sm text-pink-700 font-medium flex items-center gap-2">
                                                <Share2 size={18} />
                                                إضافة روابط السوشيال ميديا بتزود ثقة العملاء في خدماتك.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                <Instagram size={18} className="text-pink-600" />
                                                رابط إنستجرام
                                            </label>
                                            <input
                                                type="url"
                                                value={editInstagram}
                                                onChange={(e) => setEditInstagram(e.target.value)}
                                                placeholder="https://instagram.com/yourbusiness"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af]/50 focus:border-[#8c71af] outline-none transition text-left"
                                                dir="ltr"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                <Facebook size={18} className="text-blue-600" />
                                                رابط صفحة فيسبوك
                                            </label>
                                            <input
                                                type="url"
                                                value={editFacebook}
                                                onChange={(e) => setEditFacebook(e.target.value)}
                                                placeholder="https://facebook.com/yourbusiness"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af]/50 focus:border-[#8c71af] outline-none transition text-left"
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Global Save/Cancel and Password Confirmation */}
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="mb-4">
                                        <h3 className="font-bold text-gray-800">تأكيد التعديلات</h3>
                                        <p className="text-xs text-gray-500 mt-1">يرجى إدخال كلمة المرور الحالية لحفظ التغييرات الجديدة.</p>
                                    </div>
                                    <div className="relative mb-6">
                                        <Lock size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                                        <input
                                            required
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pr-10 pl-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af]/50 focus:border-[#8c71af] outline-none transition text-left"
                                            dir="ltr"
                                        />
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            disabled={isUpdating}
                                            type="submit"
                                            className="flex-1 md:flex-none md:w-auto px-8 py-3 bg-gradient-primary text-white rounded-xl font-bold shadow-md hover:opacity-90 transition disabled:opacity-50"
                                        >
                                            {isUpdating ? "جاري الحفظ..." : "حفظ التغييرات"}
                                        </button>
                                        <Link href="/vendor-dashboard">
                                            <button
                                                type="button"
                                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold shadow-sm hover:bg-gray-200 transition"
                                            >
                                                إلغاء
                                            </button>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="md:hidden w-full px-6 py-3 mt-2 bg-red-50 text-red-600 rounded-xl font-bold shadow-sm border border-red-100 hover:bg-red-100 transition flex items-center justify-center gap-2"
                                        >
                                            <LogOut size={18} /> تسجيل الخروج
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Nav */}
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
                <Link href="/vendor-messages" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
                    <MessageSquare size={20} />
                </Link>
                <Link href="/vendor-settings" className="flex flex-col items-center p-2 text-white bg-white/20 rounded-lg">
                    <Settings size={20} />
                </Link>
            </div>
        </div>
    );
}
