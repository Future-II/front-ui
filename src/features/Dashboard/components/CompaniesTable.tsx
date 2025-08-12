interface CompaniesTableProps {
  companies: Company[];
  formatDateTime: (dateString: string) => string;
}

export default function CompaniesTable({ companies, formatDateTime }: CompaniesTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الشركة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المستخدمين
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الباقة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاريخ التسجيل
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-normal break-words">
                  <div className="text-sm font-medium text-gray-900">
                    {company.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {company.contactEmail}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 text-center">
                  {company.users}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 text-center">
                  {company.package}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      company.status === "نشط"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {company.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 text-center">
                  {formatDateTime(company.createdAt)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">عرض</button>
                  <button className="text-amber-600 hover:text-amber-900">تعديل</button>
                  <button className="text-red-600 hover:text-red-900">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
