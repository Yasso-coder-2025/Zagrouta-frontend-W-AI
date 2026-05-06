import { Link } from "wouter";

const MOCK_DRESSES = [
  {
    id: 1,
    name: "فستان زفاف ملكي",
    price: "7,000 ج.م",
    priceLabel: "إيجار",
    type: "شراء/إيجار",
    location: "مصر الجديدة",
    rating: "4.8",
    image: "/dress1.jpg"
  },
  {
    id: 2,
    name: "فستان سندريلا تركي",
    price: "5,000 ج.م",
    priceLabel: "إيجار",
    type: "إيجار",
    location: "التجمع الخامس",
    rating: "4.5",
    image: "/dress2.jpg"
  },
  {
    id: 3,
    name: "فستان سمبل أبيض",
    price: "15,000 ج.م",
    priceLabel: "شراء",
    type: "شراء",
    location: "المهندسين",
    rating: "4.9",
    image: "/dress3.jpg"
  },
  {
    id: 4,
    name: "فستان بتطريز لؤلؤ",
    price: "8,500 ج.م",
    priceLabel: "إيجار",
    type: "إيجار",
    location: "مدينة نصر",
    rating: "4.7",
    image: "/dress4.jpg"
  },
  {
    id: 5,
    name: "فستان زفاف كلاسيكي",
    price: "6,000 ج.م",
    priceLabel: "إيجار",
    type: "إيجار",
    location: "المعادي",
    rating: "4.6",
    image: "/dress5.jpg"
  },
  {
    id: 6,
    name: "فستان زفاف مودرن",
    price: "12,000 ج.م",
    priceLabel: "شراء",
    type: "شراء",
    location: "الالشيخ زايد",
    rating: "4.8",
    image: "/dress6.jpg"
  },
  {
    id: 7,
    name: "فستان منفوش أنيق",
    price: "9,000 ج.م",
    priceLabel: "إيجار",
    type: "إيجار/شراء",
    location: "الزمالك",
    rating: "4.9",
    image: "/dress7.jpg"
  },
  {
    id: 8,
    name: "فستان زفاف دانتيل",
    price: "7,500 ج.م",
    priceLabel: "إيجار",
    type: "إيجار",
    location: "هيليوبوليس",
    rating: "4.7",
    image: "/dress8.jpg"
  },
  {
    id: 9,
    name: "فستان زفاف بسيط",
    price: "4,500 ج.م",
    priceLabel: "إيجار",
    type: "إيجار",
    location: "الدقي",
    rating: "4.5",
    image: "/dress9.jpg"
  }
];

export default function Dresses() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">أحدث فساتين الزفاف</h2>
            <div className="w-24 h-1 bg-primary rounded-full"></div>
          </div>
          <Link href="/services?category=dresses" className="hidden md:inline-flex items-center gap-2 text-[#8c71af] font-bold hover:text-pink-600 transition">
            عرض كل الفساتين <span>←</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_DRESSES.map((dress) => (
            <div key={dress.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group border border-gray-100 flex flex-col">
              <div className="relative h-64 bg-gray-200 overflow-hidden">
                <img 
                  src={dress.image.startsWith('/') ? dress.image.substring(1) : dress.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  alt={dress.name}
                />
                <span className="absolute top-3 right-3 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {dress.type}
                </span>
                <button className="absolute top-3 left-3 bg-white/50 hover:bg-white p-2 rounded-full transition text-gray-400 hover:text-red-500 shadow-sm">
                  🤍
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l group-hover:from-blue-900 group-hover:via-[#8c71af] group-hover:to-pink-300 transition">
                    {dress.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold mb-2">⭐ {dress.rating}</div>
                <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">📍 {dress.location}</p>
                <div className="mt-auto flex justify-between items-center border-t pt-4">
                  <div>
                    <span className="block text-xs text-gray-400">{dress.priceLabel}</span>
                    <span className="font-bold text-pink-600 text-lg">{dress.price}</span>
                  </div>
                  <Link href={`/services/${dress.id}`} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#8c71af] hover:text-white transition">
                    التفاصيل
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
            <Link href="/services?category=dresses" className="inline-block bg-white border-2 border-[#8c71af] text-[#8c71af] px-8 py-3 rounded-xl font-bold hover:bg-[#8c71af] hover:text-white transition w-full">
                عرض كل الفساتين
            </Link>
        </div>
      </div>
    </section>
  );
}
