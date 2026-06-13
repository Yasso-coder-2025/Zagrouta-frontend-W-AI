import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Sparkles, X, Send, Bot, MapPin, Calendar, HelpCircle, ArrowRight, User } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { SERVICES_DATA } from "../../lib/data";

export const intents = [
  {
    keys: ["شكرا", "شكرًا", "مرسي", "تسلم", "حبيبتي", "thanks", "thank you", "chokran", "shokran"],
    reply: {
      ar: "على الرحب والسعة يا عروسة! 🥰 أنا هنا دائماً لخدمتكِ ومساعدتكِ في جعل فرحكِ ليلة العمر. لو عندكِ أي سؤال تاني متتردديش تسألي!",
      en: "You are welcome, Bride! 🥰 I am always here to serve you and help make your wedding perfect. If you have any other questions, don't hesitate to ask!"
    }
  },
  {
    keys: ["سلام", "هلو", "هاي", "مرحبا", "أهلاً", "صباح", "مساء", "hi", "hello", "hey", "welcome"],
    reply: {
      ar: "أهلاً بكِ يا عروسة! نورتي زغروطة ✨ أنا مساعدكِ الذكي لمساعدتكِ في التخطيط لفرحكِ. تحبي تسألي عن القاعات، الفساتين، الميك أب، ولا المصورين؟",
      en: "Welcome, Bride! ✨ I am your smart assistant here to help you plan your wedding. Would you like to ask about venues, dresses, makeup, or photography?"
    }
  },
  {
    keys: ["باي", "مع السلامة", "اشوفك بعدين", "bye", "goodbye"],
    reply: {
      ar: "مع السلامة يا عروسة! فرصة سعيدة جداً بمساعدتكِ اليوم، وأتمنى لكِ رحلة تخطيط سعيدة لليلة العمر. في رعاية الله! 👋💖",
      en: "Goodbye, Bride! It was a pleasure helping you today. I wish you a happy wedding planning journey. Take care! 👋💖"
    }
  },
  {
    keys: ["جميل", "حلو", "لذيذ", "رائع", "جامد", "nice", "great", "cool", "wonderful", "perfect", "ممتاز"],
    reply: {
      ar: "تسلمي يا رب! ده من ذوقكِ الراقي 💖 زغروطة دايماً في الخدمة عشان نسهل عليكي كل تفاصيل الفرح. قوليلي، هل بتدوري على خدمة معينة دلوقتي؟",
      en: "Thank you so much! That's very kind of you 💖 Zagrouta is always here to make your wedding details simple. Tell me, are you looking for a specific service right now?"
    }
  },
  {
    keys: ["ايه هو زغروطة", "يعني ايه زغروطة", "ايه الموقع ده", "zagrouta", "ما هو زغروطة", "منصة زغروطة"],
    reply: {
      ar: "زغروطة هي منصتكِ الأولى لتجهيز الفرح في مصر! 👰✨ بنجمعلكِ أفضل قاعات الأفراح، الأتيليهات للفساتين، الميك أب آرتيست، والمصورين في مكان واحد لتوفير وقتكِ ومجهودكِ مع أسعار خاصة وعروض حصرية لعرايس زغروطة.",
      en: "Zagrouta is your premier wedding preparation platform in Egypt! 👰✨ We bring together the best wedding venues, dress ateliers, makeup artists, and photographers in one place to save your time and effort with exclusive rates and offers."
    }
  },
  {
    keys: ["مضمون", "موثوق", "حقيقي", "نصابين", "أمان", "safe", "secure", "trust", "scam"],
    reply: {
      ar: "أكيد مضمون 100%! كل الموردين المسجلين على منصة زغروطة يتم التحقق من هوياتهم وسجل أعمالهم وجودة خدماتهم بعناية. كما أن نظام الحجز وتأكيد العربون مشفر وآمن بالكامل لضمان حقوقكِ وحقوق الموردين. 🔒✨",
      en: "Yes, 100% secure! All vendors registered on Zagrouta are verified for identity, background, and service quality. Our booking and deposit payment system is fully encrypted and safe to protect both you and the vendors. 🔒✨"
    }
  },
  {
    keys: ["خصم", "خصومات", "عرض", "عروض", "تخفيض", "discount", "offers", "sale"],
    reply: {
      ar: "عرايس زغروطة ليهم دايماً عروض وخصومات حصرية! 🎁 يمكنكِ تصفح قسم 'خدمات مميزة لليلة العمر' في الصفحة الرئيسية لرؤية أحدث العروض والخصومات النشطة حالياً.",
      en: "Zagrouta brides always get exclusive offers and discounts! 🎁 You can browse the 'Featured Services' section on the homepage to view the latest active discounts and deals."
    }
  },
  {
    keys: ["فين فروعكم", "المحافظات", "اسكندرية", "محافظة ايه", "governorate", "branches", "مكانكم", "عنوانكم"],
    reply: {
      ar: "حالياً خدمات زغروطة تغطي محافظة القاهرة والجيزة بالكامل (التجمع، مدينة نصر، المهندسين، المعادي، الشيخ زايد، مصر الجديدة، الزمالك، الدقي، الهرم، وسط البلد). ونعمل حالياً على التوسع في جميع محافظات مصر قريباً جداً لتلبية طلبات كل العرايس! 🗺️✨",
      en: "Currently, Zagrouta covers Cairo and Giza governorates entirely (Fifth Settlement, Nasr City, Mohandessin, Maadi, Sheikh Zayed, Heliopolis, Zamalek, Dokki, Haram, Downtown). We are planning to expand to all of Egypt's governorates very soon! 🗺️✨"
    }
  },
  {
    keys: ["تسجيل مورد", "أنا مورد", "انضمام كمورد", "مورد جديد", "vendor", "join as vendor", "register vendor"],
    reply: {
      ar: "أهلاً بك معنا شريكاً لنجاح عرايسنا! 💼 للإنضمام كـ مورد في زغروطة، يرجى تسجيل حساب جديد واختيار نوع الحساب 'مورد' (Vendor)، ثم ملء بيانات الخدمات وأسعار الباقات وصور أعمالك لبدء استقبال الحجوزات فوراً!",
      en: "Welcome to our success network! 💼 To join as a vendor on Zagrouta, please register a new account and choose the 'Vendor' account type, then complete your services info, packages, prices, and portfolios to start receiving bookings!"
    }
  }
];

