import { useState } from "react";
import { Link } from "wouter";
import { Calendar, Heart, Settings, LogOut, X } from "lucide-react";
import { useAuth } from "../hooks/use-auth";

export default function UserProfile() {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState('bookings');
    const [editName, setEditName] = useState(user?.fullName || "");
    const [editPhone, setEditPhone] = useState(user?.phone?.replace('+20', '') || "");
    const [editGender, setEditGender] = useState(user?.gender || "MALE");
    const [currentPassword, setCurrentPassword] = useState("");
    const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });
    const [isUpdating, setIsUpdating] = useState(false);

    const switchTab = (tab) => setActiveTab(tab);

    const handleUpdateProfile = async (e) => {
      e.preventDefault();
      
      if (editPhone.length !== 10) {
        setUpdateStatus({ type: 'error', message: "يرجى إدخال رقم هاتف صحيح مكون من 10 أرقام (بدون الصفر)." });
        setIsUpdating(false);
        return;
      }

      setIsUpdating(true);
      setUpdateStatus({ type: '', message: '' });

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}/users/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            password: currentPassword, // to verify it's the real user
            fullName: editName,
            phone: "+20" + editPhone,
            gender: editGender
          })
        });

        const resultText = await res.text();
        if (res.ok) {
          setUpdateStatus({ type: 'success', message: 'تم حفظ التغييرات بنجاح!' });
          // Update local state with new data
          login({ ...user, fullName: editName, phone: "+20" + editPhone, gender: editGender, password: currentPassword });
          setCurrentPassword(""); // clear password field
        } else {
          setUpdateStatus({ type: 'error', message: resultText || 'كلمة المرور غير صحيحة أو حدث خطأ.' });
        }
      } catch (error) {
        setUpdateStatus({ type: 'error', message: 'حدث خطأ في الاتصال بالخادم.' });
      }
      setIsUpdating(false);
    };
    return (<div className="bg-gray-50 min-h-screen pb-20 md:pb-0">
      <header className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-primary">بروفايلي</h1>
        <div className="w-8 h-8 rounded-full bg-primary-100 overflow-hidden border border-primary-200">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=60" className="w-full h-full object-cover" alt="Profile"/>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar (Desktop) */}
          <aside className="hidden md:block col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-gray-100 sticky top-24">
              <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden mb-4 border-4 border-pink-50">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=60" className="w-full h-full object-cover" alt="Profile"/>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user?.fullName || 'عضو زغروطة'}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {user?.role === 'VENDOR' ? 'مورد خدمات 🤵' : (user?.gender === 'FEMALE' ? 'عروسة 👰' : 'عريس 🎩')}
              </p>
              
              <nav className="space-y-2 text-right">
                <button onClick={() => switchTab('bookings')} className={`w-full p-3 rounded-xl font-bold flex items-center gap-3 transition ${activeTab === 'bookings' ? 'bg-primary-50 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Calendar size={20}/> حجوزاتي
                </button>
                <button onClick={() => switchTab('favorites')} className={`w-full p-3 rounded-xl font-bold flex items-center gap-3 transition ${activeTab === 'favorites' ? 'bg-primary-50 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Heart size={20}/> المفضلة
                </button>
                <button onClick={() => switchTab('settings')} className={`w-full p-3 rounded-xl font-bold flex items-center gap-3 transition ${activeTab === 'settings' ? 'bg-primary-50 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Settings size={20}/> إعدادات الحساب
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-1 md:col-span-3">
            
            {/* Bookings Section */}
            {activeTab === 'bookings' && (<section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
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
                      <tr className="hover:bg-primary-50 transition">
                        <td className="p-4 font-bold">قاعة الزمردة</td>
                        <td className="p-4 text-gray-500">فندق الماسة</td>
                        <td className="p-4">20 مارس 2026</td>
                        <td className="p-4 font-bold text-primary">25,000 ج.م</td>
                        <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">قيد الانتظار</span></td>
                        <td className="p-4"><button className="text-red-500 hover:underline">إلغاء</button></td>
                      </tr>
                      <tr className="hover:bg-primary-50 transition">
                        <td className="p-4 font-bold">سيشن تصوير</td>
                        <td className="p-4 text-gray-500">استوديو لايف</td>
                        <td className="p-4">15 أبريل 2026</td>
                        <td className="p-4 font-bold text-primary">3,000 ج.م</td>
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
                      <span className="font-bold text-primary">25,000 ج.م</span>
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
                      <span className="font-bold text-primary">3,000 ج.م</span>
                    </div>
                    <button className="w-full bg-primary text-primary-foreground py-2 rounded-xl text-sm font-bold shadow-md">عرض الفاتورة</button>
                  </div>
                </div>
              </section>)}

            {/* Favorites Section */}
            {activeTab === 'favorites' && (<section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 hidden md:block">قائمة المفضلة ❤️</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 relative group">
                    <button className="absolute top-3 left-3 bg-white/90 p-2 rounded-full text-red-500 shadow-sm z-10 hover:bg-red-50">
                      <X size={16}/>
                    </button>
                    <div className="h-40 bg-gray-200 relative">
                      <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=60" className="w-full h-full object-cover" alt="Dress"/>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800">فستان زفاف ملكي</h3>
                      <p className="text-primary font-bold text-sm mt-1">12,000 ج.م</p>
                      <button className="mt-3 w-full bg-primary text-primary-foreground py-2 rounded-xl text-sm font-bold shadow-md hover:bg-primary-hover">احجز الآن</button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 relative group">
                    <button className="absolute top-3 left-3 bg-white/90 p-2 rounded-full text-red-500 shadow-sm z-10 hover:bg-red-50">
                      <X size={16}/>
                    </button>
                    <div className="h-40 bg-gray-200 relative">
                      <img src="https://images.unsplash.com/photo-1464013778555-8e723c2f01f8?auto=format&fit=crop&w=500&q=60" className="w-full h-full object-cover" alt="Hall"/>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800">قاعة اللؤلؤة</h3>
                      <p className="text-primary font-bold text-sm mt-1">18,000 ج.م</p>
                      <button className="mt-3 w-full bg-primary text-primary-foreground py-2 rounded-xl text-sm font-bold shadow-md hover:bg-primary-hover">احجز الآن</button>
                    </div>
                  </div>
                </div>
              </section>)}

            {/* Settings Section */}
            {activeTab === 'settings' && (<section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 hidden md:block">تعديل الملف الشخصي ⚙️</h2>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  {updateStatus.message && (
                    <div className={`mb-4 p-3 rounded-xl text-sm font-bold ${updateStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {updateStatus.message}
                    </div>
                  )}
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الاسم بالكامل</label>
                      <input 
                        required
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">رقم الموبايل</label>
                      <div className="flex border rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-primary overflow-hidden" dir="ltr">
                        <div className="p-3 bg-gray-200 text-gray-700 font-bold border-r border-gray-300 flex items-center justify-center">
                          +20
                        </div>
                        <input 
                          type="tel" 
                          required
                          value={editPhone}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.startsWith('0')) val = val.substring(1);
                            if (val.length > 10) val = val.substring(0, 10);
                            setEditPhone(val);
                          }}
                          placeholder="1xxxxxxxxx" 
                          className="w-full p-3 bg-transparent outline-none text-left"
                        />
                      </div>
                    </div>
                    {user?.role === 'CUSTOMER' && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">النوع</label>
                        <select 
                          value={editGender}
                          onChange={(e) => setEditGender(e.target.value)}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        >
                          <option value="MALE">عريس</option>
                          <option value="FEMALE">عروسة</option>
                        </select>
                      </div>
                    )}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور الحالية (لتأكيد هويتك)</label>
                        <Link href="/auth">
                          <span className="text-xs text-primary hover:underline cursor-pointer">نسيت كلمة السر؟</span>
                        </Link>
                      </div>
                      <input 
                        required
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="pt-4">
                      <button disabled={isUpdating} type="submit" className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg hover:bg-primary-hover transition disabled:opacity-50">
                        {isUpdating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                      </button>
                    </div>
                  </form>
                </div>
              </section>)}

          </main>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 px-6 py-2 flex justify-between items-center">
        <button onClick={() => switchTab('bookings')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'bookings' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}>
          <Calendar size={24}/>
          <span className="text-[10px] font-bold">حجوزاتي</span>
        </button>
        <button onClick={() => switchTab('favorites')} className={`flex flex-col items-center gap-1 p-2 transition ${activeTab === 'favorites' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}>
          <Heart size={24}/>
          <span className="text-[10px] font-bold">المفضلة</span>
        </button>
        <button onClick={() => switchTab('settings')} className={`flex flex-col items-center gap-1 p-2 transition ${activeTab === 'settings' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}>
          <Settings size={24}/>
          <span className="text-[10px] font-bold">إعدادات</span>
        </button>
        <Link href="/">
          <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-600 p-2 transition cursor-pointer">
            <LogOut size={24}/>
            <span className="text-[10px] font-bold">خروج</span>
          </div>
        </Link>
      </div>
    </div>);
}
