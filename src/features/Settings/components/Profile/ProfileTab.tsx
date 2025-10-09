import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { User, Save } from "lucide-react";
import axios from "axios";

const ProfileTab: React.FC = () => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isIndividual = user?.type === 'individual';
  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companyType: "",
    licenseNumber: "",
    city: "",
    // profileImage: "", // دعم الصورة (تم التعليق)
  });
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // جلب البيانات من الـ API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && res.data.user) {
          console.log('بيانات المستخدم من السيرفر:', res.data.user); // لعرض البيانات في الكونسول
          setFormData({ ...res.data.user });
          setImagePreview(""); // لا يوجد صورة من الباك اند
        }
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // تحديث قيمة أي input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // رفع صورة جديدة
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // رفع الصورة إلى السيرفر (مثال: endpoint منفصل)
    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("image", file);
    try {
      const res = await axios.post("/api/users/upload-profile-image", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success && res.data.url) {
        // setFormData({ ...formData, profileImage: res.data.url }); // تم التعليق
        setImagePreview(""); // فقط شكل
      }
    } catch (err) {
      alert("فشل رفع الصورة");
    }
  };

  // حفظ التغييرات
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && res.data.user) {
        alert("✅ تم تحديث الملف الشخصي بنجاح");
        setFormData(res.data.user);
        setImagePreview(""); // لا يوجد صورة من الباك اند
      }
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("حدث خطأ أثناء التحديث");
    }
  };

  if (loading) return <p>⏳ جاري تحميل البيانات...</p>;

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        {t("settings.profile", "الملف الشخصي")}
      </h2>

      <div className="mb-6 flex items-center">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {imagePreview ? (
            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="h-10 w-10 text-gray-500" />
          )}
        </div>
        <div className="mx-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {t("profile.changePicture", "تغيير الصورة")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("profile.firstName", "الاسم الأول")}
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("profile.lastName", "الاسم الأخير")}
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("common.email", "البريد الإلكتروني")}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("common.phone", "رقم الهاتف")}
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {!isIndividual && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("common.company", "الشركة")}
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("profile.role", "نوع الشركة")}
              </label>
              <input
                type="text"
                name="companyType"
                value={formData.companyType || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>

      {!isIndividual && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("profile.licenseNumber", "رقم الترخيص")}
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("profile.city", "المدينة")}
            </label>
            <input
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Save className="h-4 w-4 ml-2" />
          {t("common.save", "حفظ التغييرات")}
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;
