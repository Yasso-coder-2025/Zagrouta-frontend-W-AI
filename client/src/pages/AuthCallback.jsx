import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { API_URL } from "../config";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      // Get the email from URL search params
      const searchParams = new URLSearchParams(window.location.search);
      const email = searchParams.get("email");
      const err = searchParams.get("error");

      if (err) {
        setError("حدث خطأ أثناء تسجيل الدخول بحساب السوشيال ميديا.");
        setTimeout(() => setLocation("/auth"), 3000);
        return;
      }

      if (email) {
        try {
          // Fetch the user object from the backend using the email
          const res = await fetch(`${API_URL}/users/${email}`);
          if (res.ok) {
            const userObj = await res.json();
            login(userObj);
            
            // Redirect based on role
            if (userObj.role === "VENDOR") {
              setLocation("/vendor-dashboard");
            } else {
              setLocation("/");
            }
          } else {
            setError("لم يتم العثور على الحساب.");
            setTimeout(() => setLocation("/auth"), 3000);
          }
        } catch (e) {
          setError("حدث خطأ في الاتصال بالخادم.");
          setTimeout(() => setLocation("/auth"), 3000);
        }
      } else {
        setLocation("/auth");
      }
    };

    fetchUser();
  }, [login, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center animate-in zoom-in-95">
        {error ? (
          <>
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">{error}</h2>
            <p className="text-sm text-gray-500">جاري العودة لصفحة الدخول...</p>
          </>
        ) : (
          <>
            <div className="inline-block w-12 h-12 border-4 border-[#8c71af] border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold text-gray-800">جاري تسجيل الدخول...</h2>
            <p className="text-sm text-gray-500 mt-2">لحظات وبيتم توجيهك لحسابك</p>
          </>
        )}
      </div>
    </div>
  );
}
