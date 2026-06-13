import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
  ar: {
    // Navbar
    nav_home: "الرئيسية",
    nav_services: "الخدمات",
    nav_contact: "تواصل معنا",
    nav_login: "دخول / تسجيل",
    nav_profile: "حسابي",
    nav_logout: "تسجيل خروج",
    nav_welcome: "أهلاً بك، ",
    nav_guest: "يا عروسة",
    nav_notifications: "الإشعارات",
    nav_clear_all: "مسح الكل",
    nav_no_notifications: "لا توجد إشعارات جديدة",
    nav_messages: "رسائلي",

    // Footer
    footer_tagline: "منصتك الأولى لتجهيز الفرح من الإبرة للصاروخ. إحنا معاكي خطوة بخطوة.",
    footer_links: "روابط هامة",
    footer_contact: "تواصل معنا",
    footer_hotline: "الخط الساخن",
    footer_address: "القاهرة، مصر",
    footer_rights: "© 2026 جميع الحقوق محفوظة لمشروع زغروطة.",

    // Home Page
    hero_title: "كل اللي يلزم فرحك في مكان واحد",
    hero_subtitle: "خططي لفرحك بكل سهولة، من القاعة للفستان للميك أب آرتيست والمصورين. بنجمعلك أفضل الموردين بأفضل الأسعار.",
    hero_cta: "ابدأي التخطيط الآن ✨",
    search_placeholder: "بتدوري على إيه؟ (قاعة، فستان، ميك أب...)",
    search_btn: "ابحث",
    cat_title: "تصفحي بالأقسام",
    cat_venue: "قاعات أفراح",
    cat_dress: "فساتين زفاف",
    cat_makeup: "ميك أب آرتيست",
    cat_photo: "تصوير",
    featured_title: "خدمات مميزة لليلة العمر",
    featured_subtitle: "مجموعة مختارة من أفضل العروض والخدمات المتاحة للحجز الفوري",
    btn_more: "عرض المزيد",
    why_title: "ليه تختاري زغروطة؟",
    why_1_title: "توفير وقت ومجهود",
    why_1_desc: "كل الموردين في مكان واحد، قارني بين العروض واحجزي ميعادك بضغطة زر.",
    why_2_title: "أفضل الأسعار والعروض",
    why_2_desc: "خصومات وعروض حصرية لعرايس زغروطة مش هتلاقيها في أي مكان تاني.",
    why_3_title: "موردين موثوقين",
    why_3_desc: "كل الموردين على منصتنا تم التحقق من هويتهم وجودة خدماتهم لضمان راحتك.",
    cta_title: "جاهزة تبدأي تخطيط لليلة العمر؟",
    cta_subtitle: "سجلي حساب جديد وابدأي في حفظ عروضك المفضلة وتنسيق ميزانية فرحك.",
    cta_btn: "إنشاء حساب مجاني",

    // Services Page
    filter_title: "البحث المتقدم",
    filter_search: "اسم القاعة، الفستان...",
    filter_cat: "القسم",
    filter_cat_all: "الكل",
    filter_cat_venue: "قاعات أفراح",
    filter_cat_dress: "فساتين زفاف",
    filter_cat_makeup: "ميك أب آرتيست",
    filter_cat_photo: "تصوير",
    filter_max_price: "الحد الأقصى للسعر",
    filter_max_price_label: "أقصى سعر:",
    filter_currency: "ج.م",
    filter_apply: "تطبيق الفلتر",
    filter_loading: "جاري البحث...",
    filter_btn_mobile: "تصفية النتائج",
    results_offers: "أحدث العروض",
    results_count: "نتيجة",
    sort_label: "ترتيب حسب",
    sort_latest: "الأحدث",
    sort_price_low: "الأقل سعراً",
    sort_rating: "الأعلى تقييماً",
    btn_details: "التفاصيل",
    no_results_title: "مفيش نتائج مطابقة",
    no_results_desc: "جربي تغيري فلاتر البحث أو اختاري أقسام تانية.",
    loading_services: "جاري تحميل الخدمات... ✨",

    // Service Details
    path_home: "الرئيسية",
    path_venues: "القاعات",
    path_dresses: "الفساتين",
    path_services: "الخدمات",
    featured_label: "مميز",
    reviews_label: "تقييم",
    no_reviews: "لا توجد تقييمات",
    about_label: "عن",
    features_label: "المميزات",
    reviews_title: "آراء العرايس",
    reviews_subtitle: "آراء وتجارب حقيقية من عرايس زغروطة",
    loading_reviews: "جاري تحميل الآراء...",
    no_reviews_placeholder: "لا توجد آراء بعد. كوني أول من يشاركنا رأيه!",
    write_review: "اكتبي رأيك وتجربتك",
    star_rating_label: "تقييمك بالنجوم:",
    review_placeholder: "شاركينا تفاصيل تجربتك مع هذا المورد...",
    btn_add_review: "إضافة تقييمك القيم ✨",
    adding_review: "جاري الإضافة...",
    login_review_prompt: "سجلي دخولك لتشاركينا رأيك وتقييمك للمورد!",
    login_btn: "تسجيل الدخول / إنشاء حساب",
    booking_title: "حجز مسبق",
    booking_type: "نوع المناسبة",
    booking_date: "تاريخ المناسبة",
    booking_guests: "عدد المدعوين",
    btn_book: "احجز الميعاد",
    btn_chat: "شات مع المورد",
    verified_vendor: "هذا المورد موثوق وتم التحقق منه ✅",
    fast_response: "متواجد للرد السريع",
    similar_offers: "ممكن يعجبك كمان",
    loading_details: "جاري تحميل التفاصيل... ✨",
    loading_details_sub: "بندور على أحلى التفاصيل لليلة عمرك",
    service_not_found: "عذراً، الخدمة غير موجودة",
    service_not_found_desc: "الخدمة التي تبحثون عنها غير متاحة أو تم إزالتها.",
    btn_back_services: "العودة للخدمات",
    similar_category_dress: "فساتين",
    similar_category_venue: "قاعات",
    similar_category_makeup: "ميك أب",
    similar_category_photo: "تصوير",
    similar_category_all: "خدمات",

    // Event Types
    booking_type_engagement: "خطوبة",
    booking_type_marriage: "عقد قران",
    booking_type_wedding: "زفاف",
    booking_type_graduation: "حفلة تخرج",

    // Guest counts
    guests_under_100: "أقل من 100",
    guests_100_300: "100 - 300 شخص",
    guests_300_500: "300 - 500 شخص",
    guests_over_500: "أكثر من 500 شخص",

    // Chat Modal
    chat_title: "رسالة لـ",
    chat_success: "تم إرسال رسالتك!",
    chat_success_desc: "هيرد عليك المورد قريباً",
    chat_ok: "تمام",
    chat_prompt: "اكتب رسالتك للمورد وهيرد عليك في أقرب وقت",
    chat_placeholder: "مثال: هل القاعة متاحة في مايو؟",
    chat_login_required: "يجب تسجيل الدخول أولاً لإرسال رسالة",
    chat_send: "إرسال الرسالة 📨",
    chat_sending: "جاري الإرسال...",

    // Validation & Error Alerts
    checkout_login_alert: "يرجى تسجيل الدخول أولاً لإتمام الحجز",
    checkout_val_instapay_sender: "يرجى إدخال اسم الحساب المرسل منه لتأكيد تحويل InstaPay",
    checkout_val_instapay_receipt: "يرجى إرفاق صورة إيصال التحويل لتأكيد تحويل InstaPay",
    checkout_val_vodafone_sender: "يرجى إدخال رقم المحفظة المرسل منها بشكل صحيح (11 رقم)",
    checkout_val_vodafone_receipt: "يرجى إرفاق صورة إيصال التحويل لتأكيد تحويل فودافون كاش",
    checkout_error_booking: "حدث خطأ أثناء الحجز",
    checkout_error_server: "حدث خطأ في الاتصال بالخادم",
    checkout_terms_agree: "بإتمام الحجز أنت توافق على",
    checkout_terms_link: "الشروط والأحكام",

    // Checkout
    checkout_step: "خطوة 2 من 2: الدفع والتأكيد",
    checkout_title: "مراجعة الحجز والدفع",
    checkout_contact: "بيانات التواصل",
    checkout_name: "الاسم بالكامل",
    checkout_phone: "رقم الموبايل",
    checkout_notes: "ملاحظات إضافية للمورد (اختياري)",
    checkout_payment_method: "طريقة دفع العربون",
    checkout_instapay: "InstaPay (انستا باي)",
    checkout_instapay_desc: "تحويل فوري مباشر لعناوين انستا باي المعتمدة",
    checkout_instapay_addr: "عنوان انستا باي للدفع (InstaPay Address)",
    checkout_btn_copy: "نسخ العنوان",
    checkout_btn_copied: "تم النسخ",
    checkout_instapay_tip: "يرجى فتح تطبيق InstaPay وتحويل مبلغ العربون (2,500 ج.م) للعنوان أعلاه، ثم إدخال اسم الحساب المحول منه وإرفاق لقطة شاشة العملية.",
    checkout_instapay_sender: "اسم الحساب المحول منه (انستا باي) *",
    checkout_instapay_ref: "رقم المعاملة / مرجع التحويل (اختياري)",
    checkout_instapay_receipt: "إرفاق لقطة شاشة التحويل (صورة الإيصال) *",
    checkout_receipt_change: "تغيير الصورة",
    checkout_receipt_upload: "اضغط هنا أو اسحب صورة الإيصال للرفع",
    checkout_receipt_size: "PNG, JPG (حد أقصى 5 ميجابايت)",
    checkout_vodafone: "فودافون كاش (Vodafone Cash)",
    checkout_vodafone_desc: "تحويل مباشر لأي محفظة فودافون كاش",
    checkout_vodafone_number: "رقم محفظة فودافون كاش للدفع",
    checkout_vodafone_btn_copy: "نسخ الرقم",
    checkout_vodafone_tip: "يرجى تحويل مبلغ العربون (2,500 ج.م) للرقم أعلاه من محفظتك الإلكترونية، ثم إدخال رقم المحفظة المرسل منها وإرفاق صورة تأكيد التحويل.",
    checkout_vodafone_sender: "رقم الموبايل المحول منه المحفظة *",
    checkout_vodafone_ref: "رقم المعاملة / عملية التحويل (اختياري)",
    checkout_cash: "دفع نقدي (في المقر)",
    checkout_cash_desc: "يتم دفع العربون عند زيارة مقر المورد لتأكيد الاتفاق",
    checkout_summary: "ملخص الحجز 🧾",
    checkout_summary_date: "التاريخ:",
    checkout_summary_guests: "العدد:",
    checkout_summary_total: "إجمالي الباقة:",
    checkout_summary_deposit: "العربون المطلوب:",
    checkout_summary_deposit_val: "2,500 ج.م",
    checkout_terms: "بإتمام الحجز أنت توافق على الشروط والأحكام",
    checkout_btn_confirm: "تأكيد الحجز (2,500 ج.م)",
    checkout_btn_processing: "جاري معالجة التحويل...",
    checkout_secure: "🔒 دفع آمن ومشفر 100%",
    checkout_success_title: "تم الحجز بنجاح!",
    checkout_success_cash: "ألف مبروك! طلب الحجز وصل للمورد وهيتواصل معاك لتأكيد المعاد وتنسيق دفع العربون نقداً خلال 24 ساعة.",
    checkout_success_online: "ألف مبروك! طلب الحجز وصل للمورد مع إيصال الدفع الإلكتروني بنجاح. هيتأكد من التحويل ويتواصل معاك لتأكيد المعاد.",
    checkout_success_bookings_btn: "عرض حجوزاتي",
    checkout_success_home_btn: "العودة للرئيسية",
    loading_checkout: "جاري تجهيز بيانات الدفع... ✨",
    loading_checkout_sub: "دقائق وبنحضرلك تفاصيل الدفع الآمنة",

    // Contact Page
    contact_title: "يسعدنا سماع صوتك! 📞",
    contact_subtitle: "عندك استفسار عن حجز؟ أو عايز تنضم لينا كمورد؟ فريق زغروطة موجود عشان يساعدك في أي وقت.",
    contact_name: "الاسم بالكامل",
    contact_phone: "رقم للتواصل",
    contact_subject: "الموضوع",
    contact_subject_booking: "استفسار عن حجز",
    contact_subject_technical: "مشكلة تقنية في الموقع",
    contact_subject_suggestions: "اقتراحات",
    contact_subject_other: "أخرى",
    contact_message: "رسالتك",
    contact_message_placeholder: "اكتبي تفاصيل استفسارك هنا...",
    contact_send: "إرسال الرسالة",
    contact_address_title: "عنواننا",
    contact_address_val: "القاهرة، المعادي، شارع 9",
    contact_email_title: "البريد الإلكتروني",
    contact_whatsapp_title: "واتساب",
  },
  en: {
    // Navbar
    nav_home: "Home",
    nav_services: "Services",
    nav_contact: "Contact Us",
    nav_login: "Login / Register",
    nav_profile: "My Profile",
    nav_logout: "Logout",
    nav_welcome: "Welcome, ",
    nav_guest: "Guest",
    nav_notifications: "Notifications",
    nav_clear_all: "Clear All",
    nav_no_notifications: "No new notifications",
    nav_messages: "My Messages",

    // Footer
    footer_tagline: "Your first platform to prepare your wedding from A to Z. We are with you step by step.",
    footer_links: "Important Links",
    footer_contact: "Contact Us",
    footer_hotline: "Hotline",
    footer_address: "Cairo, Egypt",
    footer_rights: "© 2026 All rights reserved to Zagrouta Project.",

    // Home Page
    hero_title: "Everything your wedding needs in one place",
    hero_subtitle: "Plan your wedding with ease, from venue to dress to makeup artist and photographers. We bring you the best vendors at the best prices.",
    hero_cta: "Start Planning Now ✨",
    search_placeholder: "What are you looking for? (venue, dress, makeup...)",
    search_btn: "Search",
    cat_title: "Browse by Category",
    cat_venue: "Venues",
    cat_dress: "Dresses",
    cat_makeup: "Makeup Artists",
    cat_photo: "Photography",
    featured_title: "Featured Services for Your Special Night",
    featured_subtitle: "A curated collection of the best offers and services available for instant booking",
    btn_more: "Show More",
    why_title: "Why Choose Zagrouta?",
    why_1_title: "Save Time and Effort",
    why_1_desc: "All vendors in one place, compare offers and book your appointment with a click of a button.",
    why_2_title: "Best Prices and Offers",
    why_2_desc: "Exclusive discounts and offers for Zagrouta brides that you won't find anywhere else.",
    why_3_title: "Verified Vendors",
    why_3_desc: "All vendors on our platform are verified for identity and service quality to ensure your comfort.",
    cta_title: "Ready to start planning your dream night?",
    cta_subtitle: "Create a new account and start saving your favorite offers and planning your budget.",
    cta_btn: "Create Free Account",

    // Services Page
    filter_title: "Advanced Search",
    filter_search: "Search venue, dress...",
    filter_cat: "Category",
    filter_cat_all: "All",
    filter_cat_venue: "Wedding Venues",
    filter_cat_dress: "Wedding Dresses",
    filter_cat_makeup: "Makeup Artists",
    filter_cat_photo: "Photography",
    filter_max_price: "Max Price",
    filter_max_price_label: "Max Price:",
    filter_currency: "EGP",
    filter_apply: "Apply Filter",
    filter_loading: "Searching...",
    filter_btn_mobile: "Filter Results",
    results_offers: "Latest Offers",
    results_count: "results",
    sort_label: "Sort by",
    sort_latest: "Latest",
    sort_price_low: "Lowest Price",
    sort_rating: "Highest Rating",
    btn_details: "Details",
    no_results_title: "No Matching Results",
    no_results_desc: "Try changing search filters or selecting different categories.",
    loading_services: "Loading services... ✨",

    // Service Details
    path_home: "Home",
    path_venues: "Venues",
    path_dresses: "Dresses",
    path_services: "Services",
    featured_label: "Featured",
    reviews_label: "reviews",
    no_reviews: "No reviews",
    about_label: "About",
    features_label: "Features",
    reviews_title: "Brides Reviews",
    reviews_subtitle: "Real reviews and experiences from Zagrouta brides",
    loading_reviews: "Loading reviews...",
    no_reviews_placeholder: "No reviews yet. Be the first to share your opinion!",
    write_review: "Write your review & experience",
    star_rating_label: "Your Rating:",
    review_placeholder: "Share details of your experience with this vendor...",
    btn_add_review: "Add your review ✨",
    adding_review: "Adding...",
    login_review_prompt: "Login to share your review and rate this vendor!",
    login_btn: "Login / Create Account",
    booking_title: "Book",
    booking_type: "Event Type",
    booking_date: "Event Date",
    booking_guests: "Guests",
    btn_book: "Book Appointment",
    btn_chat: "Chat with Vendor",
    verified_vendor: "This vendor is trusted and verified ✅",
    fast_response: "Available for quick replies",
    similar_offers: "You might also like",
    loading_details: "Loading details... ✨",
    loading_details_sub: "Finding the best details for your special night",
    service_not_found: "Sorry, service not found",
    service_not_found_desc: "The service you are looking for is unavailable or has been removed.",
    btn_back_services: "Back to Services",
    similar_category_dress: "Dresses",
    similar_category_venue: "Venues",
    similar_category_makeup: "Makeup",
    similar_category_photo: "Photography",
    similar_category_all: "Services",

    // Event Types
    booking_type_engagement: "Engagement",
    booking_type_marriage: "Marriage Contract",
    booking_type_wedding: "Wedding",
    booking_type_graduation: "Graduation Party",

    // Guest counts
    guests_under_100: "Less than 100",
    guests_100_300: "100 - 300 guests",
    guests_300_500: "300 - 500 guests",
    guests_over_500: "More than 500 guests",

    // Chat Modal
    chat_title: "Message to",
    chat_success: "Your message has been sent!",
    chat_success_desc: "The vendor will reply to you soon",
    chat_ok: "OK",
    chat_prompt: "Write your message to the vendor and they will reply as soon as possible",
    chat_placeholder: "e.g. Is the venue available in May?",
    chat_login_required: "You must login first to send a message",
    chat_send: "Send Message 📨",
    chat_sending: "Sending...",

    // Validation & Error Alerts
    checkout_login_alert: "Please login first to complete the booking",
    checkout_val_instapay_sender: "Please enter the sender's account name to confirm the InstaPay transfer",
    checkout_val_instapay_receipt: "Please attach the transfer receipt image to confirm the InstaPay transfer",
    checkout_val_vodafone_sender: "Please enter a valid sender wallet number (11 digits)",
    checkout_val_vodafone_receipt: "Please attach the transfer receipt image to confirm the Vodafone Cash transfer",
    checkout_error_booking: "An error occurred during booking",
    checkout_error_server: "A server connection error occurred",
    checkout_terms_agree: "By completing the booking, you agree to the",
    checkout_terms_link: "Terms & Conditions",

    // Checkout
    checkout_step: "Step 2 of 2: Payment & Confirmation",
    checkout_title: "Review Booking & Payment",
    checkout_contact: "Contact Information",
    checkout_name: "Full Name",
    checkout_phone: "Phone Number",
    checkout_notes: "Additional notes for the vendor (optional)",
    checkout_payment_method: "Select Deposit Method",
    checkout_instapay: "InstaPay",
    checkout_instapay_desc: "Instant direct transfer to verified InstaPay addresses",
    checkout_instapay_addr: "InstaPay Address",
    checkout_btn_copy: "Copy Address",
    checkout_btn_copied: "Copied",
    checkout_instapay_tip: "Please open the InstaPay app and transfer the deposit amount (2,500 EGP) to the address above. Then, enter the sender's account name and attach the transaction receipt screenshot.",
    checkout_instapay_sender: "Sender Account Name (InstaPay) *",
    checkout_instapay_ref: "Transaction ID / Reference (optional)",
    checkout_instapay_receipt: "Attach Transfer Receipt (Screenshot) *",
    checkout_receipt_change: "Change Image",
    checkout_receipt_upload: "Click here or drag receipt image to upload",
    checkout_receipt_size: "PNG, JPG (max 5MB)",
    checkout_vodafone: "Vodafone Cash",
    checkout_vodafone_desc: "Direct transfer to any Vodafone Cash wallet",
    checkout_vodafone_number: "Vodafone Cash Number for Payment",
    checkout_vodafone_btn_copy: "Copy Number",
    checkout_vodafone_tip: "Please transfer the deposit amount (2,500 EGP) to the number above from your mobile wallet, then enter the sender's wallet number and attach the transfer receipt image.",
    checkout_vodafone_sender: "Sender Wallet Number *",
    checkout_vodafone_ref: "Transaction ID (optional)",
    checkout_cash: "Cash Payment (at Location)",
    checkout_cash_desc: "Pay the deposit when visiting the vendor's headquarters to confirm the agreement",
    checkout_summary: "Booking Summary 🧾",
    checkout_summary_date: "Date:",
    checkout_summary_guests: "Guests:",
    checkout_summary_total: "Total Package:",
    checkout_summary_deposit: "Required Deposit:",
    checkout_summary_deposit_val: "2,500 EGP",
    checkout_terms: "By completing the booking, you agree to the Terms & Conditions",
    checkout_btn_confirm: "Confirm Booking (2,500 EGP)",
    checkout_btn_processing: "Processing transfer...",
    checkout_secure: "🔒 100% Secure & Encrypted Payment",
    checkout_success_title: "Booking Confirmed Successfully!",
    checkout_success_cash: "Congratulations! Your booking request has reached the vendor. They will contact you to confirm the date and coordinate the cash deposit within 24 hours.",
    checkout_success_online: "Congratulations! Your booking request has reached the vendor with the electronic payment receipt. They will verify the transfer and contact you to confirm the date.",
    checkout_success_bookings_btn: "View My Bookings",
    checkout_success_home_btn: "Back to Home",
    loading_checkout: "Preparing payment details... ✨",
    loading_checkout_sub: "Just a moment while we set up secure payment details",

    // Contact Page
    contact_title: "We'd love to hear from you! 📞",
    contact_subtitle: "Have a question about a booking? Or want to join us as a vendor? The Zagrouta team is here to help you at any time.",
    contact_name: "Full Name",
    contact_phone: "Phone Number",
    contact_subject: "Subject",
    contact_subject_booking: "Booking Inquiry",
    contact_subject_technical: "Technical Issue",
    contact_subject_suggestions: "Suggestions",
    contact_subject_other: "Other",
    contact_message: "Your Message",
    contact_message_placeholder: "Write the details of your inquiry here...",
    contact_send: "Send Message",
    contact_address_title: "Our Address",
    contact_address_val: "Cairo, Maadi, Street 9",
    contact_email_title: "Email",
    contact_whatsapp_title: "WhatsApp",
  }
};

