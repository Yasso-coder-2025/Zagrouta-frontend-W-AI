import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { SERVICES_DATA } from "../lib/data";
import { API_URL } from "../config";
import { Copy, Check, UploadCloud, Loader2 } from "lucide-react";

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

    // New payment states
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [copiedText, setCopiedText] = useState(false);
    const [txnId, setTxnId] = useState("");
    const [senderName, setSenderName] = useState("");
    const [senderPhone, setSenderPhone] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result); // Base64 data URL
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleCopyText = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
    };

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

        // Validations
        if (paymentMethod === 'instapay') {
            if (!senderName.trim()) {
                alert("يرجى إدخال اسم الحساب المرسل منه لتأكيد تحويل InstaPay");
                return;
            }
            if (!filePreview) {
                alert("يرجى إرفاق صورة إيصال التحويل لتأكيد تحويل InstaPay");
                return;
            }
        } else if (paymentMethod === 'vodafone') {
            if (!senderPhone.trim() || senderPhone.trim().length < 11) {
                alert("يرجى إدخال رقم المحفظة المرسل منها بشكل صحيح (11 رقم)");
                return;
            }
            if (!filePreview) {
                alert("يرجى إرفاق صورة إيصال التحويل لتأكيد تحويل فودافون كاش");
                return;
            }
        }

        setIsProcessing(true);

        const bookingData = {
            serviceId: service.id,
            serviceName: service.name,
            servicePrice: service.price,
            vendorName: service.user ? service.user.fullName : ("إدارة " + service.name),
            vendorId: service.user ? service.user.id : 2, 
            bookingDate: bookingDate,
            status: "PENDING",
            paymentMethod: paymentMethod === 'instapay' ? 'INSTAPAY' : paymentMethod === 'vodafone' ? 'VODAFONE_CASH' : 'CASH',
            transactionId: paymentMethod === 'instapay' ? (txnId || senderName) : paymentMethod === 'vodafone' ? (txnId || senderPhone) : null,
            paymentReceiptUrl: filePreview || null
        };

        try {
            const res = await fetch(`${API_URL}/bookings/add/${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            if (res.ok) {
                setTimeout(() => {
                    setIsProcessing(false);
                    setIsModalOpen(true);
                }, 2000);
            } else {
                setIsProcessing(false);
                alert("حدث خطأ أثناء الحجز");
            }
        } catch (error) {
            console.error("Booking error:", error);
            setIsProcessing(false);
            alert("حدث خطأ في الاتصال بالخادم");
        }
    };

    if (loadingService) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-pink-50/30 to-white py-12 animate-in fade-in duration-300">
                <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#8c71af] animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-b-transparent border-pink-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <h3 className="text-xl font-bold text-gray-700 animate-pulse">جاري تجهيز بيانات الدفع... ✨</h3>
                <p className="text-xs text-gray-400 mt-2 font-medium">دقائق وبنحضرلك تفاصيل الدفع الآمنة</p>
            </div>
        );
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
                {/* InstaPay */}
                <div>
                  <input type="radio" id="instapay" className="peer hidden" checked={paymentMethod === 'instapay'} onChange={() => setPaymentMethod('instapay')} />
                  <label htmlFor="instapay" className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'instapay' ? 'border-purple-600 bg-purple-50/10 text-purple-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-black text-sm">IP</div>
                      <div>
                        <span className="font-bold block text-gray-800">InstaPay (انستا باي)</span>
                        <span className="text-xs text-gray-500">تحويل فوري مباشر لعناوين انستا باي المعتمدة</span>
                      </div>
                    </div>
                    <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === 'instapay' ? 'border-purple-600 bg-purple-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'instapay' && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                    </span>
                  </label>
                </div>

                <div className={`transition-all duration-1000 ease-in-out overflow-hidden border-purple-100 bg-purple-50/20 rounded-2xl space-y-4 ${
                  paymentMethod === 'instapay' 
                    ? 'max-h-[1000px] opacity-100 p-5 mt-4 border pointer-events-auto' 
                    : 'max-h-0 opacity-0 p-0 mt-0 border-0 pointer-events-none'
                }`} dir="rtl">
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-purple-100/50">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block">عنوان انستا باي للدفع (InstaPay Address)</span>
                      <span className="font-bold text-purple-700 text-sm select-all">zagrouta@instapay</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleCopyText("zagrouta@instapay")} 
                      className="flex items-center gap-1 text-xs text-purple-600 font-bold hover:bg-purple-50 px-3 py-2 rounded-xl border border-purple-100 transition cursor-pointer"
                    >
                      {copiedText ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      {copiedText ? "تم النسخ" : "نسخ العنوان"}
                    </button>
                  </div>

                  <div className="text-xs text-purple-700/80 bg-purple-50/50 p-3 rounded-xl flex gap-2 text-right">
                    <span>💡</span>
                    <p>يرجى فتح تطبيق InstaPay وتحويل مبلغ العربون (2,500 ج.م) للعنوان أعلاه، ثم إدخال اسم الحساب المحول منه وإرفاق لقطة شاشة العملية.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">اسم الحساب المحول منه (انستا باي) *</label>
                      <input 
                        type="text" 
                        value={senderName} 
                        onChange={(e) => setSenderName(e.target.value)} 
                        placeholder="مثلاً: سارة أحمد محمود" 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">رقم المعاملة / مرجع التحويل (اختياري)</label>
                      <input 
                        type="text" 
                        value={txnId} 
                        onChange={(e) => setTxnId(e.target.value)} 
                        placeholder="مثلاً: 123456789012" 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <label className="block text-xs font-bold text-gray-500 mb-1">إرفاق لقطة شاشة التحويل (صورة الإيصال) *</label>
                    <div className="relative border-2 border-dashed border-purple-200 rounded-2xl p-6 text-center hover:bg-purple-50/30 transition">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {filePreview ? (
                        <div className="space-y-2">
                          <img src={filePreview} className="max-h-32 mx-auto rounded-lg shadow-sm border" alt="Receipt preview" />
                          <p className="text-xs text-purple-600 font-bold">تغيير الصورة</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <UploadCloud className="mx-auto text-purple-400" size={32} />
                          <p className="text-xs text-gray-500 font-bold">اضغط هنا أو اسحب صورة الإيصال للرفع</p>
                          <p className="text-[10px] text-gray-400">PNG, JPG (حد أقصى 5 ميجابايت)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vodafone Cash */}
                <div>
                  <input type="radio" id="vodafone" className="peer hidden" checked={paymentMethod === 'vodafone'} onChange={() => setPaymentMethod('vodafone')} />
                  <label htmlFor="vodafone" className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'vodafone' ? 'border-red-600 bg-red-50/10 text-red-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-black text-sm">VF</div>
                      <div>
                        <span className="font-bold block text-gray-800">فودافون كاش (Vodafone Cash)</span>
                        <span className="text-xs text-gray-500">تحويل مباشر لأي محفظة فودافون كاش</span>
                      </div>
                    </div>
                    <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === 'vodafone' ? 'border-red-600 bg-red-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'vodafone' && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                    </span>
                  </label>
                </div>

                <div className={`transition-all duration-1000 ease-in-out overflow-hidden border-red-100 bg-red-50/20 rounded-2xl space-y-4 ${
                  paymentMethod === 'vodafone' 
                    ? 'max-h-[1000px] opacity-100 p-5 mt-4 border pointer-events-auto' 
                    : 'max-h-0 opacity-0 p-0 mt-0 border-0 pointer-events-none'
                }`} dir="rtl">
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-red-100/50">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block">رقم محفظة فودافون كاش للدفع</span>
                      <span className="font-bold text-red-600 text-sm select-all">01023456789</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleCopyText("01023456789")} 
                      className="flex items-center gap-1 text-xs text-red-600 font-bold hover:bg-red-50 px-3 py-2 rounded-xl border border-red-100 transition cursor-pointer"
                    >
                      {copiedText ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      {copiedText ? "تم النسخ" : "نسخ الرقم"}
                    </button>
                  </div>

                  <div className="text-xs text-red-700/80 bg-red-50/50 p-3 rounded-xl flex gap-2 text-right">
                    <span>💡</span>
                    <p>يرجى تحويل مبلغ العربون (2,500 ج.م) للرقم أعلاه من محفظتك الإلكترونية، ثم إدخال رقم المحفظة المرسل منها وإرفاق صورة تأكيد التحويل.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">رقم الموبايل المحول منه المحفظة *</label>
                      <input 
                        type="tel" 
                        value={senderPhone} 
                        onChange={(e) => setSenderPhone(e.target.value)} 
                        placeholder="01XXXXXXXXX" 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">رقم المعاملة / عملية التحويل (اختياري)</label>
                      <input 
                        type="text" 
                        value={txnId} 
                        onChange={(e) => setTxnId(e.target.value)} 
                        placeholder="مثلاً: 98765432" 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <label className="block text-xs font-bold text-gray-500 mb-1">إرفاق لقطة شاشة التحويل (صورة الإيصال) *</label>
                    <div className="relative border-2 border-dashed border-red-200 rounded-2xl p-6 text-center hover:bg-red-50/30 transition">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {filePreview ? (
                        <div className="space-y-2">
                          <img src={filePreview} className="max-h-32 mx-auto rounded-lg shadow-sm border" alt="Receipt preview" />
                          <p className="text-xs text-red-600 font-bold">تغيير الصورة</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <UploadCloud className="mx-auto text-red-400" size={32} />
                          <p className="text-xs text-gray-500 font-bold">اضغط هنا أو اسحب صورة الإيصال للرفع</p>
                          <p className="text-[10px] text-gray-400">PNG, JPG (حد أقصى 5 ميجابايت)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cash */}
                <div>
                  <input type="radio" id="cash" className="peer hidden" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')}/>
                  <label htmlFor="cash" className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition border-gray-200 peer-checked:border-[#8c71af] peer-checked:bg-[#8c71af]/5 peer-checked:text-[#8c71af]">
                    <div className="flex items-center gap-3 text-right">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">💵</div>
                      <div className="text-right">
                        <span className="font-bold block text-gray-800">دفع نقدي (في المقر)</span>
                        <span className="text-xs text-gray-500">يتم دفع العربون عند زيارة مقر المورد لتأكيد الاتفاق</span>
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

              <button 
                onClick={confirmBooking} 
                disabled={isProcessing}
                className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold shadow-md hover:opacity-90 transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    جاري معالجة التحويل...
                  </>
                ) : (
                  `تأكيد الحجز (2,500 ج.م)`
                )}
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
            <p className="text-gray-500 mb-8">
              {paymentMethod === 'cash' 
                ? "ألف مبروك! طلب الحجز وصل للمورد وهيتواصل معاك لتأكيد المعاد وتنسيق دفع العربون نقداً خلال 24 ساعة."
                : `ألف مبروك! طلب الحجز وصل للمورد مع إيصال الدفع الإلكتروني (${paymentMethod === 'instapay' ? 'InstaPay' : 'فودافون كاش'}) بنجاح. هيتأكد من التحويل ويتواصل معاك لتأكيد المعاد.`}
            </p>
            
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
