import UserCompanyItem from "./UserCompanyItem";
import { Company } from "../../types";

interface CompaniesTableProps {
  companies: Company[];
  formatDateTime: (dateString: string) => string|null;
}

export default function CompaniesTable({ companies, formatDateTime }: CompaniesTableProps) {
  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <UserCompanyItem
          key={company.id}
          company={company}
          formatDateTime={formatDateTime}
        />
      ))}
    </div>
  );
}
