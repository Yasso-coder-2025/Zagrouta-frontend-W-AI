import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, MessageCircle } from "lucide-react";
import { CustomSelect } from "../components/ui/CustomSelect";
import { useAuth } from "../hooks/use-auth";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
    const { lang, t } = useLanguage();
    const { user } = useAuth();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.fullName || "");
            setPhone(user.phone?.replace('+20', '') || "");
        }
    }, [user]);

    return (<div className="bg-gray-50 text-gray-800 flex-1 flex flex-col w-full h-full">
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t("contact_title")}</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            {t("contact_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-border/20">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">{t("contact_name")}</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'ar' ? "مثلاً: سارة أحمد" : "e.g., Sarah Ahmed"} 
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#8c71af] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">{t("contact_phone")}</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX" 
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#8c71af] focus:outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{t("contact_subject")}</label>
                <CustomSelect
                  defaultValue="contact_subject_booking"
                  options={[
                    { value: "contact_subject_booking", label: t("contact_subject_booking") },
                    { value: "contact_subject_technical", label: t("contact_subject_technical") },
                    { value: "contact_subject_suggestions", label: t("contact_subject_suggestions") },
                    { value: "contact_subject_other", label: t("contact_subject_other") }
                  ]}
                  className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#8c71af] text-gray-700 font-bold hover:border-[#8c71af] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{t("contact_message")}</label>
                <textarea rows={5} placeholder={t("contact_message_placeholder")} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#8c71af] focus:outline-none transition"></textarea>
              </div>
              <button type="button" className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold shadow-lg hover:opacity-90 transition transform hover:scale-[1.02]">
                {t("contact_send")}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6 border-r-4 border-[#8c71af]">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-pink-50 rounded-full flex items-center justify-center text-[#8c71af] shrink-0">
                <MapPin size={28}/>
              </div>
              <div className="text-start">
                <h3 className="font-bold text-lg">{t("contact_address_title")}</h3>
                <p className="text-gray-500">{t("contact_address_val")}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6 border-r-4 border-[#8c71af]">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-pink-50 rounded-full flex items-center justify-center text-[#8c71af] shrink-0">
                <Mail size={28}/>
              </div>
              <div className="text-start">
                <h3 className="font-bold text-lg">{t("contact_email_title")}</h3>
                <p className="text-gray-500">support@zaghrouta.com</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6 border-r-4 border-[#8c71af]">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-pink-50 rounded-full flex items-center justify-center text-[#8c71af] shrink-0">
                <MessageCircle size={28}/>
              </div>
              <div className="text-start">
                <h3 className="font-bold text-lg">{t("contact_whatsapp_title")}</h3>
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
