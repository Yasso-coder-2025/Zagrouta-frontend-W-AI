import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Scissors, CalendarCheck, MessageSquare, Settings, LogOut, Star, Filter } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { API_URL } from "../config";
import VendorHeader from "../components/layout/VendorHeader";

export default function VendorReviews() {
    const { user, logout } = useAuth();
    const [location, setLocation] = useLocation();
    const [reviews, setReviews] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadMessages, setUnreadMessages] = useState(0);

    // Filters
    const [selectedService, setSelectedService] = useState("all");
    const [selectedRating, setSelectedRating] = useState("all");

    useEffect(() => {
        if (user && user.role === 'VENDOR') {
            fetchReviews();
            fetchServices();
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
        setLoading(false);
    };

    const fetchServices = async () => {
        try {
            const res = await fetch(`${API_URL}/services/user/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleLogout = () => {
        logout();
        setLocation("/auth");
    };

    // Calculate Stats
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : "0.0";

    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
        if (ratingBreakdown[r.rating] !== undefined) {
            ratingBreakdown[r.rating]++;
        }
    });

    const getStarPercentage = (star) => {
        if (totalReviews === 0) return 0;
        return ((ratingBreakdown[star] / totalReviews) * 100).toFixed(0);
    };

    // Filtered reviews
    const filteredReviews = reviews.filter(r => {
        const matchesService = selectedService === "all" || r.service?.id === parseInt(selectedService);
        const matchesRating = selectedRating === "all" || r.rating === parseInt(selectedRating);
        return matchesService && matchesRating;
    });

    return (
        <div className="bg-gray-100 flex h-screen overflow-hidden w-full" dir="rtl">
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
                    <Link href="/vendor-bookings" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
                        <CalendarCheck size={20}/> الحجوزات
                    </Link>
                    <Link href="/vendor-messages" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
                        <MessageSquare size={20}/> الرسائل
                        {unreadMessages > 0 && (
                            <span className="mr-auto bg-red-500 text-white text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">{unreadMessages}</span>
                        )}
                    </Link>
                    <Link href="/vendor-reviews" className="block p-3 rounded-xl bg-white/20 font-bold flex items-center gap-3 shadow-sm border border-white/10">
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
                <VendorHeader onUnreadMessages={setUnreadMessages} title="آراء وتقييمات العملاء ⭐️" />

                <div className="p-4 md:p-8 space-y-8">
                    {/* Stats Summary Panel */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Average Rating Big Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                            <span className="text-gray-500 text-sm font-bold">التقييم العام للمورد</span>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="text-5xl font-black text-gradient-primary">{averageRating}</span>
                                <div className="flex flex-col items-start">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={i < Math.round(Number(averageRating)) ? "fill-current" : "text-gray-200"} size={18} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-400 mt-1">بناءً على {totalReviews} تقييم</span>
                                </div>
                            </div>
                        </div>

                        {/* Star Breakdown Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 space-y-2">
                            <h4 className="font-bold text-gray-800 text-sm mb-4">تفاصيل التقييمات بالنجوم</h4>
                            {[5, 4, 3, 2, 1].map(star => (
                                <div key={star} className="flex items-center gap-4 text-sm">
                                    <span className="w-12 font-bold text-gray-600 flex items-center gap-1 justify-end">{star} <Star size={14} className="fill-yellow-400 text-yellow-400" /></span>
                                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-primary rounded-full transition-all duration-500" 
                                            style={{ width: `${getStarPercentage(star)}%` }}
                                        />
                                    </div>
                                    <span className="w-12 text-left text-gray-400 font-bold">{getStarPercentage(star)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
                            <Filter size={18} className="text-[#8c71af]" />
                            <span>تصفية النتائج:</span>
                        </div>
                        <div className="flex flex-wrap gap-3 flex-1 md:flex-none">
                            {/* Service Filter */}
                            <select 
                                value={selectedService} 
                                onChange={(e) => setSelectedService(e.target.value)}
                                className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#8c71af]"
                            >
                                <option value="all">كل الخدمات</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>

                            {/* Stars Filter */}
                            <select 
                                value={selectedRating} 
                                onChange={(e) => setSelectedRating(e.target.value)}
                                className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#8c71af]"
                            >
                                <option value="all">كل التقييمات</option>
                                <option value="5">5 نجوم ★★★★★</option>
                                <option value="4">4 نجوم ★★★★☆</option>
                                <option value="3">3 نجوم ★★★☆☆</option>
                                <option value="2">2 نجوم ★★☆☆☆</option>
                                <option value="1">1 نجمة ★☆☆☆☆</option>
                            </select>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500 font-bold">
                                جاري تحميل التعليقات...
                            </div>
                        ) : filteredReviews.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                                <div className="text-5xl mb-4">💬</div>
                                <p className="font-bold text-lg text-gray-700">لا توجد تقييمات مطابقة للفلاتر المحددة</p>
                                <p className="text-sm text-gray-400 mt-1">العملاء لسة مكتبوش آراء على الفلاتر دي.</p>
                            </div>
                        ) : (
                            filteredReviews.map(review => (
                                <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar placeholder with first letter */}
                                            <div className="w-10 h-10 rounded-full bg-[#8c71af]/10 text-[#8c71af] font-black flex items-center justify-center text-lg">
                                                {review.user?.fullName?.[0] || "ع"}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-gray-800">{review.user?.fullName || "عميل زغروطة"}</h5>
                                                <span className="text-xs text-gray-400 font-semibold">{review.createdAt}</span>
                                            </div>
                                        </div>

                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={i < review.rating ? "fill-current" : "text-gray-200"} size={16} />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold mb-2">
                                            🏷️ {review.service?.name || "خدمة غير معروفة"}
                                        </span>
                                        <p className="text-gray-600 text-sm leading-relaxed font-semibold">
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile Nav */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-gradient-primary text-white z-50 px-4 py-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <Link href="/vendor-dashboard" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
                    <LayoutDashboard size={20}/>
                </Link>
                <Link href="/vendor-services" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
                    <Scissors size={20}/>
                </Link>
                <Link href="/vendor-bookings" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
                    <CalendarCheck size={20}/>
                </Link>
                <Link href="/vendor-reviews" className="flex flex-col items-center p-2 text-white bg-white/20 rounded-lg">
                    <Star size={20}/>
                </Link>
                <Link href="/vendor-settings" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
                    <Settings size={20}/>
                </Link>
            </div>
        </div>
    );
}
