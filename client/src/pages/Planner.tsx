import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Planner() {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(50000);
  const [, setLocation] = useLocation();
  const totalSteps = 3;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setStep(4); // Loading
      setTimeout(() => {
        setLocation('/services');
      }, 3000);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 to-white min-h-screen flex items-center justify-center p-4 py-12 w-full h-full">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative min-h-[500px] flex flex-col">
        
        <div className="p-8 pb-0">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="text-gray-400 hover:text-pink-600 text-sm font-bold">✕ إلغاء ورجوع</Link>
            <span className="text-pink-600 font-bold tracking-widest">زغروطة ✨</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-pink-600 h-full transition-all duration-500 ease-in-out" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>
        </div>

        <form className="p-8 flex-1 flex flex-col justify-center">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">ألف مبروك! 🎉</h2>
              <p className="text-gray-500 mb-8 text-lg">خلينا نبدأ بالأساسيات.. الفرح امتى وفين؟</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">موعد الفرح (تقريبي)</label>
                  <input type="date" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-pink-500 outline-none text-gray-600 font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">المدينة</label>
                  <select className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-pink-500 outline-none text-gray-600 font-bold cursor-pointer">
                    <option>القاهرة</option>
                    <option>الإسكندرية</option>
                    <option>الجيزة</option>
                    <option>المنصورة</option>
                    <option>أخرى</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">ظبطي الميزانية 💰</h2>
              <p className="text-gray-500 mb-8 text-lg">عشان نطلعلك حاجات تناسب جيبك وما تخرمش الميزانية.</p>
              
              <div className="space-y-8">
                <div className="text-center">
                  <span className="text-4xl font-black text-pink-600">{budget.toLocaleString()}</span>
                  <span className="text-gray-400 font-bold mr-2">ج.م</span>
                </div>
                <input 
                  type="range" 
                  min="5000" max="200000" step="1000" 
                  value={budget} 
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600" 
                />
                
                <div className="flex justify-between text-xs text-gray-400 font-bold">
                  <span>على قد الإيد</span>
                  <span>متوسط</span>
                  <span>فخم جداً</span>
                </div>

                <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 text-sm text-pink-800 flex gap-3 items-start">
                  <span>💡</span>
                  <p>نصيحة: دايماً زودي 10% على الميزانية دي للطوارئ.</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">محتاجة إيه بالظبط؟ 🤔</h2>
              <p className="text-gray-500 mb-8 text-lg">اختاري الخدمات اللي بتدوري عليها دلوقتي.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer group">
                  <input type="checkbox" className="peer hidden" />
                  <div className="border-2 border-gray-100 rounded-2xl p-6 text-center hover:border-pink-200 transition h-full flex flex-col justify-center peer-checked:border-pink-600 peer-checked:bg-pink-50 peer-checked:text-pink-600">
                    <div className="text-4xl mb-2">👗</div>
                    <span className="font-bold">فستان</span>
                  </div>
                </label>
                <label className="cursor-pointer group">
                  <input type="checkbox" className="peer hidden" defaultChecked />
                  <div className="border-2 border-gray-100 rounded-2xl p-6 text-center hover:border-pink-200 transition h-full flex flex-col justify-center peer-checked:border-pink-600 peer-checked:bg-pink-50 peer-checked:text-pink-600">
                    <div className="text-4xl mb-2">🏨</div>
                    <span className="font-bold">قاعة</span>
                  </div>
                </label>
                <label className="cursor-pointer group">
                  <input type="checkbox" className="peer hidden" />
                  <div className="border-2 border-gray-100 rounded-2xl p-6 text-center hover:border-pink-200 transition h-full flex flex-col justify-center peer-checked:border-pink-600 peer-checked:bg-pink-50 peer-checked:text-pink-600">
                    <div className="text-4xl mb-2">💄</div>
                    <span className="font-bold">ميك أب</span>
                  </div>
                </label>
                <label className="cursor-pointer group">
                  <input type="checkbox" className="peer hidden" />
                  <div className="border-2 border-gray-100 rounded-2xl p-6 text-center hover:border-pink-200 transition h-full flex flex-col justify-center peer-checked:border-pink-600 peer-checked:bg-pink-50 peer-checked:text-pink-600">
                    <div className="text-4xl mb-2">📸</div>
                    <span className="font-bold">تصوير</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-10 animate-in fade-in duration-500">
              <div className="w-20 h-20 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">بندورلك على أحسن حاجة...</h2>
              <p className="text-gray-500">جاري تصفية النتائج حسب ميزانيتك 🧐</p>
            </div>
          )}

        </form>

        {step <= totalSteps && (
          <div className="p-8 pt-0 flex justify-between items-center">
            <button 
              type="button" 
              onClick={prevStep} 
              className={`text-gray-400 font-bold hover:text-gray-600 ${step === 1 ? 'invisible' : ''}`}
            >
              رجوع
            </button>
            <button 
              type="button" 
              onClick={nextStep} 
              className="bg-pink-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:bg-pink-700 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              {step === totalSteps ? "عرض النتائج ✨" : "التالي ⬅"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
