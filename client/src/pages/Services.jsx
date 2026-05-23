import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { CustomSelect } from "../components/ui/CustomSelect";
import { useAuth } from "../hooks/use-auth";
import { useFavorites } from "../hooks/use-favorites";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "../config";

export default function Services() {
    const [location] = useLocation();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [servicesData, setServicesData] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_URL}/services/all`);
                if (res.ok) {
                    const data = await res.json();
                    const formattedData = data.map(s => ({
                        id: s.id,
                        name: s.name,
                        category: s.category || 'venue',
                        typeLabel: s.category === 'venue' ? 'قاعة' : s.category === 'dress' ? 'فستان' : s.category === 'makeup' ? 'ميك أب' : 'تصوير',
                        rating: "4.9",
                        location: s.location || "القاهرة",
                        priceLabel: s.category === 'dress' ? 'إيجار' : 'يبدأ من',
                        price: s.price || "0 ج.م",
                        image: s.imageUrl || "https://via.placeholder.com/500"
                    }));
                    setServicesData(formattedData);
                }
            } catch (error) {
                console.error("Failed to fetch services", error);
            }
            setLoadingServices(false);
        };
        fetchServices();
    }, []);
    
    // Initialize filters from URL params
    const searchParams = useMemo(() => new URLSearchParams(window.location.search), [window.location.search]);
    
    const [appliedPriceLimit, setAppliedPriceLimit] = useState(() => {
        const budget = searchParams.get('budget');
        return budget ? parseInt(budget) : 50000;
    });

    const [priceLimit, setPriceLimit] = useState(() => {
        const budget = searchParams.get('budget');
        return budget ? parseInt(budget) : 50000;
    });
    
    const [selectedCategory, setSelectedCategory] = useState(() => {
        const category = searchParams.get('category');
        return category || "all";
    });

    const handleApplyFilters = () => {
        setIsFiltering(true);
        setTimeout(() => {
            setAppliedPriceLimit(priceLimit);
            setIsFiltering(false);
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
                setIsFilterOpen(false);
            }
        }, 600);
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("الأحدث");
    const [isFiltering, setIsFiltering] = useState(false);

    const { user } = useAuth();
    const { favorites, toggleFavorite } = useFavorites();
    const { toast } = useToast();

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, appliedPriceLimit, searchQuery, sortOption]);

    const toggleFavoriteBtn = (e, id) => {
        e.preventDefault();
        if (!user) {
            toast({
                title: "تسجيل الدخول مطلوب 🔒",
                description: "لازم تسجل دخول الأول عشان تقدر تحفظ في المفضلة.",
                variant: "destructive"
            });
            return;
        }
        
        toggleFavorite(id);
        
        if (favorites.includes(id)) {
            toast({
                title: "مسحتني من المفضله ليه 🥲🥹",
                description: "طب هجيلك في المنام 🎃",
            });
        } else {
            toast({
                title: "تم الحفظ في المفضلة ❤️",
                description: "تقدر تشوفها في حسابك في أي وقت.",
                className: "bg-green-50 border-green-200"
            });
        }
    };

    const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

    const shuffledServices = useMemo(() => {
        return [...servicesData].sort(() => Math.random() - 0.5);
    }, [servicesData]);

    const filteredServices = useMemo(() => {
        return shuffledServices.filter(service => {
            // Category filter
            if (selectedCategory !== "all" && service.category !== selectedCategory) {
                return false;
            }

            // Price filter (cleaning the price string "25,000 ج.م" to number)
            const priceValue = parseInt(service.price.replace(/[^\d]/g, '')) || 0;
            if (priceValue > appliedPriceLimit) {
                return false;
            }

            // Search query
            if (searchQuery && !service.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            return true;
        });
    }, [selectedCategory, appliedPriceLimit, searchQuery, shuffledServices]);

    const sortedServices = useMemo(() => {
        const sorted = [...filteredServices];
        if (sortOption === "الأعلى تقييماً") {
            sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        } else if (sortOption === "الأقل سعراً") {
            sorted.sort((a, b) => {
                const priceA = parseInt(a.price.replace(/[^\d]/g, '')) || 0;
                const priceB = parseInt(b.price.replace(/[^\d]/g, '')) || 0;
                return priceA - priceB;
            });
        }
        return sorted;
    }, [filteredServices, sortOption]);

    const totalPages = Math.ceil(sortedServices.length / ITEMS_PER_PAGE);
    const paginatedServices = sortedServices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (<div className="container mx-auto px-4 py-8 flex-1">
      <button onClick={toggleFilter} className="md:hidden w-full bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl mb-6 flex items-center justify-center gap-2 shadow-sm">
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
            <input 
              type="text" 
              placeholder="اسم القاعة، الفستان..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border  rounded-xl focus:ring-2 focus:ring-[#8c71af] focus:outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-sm text-gray-500 uppercase">القسم</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-pink-50 hover:border-border/20 border border-transparent p-2 rounded-lg transition">
                <input 
                  type="radio" 
                  name="category" 
                  className="accent-[#8c71af] w-5 h-5 focus:ring-[#8c71af]" 
                  checked={selectedCategory === "all"}
                  onChange={() => setSelectedCategory("all")}
                />
                <span className="font-bold text-gray-700">الكل</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-pink-50 hover:border-border/20 border border-transparent p-2 rounded-lg transition">
                <input 
                  type="radio" 
                  name="category" 
                  className="accent-[#8c71af] w-5 h-5 focus:ring-[#8c71af]"
                  checked={selectedCategory === "venue"}
                  onChange={() => setSelectedCategory("venue")}
                />
                <span className="font-bold text-gray-700">قاعات أفراح</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-pink-50 hover:border-border/20 border border-transparent p-2 rounded-lg transition">
                <input 
                  type="radio" 
                  name="category" 
                  className="accent-[#8c71af] w-5 h-5 focus:ring-[#8c71af]"
                  checked={selectedCategory === "dress"}
                  onChange={() => setSelectedCategory("dress")}
                />
                <span className="font-bold text-gray-700">فساتين زفاف</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-pink-50 hover:border-border/20 border border-transparent p-2 rounded-lg transition">
                <input 
                  type="radio" 
                  name="category" 
                  className="accent-[#8c71af] w-5 h-5 focus:ring-[#8c71af]"
                  checked={selectedCategory === "makeup"}
                  onChange={() => setSelectedCategory("makeup")}
                />
                <span className="font-bold text-gray-700">ميك أب آرتيست</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-pink-50 hover:border-border/20 border border-transparent p-2 rounded-lg transition">
                <input 
                  type="radio" 
                  name="category" 
                  className="accent-[#8c71af] w-5 h-5 focus:ring-[#8c71af]"
                  checked={selectedCategory === "photography"}
                  onChange={() => setSelectedCategory("photography")}
                />
                <span className="font-bold text-gray-700">تصوير</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-3 text-sm text-gray-500 uppercase">الحد الأقصى للسعر</h3>
            
            <input type="range" dir="ltr" className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4" min="1000" max="100000" step="500" value={priceLimit} onChange={(e) => setPriceLimit(parseInt(e.target.value))}/>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-bold text-sm">أقصى سعر:</span>
              <input type="number" className="w-full p-2 border border-gray-300 rounded-lg text-gradient-primary font-bold text-center focus:ring-2 focus:ring-[#8c71af] outline-none" value={priceLimit} 
                onChange={(e) => setPriceLimit(e.target.value === '' ? '' : parseInt(e.target.value))}
                onBlur={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1000) setPriceLimit(1000);
                  else if (val > 100000) setPriceLimit(100000);
                }}
              />
              <span className="text-gray-400 font-bold text-sm">ج.م</span>
            </div>
          </div>

          <button onClick={handleApplyFilters} disabled={isFiltering} className="w-full bg-gradient-primary text-white py-3 rounded-xl font-bold cursor-pointer transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(140,113,175,0.6)] hover:-translate-y-1 hover:brightness-110 flex items-center justify-center gap-2">
            {isFiltering ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                جاري البحث...
              </>
            ) : "تطبيق الفلتر"}
          </button>
        </aside>

        {/* Main Content */}
        <section className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">أحدث العروض <span className="text-gradient-primary text-sm font-bold ml-2">({sortedServices.length} نتيجة)</span></h1>
            <div className="w-48">
              <CustomSelect 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                options={["الأحدث", "الأقل سعراً", "الأعلى تقييماً"]}
                className="bg-white border text-gray-700 font-bold p-2.5 rounded-lg text-sm focus:ring-1 focus:ring-[#8c71af] hover:border-[#8c71af] transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isFiltering ? (
              Array(6).fill(0).map((_, i) => (
                <div key={`skel-${i}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col animate-pulse">
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="mt-auto flex justify-between items-center border-t pt-4">
                      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : loadingServices ? (
               <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                   <div className="relative w-12 h-12 mb-4">
                       <div className="absolute inset-0 rounded-full border-3 border-t-transparent border-[#8c71af] animate-spin"></div>
                   </div>
                   <p className="text-gray-500 font-bold animate-pulse">جاري تحميل الخدمات... ✨</p>
               </div>
            ) : paginatedServices.length > 0 ? (
              paginatedServices.map((service) => (<div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group border border-gray-100 flex flex-col">
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={service.name}/>
                  <span className="absolute top-3 right-3 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">{service.typeLabel}</span>
                  <button onClick={(e) => toggleFavoriteBtn(e, service.id)} className="absolute top-3 left-3 bg-white/50 hover:bg-white p-2 rounded-full transition text-red-500">
                    {favorites.includes(service.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l group-hover:from-blue-900 group-hover:via-[#8c71af] group-hover:to-pink-300 transition">{service.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">⭐ {service.rating}</div>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">📍 {service.location}</p>
                  <div className="mt-auto flex justify-between items-center border-t pt-4">
                    <div>
                      <span className="block text-xs text-gray-400">{service.priceLabel}</span>
                      <span className="font-bold text-gradient-primary text-lg">{service.price}</span>
                    </div>
                    <Link href={`/services/${service.id}`} className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gradient-to-br hover:from-blue-900 hover:to-[#8c71af] transition shadow hover:shadow-md transform hover:-translate-y-0.5">
                      التفاصيل
                    </Link>
                  </div>
                </div>
              </div>))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">مفيش نتائج مطابقة</h3>
                <p className="text-gray-500">جربي تغيري فلاتر البحث أو اختاري أقسام تانية.</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2 font-bold">
              <button 
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="cursor-pointer w-10 h-10 rounded-lg border border-gray-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-pink-50 hover:border-border/30 hover-text-gradient-primary flex items-center justify-center text-gray-500 transition disabled:opacity-50"
              >‹</button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`cursor-pointer w-10 h-10 rounded-lg flex items-center justify-center transition ${
                    currentPage === page 
                      ? "bg-gradient-primary text-white font-bold shadow-lg transform hover:-translate-y-0.5" 
                      : "border border-gray-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-pink-50 hover:border-border/30 hover-text-gradient-primary text-gray-500"
                  }`}
                >{page}</button>
              ))}

              <button 
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="cursor-pointer w-10 h-10 rounded-lg border border-gray-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-pink-50 hover:border-border/30 hover-text-gradient-primary flex items-center justify-center text-gray-500 transition disabled:opacity-50"
              >›</button>
            </div>
          )}
        </section>
      </div>
    </div>);
}
