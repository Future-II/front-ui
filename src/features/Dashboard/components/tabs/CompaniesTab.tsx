import React, { useState } from "react";
import { Search, Plus, Building2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import CompaniesTable from "../companies/CompaniesTable";
import IndividualUsersTable from "../companies/IndividualUsersTable";
import AddUserModal from "../companies/AddUserModal";
import AddCompanyModal from "../companies/AddCompanyModal";
import { Company, User } from "../../types";

interface CompaniesTabProps {
    companies: Company[];
    users: User[];
    formatDateTime: (date: string) => string;
    onDataChange?: () => void;
}

const CompaniesTab: React.FC<CompaniesTabProps> = ({ companies, users, formatDateTime, onDataChange }) => {
    const { t } = useTranslation();
    const [companySearchTerm, setCompanySearchTerm] = useState("");
    const [userSearchTerm, setUserSearchTerm] = useState("");
    const [showUserModal, setShowUserModal] = useState(false);
    const [addCompanyModal, setAddCompanyModal] = useState(false);
    const [selectedCompanyIdForUser, setSelectedCompanyIdForUser] = useState<string | undefined>(undefined);

    const filteredCompanies = companies.filter(
        (company) =>
            company.name?.toLowerCase().includes(companySearchTerm.toLowerCase())
    );

    const individualUsers = users.filter(user => !user.company || user.company === "");

    const filteredUsers = individualUsers.filter(
        (user) =>
            user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12">
            {/* Companies Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
                <div className="flex items-center mb-6">
                    <Building2 className="h-8 w-8 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">{t("dashboard.recentCompanies.title")}</h2>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder={t("common.search", "البحث في الشركات...")}
                            className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all"
                            value={companySearchTerm}
                            onChange={(e) => setCompanySearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setSelectedCompanyIdForUser(undefined);
                                setAddCompanyModal(true);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <Plus className="h-5 w-5 ml-2" />
                            {t("dashboard.recentCompanies.addCompany")}
                        </button>
                        <button
                            onClick={() => {
                                setSelectedCompanyIdForUser(undefined);
                                setShowUserModal(true);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <Plus className="h-5 w-5 ml-2" />
                            {t("users.addUser")}
                        </button>
                    </div>
                </div>
                <CompaniesTable companies={filteredCompanies} formatDateTime={formatDateTime} />
            </div>

            {/* Individual Users Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg border border-green-100">
                <div className="flex items-center mb-6">
                    <Users className="h-8 w-8 text-green-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">{t("users.individualUsers")}</h2>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder={t("common.search", "البحث في المستخدمين...")}
                            className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all"
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <IndividualUsersTable users={filteredUsers} formatDateTime={formatDateTime} />
            </div>

            <AddUserModal open={showUserModal} onClose={() => setShowUserModal(false)} companyId={selectedCompanyIdForUser} onDataChange={onDataChange} />
            <AddCompanyModal open={addCompanyModal} onClose={() => setAddCompanyModal(false)} onDataChange={onDataChange} />
        </div>
    );
};

export default CompaniesTab;
