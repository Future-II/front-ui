interface TabsNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: "overview", label: "نظرة عامة" },
  { id: "companies", label: "إدارة الشركات" },
  { id: "users", label: "إدارة المستخدمين" },
  { id: "packages", label: "إدارة الباقات" },
  { id: "support", label: "الدعم الفني" },
];

const TabsNav: React.FC<TabsNavProps> = ({ activeTab, setActiveTab }) => (
  <nav className="flex -mb-px overflow-x-auto">
    {tabs.map(({ id, label }) => (
      <button
        key={id}
        className={`py-4 px-6 text-center border-b-2 text-sm font-medium whitespace-nowrap ${
          activeTab === id
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
        onClick={() => setActiveTab(id)}
      >
        {label}
      </button>
    ))}
  </nav>
);

export default TabsNav;