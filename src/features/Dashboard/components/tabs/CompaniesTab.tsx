import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import CompaniesTable from "../companies/CompaniesTable";
import AddUserModal from "../companies/AddUserModal";
import AddCompanyModal from "../companies/AddCompanyModal";

interface CompaniesTabProps {
    companies: Company[];
    formatDateTime: (date: string) => string;
}

const CompaniesTab: React.FC<CompaniesTabProps> = ({ companies, formatDateTime }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [showUserModal, setShowUserModal] = useState(false);
    const [addCompanyModal, setAddCompanyModal] = useState(false);

    const filteredCompanies = companies.filter(
        (company) =>
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.package.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder={t("common.search", "البحث في الشركات...")}
                        className="w-full md:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowUserModal(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                        {t("users.addUser")}
                        <Plus className="h-4 w-4 mx-2" />
                    </button>
                    <button
                        onClick={() => setAddCompanyModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        {t("dashboard.recentCompanies.addCompany")}
                        <Plus className="h-4 w-4 mx-2" />
                    </button>
                </div>
            </div>

            <AddUserModal open={showUserModal} onClose={() => setShowUserModal(false)} />
            <AddCompanyModal open={addCompanyModal} onClose={() => setAddCompanyModal(false)} />

            <CompaniesTable companies={filteredCompanies} formatDateTime={formatDateTime} />
        </div>
    );
};

export default CompaniesTab;
