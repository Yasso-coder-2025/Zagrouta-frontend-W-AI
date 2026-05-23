import { Link } from "wouter";
import { useAuth } from "../../hooks/use-auth";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
    const { user } = useAuth();
    const { lang, t } = useLanguage();
    const isVendor = user?.role === 'VENDOR';

    return (<footer className="bg-gray-900 text-white pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className={`grid grid-cols-1 ${isVendor ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-12 mb-12`}>
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4 tracking-wider flex items-center gap-2"><span className="text-white">✨</span> {lang === 'ar' ? 'زغروطة' : 'Zagrouta'}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {t("footer_tagline")}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block">
              {t("footer_links")}
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition">{t("nav_home")}</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition">{t("nav_services")}</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">{t("nav_contact")}</Link>
              </li>
            </ul>
          </div>

          {isVendor && (
          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block text-yellow-500">
              {lang === 'ar' ? 'اختصارات (للمورد)' : 'Shortcuts (Vendor)'}
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/vendor-dashboard" className="hover:text-yellow-400 transition">
                  {lang === 'ar' ? '🛠️ لوحة تحكم المورد' : '🛠️ Vendor Dashboard'}
                </Link>
              </li>
            </ul>
          </div>
          )}

          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block">
              {t("footer_contact")}
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition flex items-center gap-2">
                  <span>📞</span> {lang === 'ar' ? '19xxx - الخط الساخن' : '19xxx - Hotline'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition flex items-center gap-2">
                  <span>📧</span> hello@zagrouta.com
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition flex items-center gap-2">
                  <span>📍</span> {t("footer_address")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
          {t("footer_rights")}
        </div>
      </div>
    </footer>);
}