export default function AiAssistant() {
  const { lang, t } = useLanguage();
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Welcome Messages & Starters
  const welcomeText = lang === 'ar'
    ? "أهلاً بكِ يا عروسة! ✨ أنا مساعد زغروطة الذكي. يمكنني مساعدتكِ في العثور على أفضل القاعات، الفساتين، الميك أب آرتيست، والمصورين، والإجابة عن أي استفسار يخص الحجز والدفع على منصتنا. اسأليني عن أي شيء!"
    : "Welcome, Bride! ✨ I am the Zagrouta AI Assistant. I can help you find the best venues, dresses, makeup artists, photographers, and answer questions about booking or payment. Ask me anything!";

  const starters = lang === 'ar'
    ? [
        { label: "🏛️ قاعات أفراح في المعادي", query: "قاعات أفراح في المعادي" },
        { label: "👗 أرخص فساتين زفاف للإيجار", query: "أرخص فساتين زفاف للإيجار" },
        { label: "💄 ميك أب آرتيست في التجمع", query: "ميك أب آرتيست في التجمع" },
        { label: "💳 طريقة الحجز والدفع؟", query: "كيف أقوم بالحجز والدفع؟" }
      ]
    : [
        { label: "🏛️ Venues in Maadi", query: "wedding venues in Maadi" },
        { label: "👗 Cheapest wedding dresses", query: "cheapest wedding dresses" },
        { label: "💄 Makeup artists in Fifth Settlement", query: "makeup artist in fifth settlement" },
        { label: "💳 How to book & pay?", query: "How to book and pay?" }
      ];

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: welcomeText,
          timestamp: new Date()
        }
      ]);
    }
  }, [lang, welcomeText]);

  // AI Response generator
  const getAiResponse = (query) => {
    const q = query.toLowerCase().trim();
    let responseText = "";
    let matchedServices = [];

    // Check pre-defined conversational intents
    const matchedIntent = intents.find(intent => 
      intent.keys.some(key => q.includes(key))
    );

    if (matchedIntent) {
      return { text: matchedIntent.reply[lang] || matchedIntent.reply['ar'], services: [] };
    }

    // 1. Detect Category
    let category = null;
    if (q.includes("قاع") || q.includes("صالات") || q.includes("مكان") || q.includes("venue") || q.includes("hall")) {
      category = "venue";
    } else if (q.includes("فستان") || q.includes("فساتين") || q.includes("أتيليه") || q.includes("dress") || q.includes("gown")) {
      category = "dress";
    } else if (q.includes("ميك") || q.includes("ميكب") || q.includes("مكياج") || q.includes("آرتيست") || q.includes("makeup") || q.includes("artist")) {
      category = "makeup";
    } else if (q.includes("صور") || q.includes("تصوير") || q.includes("فوتو") || q.includes("سيشن") || q.includes("فيديو") || q.includes("كاميرا") || q.includes("photo") || q.includes("camera")) {
      category = "photography";
    }

    // 2. Detect Location
    let location = null;
    if (q.includes("تجمع") || q.includes("خامس") || q.includes("أول") || q.includes("tag")) {
      location = "التجمع";
    } else if (q.includes("نصر") || q.includes("nasr")) {
      location = "مدينة نصر";
    } else if (q.includes("مهندسين") || q.includes("mohand")) {
      location = "المهندسين";
    } else if (q.includes("معادي") || q.includes("maadi")) {
      location = "المعادي";
    } else if (q.includes("جديدة") || q.includes("هيليوبوليس") || q.includes("helio")) {
      location = "مصر الجديدة";
    } else if (q.includes("زايد") || q.includes("zayed")) {
      location = "الشيخ زايد";
    } else if (q.includes("زمالك") || q.includes("zamalek")) {
      location = "الزمالك";
    } else if (q.includes("دقي") || q.includes("dokki")) {
      location = "الدقي";
    } else if (q.includes("هرم") || q.includes("جيزة") || q.includes("pyramid") || q.includes("giza")) {
      location = "الهرم";
    } else if (q.includes("بلد") || q.includes("downtown")) {
      location = "وسط البلد";
    }

    // 3. Detect Price Modifier
    let priceFilter = null; // 'cheap' | 'expensive'
    if (q.includes("رخيص") || q.includes("أرخص") || q.includes("أقل سعر") || q.includes("cheap") || q.includes("budget")) {
      priceFilter = "cheap";
    } else if (q.includes("غالي") || q.includes("أغلى") || q.includes("أعلى سعر") || q.includes("أفخم") || q.includes("luxury") || q.includes("expensive")) {
      priceFilter = "expensive";
    }

    // 4. Query services data (only if user explicitly searches by category, location, or price filters)
    if (category || location || priceFilter) {
      matchedServices = SERVICES_DATA.filter(s => {
        let isMatch = true;
        if (category && s.category !== category) isMatch = false;
        if (location && !s.location.includes(location)) isMatch = false;
        return isMatch;
      });

      // Helper to parse price digits
      const parsePriceVal = (priceStr) => {
        return parseInt(priceStr.replace(/[^\d]/g, ''), 10) || 0;
      };

      // Sort by price modifier
      if (priceFilter === 'cheap') {
        matchedServices.sort((a, b) => parsePriceVal(a.price) - parsePriceVal(b.price));
      } else if (priceFilter === 'expensive') {
        matchedServices.sort((a, b) => parsePriceVal(b.price) - parsePriceVal(a.price));
      }
    }

    // Check specific topics if no filter category
    const isBookingQuery = q.includes("حجز") || q.includes("دفع") || q.includes("عربون") || q.includes("دفع") || q.includes("انستا") || q.includes("فودافون") || q.includes("كاش") || q.includes("book") || q.includes("pay") || q.includes("deposit");
    const isContactQuery = q.includes("تواصل") || q.includes("رقم") || q.includes("موبايل") || q.includes("ايميل") || q.includes("contact") || q.includes("call") || q.includes("support");
    const isGreeting = q.includes("سلام") || q.includes("هلو") || q.includes("هاي") || q.includes("مرحبا") || q.includes("أهلاً") || q.includes("صباح") || q.includes("مساء") || q.includes("hello") || q.includes("hi") || q.includes("hey");

    if (matchedServices.length > 0) {
      // Limit to 4 items
      matchedServices = matchedServices.slice(0, 4);
      if (lang === 'ar') {
        responseText = `لقد وجدت لكِ خدمات رائعة مطابقة لطلبكِ في زغروطة! يمكنكِ استعراض تفاصيلها وحجزها مباشرة:`;
      } else {
        responseText = `I found some wonderful services matching your request in Zagrouta! You can review details or add them to your cart directly:`;
      }
    } else if (isBookingQuery) {
      if (lang === 'ar') {
        responseText = `لتأكيد الحجز والدفع على منصة زغروطة، يرجى اتباع الآتي:
1. اختاري خدمات فرحكِ المفضلة من الموقع (قاعات، فساتين، ميك أب...).
2. حددي التاريخ، نوع المناسبة، وعدد المعازيم، واضغطي **"إضافة إلى العربة"**.
3. افتحي العربة من الأعلى واضغطي **"تأكيد وحجز كل الخدمات"**.
4. في صفحة الدفع، يمكنكِ سداد العربون المطلوب (2,500 ج.م للخدمة) إما عبر:
   - **InstaPay** (zagrouta@instapay)
   - **فودافون كاش** (01023456789)
   - **نقداً** في مقر المورد.
5. ارفعي صورة الإيصال لتأكيد حجزكِ فوراً!`;
      } else {
        responseText = `To confirm your booking & pay on Zagrouta, follow these steps:
1. Browse and select your favorite wedding services (venues, dresses, makeup, etc.).
2. Select the date, event type, and guests count, then click **"Add to Cart"**.
3. Open the cart from the top and click **"Checkout & Book All"**.
4. In the payment page, pay the required deposit (2,500 EGP per service) via:
   - **InstaPay** (zagrouta@instapay)
   - **Vodafone Cash** (01023456789)
   - **Cash** at the vendor's location.
5. Upload the transaction screenshot to confirm your date instantly!`;
      }
    } else if (isContactQuery) {
      if (lang === 'ar') {
        responseText = `يسعدنا جداً تواصلكِ معنا! فريق زغروطة متواجد لمساعدتكِ طوال اليوم:
📞 **الخط الساخن**: 19999
✉️ **البريد الإلكتروني**: support@zagrouta.com
📍 **المقر**: القاهرة، المعادي، شارع 9
أو يمكنكِ الذهاب لصفحة "تواصل معنا" وإرسال استفساركِ!`;
      } else {
        responseText = `We are delighted to assist you! The Zagrouta team is available to help:
📞 **Hotline**: 19999
✉️ **Email**: support@zagrouta.com
📍 **Address**: Cairo, Maadi, Street 9
Or you can go to our "Contact Us" page and send an inquiry!`;
      }
    } else if (isGreeting) {
      responseText = welcomeText;
    } else {
      if (lang === 'ar') {
        responseText = `عذراً يا عروسة، لم أجد نتائج مطابقة لـ "${query}" في قاعدة البيانات. 
جربي السؤال بشكل مختلف مثل: "قاعات في الزمالك" أو "أرخص فستان زفاف" أو "كيف أقوم بالحجز؟"`;
      } else {
        responseText = `Sorry, I couldn't find matching results for "${query}". 
Try asking differently like: "venues in Zamalek", "cheapest wedding dress", or "how to book a service?"`;
      }
    }

    return { text: responseText, services: matchedServices };
  };

  const handleSend = (textToSend) => {
    const val = textToSend || inputVal;
    if (!val.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: val,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAiResponse(val);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: response.text,
        services: response.services,
        timestamp: new Date()
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 850);
  };

  const handleCardClick = (id) => {
    setIsOpen(false);
    setLocation(`/services/${id}`);
  };

  const handleEndConversation = () => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: welcomeText,
        timestamp: new Date()
      }
    ]);
    setInputVal("");
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      {(!isOpen) && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-8 z-40 bg-gradient-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 hover:shadow-[0_0_20px_rgba(140,113,175,0.6)] cursor-pointer flex items-center justify-center animate-bounce-slow`}
          style={{ [lang === 'ar' ? 'left' : 'right']: '2rem' }}
          title={lang === 'ar' ? "اسألي مساعد زغروطة الذكي ✨" : "Ask Zagrouta AI Assistant ✨"}
        >
          <Sparkles className="h-6 w-6 animate-pulse" />
        </button>
      )}

      {/* Chat Window Container */}
      <div
        className={`fixed bottom-6 z-50 w-[92%] sm:w-full sm:max-w-md bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out origin-bottom ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'
        }`}
        style={{ [lang === 'ar' ? 'left' : 'right']: '1.5rem', height: '520px' }}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-primary text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl flex items-center justify-center">
              <Bot size={22} className="text-white" />
            </div>
            <div className="text-start">
              <h3 className="font-bold text-sm tracking-wide">
                {lang === 'ar' ? 'مساعد زغروطة الذكي ✨' : 'Zagrouta AI Assistant ✨'}
              </h3>
              <p className="text-[10px] text-pink-100 font-medium">
                {lang === 'ar' ? 'متواجد للرد على أسئلة فرحكِ' : 'Here to plan your dream wedding'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleEndConversation}
              className="text-[10px] bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer"
            >
              {lang === 'ar' ? 'إنهاء المحادثة' : 'End Chat'}
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-pink-50/10 to-white/50">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div 
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${isBot ? 'self-start text-start mr-auto' : 'self-end text-start ml-auto flex-row-reverse'}`}
                style={{ marginLeft: isBot ? '0' : 'auto', marginRight: isBot ? 'auto' : '0' }}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ${
                  isBot ? 'bg-[#8c71af]/10 text-[#8c71af]' : 'bg-pink-100 text-pink-600'
                }`}>
                  {isBot ? <Bot size={16} /> : <User size={16} />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-3.5">
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium shadow-sm ${
                    isBot 
                      ? 'bg-white text-gray-700 border border-gray-100 rounded-tr-none lang-ar:rounded-tr-2xl lang-ar:rounded-tl-none' 
                      : 'bg-gradient-primary text-white rounded-tl-none lang-ar:rounded-tl-2xl lang-ar:rounded-tr-none'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* Render Services Cards if present in AI response */}
                  {isBot && msg.services && msg.services.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-2">
                      {msg.services.map((item) => (
                        <div 
                          key={item.id}
                          className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col"
                          onClick={() => handleCardClick(item.id)}
                        >
                          <img src={item.image} className="h-20 w-full object-cover" alt={item.name} />
                          <div className="p-2.5 flex-1 flex flex-col text-start">
                            <h4 className="font-bold text-[11px] text-gray-800 truncate">{t(item.name)}</h4>
                            <p className="text-gray-400 text-[9px] truncate mt-0.5">📍 {t(item.location)}</p>
                            <div className="flex justify-between items-center mt-2 pt-1 border-t border-gray-50">
                              <span className="text-[10px] text-[#8c71af] font-bold">{item.price}</span>
                              <span className="text-[8px] text-blue-600 font-bold flex items-center gap-0.5">
                                {lang === 'ar' ? 'عرض' : 'View'} <ArrowRight size={8} className="lang-ar:rotate-180" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2.5 max-w-[80%] self-start text-start mr-auto" style={{ marginRight: 'auto' }}>
              <div className="w-8 h-8 rounded-xl bg-[#8c71af]/10 text-[#8c71af] flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-gray-100 p-3.5 rounded-2xl rounded-tr-none lang-ar:rounded-tr-2xl lang-ar:rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#8c71af] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#8c71af] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#8c71af] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Welcome Prompts List */}
          {messages.length === 1 && !isTyping && (
            <div className="pt-3 border-t border-gray-50 flex flex-col gap-2 text-start">
              <p className="text-[10px] text-gray-400 font-bold px-2 flex items-center gap-1">
                <HelpCircle size={12} /> {lang === 'ar' ? 'أسئلة مقترحة للبدء:' : 'Suggested questions:'}
              </p>
              <div className="flex flex-col gap-1.5">
                {starters.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s.query)}
                    className="text-gray-600 hover:text-[#8c71af] hover:bg-[#8c71af]/5 border border-gray-100 rounded-xl px-3 py-2 text-xs font-semibold text-start transition cursor-pointer bg-white"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Panel */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="p-3 border-t border-gray-100 bg-white flex gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={lang === 'ar' ? 'اسألي زغروطة...' : 'Ask Zagrouta...'}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-[#8c71af] transition font-medium"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="bg-gradient-primary text-white p-2.5 rounded-xl shadow-md hover:opacity-90 active:scale-95 disabled:opacity-50 transition cursor-pointer flex items-center justify-center"
          >
            <Send size={14} className="lang-ar:rotate-180" />
          </button>
        </form>
      </div>
    </>
  );
}
