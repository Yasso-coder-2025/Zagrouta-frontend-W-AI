import { useState } from "react";
import { Link } from "wouter";

// Mock data based on the HTML template
const SERVICES_DATA = [
  {
    id: 1,
    name: "قاعة الماسة",
    category: "venue",
    typeLabel: "قاعة",
    rating: "4.9",
    location: "مدينة نصر، القاهرة",
    priceLabel: "يبدأ من",
    price: "25,000 ج.م",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    name: "فستان سندريلا",
    category: "dress",
    typeLabel: "فستان",
    rating: "4.5",
    location: "التجمع الخامس",
    priceLabel: "إيجار",
    price: "5,000 ج.م",
    image: "https://images.unsplash.com/photo-1594553323242-c194a69990b0?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    name: "سارة ميك أب",
    category: "makeup",
    typeLabel: "ميك أب",
    rating: "5.0",
    location: "المهندسين",
    priceLabel: "باكيدج زفاف",
    price: "3,500 ج.م",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=60"
  }
];

export default function Services() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceLimit, setPriceLimit] = useState(25000);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <button 
        onClick={toggleFilter}
        className="md:hidden w-full bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl mb-6 flex items-center justify-center gap-2 shadow-sm"
      >
        <span>⚙️</span> تصفية النتائج
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-1/4 bg-white p-6 rounded-2xl shadow-sm h-fit border border-gray-100 sticky top-24`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl">البحث المتقدم</h2>
            <button onClick={toggleFilter} className="md:hidden text-gray-400">✕</button>
          </div>

          <div className="mb-6 relative">
            <input type="text" placeholder="اسم القاعة، الفستان..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-sm text-gray-500 uppercase">القسم</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-pink-50 p-2 rounded-lg transition">
                <input type="radio" name="category" className="accent-pink-600 w-5 h-5" defaultChecked />
                <span>الكل</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-pink-50 p-2 rounded-lg transition">
                <input type="radio" name="category" className="accent-pink-600 w-5 h-5" />
                <span>قاعات أفراح</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-pink-50 p-2 rounded-lg transition">
                <input type="radio" name="category" className="accent-pink-600 w-5 h-5" />
                <span>فساتين زفاف</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-pink-50 p-2 rounded-lg transition">
                <input type="radio" name="category" className="accent-pink-600 w-5 h-5" />
                <span>ميك أب آرتيست</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-3 text-sm text-gray-500 uppercase">الحد الأقصى للسعر</h3>
            
            <input 
              type="range" 
              className="w-full accent-pink-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4" 
              min="1000" max="100000" step="500" 
              value={priceLimit}
              onChange={(e) => setPriceLimit(parseInt(e.target.value))}
            />
            
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-bold text-sm">أقصى سعر:</span>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-lg text-pink-600 font-bold text-center focus:ring-2 focus:ring-pink-500 outline-none" 
                value={priceLimit}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val)) val = 1000;
                  if (val > 100000) val = 100000;
                  if (val < 1000) val = 1000;
                  setPriceLimit(val);
                }}
              />
              <span className="text-gray-400 font-bold text-sm">ج.م</span>
            </div>
          </div>

          <button className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 transition shadow-md">تطبيق الفلتر</button>
        </aside>

        {/* Main Content */}
        <section className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">أحدث العروض <span className="text-pink-600 text-sm font-normal">({SERVICES_DATA.length} نتيجة)</span></h1>
            <select className="bg-white border p-2 rounded-lg text-sm focus:ring-pink-500 outline-none">
              <option>الأحدث</option>
              <option>الأقل سعراً</option>
              <option>الأعلى تقييماً</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_DATA.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group border border-gray-100 flex flex-col">
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={service.name} />
                  <span className="absolute top-3 right-3 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">{service.typeLabel}</span>
                  <button 
                    onClick={(e) => toggleFavorite(e, service.id)}
                    className="absolute top-3 left-3 bg-white/50 hover:bg-white p-2 rounded-full transition text-red-500"
                  >
                    {favorites[service.id] ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-pink-600 transition">{service.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">⭐ {service.rating}</div>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">📍 {service.location}</p>
                  <div className="mt-auto flex justify-between items-center border-t pt-4">
                    <div>
                      <span className="block text-xs text-gray-400">{service.priceLabel}</span>
                      <span className="font-bold text-pink-600 text-lg">{service.price}</span>
                    </div>
                    <Link href={`/services/${service.id}`} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-pink-600 transition">
                      التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-2">
            <button className="w-10 h-10 rounded-lg border hover:bg-pink-50 flex items-center justify-center text-gray-500">‹</button>
            <button className="w-10 h-10 rounded-lg bg-pink-600 text-white font-bold flex items-center justify-center shadow-md">1</button>
            <button className="w-10 h-10 rounded-lg border hover:bg-pink-50 flex items-center justify-center text-gray-500">2</button>
            <button className="w-10 h-10 rounded-lg border hover:bg-pink-50 flex items-center justify-center text-gray-500">3</button>
            <button className="w-10 h-10 rounded-lg border hover:bg-pink-50 flex items-center justify-center text-gray-500">›</button>
          </div>
        </section>
      </div>
    </div>
  );
}
