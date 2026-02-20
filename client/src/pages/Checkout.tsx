import { useState } from "react";
import { Link } from "wouter";

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('instapay');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const confirmBooking = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold text-pink-600 tracking-wider flex items-center gap-2">
            <span>✨</span> زغروطة
          </Link>
          <div className="hidden md:block text-gray-500 font-bold">خطوة 2 من 2: الدفع والتأكيد</div>
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
                <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                بيانات التواصل
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">الاسم بالكامل</label>
                  <input type="text" defaultValue="أحمد محمد" className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">رقم الموبايل</label>
                  <input type="tel" defaultValue="01012345678" className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-500 mb-1">ملاحظات إضافية للمورد (اختياري)</label>
                  <textarea rows={2} placeholder="مثلاً: محتاجين نتأكد من نوع الكوشة..." className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500"></textarea>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                طريقة دفع العربون
              </h2>
              
              <div className="space-y-3">
                <div>
                  <input type="radio" id="instapay" className="peer hidden" checked={paymentMethod === 'instapay'} onChange={() => setPaymentMethod('instapay')} />
                  <label htmlFor="instapay" className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition border-gray-200 peer-checked:border-pink-600 peer-checked:bg-pink-50 peer-checked:text-pink-600">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">IP</div>
                      <div>
                        <span className="font-bold block">InstaPay (انستا باي)</span>
                        <span className="text-xs text-gray-500 peer-checked:text-pink-500">دفع فوري وآمن</span>
                      </div>
                    </div>
                    <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === 'instapay' ? 'border-pink-600 bg-pink-600' : 'border-gray-300'}`}></span>
                  </label>
                </div>

                <div>
                  <input type="radio" id="vodafone" className="peer hidden" checked={paymentMethod === 'vodafone'} onChange={() => setPaymentMethod('vodafone')} />
                  <label htmlFor="vodafone" className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition border-gray-200 peer-checked:border-pink-600 peer-checked:bg-pink-50 peer-checked:text-pink-600">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold">VF</div>
                      <div>
                        <span className="font-bold block">فودافون كاش</span>
                        <span className="text-xs text-gray-500">تحويل للمحفظة</span>
                      </div>
                    </div>
                    <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === 'vodafone' ? 'border-pink-600 bg-pink-600' : 'border-gray-300'}`}></span>
                  </label>
                </div>

                <div>
                  <input type="radio" id="cash" className="peer hidden" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                  <label htmlFor="cash" className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition border-gray-200 peer-checked:border-pink-600 peer-checked:bg-pink-50 peer-checked:text-pink-600">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">💵</div>
                      <div>
                        <span className="font-bold block">دفع نقدي (في المقر)</span>
                        <span className="text-xs text-gray-500">يتم دفع العربون عند زيارة المكان</span>
                      </div>
                    </div>
                    <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === 'cash' ? 'border-pink-600 bg-pink-600' : 'border-gray-300'}`}></span>
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
                <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=150&q=60" className="w-16 h-16 rounded-lg object-cover" alt="Hall" />
                <div>
                  <h4 className="font-bold text-sm">قاعة الماسة الملكية</h4>
                  <p className="text-gray-500 text-xs">مدينة نصر، القاهرة</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>التاريخ:</span>
                  <span className="font-bold text-gray-800">20 مارس 2026</span>
                </div>
                <div className="flex justify-between">
                  <span>العدد:</span>
                  <span className="font-bold text-gray-800">200 فرد</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span>إجمالي الباقة:</span>
                  <span className="font-bold">25,000 ج.م</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>العربون المطلوب (10%):</span>
                  <span className="font-bold">2,500 ج.م</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 mb-6 text-center">
                بإتمام الحجز أنت توافق على <a href="#" className="text-pink-600 underline">الشروط والأحكام</a>
              </div>

              <button onClick={confirmBooking} className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold shadow-md hover:bg-pink-700 transition transform hover:-translate-y-1">
                تأكيد الحجز (2,500 ج.م)
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-4">🔒 دفع آمن ومشفر 100%</p>
            </div>
          </div>

        </div>
      </div>

      {/* Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8">
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/confetti.png')]"></div>
            
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
              🎉
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">تم الحجز بنجاح!</h2>
            <p className="text-gray-500 mb-8">ألف مبروك! طلبك وصل للمورد وهيتواصل معاك لتأكيد المعاد خلال 24 ساعة.</p>
            
            <div className="space-y-3 relative z-10">
              <Link href="/user-profile">
                <button className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 transition mb-3">
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
        </div>
      )}
    </>
  );
}
