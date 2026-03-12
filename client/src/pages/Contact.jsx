import { Mail, Phone, MapPin, Send, MessageSquare, MessageCircle } from "lucide-react";
import { CustomSelect } from "../components/ui/CustomSelect";
export default function Contact() {
    return (<div className="bg-gray-50 text-gray-800 flex-1 flex flex-col w-full h-full">
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">يسعدنا سماع صوتك! 📞</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            عندك استفسار عن حجز؟ أو عايز تنضم لينا كمورد؟ فريق زغروطة موجود عشان يساعدك في أي وقت.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-border/20">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">الاسم بالكامل</label>
                  <input type="text" placeholder="مثلاً: سارة أحمد" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#8c71af] focus: outline-none transition"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">رقم للتواصل</label>
                  <input type="tel" placeholder="01XXXXXXXXX" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#8c71af] focus: outline-none transition"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">الموضوع</label>
                <CustomSelect
                  defaultValue="استفسار عن حجز"
                  options={["استفسار عن حجز", "مشكلة تقنية في الموقع", "اقتراحات", "أخرى"]}
                  className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#8c71af] text-gray-700 font-bold hover:border-[#8c71af] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">رسالتك</label>
                <textarea rows={5} placeholder="اكتبي تفاصيل استفسارك هنا..." className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#8c71af] focus: outline-none transition"></textarea>
              </div>
              <button type="button" className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold shadow-lg hover:opacity-90 transition transform hover:scale-[1.02]">
                إرسال الرسالة
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6 border-r-4 ">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-pink-50 rounded-full flex items-center justify-center text-[#8c71af]">
                <MapPin size={28}/>
              </div>
              <div>
                <h3 className="font-bold text-lg">عنواننا</h3>
                <p className="text-gray-500">القاهرة، المعادي، شارع 9</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6 border-r-4 ">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-pink-50 rounded-full flex items-center justify-center text-[#8c71af]">
                <Mail size={28}/>
              </div>
              <div>
                <h3 className="font-bold text-lg">البريد الإلكتروني</h3>
                <p className="text-gray-500">support@zaghrouta.com</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6 border-r-4 ">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-pink-50 rounded-full flex items-center justify-center text-[#8c71af]">
                <MessageCircle size={28}/>
              </div>
              <div>
                <h3 className="font-bold text-lg">واتساب</h3>
                <p className="text-gray-500">0123-456-7890</p>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-md h-64 bg-gray-200">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55251.3770996495!2d31.2234448!3d30.0594838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296511562b3!2sCairo%2C%20Egypt!5e0!3m2!1sen!2s!4v1640000000000!5m2!1sen!2s" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Map">
              </iframe>
            </div>
          </div>
        </div>
      </main>
    </div>);
}
