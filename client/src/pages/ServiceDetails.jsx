import { useState } from "react";
import { Link, useParams } from "wouter";
import { CustomSelect } from "../components/ui/CustomSelect";
export default function ServiceDetails() {
    const { id } = useParams();
    const images = [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1464013778555-8e723c2f01f8?auto=format&fit=crop&w=800&q=80"
    ];
    const [mainImage, setMainImage] = useState(images[0]);
    const [animateImage, setAnimateImage] = useState(false);
    const handleImageChange = (img) => {
        setAnimateImage(true);
        setTimeout(() => {
            setMainImage(img);
            setAnimateImage(false);
        }, 150);
    };
    return (<>
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#8c71af] transition">الرئيسية</Link> <span>/</span>
          <Link href="/services" className="hover:text-[#8c71af] transition">الخدمات</Link> <span>/</span>
          <span className="text-gray-800 font-bold">قاعة الماسة الملكية</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Details Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="h-[400px] overflow-hidden rounded-xl mb-4 relative group">
                <img src={mainImage} className={`w-full h-full object-cover transition-opacity duration-300 ${animateImage ? 'opacity-50' : 'opacity-100'}`} alt="قاعة الماسة"/>
                <span className="absolute top-4 right-4 bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">قاعة مميزة</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {images.map((img, idx) => (<img key={idx} onClick={() => handleImageChange(img)} src={img} className={`w-24 h-24 rounded-lg object-cover cursor-pointer border-2 transition-all duration-200 ${mainImage === img ? ' opacity-100' : 'border-transparent opacity-70 hover:opacity-100 hover:'}`} alt="Thumbnail"/>))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">قاعة الماسة الملكية</h1>
                  <p className="text-gray-500 flex items-center gap-2">📍 مدينة نصر، القاهرة (بجوار الاستاد)</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex text-yellow-500 text-lg mb-1">★★★★★</div>
                  <span className="text-sm text-gray-400 font-bold">4.9 (120 تقييم)</span>
                </div>
              </div>

              <div className="border-t border-gray-100 my-6"></div>

              <h3 className="text-xl font-bold text-gray-800 mb-4">عن الخدمة</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                قاعة الماسة بتوفرلك تجربة فرح ملوكي، مساحة واسعة تسع حتى 500 فرد، ديكورات مودرن بأحدث صيحات 2026. عندنا فريق كامل لتنظيم الإضاءة والصوت عشان نضمن ليكي ليلة متتنسيش.
              </p>

              <h3 className="text-xl font-bold text-gray-800 mb-4">المميزات</h3>
              <ul className="grid grid-cols-2 gap-4 text-gray-600">
                <li className="flex items-center gap-2">✅ تكييف مركزي</li>
                <li className="flex items-center gap-2">✅ جراج خاص (Parking)</li>
                <li className="flex items-center gap-2">✅ غرفة للعروسة</li>
                <li className="flex items-center gap-2">✅ بوفيه مفتوح</li>
                <li className="flex items-center gap-2">✅ دي جي وساوند سيستم</li>
                <li className="flex items-center gap-2">✅ تصوير فيديو HD</li>
              </ul>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">آراء العرايس (3)</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-pink-50 rounded-full flex items-center justify-center font-bold text-[#8c71af]">س</div>
                  <div>
                    <h4 className="font-bold text-gray-800">سارة أحمد</h4>
                    <div className="text-yellow-500 text-xs mb-1">★★★★★</div>
                    <p className="text-gray-600 text-sm">القاعة تحفة والتعامل قمة في الذوق، بجد شكراً ليكم.</p>
                  </div>
                </div>
                <hr className="border-gray-100"/>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">م</div>
                  <div>
                    <h4 className="font-bold text-gray-800">منى زكي</h4>
                    <div className="text-yellow-500 text-xs mb-1">★★★★☆</div>
                    <p className="text-gray-600 text-sm">المكان جميل بس التكييف كان عالي شوية، غير كده كل حاجة تمام.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Action */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-border/20 sticky top-24">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-gray-400 text-sm block">سعر الباقة يبدأ من</span>
                  <span className="text-3xl font-black text-gradient-primary">25,000 ج.م</span>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الفرح</label>
                  <CustomSelect 
                    defaultValue="خطوبة"
                    options={["خطوبة", "عقد قران", "زفاف"]}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af] text-gray-700 font-bold hover:border-[#8c71af] transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">عدد المدعوين</label>
                  <CustomSelect 
                    defaultValue="أقل من 100"
                    options={["أقل من 100", "100 - 300 شخص", "300 - 500 شخص", "أكثر من 500 شخص"]}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af] text-gray-700 font-bold hover:border-[#8c71af] transition"
                  />
                </div>

                <Link href="/checkout">
                  <button type="button" className="mt-4 w-full bg-gradient-primary text-white py-4 rounded-xl font-bold shadow-md hover:opacity-90 hover:shadow-lg transition transform hover:-translate-y-1 flex justify-center items-center gap-2 text-lg">
                    <span>📅</span> احجز الميعاد
                  </button>
                </Link>

                <button type="button" className="w-full bg-white border-2 border-border/30 text-[#8c71af] py-3 rounded-xl font-bold hover:bg-[#8c71af]/5 transition flex justify-center items-center gap-2">
                  <span>💬</span> شات مع المورد
                </button>
              </form>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-xs text-gray-400 mb-2">هذا المورد موثوق وتم التحقق منه ✅</p>
                <div className="flex items-center justify-center gap-3">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=60" className="w-10 h-10 rounded-full object-cover" alt="Manager"/>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">إدارة القاعة</p>
                    <p className="text-xs text-gray-500">متواجد للرد السريع</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar items */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">ممكن يعجبك كمان</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/services/10" className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition block">
              <img src="https://images.unsplash.com/photo-1464013778555-8e723c2f01f8?auto=format&fit=crop&w=500&q=60" className="h-40 w-full object-cover" alt="Room"/>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">قاعة اللؤلؤة</h3>
                <p className="text-gradient-primary font-bold text-sm">18,000 ج.م</p>
              </div>
            </Link>
            <Link href="/services/11" className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition block">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=60" className="h-40 w-full object-cover" alt="Open Air"/>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">فيلا الأفراح (Open Air)</h3>
                <p className="text-gradient-primary font-bold text-sm">30,000 ج.م</p>
              </div>
            </Link>
            <Link href="/services/12" className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition block">
              <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=500&q=60" className="h-40 w-full object-cover" alt="Hall"/>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">قاعة الفيروز</h3>
                <p className="text-gradient-primary font-bold text-sm">15,000 ج.م</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>);
}
