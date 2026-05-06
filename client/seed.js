const SERVICES_DATA = [
    { id: 1, name: "قاعة الماسة", category: "venue", typeLabel: "قاعة", rating: "4.9", location: "مدينة نصر، القاهرة", priceLabel: "يبدأ من", price: "25,000 ج.م", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=60" },
    { id: 2, name: "فستان سندريلا", category: "dress", typeLabel: "فستان", rating: "4.5", location: "التجمع الخامس", priceLabel: "إيجار", price: "5,000 ج.م", image: "https://s.alicdn.com/@sc04/kf/Hb2a67e5d2fc74020b6f41f6cfa79265fT/Mumuleo-Pink-15-Party-Sexy-Red-Ball-Gown-Quinceanera-Dresses-3D-Bow-Design-Tulle-Formal-Cinderella-Birthday.jpg" },
    { id: 3, name: "سارة ميك أب", category: "makeup", typeLabel: "ميك أب", rating: "5.0", location: "المهندسين", priceLabel: "باكيدج زفاف", price: "3,500 ج.م", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=60" },
    { id: 4, name: "قاعة فيرونا", category: "venue", typeLabel: "قاعة", rating: "4.7", location: "المعادي، القاهرة", priceLabel: "يبدأ من", price: "15,000 ج.م", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=60" },
    { id: 5, name: "أتيليه ليلة العمر", category: "dress", typeLabel: "فستان", rating: "4.8", location: "مصر الجديدة", priceLabel: "شراء", price: "12,000 ج.م", image: "/atelie_dress.png" },
    { id: 6, name: "نورا فوتوغرافي", category: "photography", typeLabel: "تصوير", rating: "4.9", location: "مدينة نصر", priceLabel: "جوفو", price: "4,000 ج.م", image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=500&q=60" },
    { id: 11, name: "فستان زفاف ملكي", category: "dress", typeLabel: "فستان", rating: "4.8", location: "مصر الجديدة", priceLabel: "شراء/إيجار", price: "7,000 ج.م", image: "/dress1.jpg" },
    { id: 12, name: "فستان سندريلا تركي", category: "dress", typeLabel: "فستان", rating: "4.5", location: "التجمع الخامس", priceLabel: "إيجار", price: "5,000 ج.م", image: "/dress2.jpg" },
    { id: 13, name: "فستان سمبل أبيض", category: "dress", typeLabel: "فستان", rating: "4.9", location: "المهندسين", priceLabel: "شراء", price: "15,000 ج.م", image: "/dress3.jpg" },
    { id: 14, name: "فستان بتطريز لؤلؤ", category: "dress", typeLabel: "فستان", rating: "4.7", location: "مدينة نصر", priceLabel: "إيجار", price: "8,500 ج.م", image: "/dress4.jpg" },
    { id: 15, name: "فستان زفاف كلاسيكي", category: "dress", typeLabel: "فستان", rating: "4.6", location: "المعادي", priceLabel: "إيجار", price: "6,000 ج.م", image: "/dress5.jpg" },
    { id: 16, name: "فستان زفاف مودرن", category: "dress", typeLabel: "فستان", rating: "4.8", location: "الشيخ زايد", priceLabel: "شراء", price: "12,000 ج.م", image: "/dress6.jpg" },
    { id: 17, name: "فستان منفوش أنيق", category: "dress", typeLabel: "فستان", rating: "4.9", location: "الزمالك", priceLabel: "إيجار/شراء", price: "9,000 ج.م", image: "/dress7.jpg" },
    { id: 18, name: "فستان زفاف دانتيل", category: "dress", typeLabel: "فستان", rating: "4.7", location: "هيليوبوليس", priceLabel: "إيجار", price: "7,500 ج.م", image: "/dress8.jpg" },
    { id: 19, name: "فستان زفاف بسيط", category: "dress", typeLabel: "فستان", rating: "4.5", location: "الدقي", priceLabel: "إيجار", price: "4,500 ج.م", image: "/dress9.jpg" },
    { id: 20, name: "قاعة أوبرا هاوس", category: "venue", typeLabel: "قاعة", rating: "4.8", location: "الزمالك", priceLabel: "يبدأ من", price: "35,000 ج.م", image: "https://images.unsplash.com/photo-1464013778555-8e723c2f01f8?auto=format&fit=crop&w=500&q=60" },
    { id: 21, name: "فيلا كليوباترا", category: "venue", typeLabel: "فيلا/أوبن اير", rating: "4.9", location: "التجمع الأول", priceLabel: "باكيدج", price: "45,000 ج.م", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=500&q=60" },
    { id: 22, name: "قاعة اللؤلؤة", category: "venue", typeLabel: "قاعة", rating: "4.7", location: "مصر الجديدة", priceLabel: "يبدأ من", price: "22,000 ج.م", image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=500&q=60" },
    { id: 23, name: "نادي حرس الحدود", category: "venue", typeLabel: "نادي مكشوف", rating: "4.5", location: "الزمالك", priceLabel: "يبدأ من", price: "18,000 ج.م", image: "/open_air_club.png" },
    { id: 24, name: "قصر الأهرامات", category: "venue", typeLabel: "قاعة", rating: "4.9", location: "الهرم، الجيزة", priceLabel: "باكيدج", price: "55,000 ج.م", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=60" },
    { id: 25, name: "ريتز كارلتون النيل", category: "venue", typeLabel: "قاعة فندقية", rating: "5.0", location: "وسط البلد", priceLabel: "يبدأ من", price: "80,000 ج.م", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=500&q=60" },
    { id: 26, name: "رويال جاردنز", category: "venue", typeLabel: "قاعة", rating: "4.6", location: "الشيخ زايد", priceLabel: "يبدأ من", price: "30,000 ج.م", image: "/royal_gardens.png" },
    { id: 27, name: "مروة عادل ميك أب", category: "makeup", typeLabel: "ميك أب", rating: "4.8", location: "مدينة نصر", priceLabel: "باكيدج زفاف", price: "4,500 ج.م", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=60" },
    { id: 28, name: "دينا راشد استوديو", category: "makeup", typeLabel: "ميك أب", rating: "4.9", location: "التجمع الخامس", priceLabel: "باكيدج", price: "6,000 ج.م", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=500&q=60" },
    { id: 29, name: "زينب علي", category: "makeup", typeLabel: "ميك أب", rating: "4.7", location: "المعادي", priceLabel: "باكيدج", price: "3,500 ج.م", image: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=500&q=60" },
    { id: 30, name: "نوران أحمد ميك أب", category: "makeup", typeLabel: "ميك أب", rating: "4.6", location: "مصر الجديدة", priceLabel: "زفاف وخطوبة", price: "5,000 ج.م", image: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=500&q=60" },
    { id: 31, name: "ميادة محمود", category: "makeup", typeLabel: "ميك أب", rating: "5.0", location: "الزمالك", priceLabel: "باكيدج", price: "7,000 ج.م", image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=500&q=60" },
    { id: 32, name: "أحمد فوتوغرافي", category: "photography", typeLabel: "تصوير", rating: "4.8", location: "المهندسين", priceLabel: "فوتو سيشن", price: "3,000 ج.م", image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=500&q=60" },
    { id: 33, name: "ستوديو العدسة الذهبية", category: "photography", typeLabel: "تصوير", rating: "4.9", location: "التجمع الخامس", priceLabel: "فيديو وفوتو", price: "5,500 ج.م", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=500&q=60" },
    { id: 34, name: "إسلام فوتو سيشن", category: "photography", typeLabel: "تصوير", rating: "4.7", location: "الهرم", priceLabel: "باكيدج زفاف", price: "2,500 ج.م", image: "https://images.unsplash.com/photo-1464013778555-8e723c2f01f8?auto=format&fit=crop&w=500&q=60" },
    { id: 35, name: "ستوديو اللحظة", category: "photography", typeLabel: "تصوير", rating: "4.6", location: "مدينة نصر", priceLabel: "سيشن فقط", price: "4,500 ج.م", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=60" },
    { id: 36, name: "كاميرا زفاف", category: "photography", typeLabel: "تصوير", rating: "5.0", location: "الشيخ زايد", priceLabel: "تغطية كاملة", price: "8,000 ج.م", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=500&q=60" }
];

async function seed() {
    console.log("Seeding " + SERVICES_DATA.length + " services to user 5...");
    for (const service of SERVICES_DATA) {
        const payload = {
            name: service.name,
            category: service.category,
            price: service.price,
            location: service.location,
            imageUrl: service.image,
            description: "خدمة مميزة من زغروطة للأعمال."
        };

        const res = await fetch("http://localhost:8080/api/services/add/5", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            console.log("Added: " + service.name);
        } else {
            console.error("Failed to add: " + service.name);
        }
    }
    console.log("Done!");
}

seed();
