import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";

// Components for Dialog/Popup 
const Popup = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button 
          onClick={onClose}
          className="w-full bg-primary text-primary-foreground py-2 rounded-xl font-bold hover:bg-primary-hover transition"
        >
          حسناً
        </button>
      </div>
    </div>
  );
};

export default function Auth() {
    const [tab, setTab] = useState('login');
    const { login } = useAuth();
    const [, setLocation] = useLocation();

    // Form states
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [signupName, setSignupName] = useState("");
    const [signupRole, setSignupRole] = useState("CUSTOMER");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupPhone, setSignupPhone] = useState("");
    const [signupGender, setSignupGender] = useState("MALE");

    // Popup state
    const [popupContent, setPopupContent] = useState({ isOpen: false, title: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const loginRes = await fetch('`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}`/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginEmail, password: loginPassword })
        });

        if (loginRes.ok) {
          const userObj = await loginRes.json();
          login(userObj);
          setLocation("/");
        } else {
          const errorText = await loginRes.text();
          if (errorText.includes("Invalid")) {
            setPopupContent({
              isOpen: true,
              title: "خطأ في تسجيل الدخول",
              message: "البريد الإلكتروني أو كلمة المرور غير صحيحة."
            });
          } else {
            setPopupContent({
              isOpen: true,
              title: "خطأ",
              message: errorText || "حدث خطأ غير متوقع."
            });
          }
        }
      } catch (error) {
        setPopupContent({ 
          isOpen: true, 
          title: "خطأ", 
          message: "حدث خطأ في الاتصال بالخادم." 
        });
      }
      setIsLoading(false);
    };

    const handleSignup = async (e) => {
      e.preventDefault();
      
      if (signupPhone.length !== 10) {
        setPopupContent({ isOpen: true, title: "خطأ", message: "يرجى إدخال رقم هاتف صحيح مكون من 10 أرقام (بدون الصفر)." });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch('`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}`/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             fullName: signupName,
             email: signupEmail,
             password: signupPassword,
             phone: "+20" + signupPhone,
             gender: signupGender,
             role: signupRole // CUSTOMER or VENDOR
          })
        });
        
        const resultText = await res.text();
        if (resultText.includes("already taken")) {
          setPopupContent({
             isOpen: true,
             title: "الحساب موجود",
             message: "هذا البريد الإلكتروني مستخدم بالفعل."
          });
        } else if (resultText.includes("successfully")) {
          // Registration successful, show popup and switch to login
          setPopupContent({
             isOpen: true,
             title: "تم بنجاح",
             message: "تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول."
          });
          setLoginEmail(signupEmail);
          setLoginPassword(signupPassword);
          setTab('login');
        } else {
          setPopupContent({ isOpen: true, title: "خطأ", message: resultText });
        }
      } catch (error) {
        setPopupContent({ isOpen: true, title: "خطأ", message: "حدث خطأ في الاتصال بالخادم." });
      }
      setIsLoading(false);
    };

    const handleForgotPassword = async (e) => {
      e.preventDefault();
      // Ensure passwords match
      if (signupPassword !== signupName) {
        setPopupContent({
           isOpen: true,
           title: "خطأ",
           message: "كلمة المرور غير متطابقة."
        });
        return;
      }
      setIsLoading(true);

      try {
        const res = await fetch('`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}`/users/update-password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             email: signupEmail,
             password: signupPassword,
          })
        });
        
        const resultText = await res.text();
        if (resultText.includes("not found")) {
          setPopupContent({
             isOpen: true,
             title: "البريد الإلكتروني غير مسجل",
             message: "هذا البريد غير مسجل لدينا، برجاء إنشاء حساب جديد."
          });
        } else if (resultText.includes("successfully")) {
          setPopupContent({
             isOpen: true,
             title: "تم بنجاح",
             message: "تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة."
          });
          setLoginEmail(signupEmail);
          setTab('login');
        } else {
          setPopupContent({ isOpen: true, title: "خطأ", message: resultText });
        }
      } catch (error) {
        setPopupContent({ isOpen: true, title: "خطأ", message: "حدث خطأ في الاتصال بالخادم." });
      }
      setIsLoading(false);
    };

    const closePopup = () => setPopupContent(prev => ({ ...prev, isOpen: false }));

    return (
      <div className="bg-gradient-to-br from-pink-100 to-white min-h-screen flex items-center justify-center p-4 w-full h-full my-auto py-12">
        <Popup 
          isOpen={popupContent.isOpen} 
          onClose={closePopup} 
          title={popupContent.title} 
          message={popupContent.message} 
        />
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10">
          
          <div className="bg-gradient-to-l from-blue-900 via-[#8c71af] to-pink-300 p-8 text-center text-white">
            <Link href="/">
              <h1 className="text-3xl font-bold mb-2 cursor-pointer">زغروطة</h1>
            </Link>
            <p className="text-white/90">نورّتي بيتك التاني، يا ريتنا نكون جزء من فرحتك!</p>
          </div>

          <div className="flex border-b border-[#8c71af]">
            <button onClick={() => setTab('login')} className={`w-1/2 py-4 font-bold transition ${(tab === 'login' || tab === 'forgot_password') ? 'text-transparent bg-clip-text bg-gradient-to-l from-blue-900 via-[#8c71af] to-pink-300 border-b-2 border-[#8c71af]' : 'text-gray-400 hover:text-[#8c71af]'}`}>
              تسجيل الدخول
            </button>
            <button onClick={() => setTab('signup')} className={`w-1/2 py-4 font-bold transition ${tab === 'signup' ? 'text-transparent bg-clip-text bg-gradient-to-l from-blue-900 via-[#8c71af] to-pink-300 border-b-2 border-[#8c71af]' : 'text-gray-400 hover:text-[#8c71af]'}`}>
              إنشاء حساب
            </button>
          </div>

          <div className="p-8">
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div>
                  <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="example@mail.com" 
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#8c71af] focus:ring-2 focus:ring-[#8c71af] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">كلمة المرور</label>
                  <input 
                    type="password" 
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#8c71af] focus:ring-2 focus:ring-[#8c71af] outline-none transition"
                  />
                </div>
                <div className="text-left">
                  <button type="button" onClick={() => setTab('forgot_password')} className="text-xs text-transparent bg-clip-text bg-gradient-to-l from-blue-900 via-[#8c71af] to-pink-300 font-bold hover:opacity-80 transition">نسيت كلمة السر؟</button>
                </div>
                <button disabled={isLoading} type="submit" className="w-full bg-gradient-to-l from-blue-900 via-[#8c71af] to-pink-300 text-white py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition disabled:opacity-50">
                  {isLoading ? 'جاري الدخول...' : 'دخول'}
                </button>
              </form>
            )}

            {tab === 'forgot_password' && (
              <form onSubmit={handleForgotPassword} className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">نسيت كلمة السر؟</h2>
                  <p className="text-sm text-gray-500 mt-2">أدخل بريدك الإلكتروني وكلمة المرور الجديدة</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="example@mail.com" 
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#8c71af] focus:ring-2 focus:ring-[#8c71af] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">كلمة المرور الجديدة</label>
                  <input 
                    type="password" 
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#8c71af] focus:ring-2 focus:ring-[#8c71af] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">تأكيد كلمة المرور الجديدة</label>
                  <input 
                    type="password" 
                    required
                    value={signupName} // re-using signupName state for confirm password to avoid creating extra state right now
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#8c71af] focus:ring-2 focus:ring-[#8c71af] outline-none transition"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <button disabled={isLoading} type="submit" className="w-full bg-gradient-to-l from-blue-900 via-[#8c71af] to-pink-300 text-white py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition disabled:opacity-50">
                    {isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                  </button>
                  <button type="button" onClick={() => setTab('login')} className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                    العودة لتسجيل الدخول
                  </button>
                </div>
              </form>
            )}

            {tab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div>
                  <label className="block text-sm font-semibold mb-2">الاسم الكامل</label>
                  <input 
                    type="text" 
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="اكتبي اسمك هنا" 
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#8c71af] focus:ring-2 focus:ring-[#8c71af] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">نوع الحساب</label>
                  <select 
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#8c71af] focus:ring-2 focus:ring-[#8c71af] outline-none transition"
                  >
                    <option value="CUSTOMER">عروسة / عريس (مستخدم)</option>
                    <option value="VENDOR">مورد خدمات (صاحب قاعة/أتيليه)</option>
                  </select>
                </div>
                {signupRole === 'CUSTOMER' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">النوع</label>
                    <select 
                      value={signupGender}
                      onChange={(e) => setSignupGender(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#8c71af] focus:ring-2 focus:ring-[#8c71af] outline-none transition"
                    >
                      <option value="MALE">ذكر</option>
                      <option value="FEMALE">أنثى</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="example@mail.com" 
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#8c71af] focus:ring-2 focus:ring-[#8c71af] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">رقم الموبايل</label>
                  <div className="flex border border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#8c71af] focus-within:ring-2 focus-within:ring-[#8c71af] overflow-hidden transition" dir="ltr">
                    <div className="p-3 bg-gray-200 text-gray-700 font-bold border-r border-gray-300 flex items-center justify-center">
                      +20
                    </div>
                    <input 
                      type="tel" 
                      required
                      value={signupPhone}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.startsWith('0')) val = val.substring(1);
                        if (val.length > 10) val = val.substring(0, 10);
                        setSignupPhone(val);
                      }}
                      placeholder="1xxxxxxxxx" 
                      className="w-full p-3 bg-transparent outline-none text-left transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">كلمة المرور</label>
                  <input 
                    type="password" 
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#8c71af] focus:ring-2 focus:ring-[#8c71af] outline-none transition"
                  />
                </div>
                <button disabled={isLoading} type="submit" className="w-full bg-gradient-to-l from-blue-900 via-[#8c71af] to-pink-300 text-white py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition disabled:opacity-50">
                  {isLoading ? 'جاري الإنشاء...' : 'إنشاء حسابي'}
                </button>
              </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 mb-4 font-bold uppercase tracking-wider">أو سجلي عبر</p>
              <div className="flex justify-center gap-4">
                <button type="button" className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition">
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 41.939 C -8.804 40.009 -11.514 38.989 -14.754 38.989 C -19.444 38.989 -23.494 41.689 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                </button>
                <button type="button" className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition">
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#1877F2" d="M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.8739 8.79933 13.8739 9.74824V11.9991H17.2018L16.6698 15.4676H13.8739V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
