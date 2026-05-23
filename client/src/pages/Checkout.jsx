import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { SERVICES_DATA } from "../lib/data";
import { API_URL } from "../config";
import { Copy, Check, UploadCloud, Loader2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Checkout() {
    const { lang, t } = useLanguage();
    const { user } = useAuth();
    
    const searchParams = new URLSearchParams(window.location.search);
    const serviceId = searchParams.get('serviceId');
    const bookingDate = searchParams.get('date') || (lang === 'ar' ? "غير محدد" : "Not specified");
    const guests = searchParams.get('guests') || "guests_100_300";

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

    const getLocalizedGuests = (val) => {
        if (val === "أقل من 100" || val === "guests_under_100") return t("guests_under_100");
        if (val === "100 - 300 شخص" || val === "guests_100_300") return t("guests_100_300");
        if (val === "300 - 500 شخص" || val === "guests_300_500") return t("guests_300_500");
        if (val === "أكثر من 500 شخص" || val === "guests_over_500") return t("guests_over_500");
        return val;
    };

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
            alert(t("checkout_login_alert"));
            return;
        }

        // Validations
        if (paymentMethod === 'instapay') {
            if (!senderName.trim()) {
                alert(t("checkout_val_instapay_sender"));
                return;
            }
            if (!filePreview) {
                alert(t("checkout_val_instapay_receipt"));
                return;
            }
        } else if (paymentMethod === 'vodafone') {
            if (!senderPhone.trim() || senderPhone.trim().length < 11) {
                alert(t("checkout_val_vodafone_sender"));
                return;
            }
            if (!filePreview) {
                alert(t("checkout_val_vodafone_receipt"));
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
                alert(t("checkout_error_booking"));
            }
        } catch (error) {
            console.error("Booking error:", error);
            setIsProcessing(false);
            alert(t("checkout_error_server"));
        }
    };

    if (loadingService) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-pink-50/30 to-white py-12 animate-in fade-in duration-300">
                <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#8c71af] animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-b-transparent border-pink-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <h3 className="text-xl font-bold text-gray-700 animate-pulse">{t("loading_checkout")}</h3>
                <p className="text-xs text-gray-400 mt-2 font-medium">{t("loading_checkout_sub")}</p>
            </div>
        );
    }

    if (!service) {
        return <div className="flex-1 flex justify-center items-center py-20 font-bold text-red-500">{t("service_not_found")}</div>;
    }

    return (<>
      <nav className="bg-white shadow-sm border-b border-gray-100 py-3 hidden md:block">
        <div className="container mx-auto px-6 text-start">
          <div className="text-gray-500 font-bold text-sm">{t("checkout_step")}</div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t("checkout_title")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-[#8c71af]/10 text-[#8c71af] w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                {t("checkout_contact")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">{t("checkout_name")}</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === 'ar' ? "مثلاً: سارة أحمد" : "e.g., Sarah Ahmed"} className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#8c71af]"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">{t("checkout_phone")}</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#8c71af]"/>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-500 mb-1">{t("checkout_notes")}</label>
                  <textarea rows={2} placeholder={lang === 'ar' ? "مثلاً: محتاجين نتأكد من نوع الكوشة..." : "e.g., We need to confirm the design..."} className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#8c71af]"></textarea>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-[#8c71af]/10 text-[#8c71af] w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                {t("checkout_payment_method")}
              </h2>
              
              <div className="space-y-3">
                {/* InstaPay */}
                <div>
                  <input type="radio" id="instapay" className="peer hidden" checked={paymentMethod === 'instapay'} onChange={() => setPaymentMethod('instapay')} />
                  <label htmlFor="instapay" className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'instapay' ? 'border-purple-600 bg-purple-50/10 text-purple-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-black text-sm">IP</div>
                      <div>
                        <span className="font-bold block text-gray-800">{t("checkout_instapay")}</span>
                        <span className="text-xs text-gray-500">{t("checkout_instapay_desc")}</span>
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
                }`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-purple-100/50">
                    <div className="text-start">
                      <span className="text-[10px] text-gray-400 block">{t("checkout_instapay_addr")}</span>
                      <span className="font-bold text-purple-700 text-sm select-all">zagrouta@instapay</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleCopyText("zagrouta@instapay")} 
                      className="flex items-center gap-1 text-xs text-purple-600 font-bold hover:bg-purple-50 px-3 py-2 rounded-xl border border-purple-100 transition cursor-pointer"
                    >
                      {copiedText ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      {copiedText ? t("checkout_btn_copied") : t("checkout_btn_copy")}
                    </button>
                  </div>

                  <div className="text-xs text-purple-700/80 bg-purple-50/50 p-3 rounded-xl flex gap-2 text-start">
                    <span>💡</span>
                    <p>{t("checkout_instapay_tip")}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-start">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t("checkout_instapay_sender")}</label>
                      <input 
                        type="text" 
                        value={senderName} 
                        onChange={(e) => setSenderName(e.target.value)} 
                        placeholder={lang === 'ar' ? "مثلاً: سارة أحمد محمود" : "e.g., Sarah Ahmed Mahmoud"} 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t("checkout_instapay_ref")}</label>
                      <input 
                        type="text" 
                        value={txnId} 
                        onChange={(e) => setTxnId(e.target.value)} 
                        placeholder={lang === 'ar' ? "مثلاً: 123456789012" : "e.g., 123456789012"} 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="text-start">
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t("checkout_instapay_receipt")}</label>
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
                          <p className="text-xs text-purple-600 font-bold">{t("checkout_receipt_change")}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <UploadCloud className="mx-auto text-purple-400" size={32} />
                          <p className="text-xs text-gray-500 font-bold">{t("checkout_receipt_upload")}</p>
                          <p className="text-[10px] text-gray-400">{t("checkout_receipt_size")}</p>
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
                        <span className="font-bold block text-gray-800">{t("checkout_vodafone")}</span>
                        <span className="text-xs text-gray-500">{t("checkout_vodafone_desc")}</span>
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
                }`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-red-100/50">
                    <div className="text-start">
                      <span className="text-[10px] text-gray-400 block">{t("checkout_vodafone_number")}</span>
                      <span className="font-bold text-red-600 text-sm select-all">01023456789</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleCopyText("01023456789")} 
                      className="flex items-center gap-1 text-xs text-red-600 font-bold hover:bg-red-50 px-3 py-2 rounded-xl border border-red-100 transition cursor-pointer"
                    >
                      {copiedText ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      {copiedText ? t("checkout_btn_copied") : t("checkout_vodafone_btn_copy")}
                    </button>
                  </div>

                  <div className="text-xs text-red-700/80 bg-red-50/50 p-3 rounded-xl flex gap-2 text-start">
                    <span>💡</span>
                    <p>{t("checkout_vodafone_tip")}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-start">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t("checkout_vodafone_sender")}</label>
                      <input 
                        type="tel" 
                        value={senderPhone} 
                        onChange={(e) => setSenderPhone(e.target.value)} 
                        placeholder="01XXXXXXXXX" 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t("checkout_vodafone_ref")}</label>
                      <input 
                        type="text" 
                        value={txnId} 
                        onChange={(e) => setTxnId(e.target.value)} 
                        placeholder={lang === 'ar' ? "مثلاً: 98765432" : "e.g., 98765432"} 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="text-start">
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t("checkout_instapay_receipt")}</label>
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
                          <p className="text-xs text-red-600 font-bold">{t("checkout_receipt_change")}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <UploadCloud className="mx-auto text-red-400" size={32} />
                          <p className="text-xs text-gray-500 font-bold">{t("checkout_receipt_upload")}</p>
                          <p className="text-[10px] text-gray-400">{t("checkout_receipt_size")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cash */}
                <div>
                  <input type="radio" id="cash" className="peer hidden" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')}/>
                  <label htmlFor="cash" className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition border-gray-200 peer-checked:border-[#8c71af] peer-checked:bg-[#8c71af]/5 peer-checked:text-[#8c71af]">
                    <div className="flex items-center gap-3 text-start">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">💵</div>
                      <div className="text-start">
                        <span className="font-bold block text-gray-800">{t("checkout_cash")}</span>
                        <span className="text-xs text-gray-500">{t("checkout_cash_desc")}</span>
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
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{t("checkout_summary")}</h3>
              
              <div className="flex gap-4 mb-4">
                <img src={service.imageUrl || "https://via.placeholder.com/500"} className="w-16 h-16 rounded-lg object-cover" alt="Service"/>
                <div className="text-start">
                  <h4 className="font-bold text-sm">{service.name}</h4>
                  <p className="text-gray-500 text-xs">{service.location || (lang === 'ar' ? 'القاهرة' : 'Cairo')}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>{t("checkout_summary_date")}</span>
                  <span className="font-bold text-gray-800">{bookingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("checkout_summary_guests")}</span>
                  <span className="font-bold text-gray-800">{getLocalizedGuests(guests)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span>{t("checkout_summary_total")}</span>
                  <span className="font-bold">{(service.price || "").replace("ج.م", lang === 'ar' ? "ج.م" : "EGP")}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>{t("checkout_summary_deposit")}</span>
                  <span className="font-bold">{t("checkout_summary_deposit_val")}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 mb-6 text-center">
                {t("checkout_terms_agree")} <a href="#" className="text-[#8c71af] underline">{t("checkout_terms_link")}</a>
              </div>

              <button 
                onClick={confirmBooking} 
                disabled={isProcessing}
                className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold shadow-md hover:opacity-90 transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {t("checkout_btn_processing")}
                  </>
                ) : (
                  t("checkout_btn_confirm")
                )}
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-4">{t("checkout_secure")}</p>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("checkout_success_title")}</h2>
            <p className="text-gray-500 mb-8">
              {paymentMethod === 'cash' 
                ? t("checkout_success_cash")
                : t("checkout_success_online")}
            </p>
            
            <div className="space-y-3 relative z-10">
              <Link href="/user-profile">
                <button className="w-full bg-gradient-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition mb-3">
                  {t("checkout_success_bookings_btn")}
                </button>
              </Link>
              <Link href="/">
                <button className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
                  {t("checkout_success_home_btn")}
                </button>
              </Link>
            </div>
          </div>
        </div>)}
    </>);
}
