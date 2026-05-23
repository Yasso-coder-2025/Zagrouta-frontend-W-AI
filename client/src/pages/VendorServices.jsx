import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Scissors, CalendarCheck, MessageSquare, Settings, LogOut, Plus, Edit, Trash2, Star } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { API_URL } from "../config";
import VendorHeader from "../components/layout/VendorHeader";

export default function VendorServices() {
    const { user, logout } = useAuth();
    const [, setLocation] = useLocation();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newService, setNewService] = useState({
        name: "",
        category: "venue",
        price: "",
        location: "",
        description: "",
        imageUrl: ""
    });
    const [isAdding, setIsAdding] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    
    // Edit state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Image Input state
    const [imageInputMode, setImageInputMode] = useState('url'); // 'url' or 'upload'

    const handleImageUpload = (e, setter) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(prev => ({ ...prev, imageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (user && user.role === 'VENDOR') {
            fetchServices();
        }
    }, [user]);

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
        setLoading(false);
    };

    const handleDelete = async (serviceId) => {
        if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
        try {
            const res = await fetch(`${API_URL}/services/delete/${serviceId}/${user.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchServices(); // Refresh list
            }
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            const res = await fetch(`${API_URL}/services/add/${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newService)
            });
            if (res.ok) {
                fetchServices();
                setIsAddModalOpen(false);
                setNewService({ name: "", category: "venue", price: "", location: "", description: "", imageUrl: "" });
            }
        } catch (error) {
            console.error("Error adding service:", error);
        }
        setIsAdding(false);
    };

    const handleUpdateService = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const res = await fetch(`${API_URL}/services/update/${editingService.id}/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingService)
            });
            if (res.ok) {
                fetchServices();
                setIsEditModalOpen(false);
                setEditingService(null);
            }
        } catch (error) {
            console.error("Error updating service:", error);
        }
        setIsUpdating(false);
    };

    const handleLogout = () => {
        logout();
        setLocation("/auth");
    };

    return (<div className="bg-gray-100 flex h-screen overflow-hidden w-full">
      {/* Sidebar - Same as Dashboard */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 via-[#8c71af] to-pink-300 text-white flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 text-2xl font-bold border-b border-white/20 text-center">
          زغروطة للأعمال ✨
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/vendor-dashboard" className="block p-3 rounded-xl hover:bg-white/10 transition flex items-center gap-3">
            <LayoutDashboard size={20}/> الرئيسية
          </Link>
          <Link href="/vendor-services" className="block p-3 rounded-xl bg-white/20 font-bold flex items-center gap-3 shadow-sm border border-white/10">
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
        <VendorHeader
          title="إدارة الخدمات ✂️"
          onUnreadMessages={setUnreadMessages}
          extraContent={
            <button onClick={() => setIsAddModalOpen(true)} className="bg-gradient-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition cursor-pointer">
              <Plus size={16}/> إضافة خدمة
            </button>
          }
        />

        <div className="p-4 md:p-8">
           {loading ? (
             <div className="text-center py-20 text-gray-500 font-bold">جاري تحميل خدماتك...</div>
           ) : services.length === 0 ? (
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-2xl mx-auto mt-10">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">مفيش خدمات مضافة لسة</h3>
                <p className="text-gray-500 mb-6 text-sm">ابدأ في إضافة خدماتك (قاعات، فساتين، ميك أب) عشان تظهر للعملاء ويقدروا يحجزوها مباشرة من الموقع.</p>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition inline-flex items-center gap-2 shadow-lg cursor-pointer">
                   <Plus size={20} /> أضف خدمتك الأولى الآن
                </button>
             </div>
           ) : (
             <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
               <div className="overflow-x-auto">
                 <table className="w-full text-right border-collapse min-w-[600px]">
                   <thead className="bg-gray-50 text-gray-500 text-sm">
                     <tr>
                       <th className="p-4">صورة</th>
                       <th className="p-4">اسم الخدمة</th>
                       <th className="p-4">القسم</th>
                       <th className="p-4">السعر</th>
                       <th className="p-4">الإجراءات</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 text-sm">
                     {services.map(s => (
                       <tr key={s.id} className="hover:bg-gray-50 transition">
                         <td className="p-4">
                           <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                             <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
                           </div>
                         </td>
                         <td className="p-4 font-bold text-gray-800">{s.name}</td>
                         <td className="p-4">
                           <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold">{s.category}</span>
                         </td>
                         <td className="p-4 font-bold text-gradient-primary">{s.price}</td>
                         <td className="p-4 flex gap-2">
                           <button onClick={() => { setEditingService(s); setIsEditModalOpen(true); }} className="text-gray-400 hover:text-blue-500 transition p-2 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer">
                             <Edit size={16} />
                           </button>
                           <button onClick={() => handleDelete(s.id)} className="text-gray-400 hover:text-red-500 transition p-2 bg-gray-50 rounded-lg hover:bg-red-50 cursor-pointer">
                             <Trash2 size={16} />
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
           )}
        </div>

        {/* Add Service Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg text-gray-800">إضافة خدمة جديدة</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 transition cursor-pointer">✕</button>
              </div>
              <div className="p-6 overflow-y-auto">
                <form id="add-service-form" onSubmit={handleAddService} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">اسم الخدمة</label>
                    <input required type="text" value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8c71af] outline-none" placeholder="مثال: قاعة الماسة"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">القسم</label>
                      <select value={newService.category} onChange={(e) => setNewService({...newService, category: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8c71af] outline-none font-bold">
                        <option value="venue">قاعة أفراح</option>
                        <option value="dress">فستان زفاف</option>
                        <option value="makeup">ميك أب آرتيست</option>
                        <option value="photography">تصوير</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">السعر</label>
                      <input required type="text" value={newService.price} onChange={(e) => setNewService({...newService, price: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8c71af] outline-none" placeholder="مثال: 5,000 ج.م"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">الموقع / العنوان</label>
                    <input required type="text" value={newService.location} onChange={(e) => setNewService({...newService, location: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8c71af] outline-none" placeholder="مثال: مدينة نصر، القاهرة"/>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">صورة الخدمة</label>
                    <div className="flex gap-2 mb-3 bg-gray-100 p-1 rounded-lg">
                      <button type="button" onClick={() => setImageInputMode('url')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition ${imageInputMode === 'url' ? 'bg-white shadow-sm text-gradient-primary' : 'text-gray-500 hover:text-gray-700'}`}>رابط مباشر (URL)</button>
                      <button type="button" onClick={() => setImageInputMode('upload')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition ${imageInputMode === 'upload' ? 'bg-white shadow-sm text-gradient-primary' : 'text-gray-500 hover:text-gray-700'}`}>رفع صورة</button>
                    </div>
                    {imageInputMode === 'url' ? (
                      <input required type="url" value={newService.imageUrl} onChange={(e) => setNewService({...newService, imageUrl: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8c71af] outline-none text-left" dir="ltr" placeholder="https://..."/>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-[#8c71af] hover:bg-[#8c71af]/5 transition group relative overflow-hidden">
                        {newService.imageUrl && newService.imageUrl.startsWith('data:image') ? (
                          <div className="relative">
                            <img src={newService.imageUrl} className="h-32 mx-auto rounded-lg object-contain" alt="Preview"/>
                            <button type="button" onClick={() => setNewService({...newService, imageUrl: ''})} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg">✕</button>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center py-4">
                            <div className="text-4xl mb-2 text-gray-400 group-hover:text-[#8c71af]">📁</div>
                            <span className="text-sm font-bold text-gray-600">اضغط هنا لاختيار صورة من جهازك</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setNewService)} />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">وصف الخدمة</label>
                    <textarea required value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8c71af] outline-none h-24 resize-none" placeholder="اكتب تفاصيل ومميزات الخدمة هنا..."></textarea>
                  </div>
                </form>
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50">
                <button type="submit" form="add-service-form" disabled={isAdding} className="flex-1 bg-gradient-primary text-white py-2.5 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 shadow-md">
                  {isAdding ? 'جاري الإضافة...' : 'إضافة الخدمة'}
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition cursor-pointer">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Service Modal */}
        {isEditModalOpen && editingService && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg text-gray-800">تعديل الخدمة</h3>
                <button onClick={() => {setIsEditModalOpen(false); setEditingService(null);}} className="text-gray-400 hover:text-red-500 transition cursor-pointer">✕</button>
              </div>
              <div className="p-6 overflow-y-auto">
                <form id="edit-service-form" onSubmit={handleUpdateService} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">اسم الخدمة</label>
                    <input required type="text" value={editingService.name} onChange={(e) => setEditingService({...editingService, name: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8c71af] outline-none"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">القسم</label>
                      <select value={editingService.category} onChange={(e) => setEditingService({...editingService, category: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8c71af] outline-none font-bold">
                        <option value="venue">قاعة أفراح</option>
                        <option value="dress">فستان زفاف</option>
                        <option value="makeup">ميك أب آرتيست</option>
                        <option value="photography">تصوير</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">السعر</label>
                      <input required type="text" value={editingService.price} onChange={(e) => setEditingService({...editingService, price: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8c71af] outline-none"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">الموقع / العنوان</label>
                    <input required type="text" value={editingService.location} onChange={(e) => setEditingService({...editingService, location: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8c71af] outline-none"/>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">صورة الخدمة</label>
                    <div className="flex gap-2 mb-3 bg-gray-100 p-1 rounded-lg">
                      <button type="button" onClick={() => setImageInputMode('url')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition ${imageInputMode === 'url' ? 'bg-white shadow-sm text-gradient-primary' : 'text-gray-500 hover:text-gray-700'}`}>رابط مباشر (URL)</button>
                      <button type="button" onClick={() => setImageInputMode('upload')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition ${imageInputMode === 'upload' ? 'bg-white shadow-sm text-gradient-primary' : 'text-gray-500 hover:text-gray-700'}`}>رفع صورة</button>
                    </div>
                    {imageInputMode === 'url' ? (
                      <input required type="url" value={editingService.imageUrl || ''} onChange={(e) => setEditingService({...editingService, imageUrl: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8c71af] outline-none text-left" dir="ltr" placeholder="https://..."/>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-[#8c71af] hover:bg-[#8c71af]/5 transition group relative overflow-hidden">
                        {editingService.imageUrl && editingService.imageUrl.startsWith('data:image') ? (
                          <div className="relative">
                            <img src={editingService.imageUrl} className="h-32 mx-auto rounded-lg object-contain" alt="Preview"/>
                            <button type="button" onClick={() => setEditingService({...editingService, imageUrl: ''})} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg">✕</button>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center py-4">
                            <div className="text-4xl mb-2 text-gray-400 group-hover:text-[#8c71af]">📁</div>
                            <span className="text-sm font-bold text-gray-600">اضغط هنا لاختيار صورة من جهازك</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setEditingService)} />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">وصف الخدمة</label>
                    <textarea required value={editingService.description || ''} onChange={(e) => setEditingService({...editingService, description: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8c71af] outline-none h-24 resize-none"></textarea>
                  </div>
                </form>
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50">
                <button type="submit" form="edit-service-form" disabled={isUpdating} className="flex-1 bg-gradient-primary text-white py-2.5 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 shadow-md">
                  {isUpdating ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
                <button type="button" onClick={() => {setIsEditModalOpen(false); setEditingService(null);}} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition cursor-pointer">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-gradient-primary text-white z-50 px-4 py-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Link href="/vendor-dashboard" className="flex flex-col items-center p-2 text-white/70 hover:text-white transition">
          <LayoutDashboard size={20}/>
        </Link>
        <Link href="/vendor-services" className="flex flex-col items-center p-2 text-white bg-white/20 rounded-lg">
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
