import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type Stage = "form" | "verifying" | "success";

const MekyasLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [showArabic, setShowArabic] = useState(true);

  const { t } = useTranslation();
  console.log("showArabic", showArabic);

  useEffect(() => {
    if (stage !== "success") return;
    setShowArabic(true);
    const swapTimer = setTimeout(() => setShowArabic(false), 400);
    const redirectTimer = setTimeout(() => {
      const next = searchParams.get("next") || "/reports/mekyas";
      navigate(next, { replace: true });
    }, 1000);

    return () => {
      clearTimeout(swapTimer);
      clearTimeout(redirectTimer);
    };
  }, [stage, navigate, searchParams]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sessionStorage.setItem("mekyasAuth", "true");
    setStage("verifying");
    setTimeout(() => setStage("success"), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16">
      <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center mb-4">
        <Lock className="h-7 w-7 text-white" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900">{t("form.login.title")}</h1>
      <p className="mt-1 text-gray-600 text-sm">
        {t("form.login.subtitle")}
      </p>

      <div className="mt-6 w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {stage === "form" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("common.username")}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`${t("common.enter")} ${t("common.username")}`}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("common.password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={`${t("common.enter")} ${t("common.password")}`}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
            >
              {t("common.submit")}
            </button>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm">
              <p className="font-medium text-yellow-900">{t("form.login.testingNoteTitle")}</p>
              <p className="text-yellow-900">{t("form.login.testingUsername")}: admin</p>
              <p className="text-yellow-900">{t("form.login.testingPassword")}: mekyas123</p>
            </div>
          </form>
        )}

        {stage === "verifying" && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="mb-4 text-blue-600">
              <svg className="h-16 w-16 animate-spin" viewBox="0 0 24 24" fill="none">
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2v4" />
                  <path d="M12 2v4" transform="rotate(60 12 12)" />
                  <path d="M12 2v4" transform="rotate(120 12 12)" />
                  <path d="M12 2v4" transform="rotate(180 12 12)" />
                  <path d="M12 2v4" transform="rotate(240 12 12)" />
                  <path d="M12 2v4" transform="rotate(300 12 12)" />
                </g>
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">{t("form.login.verifyingTitle")}</h3>
            <p className="text-sm text-gray-600 mt-1">{t("form.login.verifyingText")}</p>
            <button
              type="button"
              className="mt-4 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-sm"
              disabled
            >
              {t("form.login.verifyingButton")}
            </button>
          </div>
        )}

        {stage === "success" && (
          <div className="flex flex-col items-center text-center py-6">
            <CheckCircle className="h-10 w-10 text-green-600 mb-3" />
            <h3 className="text-base font-semibold text-gray-900">{t("form.login.successTitle")}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {t("form.login.redirect")}
            </p>
            <div className="mt-4 px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">
              {t("form.login.successNote")}
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-gray-500 text-center">
        {t("form.login.footer")}
      </p>
    </div>
  );
};

export default MekyasLogin;