const serviceTranslations = {
  // Service Names
  "قاعة الماسة": "Al-Masa Venue",
  "فستان سندريلا": "Cinderella Dress",
  "سارة ميك أب": "Sarah Makeup",
  "قاعة فيرونا": "Verona Venue",
  "أتيليه ليلة العمر": "Laylat El-Omr Atelier",
  "نورا فوتوغرافي": "Noura Photography",
  "فستان زفاف ملكي": "Royal Wedding Dress",
  "فستان سندريلا تركي": "Turkish Cinderella Dress",
  "فستان سمبل أبيض": "Simple White Dress",
  "فستان بتطريز لؤلؤ": "Pearl Embroidered Dress",
  "فستان زفاف كلاسيكي": "Classical Wedding Dress",
  "فستان زفاف مودرن": "Modern Wedding Dress",
  "فستان منفوش أنيق": "Elegant Fluffy Dress",
  "فستان زفاف دانتيل": "Lace Wedding Dress",
  "فستان زفاف بسيط": "Simple Wedding Dress",
  "قاعة أوبرا هاوس": "Opera House Venue",
  "فيلا كليوباترا": "Cleopatra Villa",
  "قاعة اللؤلؤة": "Pearl Venue",
  "نادي حرس الحدود": "Border Guards Club",
  "قصر الأهرامات": "Pyramids Palace",
  "ريتز كارلتون النيل": "Nile Ritz Carlton",
  "رويال جاردنز": "Royal Gardens",
  "مروة عادل ميك أب": "Marwa Adel Makeup",
  "دينا راشد استوديو": "Dina Rashed Studio",
  "زينب علي": "Zainab Ali",
  "نوران أحمد ميك أب": "Nouran Ahmed Makeup",
  "ميادة محمود": "Mayada Mahmoud",
  "أحمد فوتوغرافي": "Ahmed Photography",
  "ستوديو العدسة الذهبية": "Golden Lens Studio",
  "إسلام فوتو سيشن": "Islam Photosession",
  "ستوديو اللحظة": "The Moment Studio",
  "كاميرا زفاف": "Wedding Camera",

  // Locations / Governorates
  "القاهرة": "Cairo",
  "مدينة نصر، القاهرة": "Nasr City, Cairo",
  "التجمع الخامس": "Fifth Settlement",
  "المهندسين": "Mohandessin",
  "المعادي، القاهرة": "Maadi, Cairo",
  "مصر الجديدة": "Heliopolis",
  "مدينة نصر": "Nasr City",
  "المعادي": "Maadi",
  "الشيخ زايد": "Sheikh Zayed",
  "الزمالك": "Zamalek",
  "هيليوبوليس": "Heliopolis",
  "الدقي": "Dokki",
  "التجمع الأول": "First Settlement",
  "الهرم، الجيزة": "Haram, Giza",
  "الهرم": "Haram",
  "وسط البلد": "Downtown",
  "الجيزة": "Giza",
  "شيراتون المطار، خلف نادي النصر": "Sheraton Airport, behind El-Nasr Club",
  "زينب علي - المعادي": "Zainab Ali - Maadi",
  "شيراتون المطار": "Sheraton Airport",
  "القاهرة، المعادي، شارع 9": "Cairo, Maadi, Street 9",
  
  // Vendor / Admin names
  "ياسين هشام": "Yassin Hesham",
  "إدارة ياسين هشام": "Yassin Hesham Management",
  "إدارة الخدمة": "Service Management",
  "إدارة زينب علي": "Zainab Ali Management"
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "ar";
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState("");

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("lang", lang);
    // Update HTML dir and lang properties dynamically
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setTransitionMessage(lang === "ar" ? "Switching to English... ✨" : "جاري التحويل للعربية... ✨");
    setIsTransitioning(true);
    setTimeout(() => {
      setLang((prev) => (prev === "ar" ? "en" : "ar"));
      setTimeout(() => {
        setIsTransitioning(false);
      }, 450);
    }, 500);
  };

  const t = (key) => {
    if (!key) return "";
    if (translations[lang]?.[key] !== undefined) {
      return translations[lang]?.[key];
    }
    if (lang === "en" && serviceTranslations[key] !== undefined) {
      return serviceTranslations[key];
    }
    return translations["ar"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
      {isTransitioning && (
        <div className="fixed inset-0 z-[9999] bg-white/70 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#8c71af] animate-spin" style={{ animationDuration: '1.2s' }}></div>
            <div className="absolute inset-2 rounded-full border-4 border-b-transparent border-pink-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.8s' }}></div>
          </div>
          <p className="text-[#8c71af] font-bold mt-4 animate-pulse text-sm">
            {transitionMessage}
          </p>
        </div>
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
