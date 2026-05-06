import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { SERVICES_DATA } from "../lib/data";
import { API_URL } from "../config";

export default function Checkout() {
    const { user } = useAuth();
    
    const searchParams = new URLSearchParams(window.location.search);
    const serviceId = searchParams.get('serviceId');
    const bookingDate = searchParams.get('date') || "غير محدد";
    const guests = searchParams.get('guests') || "غير محدد";

    const [service, setService] = useState(null);
    const [loadingService, setLoadingService] = useState(true);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.fullName || "");
            setPhone(user.phone?.replace('+20', '') || "");
        }
    }, [user]);

    useEffect(() => {
        const fetchService = async () => {
            if (!serviceId) return;
            try {
                const res = await fetch(`${API_URL}/services/${serviceId}`);
                if (res.ok) {
                    const data = await res.json();
                    setService(data);
                }
            } catch (error) {
                console.error("Error fetching service:", error);
            }
            setLoadingService(false);
        };
        fetchService();
    }, [serviceId]);

    const confirmBooking = async () => {
        if (!user) {
            alert("يرجى تسجيل الدخول أولاً لإتمام الحجز");
            return;
        }

        const bookingData = {
            serviceId: service.id,
            serviceName: service.name,
            servicePrice: service.price,
            vendorName: service.user ? service.user.fullName : ("إدارة " + service.name),
            vendorId: service.user ? service.user.id : 2, 
            bookingDate: bookingDate,
            status: "PENDING",
            paymentMethod: "CASH"
        };

        try {
            const res = await fetch(`${API_URL}/bookings/add/${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            if (res.ok) {
                setIsModalOpen(true);
            } else {
                alert("حدث خطأ أثناء الحجز");
            }
        } catch (error) {
            console.error("Booking error:", error);
            alert("حدث خطأ في الاتصال بالخادم");
        }
    };

    if (loadingService) {
        return <div className="flex-1 flex justify-center items-center py-20 font-bold text-gray-500">جاري تجهيز بيانات الدفع...</div>;
    }

    if (!service) {
        return <div className="flex-1 flex justify-center items-center py-20 font-bold text-red-500">حدث خطأ في العثور على الخدمة.</div>;
    }

    return (<>
      <nav className="bg-white shadow-sm border-b border-gray-100 py-3 hidden md:block">
        <div className="container mx-auto px-6 text-left">
          <div className="text-gray-500 font-bold text-sm">خطوة 2 من 2: الدفع والتأكيد</div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">مراجعة الحجز والدفع</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-[#8c71af]/10 text-[#8c71af] w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                بيانات التواصل
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">الاسم بالكامل</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: سارة أحمد" className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#8c71af]"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">رقم الموبايل</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#8c71af]"/>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-500 mb-1">ملاحظات إضافية للمورد (اختياري)</label>
                  <textarea rows={2} placeholder="مثلاً: محتاجين نتأكد من نوع الكوشة..." className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#8c71af]"></textarea>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-[#8c71af]/10 text-[#8c71af] w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                طريقة دفع العربون
              </h2>
              
              <div className="space-y-3">
                <div>
                  <input type="radio" id="instapay" className="peer hidden" checked={paymentMethod === 'instapay'} onChange={() => {}} disabled />
                  <label htmlFor="instapay" className="flex items-center justify-between p-4 border rounded-xl cursor-not-allowed opacity-60 transition border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold grayscale">IP</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold block text-gray-800">InstaPay (انستا باي)</span>
                          <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">قريباً</span>
                        </div>
                        <span className="text-xs text-gray-500">سيتم تفعيل الدفع الإلكتروني قريباً</span>
                      </div>
                    </div>
                    <span className="w-5 h-5 border-2 rounded-full flex items-center justify-center border-gray-300"></span>
                  </label>
                </div>

                <div>
                  <input type="radio" id="vodafone" className="peer hidden" checked={paymentMethod === 'vodafone'} onChange={() => {}} disabled />
                  <label htmlFor="vodafone" className="flex items-center justify-between p-4 border rounded-xl cursor-not-allowed opacity-60 transition border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold grayscale">VF</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold block text-gray-800">فودافون كاش</span>
                          <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">قريباً</span>
                        </div>
                        <span className="text-xs text-gray-500">سيتم تفعيل الدفع الإلكتروني قريباً</span>
                      </div>
                    </div>
                    <span className="w-5 h-5 border-2 rounded-full flex items-center justify-center border-gray-300"></span>
                  </label>
                </div>

                <div>
                  <input type="radio" id="cash" className="peer hidden" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')}/>
                  <label htmlFor="cash" className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition border-gray-200 peer-checked:border-[#8c71af] peer-checked:bg-[#8c71af]/5 peer-checked:text-[#8c71af]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">💵</div>
                      <div>
                        <span className="font-bold block text-gray-800">دفع نقدي (في المقر)</span>
                        <span className="text-xs text-gray-500">يتم دفع العربون عند زيارة المكان</span>
                      </div>
                    </div>
                    <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === 'cash' ? 'border-[#8c71af] bg-[#8c71af]' : 'border-gray-300'}`}></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">ملخص الحجز 🧾</h3>
              
              <div className="flex gap-4 mb-4">
                <img src={service.imageUrl || "https://via.placeholder.com/500"} className="w-16 h-16 rounded-lg object-cover" alt="Service"/>
                <div>
                  <h4 className="font-bold text-sm">{service.name}</h4>
                  <p className="text-gray-500 text-xs">{service.location || 'القاهرة'}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>التاريخ:</span>
                  <span className="font-bold text-gray-800">{bookingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>العدد:</span>
                  <span className="font-bold text-gray-800">{guests}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span>إجمالي الباقة:</span>
                  <span className="font-bold">{service.price}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>العربون المطلوب:</span>
                  <span className="font-bold">2,500 ج.م</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 mb-6 text-center">
                بإتمام الحجز أنت توافق على <a href="#" className="text-[#8c71af] underline">الشروط والأحكام</a>
              </div>

              <button onClick={confirmBooking} className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold shadow-md hover:opacity-90 transition transform hover:-translate-y-1">
                تأكيد الحجز (2,500 ج.م)
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-4">🔒 دفع آمن ومشفر 100%</p>
            </div>
          </div>

        </div>
      </div>

      {/* Success Modal */}
      {isModalOpen && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8">
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/confetti.png')]"></div>
            
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
              🎉
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">تم الحجز بنجاح!</h2>
            <p className="text-gray-500 mb-8">ألف مبروك! طلبك وصل للمورد وهيتواصل معاك لتأكيد المعاد خلال 24 ساعة.</p>
            
            <div className="space-y-3 relative z-10">
              <Link href="/user-profile">
                <button className="w-full bg-gradient-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition mb-3">
                  عرض حجوزاتي
                </button>
              </Link>
              <Link href="/">
                <button className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
                  العودة للرئيسية
                </button>
              </Link>
            </div>
          </div>
        </div>)}
    </>);
}
