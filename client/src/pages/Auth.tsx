import { useState } from "react";
import { Link } from "wouter";

export default function Auth() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="bg-gradient-to-br from-pink-100 to-white min-h-screen flex items-center justify-center p-4 w-full h-full my-auto py-12">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10">
        
        <div className="bg-pink-600 p-8 text-center text-white">
          <Link href="/">
            <h1 className="text-3xl font-bold mb-2 cursor-pointer">زغروطة</h1>
          </Link>
          <p className="text-pink-100">نورّتي بيتك التاني، يا ريتنا نكون جزء من فرحتك!</p>
        </div>

        <div className="flex border-b">
          <button 
            onClick={() => setTab('login')} 
            className={`w-1/2 py-4 font-bold transition ${tab === 'login' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
          >
            تسجيل الدخول
          </button>
          <button 
            onClick={() => setTab('signup')} 
            className={`w-1/2 py-4 font-bold transition ${tab === 'signup' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
          >
            إنشاء حساب
          </button>
        </div>

        <div className="p-8">
          {tab === 'login' ? (
            <form className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                <input type="email" placeholder="example@mail.com" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">كلمة المرور</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
              <div className="text-left">
                <a href="#" className="text-xs text-pink-500 hover:underline">نسيت كلمة السر؟</a>
              </div>
              <button type="submit" className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-pink-700 transition">دخول</button>
            </form>
          ) : (
            <form className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <label className="block text-sm font-semibold mb-2">الاسم الكامل</label>
                <input type="text" placeholder="اكتبي اسمك هنا" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">نوع الحساب</label>
                <select className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-500 outline-none">
                  <option>عروسة / عريس (مستخدم)</option>
                  <option>مورد خدمات (صاحب قاعة/أتيليه)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                <input type="email" placeholder="example@mail.com" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">كلمة المرور</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
              <button type="submit" className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-pink-700 transition">إنشاء حسابي</button>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 mb-4 font-bold uppercase tracking-wider">أو سجلي عبر</p>
            <div className="flex justify-center gap-4">
              <button type="button" className="p-3 border rounded-full hover:bg-gray-50 transition">
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 41.939 C -8.804 40.009 -11.514 38.989 -14.754 38.989 C -19.444 38.989 -23.494 41.689 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
              </button>
              <button type="button" className="p-3 border rounded-full hover:bg-gray-50 transition">
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
