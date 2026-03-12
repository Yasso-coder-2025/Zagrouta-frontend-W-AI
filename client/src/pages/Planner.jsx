import { useState } from "react";
import { Link, useLocation } from "wouter";
import { CustomSelect } from "../components/ui/CustomSelect";
export default function Planner() {
    const [step, setStep] = useState(1);
    const [budget, setBudget] = useState(50000);
    const [city, setCity] = useState("القاهرة");
    const [customCity, setCustomCity] = useState("");
    const [, setLocation] = useLocation();
    const totalSteps = 3;
    const nextStep = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        }
        else {
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
    return (<div className="bg-gradient-to-br from-pink-50 to-white min-h-screen flex items-center justify-center p-4 py-12 w-full h-full">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative min-h-[500px] flex flex-col">
        
        <div className="p-8 pb-0">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="text-gray-400 hover-text-gradient-primary text-sm font-bold transition">✕ إلغاء ورجوع</Link>
            <span className="text-gradient-primary font-bold tracking-widest flex items-center gap-1"><span className="text-pink-300">✨</span> زغروطة</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-primary h-full transition-all duration-500 ease-in-out" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>
        </div>

        <form className="p-8 flex-1 flex flex-col justify-center">
          
          {step === 1 && (<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">ألف مبروك! 🎉</h2>
              <p className="text-gray-500 mb-8 text-lg">خلينا نبدأ بالأساسيات.. الفرح امتى وفين؟</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">موعد الفرح (تقريبي)</label>
                  <input type="date" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus: focus:ring-2 focus:ring-[#8c71af] outline-none text-gray-600 font-bold transition"/>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-3">مدينة الفرح (المحافظة):</label>
                  <CustomSelect 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    options={[
                      { value: "القاهرة", label: "القاهرة" },
                      { value: "الإسكندرية", label: "الإسكندرية" },
                      { value: "الجيزة", label: "الجيزة" },
                      { value: "أخرى", label: "أخرى" }
                    ]}
                    className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#8c71af] focus:ring-2 focus:ring-[#8c71af] text-gray-600 font-bold cursor-pointer transition hover:border-[#8c71af]"
                  />
                </div>
                {city === "أخرى" && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-gray-700 font-bold mb-3">اكتبي اسم المدينة أو المحافظة:</label>
                    <input 
                      type="text" 
                      placeholder="مثلاً: المنصورة، الغردقة، بورسعيد..." 
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#8c71af] focus:ring-2 focus:ring-[#8c71af] outline-none text-gray-600 font-bold transition"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </div>)}

          {step === 2 && (<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">ظبطي الميزانية 💰</h2>
              <p className="text-gray-500 mb-8 text-lg">عشان نطلعلك حاجات تناسب جيبك وما تخرمش الميزانية.</p>
              
              <div className="space-y-8">
                <div className="text-center">
                  <span className="text-4xl font-black text-gradient-primary">{budget.toLocaleString()}</span>
                  <span className="text-gray-400 font-bold mr-2">ج.م</span>
                  <label className="block text-gray-700 font-bold mb-3 mt-6">ميزانيتك التقريبية (بالجنيه):</label>
                </div>
                <input type="range" min="5000" max="200000" step="1000" value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8c71af]"/>
                
                <div className="flex justify-between text-xs text-gray-400 font-bold">
                  <span>على قد الإيد</span>
                  <span>متوسط</span>
                  <span>فخم جداً</span>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-pink-50 p-4 rounded-xl border border-border/20 text-sm text-gradient-primary font-bold flex gap-3 items-center">
                  <span className="text-xl text-white leading-none">💡</span>
                  <p className="m-0 text-red-700">نصيحة: دايماً زودي 10% على الميزانية دي للطوارئ.</p>
                </div>
              </div>
            </div>)}

          {step === 3 && (<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">محتاجة إيه بالظبط؟ 🤔</h2>
              <p className="text-gray-500 mb-8 text-lg">اختاري الخدمات اللي بتدوري عليها دلوقتي.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer group">
                  <input type="checkbox" className="peer hidden"/>
                  <div className="border-2 border-gray-100 rounded-2xl p-6 text-center hover: transition h-full flex flex-col justify-center peer-checked: peer-checked:bg-gradient-to-br peer-checked:from-blue-50 peer-checked:to-pink-50 peer-checked:text-[#8c71af]">
                    <div className="text-4xl mb-2">👗</div>
                    <span className="font-bold">فستان</span>
                  </div>
                </label>
                <label className="cursor-pointer group">
                  <input type="checkbox" className="peer hidden" defaultChecked/>
                  <div className="border-2 border-gray-100 rounded-2xl p-6 text-center hover: transition h-full flex flex-col justify-center peer-checked: peer-checked:bg-gradient-to-br peer-checked:from-blue-50 peer-checked:to-pink-50 peer-checked:text-[#8c71af]">
                    <div className="text-4xl mb-2">🏨</div>
                    <span className="font-bold">قاعة</span>
                  </div>
                </label>
                <label className="cursor-pointer group">
                  <input type="checkbox" className="peer hidden"/>
                  <div className="border-2 border-gray-100 rounded-2xl p-6 text-center hover: transition h-full flex flex-col justify-center peer-checked: peer-checked:bg-gradient-to-br peer-checked:from-blue-50 peer-checked:to-pink-50 peer-checked:text-[#8c71af]">
                    <div className="text-4xl mb-2">💄</div>
                    <span className="font-bold">ميك أب</span>
                  </div>
                </label>
                <label className="cursor-pointer group">
                  <input type="checkbox" className="peer hidden"/>
                  <div className="border-2 border-gray-100 rounded-2xl p-6 text-center hover: transition h-full flex flex-col justify-center peer-checked: peer-checked:bg-gradient-to-br peer-checked:from-blue-50 peer-checked:to-pink-50 peer-checked:text-[#8c71af]">
                    <div className="text-4xl mb-2">📸</div>
                    <span className="font-bold">تصوير</span>
                  </div>
                </label>
              </div>
            </div>)}

          {step === 4 && (<div className="text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 border-4 border-border/20 border-t-[#8c71af] rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">بندورلك على أحسن حاجة...</h2>
              <p className="text-gray-500">جاري تصفية النتائج حسب ميزانيتك 🧐</p>
            </div>)}

        </form>

        {step <= totalSteps && (<div className="p-8 pt-0 flex justify-between items-center">
            <button type="button" onClick={prevStep} className={`text-gray-400 font-bold hover-text-gradient-primary transition cursor-pointer ${step === 1 ? 'invisible' : ''} `}>
              رجوع
            </button>
            <button type="button" onClick={nextStep} className="bg-gradient-primary text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
              {step === totalSteps ? "عرض النتائج ✨" : "التالي ⬅"}
            </button>
          </div>)}

      </div>
    </div>);
}
