import { Check } from 'lucide-react';

// Define the type for a single package object
interface PackageType {
  id: number;
  name: string;
  price: number;
  period: string;
  features: string[];
  usersLimit: number;
  reportsLimit: number;
  storageLimit: string;
  status: string;
  popularChoice?: boolean;
}

// Define the props for the component
interface PackageCardProps {
  pkg: PackageType;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  return (
    <div key={pkg.id} className={`bg-white rounded-lg shadow-sm border ${pkg.popularChoice ? 'border-blue-500' : 'border-gray-200'} overflow-hidden relative`}>
      {pkg.popularChoice && (
        <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 text-xs font-medium">
          الأكثر شيوعاً
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {pkg.name}
        </h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">
            {pkg.price}
          </span>
          <span className="text-gray-500 mr-1">ر.س / {pkg.period}</span>
        </div>
        <ul className="space-y-3 mb-6">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 ml-2" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">المستخدمين:</span>
            <span className="font-medium text-gray-900">
              {pkg.usersLimit === 999 ? 'غير محدود' : pkg.usersLimit}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">التقارير شهرياً:</span>
            <span className="font-medium text-gray-900">
              {pkg.reportsLimit === 999 ? 'غير محدود' : pkg.reportsLimit}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">مساحة التخزين:</span>
            <span className="font-medium text-gray-900">
              {pkg.storageLimit}
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            تعديل
          </button>
          <div className="flex items-center">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${pkg.status === 'نشط' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {pkg.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}