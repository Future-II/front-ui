import React, { useState } from "react";
import { FileText, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import {getMeqyasReport} from "../api";

const PullPropertyReport: React.FC = () => {
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ username, password, query });
  };

  const handleSubmit = async () => {
    try {
      const data = await getMeqyasReport(username, password, query);
      console.log(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            {t("mekyas.selectStep.title")}
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          {t("mekyas.selectStep.description3")}
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <form onSubmit={onSearch} className="space-y-4">
          {/* Username */}
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Query */}
          <div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Search Button */}
          <div className="pt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              {t("automation.automation report.button")}
            </button>
          </div>
        </form>
      </div>

      {/* Results Area */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">{t("automation.pull property.title")}</p>
          <p className="text-sm text-gray-400">
            {t("automation.pull property.description")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PullPropertyReport;
