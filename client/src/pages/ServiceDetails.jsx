import { useState, useMemo, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { CustomSelect } from "../components/ui/CustomSelect";
import { API_URL } from "../config";
import { useAuth } from "../hooks/use-auth";
import { Facebook, Instagram } from "lucide-react";

export default function ServiceDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const [, setLocation] = useLocation();
    const [service, setService] = useState(null);
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState("");
    const [chatSent, setChatSent] = useState(false);
    const [chatSending, setChatSending] = useState(false);

    // Reviews State
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const averageRating = useMemo(() => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / reviews.length).toFixed(1);
    }, [reviews]);

    const reviewsCount = reviews ? reviews.length : 0;

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                // Fetch specific service
                const res = await fetch(`${API_URL}/services/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    
                    setService({
                        id: data.id,
                        name: data.name,
                        category: data.category || 'venue',
                        typeLabel: data.category === 'venue' ? 'قاعة' : data.category === 'dress' ? 'فستان' : data.category === 'makeup' ? 'ميك أب' : 'تصوير',
                        rating: "4.9",
                        // Mock data as fallback for newly added fields if the backend hasn't been updated yet
                        location: data.location || data.user?.governorate || "القاهرة",
                        address: data.user?.address || "شيراتون المطار، خلف نادي النصر",
                        bio: data.user?.bio || null,
                        logoUrl: data.user?.logoUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=60",
                        facebook: data.user?.facebook || "https://facebook.com",
                        instagram: data.user?.instagram || "https://instagram.com",
                        priceLabel: data.category === 'dress' ? 'إيجار' : 'يبدأ من',
                        price: data.price || "0 ج.م",
                        image: data.imageUrl || "https://via.placeholder.com/500",
                        vendorName: data.user ? data.user.fullName : "إدارة الخدمة"
                    });
                }
                
                // Fetch all services for "similar items"
                const allRes = await fetch(`${API_URL}/services/all`);
                if (allRes.ok) {
                    const allData = await allRes.json();
                    setAllServices(allData.map(s => ({
                        id: s.id,
                        name: s.name,
                        category: s.category || 'venue',
                        price: s.price || "0 ج.م",
                        image: s.imageUrl || "https://via.placeholder.com/500"
                    })));
                }
            } catch (error) {
                console.error("Error fetching service details:", error);
            }
            setLoading(false);
        };
        fetchServiceData();
    }, [id]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/reviews/service/${id}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoadingReviews(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchReviews();
        }
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        if (!newComment.trim()) return;

        setIsSubmittingReview(true);
        setSubmitError("");

        try {
            const res = await fetch(`${API_URL}/reviews/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    serviceId: parseInt(id),
                    userId: user.id,
                    comment: newComment.trim(),
                    rating: newRating
                })
            });

            if (res.ok) {
                setNewComment("");
                setNewRating(5);
                await fetchReviews();
            } else {
                const errData = await res.json().catch(() => ({}));
                setSubmitError(errData.message || "حدث خطأ أثناء إضافة التقييم. حاول مرة أخرى.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            setSubmitError("فشل الاتصال بالخادم. تأكد من اتصالك بالإنترنت.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const images = useMemo(() => {
        if (!service) return [];
        const relatedImages = allServices
            .filter(s => s.category === service.category && s.id !== service.id)
            .slice(0, 3)
            .map(s => s.image);
            
        return [service.image, ...relatedImages];
    }, [service, allServices]);

    const [mainImage, setMainImage] = useState("");
    const [animateImage, setAnimateImage] = useState(false);

    // Form State
    const [eventType, setEventType] = useState("زفاف");
    const [bookingDate, setBookingDate] = useState("");
    const [guests, setGuests] = useState("100 - 300 شخص");

    useEffect(() => {
        if (service) setMainImage(service.image);
    }, [service]);

    const handleImageChange = (img) => {
        setAnimateImage(true);
        setTimeout(() => {
            setMainImage(img);
            setAnimateImage(false);
        }, 150);
    };

    const handleSendChat = async () => {
        if (!user) { setLocation("/auth"); return; }
        if (!chatMessage.trim() || !service) return;
        setChatSending(true);
        try {
            const svcRes = await fetch(`${API_URL}/services/${service.id}`);
            const svcData = await svcRes.json();
            const vendorId = svcData.user?.id;
            if (!vendorId) return;
            const res = await fetch(`${API_URL}/messages/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: user.id,
                    receiverId: vendorId,
                    content: chatMessage.trim(),
                }),
            });
            if (res.ok) {
                setChatSent(true);
                setChatMessage("");
            }
        } catch (err) {
            console.error("Chat error:", err);
        } finally {
            setChatSending(false);
        }
    };

    if (loading) {
        return <div className="flex-1 flex items-center justify-center py-32 font-bold text-gray-500">جاري تحميل التفاصيل...</div>;
    }

    if (!service) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-32 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">عذراً، الخدمة غير موجودة</h2>
                <p className="text-gray-500 mb-6">الخدمة التي تبحثون عنها غير متاحة أو تم إزالتها.</p>
                <Link href="/services"><button className="bg-gradient-primary text-white px-8 py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition">العودة للخدمات</button></Link>
            </div>
        );
    }

    // Dynamic content generation details based on category
    const renderDescription = () => {
        // If the vendor has set a specific bio, show it instead of generic text!
        if (service.bio) {
            return service.bio;
        }

        if (service.category === 'venue') {
            return `تقدم ${service.name} تجربة لا تُنسى بأفضل المعايير. مساحة واسعة، ديكورات مودرن بأحدث صيحات 2026، وفريق كامل لتنظيم الإضاءة والصوت لضمان ليلة عمر مثالية.`;
        } else if (service.category === 'dress') {
            return `تألقي في ليلة العمر مع ${service.name}. الفستان مصنوع من أجود الخامات بأحدث التصميمات العالمية ليمنحك إطلالة ملكية تخطف الأنظار. متوفر بمقاسات مختلفة مع إمكانية التعديل.`;
        } else if (service.category === 'makeup') {
            return `احصلي على إطلالة مثالية تدوم طوال اليوم مع ${service.name}. نستخدم أفضل الماركات العالمية لضمان ثبات الميك أب وإبراز جمالك الطبيعي في أهم يوم بحياتك.`;
        } else {
            return `نتميز بتقديم خدمة ${service.name} بأعلى مستوى من الاحترافية والجودة. اختيارك الأمثل ليومك المميز في ${service.location}.`;
        }
    };

    const renderFeatures = () => {
        if (service.category === 'venue') {
            return (
                <>
                    <li className="flex items-center gap-2">✅ تكييف مركزي</li>
                    <li className="flex items-center gap-2">✅ جراج خاص (Parking)</li>
                    <li className="flex items-center gap-2">✅ غرفة للعروسة</li>
                    <li className="flex items-center gap-2">✅ بوفيه مفتوح</li>
                    <li className="flex items-center gap-2">✅ دي جي وساوند سيستم</li>
                    <li className="flex items-center gap-2">✅ تصوير فيديو HD</li>
                </>
            );
        } else if (service.category === 'dress') {
            return (
                <>
                    <li className="flex items-center gap-2">✅ خامات مستوردة عالية الجودة</li>
                    <li className="flex items-center gap-2">✅ مقاسات مختلفة وتعديلات مجانية</li>
                    <li className="flex items-center gap-2">✅ أحدث تصميمات 2026</li>
                    <li className="flex items-center gap-2">✅ طرحة وإكسسوارات مطابقة</li>
                    <li className="flex items-center gap-2">✅ بروفة قبل الموعد بـ 3 أيام</li>
                    <li className="flex items-center gap-2">✅ الغسيل والكي مجاني</li>
                </>
            );
        } else {
            return (
                <>
                    <li className="flex items-center gap-2">✅ خدمة عملاء 24/7</li>
                    <li className="flex items-center gap-2">✅ التزام تام بالمواعيد</li>
                    <li className="flex items-center gap-2">✅ أسعار تنافسية</li>
                    <li className="flex items-center gap-2">✅ أعلى جودة في التنفيذ</li>
                </>
            );
        }
    };
    return (<>
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#8c71af] transition">الرئيسية</Link> <span>/</span>
          <Link href={`/services?category=${service.category}`} className="hover:text-[#8c71af] transition">{service.category === 'venue' ? 'القاعات' : service.category === 'dress' ? 'الفساتين' : 'الخدمات'}</Link> <span>/</span>
          <span className="text-gray-800 font-bold">{service.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Details Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="h-[400px] overflow-hidden rounded-xl mb-4 relative group">
                <img src={mainImage} className={`w-full h-full object-cover transition-opacity duration-300 ${animateImage ? 'opacity-50' : 'opacity-100'}`} alt={service.name}/>
                <span className="absolute top-4 right-4 bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">{service.typeLabel} مميز</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {images.map((img, idx) => (<img key={idx} onClick={() => handleImageChange(img)} src={img} className={`w-24 h-24 rounded-lg object-cover cursor-pointer border-2 transition-all duration-200 ${mainImage === img ? ' opacity-100 border-[#8c71af]' : 'border-transparent opacity-70 hover:opacity-100'}`} alt="Thumbnail"/>))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{service.name}</h1>
                  <p className="text-gray-500 flex items-center gap-2">📍 {service.location} - {service.address}</p>
                </div>
                <div className="flex flex-col items-end">
                  {reviewsCount > 0 ? (
                    <>
                      <div className="flex text-yellow-500 text-lg mb-1">
                        {"★".repeat(Math.round(parseFloat(averageRating)))}{"☆".repeat(5-Math.round(parseFloat(averageRating)))}
                      </div>
                      <span className="text-sm text-gray-400 font-bold">{averageRating} ({reviewsCount} تقييم)</span>
                    </>
                  ) : (
                    <>
                      <div className="flex text-gray-300 text-lg mb-1">☆☆☆☆☆</div>
                      <span className="text-sm text-gray-400 font-medium">لا توجد تقييمات</span>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 my-6"></div>

              <h3 className="text-xl font-bold text-gray-800 mb-4">عن {service.typeLabel}</h3>
              <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap">
                {renderDescription()}
              </p>

              <h3 className="text-xl font-bold text-gray-800 mb-4">المميزات</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                {renderFeatures()}
              </ul>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">آراء العرايس ({reviewsCount})</h3>
                <p className="text-sm text-gray-500">آراء وتجارب حقيقية من عرايس زغروتة</p>
              </div>
              
              {loadingReviews ? (
                <div className="text-gray-500 text-center py-4">جاري تحميل الآراء...</div>
              ) : reviews.length === 0 ? (
                <div className="bg-gray-50/50 rounded-2xl p-6 text-center border border-dashed border-gray-100">
                  <p className="text-gray-500 text-sm">لا توجد آراء بعد. كوني أول من يشاركنا رأيه!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((r, index) => {
                    const initials = r.user?.fullName ? r.user.fullName.trim().charAt(0) : "ع";
                    return (
                      <div key={r.id}>
                        {index > 0 && <hr className="border-gray-100 mb-6"/>}
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-50 to-[#8c71af]/10 rounded-full flex items-center justify-center font-bold text-[#8c71af] shadow-sm">
                            {initials}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-800">{r.user?.fullName || "عروسة مجهولة"}</h4>
                              <span className="text-xs text-gray-400">{r.createdAt ? r.createdAt.split(' ')[0] : ''}</span>
                            </div>
                            <div className="text-yellow-500 text-xs mb-1">
                              {"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Review Form */}
              <div className="border-t border-gray-100 pt-8 mt-8">
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-800">اكتبي رأيك وتجربتك</h4>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-700">تقييمك بالنجوم:</span>
                      <div className="flex gap-1 text-2xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform duration-100 hover:scale-125 focus:outline-none cursor-pointer"
                          >
                            <span className={(hoverRating || newRating) >= star ? "text-yellow-500" : "text-gray-200"}>
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="شاركينا تفاصيل تجربتك مع هذا المورد..."
                        rows={3}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8c71af]/30 focus:border-[#8c71af] resize-none transition font-medium"
                        required
                      />
                      {submitError && <p className="text-xs text-red-500 mt-1">{submitError}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview || !newComment.trim()}
                      className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmittingReview ? "جاري الإضافة..." : "إضافة تقييمك القيم ✨"}
                    </button>
                  </form>
                ) : (
                  <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-6 text-center">
                    <p className="text-gray-600 text-sm mb-3">سجلي دخولك لتشاركينا رأيك وتقييمك للمورد!</p>
                    <Link href="/auth">
                      <button className="bg-gradient-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:opacity-90 transition">
                        تسجيل الدخول / إنشاء حساب
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Action */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-border/20 sticky top-24">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-gray-400 text-sm block">{service.priceLabel}</span>
                  <span className="text-3xl font-black text-gradient-primary">{service.price}</span>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">نوع المناسبة</label>
                  <CustomSelect 
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    options={["خطوبة", "عقد قران", "زفاف", "حفلة تخرج"]}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af] text-gray-700 font-bold hover:border-[#8c71af] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ المناسبة</label>
                  <input 
                    type="date" 
                    required 
                    value={bookingDate} 
                    onChange={(e) => setBookingDate(e.target.value)} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af] outline-none text-gray-700 font-bold" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">عدد المدعوين</label>
                  <CustomSelect 
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    options={["أقل من 100", "100 - 300 شخص", "300 - 500 شخص", "أكثر من 500 شخص"]}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8c71af] text-gray-700 font-bold hover:border-[#8c71af] transition"
                  />
                </div>

                <Link href={`/checkout?serviceId=${service.id}&date=${bookingDate}&eventType=${eventType}&guests=${guests}`}>
                  <button type="button" disabled={!bookingDate} className="mt-4 w-full bg-gradient-primary text-white py-4 rounded-xl font-bold shadow-md hover:opacity-90 hover:shadow-lg transition transform hover:-translate-y-1 flex justify-center items-center gap-2 text-lg disabled:opacity-50 disabled:transform-none">
                    <span>📅</span> احجز الميعاد
                  </button>
                </Link>

                <button
                  type="button"
                  onClick={() => { setIsChatOpen(true); setChatSent(false); }}
                  className="w-full bg-white border-2 border-border/30 text-[#8c71af] py-3 rounded-xl font-bold hover:bg-[#8c71af]/5 transition flex justify-center items-center gap-2 cursor-pointer">
                  <span>💬</span> شات مع المورد
                </button>
              </form>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-xs text-gray-400 mb-3">هذا المورد موثوق وتم التحقق منه ✅</p>
                <div className="flex items-center justify-center gap-3">
                  <img src={service.logoUrl} className="w-12 h-12 rounded-full object-cover border-2 border-pink-100 shadow-sm" alt="Vendor Logo"/>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">إدارة {service.vendorName || service.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">متواجد للرد السريع</p>
                      {(service.facebook || service.instagram) && <span className="text-gray-300">|</span>}
                      {service.facebook && (
                          <a href={service.facebook} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 transition">
                              <Facebook size={14} />
                          </a>
                      )}
                      {service.instagram && (
                          <a href={service.instagram} target="_blank" rel="noreferrer" className="text-pink-600 hover:text-pink-700 transition">
                              <Instagram size={14} />
                          </a>
                      )}
                    </div>
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
            {allServices.filter(s => s.category === service.category && s.id !== service.id).slice(0, 3).map(similar => (
                <Link key={similar.id} href={`/services/${similar.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition block">
                <img src={similar.image} className="h-40 w-full object-cover" alt={similar.name}/>
                <div className="p-4">
                    <h3 className="font-bold text-gray-800 truncate">{similar.name}</h3>
                    <p className="text-gradient-primary font-bold text-sm">{similar.price}</p>
                </div>
                </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsChatOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">💬 رسالة لـ {service?.vendorName}</h3>
              <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-red-500 transition text-xl">✕</button>
            </div>
            <div className="p-5">
              {chatSent ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-3">✅</div>
                  <p className="font-bold text-gray-800">تم إرسال رسالتك!</p>
                  <p className="text-sm text-gray-500 mt-1">هيرد عليك المورد قريباً</p>
                  <button onClick={() => setIsChatOpen(false)} className="mt-4 bg-gradient-primary text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition">تمام</button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-3">اكتب رسالتك للمورد وهيرد عليك في أقرب وقت</p>
                  <textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="مثال: هل القاعة متاحة في مايو؟"
                    rows={4}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8c71af]/30 focus:border-[#8c71af] resize-none transition"
                  />
                  {!user && <p className="text-xs text-red-500 mt-1">يجب تسجيل الدخول أولاً لإرسال رسالة</p>}
                  <button
                    onClick={handleSendChat}
                    disabled={!chatMessage.trim() || chatSending}
                    className="mt-3 w-full bg-gradient-primary text-white py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                  >
                    {chatSending ? "جاري الإرسال..." : "إرسال الرسالة 📨"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>);
}
