import React, { useState } from 'react';
import { ArrowUpRight, ChevronDown, Check, Edit, Filter, FileText, MessageSquare, MoreHorizontal, Phone, Plus, Search, Mail, Users, Package, Building, Briefcase } from 'lucide-react';

import ManagementCard from '../components/ManagementCard';
import PackageCard from '../components/PackageCard';

import RecentCompaniesTable from '../components/ReactCompaniesTable';
import RecentTicketsList from '../components/RecentTicketList';

import CompaniesTable from '../components/CompaniesTable';
import UsersTable from '../components/UsersTable';
import TicketNotFound from '../components/TicketNotFound';

import TicketTable from '../components/TicketTable';
import TicketListHeader from '../components/TicketListHeader';
import ContactOptions from '../components/ContactOptions';

// Define types for our data
interface Company {
  id: number;
  name: string;
  users: number;
  package: string;
  status: string;
  logo?: string;
  createdAt: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  company: string;
  status: string;
  lastActive: string;
  avatar?: string;
}
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
interface SupportTicket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  company: string;
  assignedTo?: string;
  messages?: TicketMessage[];
}
interface TicketMessage {
  id: number;
  ticketId: number;
  sender: string;
  senderRole: 'user' | 'support';
  senderAvatar?: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}
interface Notification {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  date: string;
}
// Sample data for companies
const companies: Company[] = [{
  id: 1,
  name: 'شركة المستقبل العقارية',
  users: 12,
  package: 'المتقدمة',
  status: 'نشط',
  logo: 'https://via.placeholder.com/40/3B82F6/FFFFFF?text=F',
  createdAt: '2023-01-15T10:30:00',
  contactPerson: 'أحمد محمد',
  contactEmail: 'ahmed@future-re.com',
  contactPhone: '+966501234567'
}, {
  id: 2,
  name: 'شركة الرياض العقارية',
  users: 8,
  package: 'الأساسية',
  status: 'نشط',
  logo: 'https://via.placeholder.com/40/10B981/FFFFFF?text=R',
  createdAt: '2023-02-20T14:15:00',
  contactPerson: 'سارة الأحمد',
  contactEmail: 'sara@riyadh-re.com',
  contactPhone: '+966512345678'
}, {
  id: 3,
  name: 'مجموعة الخليج للعقارات',
  users: 15,
  package: 'الاحترافية',
  status: 'نشط',
  logo: 'https://via.placeholder.com/40/F59E0B/FFFFFF?text=G',
  createdAt: '2022-11-05T09:45:00',
  contactPerson: 'محمد العلي',
  contactEmail: 'mohammed@gulf-re.com',
  contactPhone: '+966523456789'
}, {
  id: 4,
  name: 'عقارات المملكة المتحدة',
  users: 5,
  package: 'الأساسية',
  status: 'متوقف',
  logo: 'https://via.placeholder.com/40/6366F1/FFFFFF?text=U',
  createdAt: '2023-03-10T11:20:00',
  contactPerson: 'خالد المالكي',
  contactEmail: 'khalid@uk-re.com',
  contactPhone: '+966534567890'
}, {
  id: 5,
  name: 'مؤسسة العمران للعقارات',
  users: 3,
  package: 'الأساسية',
  status: 'نشط',
  logo: 'https://via.placeholder.com/40/EC4899/FFFFFF?text=O',
  createdAt: '2023-04-05T16:30:00',
  contactPerson: 'فهد العمران',
  contactEmail: 'fahad@omran-re.com',
  contactPhone: '+966545678901'
}];
// Sample data for users
const users: User[] = [{
  id: 1,
  name: 'أحمد محمد',
  email: 'ahmed@future-re.com',
  role: 'مدير',
  company: 'شركة المستقبل العقارية',
  status: 'نشط',
  lastActive: '2023-05-20T14:30:00',
  avatar: 'https://via.placeholder.com/40/3B82F6/FFFFFF?text=A'
}, {
  id: 2,
  name: 'سارة الأحمد',
  email: 'sara@riyadh-re.com',
  role: 'مدير',
  company: 'شركة الرياض العقارية',
  status: 'نشط',
  lastActive: '2023-05-19T10:15:00',
  avatar: 'https://via.placeholder.com/40/10B981/FFFFFF?text=S'
}, {
  id: 3,
  name: 'محمد العلي',
  email: 'mohammed@gulf-re.com',
  role: 'مدير',
  company: 'مجموعة الخليج للعقارات',
  status: 'نشط',
  lastActive: '2023-05-20T09:45:00',
  avatar: 'https://via.placeholder.com/40/F59E0B/FFFFFF?text=M'
}, {
  id: 4,
  name: 'نورة السالم',
  email: 'noura@future-re.com',
  role: 'محلل',
  company: 'شركة المستقبل العقارية',
  status: 'نشط',
  lastActive: '2023-05-18T16:20:00',
  avatar: 'https://via.placeholder.com/40/EC4899/FFFFFF?text=N'
}, {
  id: 5,
  name: 'خالد المالكي',
  email: 'khalid@uk-re.com',
  role: 'مدير',
  company: 'عقارات المملكة المتحدة',
  status: 'غير نشط',
  lastActive: '2023-05-10T11:30:00',
  avatar: 'https://via.placeholder.com/40/6366F1/FFFFFF?text=K'
}];
// Sample data for packages
const packages: PackageType[] = [{
  id: 1,
  name: 'الباقة الأساسية',
  price: 1999,
  period: 'شهري',
  features: ['سحب التقارير التلقائي', 'إدارة حتى 5 مستخدمين', 'تخزين التقارير لمدة 3 أشهر', 'دعم فني بالبريد الإلكتروني'],
  usersLimit: 5,
  reportsLimit: 100,
  storageLimit: '5GB',
  status: 'نشط'
}, {
  id: 2,
  name: 'الباقة المتقدمة',
  price: 4999,
  period: 'شهري',
  features: ['سحب التقارير التلقائي', 'إدارة حتى 10 مستخدمين', 'تخزين التقارير لمدة سنة كاملة', 'دعم فني على مدار الساعة', 'تقارير تحليلية متقدمة'],
  usersLimit: 10,
  reportsLimit: 500,
  storageLimit: '20GB',
  status: 'نشط',
  popularChoice: true
}, {
  id: 3,
  name: 'الباقة الاحترافية',
  price: 9999,
  period: 'شهري',
  features: ['سحب التقارير التلقائي', 'إدارة عدد غير محدود من المستخدمين', 'تخزين التقارير لمدة 3 سنوات', 'دعم فني على مدار الساعة', 'تقارير تحليلية متقدمة', 'واجهة برمجة التطبيقات (API)', 'تخصيص كامل للنظام'],
  usersLimit: 999,
  reportsLimit: 999,
  storageLimit: '100GB',
  status: 'نشط'
}];
// Sample data for support tickets
const supportTickets: SupportTicket[] = [{
  id: 1,
  subject: 'مشكلة في سحب التقارير التلقائي',
  status: 'مفتوح',
  priority: 'عالي',
  createdAt: '2023-11-22T10:30:00',
  updatedAt: '2023-11-22T10:30:00',
  company: 'شركة المستقبل العقارية',
  assignedTo: 'محمد الدعم',
  messages: [{
    id: 1,
    ticketId: 1,
    sender: 'سارة الأحمد',
    senderRole: 'user',
    senderAvatar: 'https://via.placeholder.com/40/D97706/FFFFFF?text=S',
    message: 'نواجه مشكلة في سحب التقارير بشكل تلقائي منذ الصباح. هل يمكن المساعدة في حل المشكلة؟',
    timestamp: '2023-11-22T10:30:00'
  }, {
    id: 2,
    ticketId: 1,
    sender: 'محمد الدعم',
    senderRole: 'support',
    senderAvatar: 'https://via.placeholder.com/40/3B82F6/FFFFFF?text=M',
    message: 'شكراً للتواصل معنا. هل يمكن مشاركة رسائل الخطأ التي تظهر لديكم أثناء محاولة سحب التقارير؟',
    timestamp: '2023-11-22T10:45:00'
  }, {
    id: 3,
    ticketId: 1,
    sender: 'سارة الأحمد',
    senderRole: 'user',
    senderAvatar: 'https://via.placeholder.com/40/D97706/FFFFFF?text=S',
    message: 'نعم، تظهر رسالة "فشل في الاتصال بالخادم" عند محاولة سحب التقارير. سأرفق لكم لقطة شاشة للخطأ.',
    timestamp: '2023-11-22T11:00:00',
    attachments: ['screenshot1.jpg']
  }]
}, {
  id: 2,
  subject: 'استفسار عن ترقية الباقة',
  status: 'قيد المعالجة',
  priority: 'متوسط',
  createdAt: '2023-11-21T14:15:00',
  updatedAt: '2023-11-22T09:20:00',
  company: 'شركة الرياض العقارية',
  assignedTo: 'أحمد المساعد',
  messages: [{
    id: 4,
    ticketId: 2,
    sender: 'أحمد الراشد',
    senderRole: 'user',
    senderAvatar: 'https://via.placeholder.com/40/4F46E5/FFFFFF?text=A',
    message: 'نرغب في معرفة تفاصيل ترقية الباقة من الأساسية إلى المتقدمة وما هي الخطوات المطلوبة؟',
    timestamp: '2023-11-21T14:15:00'
  }, {
    id: 5,
    ticketId: 2,
    sender: 'أحمد المساعد',
    senderRole: 'support',
    senderAvatar: 'https://via.placeholder.com/40/10B981/FFFFFF?text=A',
    message: 'مرحباً بك، يمكنك ترقية الباقة من خلال صفحة الاشتراكات في لوحة التحكم. سأرسل لك دليل مفصل بالخطوات المطلوبة.',
    timestamp: '2023-11-21T15:30:00'
  }, {
    id: 6,
    ticketId: 2,
    sender: 'أحمد المساعد',
    senderRole: 'support',
    senderAvatar: 'https://via.placeholder.com/40/10B981/FFFFFF?text=A',
    message: 'تم إرسال دليل الترقية إلى بريدك الإلكتروني. هل هناك أي استفسارات أخرى؟',
    timestamp: '2023-11-22T09:20:00',
    attachments: ['upgrade_guide.pdf']
  }]
}, {
  id: 3,
  subject: 'طلب إضافة مستخدمين جدد',
  status: 'مغلق',
  priority: 'منخفض',
  createdAt: '2023-11-20T11:45:00',
  updatedAt: '2023-11-21T13:30:00',
  company: 'مجموعة الخليج للعقارات',
  assignedTo: 'سارة الدعم',
  messages: [{
    id: 7,
    ticketId: 3,
    sender: 'محمد العلي',
    senderRole: 'user',
    senderAvatar: 'https://via.placeholder.com/40/059669/FFFFFF?text=M',
    message: 'نحتاج إلى إضافة 3 مستخدمين جدد للنظام. هل يمكن مساعدتنا في ذلك؟',
    timestamp: '2023-11-20T11:45:00'
  }, {
    id: 8,
    ticketId: 3,
    sender: 'سارة الدعم',
    senderRole: 'support',
    senderAvatar: 'https://via.placeholder.com/40/8B5CF6/FFFFFF?text=S',
    message: 'بالتأكيد، يمكنك إضافة المستخدمين من خلال قسم إدارة المستخدمين في لوحة التحكم. هل ترغب في مساعدة لإضافتهم؟',
    timestamp: '2023-11-20T13:20:00'
  }, {
    id: 9,
    ticketId: 3,
    sender: 'محمد العلي',
    senderRole: 'user',
    senderAvatar: 'https://via.placeholder.com/40/059669/FFFFFF?text=M',
    message: 'تمكنت من إضافتهم بنجاح، شكراً لكم على المساعدة السريعة!',
    timestamp: '2023-11-21T10:15:00'
  }, {
    id: 10,
    ticketId: 3,
    sender: 'سارة الدعم',
    senderRole: 'support',
    senderAvatar: 'https://via.placeholder.com/40/8B5CF6/FFFFFF?text=S',
    message: 'سعداء بمساعدتك! هل هناك أي استفسارات أخرى يمكننا المساعدة فيها؟',
    timestamp: '2023-11-21T11:00:00'
  }, {
    id: 11,
    ticketId: 3,
    sender: 'محمد العلي',
    senderRole: 'user',
    senderAvatar: 'https://via.placeholder.com/40/059669/FFFFFF?text=M',
    message: 'لا، شكراً لكم. يمكن إغلاق التذكرة.',
    timestamp: '2023-11-21T12:45:00'
  }, {
    id: 12,
    ticketId: 3,
    sender: 'سارة الدعم',
    senderRole: 'support',
    senderAvatar: 'https://via.placeholder.com/40/8B5CF6/FFFFFF?text=S',
    message: 'تم إغلاق التذكرة. نشكرك على التواصل معنا ونسعد بخدمتك دائماً.',
    timestamp: '2023-11-21T13:30:00'
  }]
}, {
  id: 4,
  subject: 'خطأ في عرض التقارير',
  status: 'مفتوح',
  priority: 'عالي',
  createdAt: '2023-11-22T08:30:00',
  updatedAt: '2023-11-22T08:30:00',
  company: 'عقارات المملكة المتحدة',
  messages: [{
    id: 13,
    ticketId: 4,
    sender: 'خالد المالكي',
    senderRole: 'user',
    senderAvatar: 'https://via.placeholder.com/40/DC2626/FFFFFF?text=K',
    message: 'نواجه مشكلة في عرض التقارير المسحوبة حديثاً. البيانات لا تظهر بشكل صحيح.',
    timestamp: '2023-11-22T08:30:00',
    attachments: ['error_report.jpg']
  }]
}, {
  id: 5,
  subject: 'طلب استعادة حساب',
  status: 'قيد المعالجة',
  priority: 'عالي',
  createdAt: '2023-11-21T09:10:00',
  updatedAt: '2023-11-22T10:15:00',
  company: 'مؤسسة العمران للعقارات',
  assignedTo: 'خالد المساعد',
  messages: [{
    id: 14,
    ticketId: 5,
    sender: 'فهد العمران',
    senderRole: 'user',
    senderAvatar: 'https://via.placeholder.com/40/6366F1/FFFFFF?text=F',
    message: 'نرجو المساعدة في استعادة حساب المستخدم "عبدالله السالم" الذي تم إيقافه بالخطأ.',
    timestamp: '2023-11-21T09:10:00'
  }, {
    id: 15,
    ticketId: 5,
    sender: 'خالد المساعد',
    senderRole: 'support',
    senderAvatar: 'https://via.placeholder.com/40/F59E0B/FFFFFF?text=K',
    message: 'شكراً للتواصل معنا. سنقوم بمراجعة الحساب والتحقق من المشكلة.',
    timestamp: '2023-11-21T10:30:00'
  }, {
    id: 16,
    ticketId: 5,
    sender: 'خالد المساعد',
    senderRole: 'support',
    senderAvatar: 'https://via.placeholder.com/40/F59E0B/FFFFFF?text=K',
    message: 'نحتاج إلى بعض المعلومات الإضافية للتحقق من هوية المستخدم. هل يمكنكم تزويدنا برقم الهوية أو البريد الإلكتروني المسجل للمستخدم؟',
    timestamp: '2023-11-22T10:15:00'
  }]
}];
const ManagementDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTicketFilter, setShowTicketFilter] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [viewingTicket, setViewingTicket] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  // Format date time helper
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-SA');
  };

  const filteredTickets = supportTickets.filter(ticket => ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.company.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCompanies = companies.filter(company => company.name.toLowerCase().includes(searchTerm.toLowerCase()) || company.package.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.company.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderOverviewTab = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ManagementCard icon={Building} title="إجمالي الشركات" iconColor='text-blue-600' iconBgColor='bg-blue-100' />
          <ManagementCard icon={Users} title="إجمالي المستخدمين" iconColor='text-green-600' iconBgColor='bg-green-100' />
          <ManagementCard icon={Package} title="إجمالي الباقات" iconColor='text-amber-600' iconBgColor='bg-amber-100' />
          <ManagementCard icon={Mail} title="التذاكر المفتوحة" iconColor='text-red-600' iconBgColor='bg-red-100' />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <RecentCompaniesTable companies={companies} />
          <RecentTicketsList
            supportTickets={supportTickets}
            formatDateTime={formatDateTime}
            onViewAllTickets={() => setActiveTab('support')}
          />
        </div>
      </div>
    );
  };

  const renderCompaniesTab = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="البحث في الشركات..."
              className="w-full md:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 ml-2" />
            إضافة شركة
          </button>
        </div>
        <CompaniesTable companies={filteredCompanies} formatDateTime={formatDateTime} />
      </div>
    );
  };

  const renderUsersTab = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="البحث في المستخدمين..."
              className="w-full md:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 ml-2" />
            إضافة مستخدم
          </button>
        </div>

        <UsersTable users={filteredUsers} formatDateTime={formatDateTime} />
      </div>
    );
  };
  // Render the packages tab
  const renderPackagesTab = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">الباقات المتاحة</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 ml-2" />
            إضافة باقة
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Map over your packages data and render a PackageCard for each */}
          {packages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    );
  };
  // Render the support tab
  const renderSupportTab = () => {
    // If viewing a specific ticket
    if (viewingTicket !== null) {
      const ticket = supportTickets.find(t => t.id === viewingTicket);
      if (!ticket) {
        return <TicketNotFound setViewingTicket={setViewingTicket} />;
      }
      return (
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <TicketListHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showTicketFilter={showTicketFilter}
              setShowTicketFilter={setShowTicketFilter}
              setShowModal={setShowModal}
            />

            <TicketTable
              filteredTickets={filteredTickets}
              setViewingTicket={setViewingTicket}
              setShowModal={setShowModal}
            />

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  عرض {filteredTickets.length} من أصل {supportTickets.length}{' '}
                  تذكرة
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  {/* Pagination controls can also be a separate component */}
                </div>
              </div>
            </div>
          </div>
          <ContactOptions />
        </div>
      );
    }
    return <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-6 flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 gap-4">
          <h2 className="text-lg font-medium text-gray-900">
            إدارة تذاكر الدعم
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input type="text" placeholder="البحث في التذاكر..." className="w-full md:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="relative">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50" onClick={() => setShowTicketFilter(!showTicketFilter)}>
                <Filter className="h-4 w-4 ml-2" />
                تصفية
                <ChevronDown className="h-4 w-4 mr-2" />
              </button>
              {showTicketFilter && <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    <div className="mb-2 font-medium">الحالة</div>
                    <div className="space-y-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" />
                        مفتوح
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" />
                        قيد المعالجة
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" />
                        مغلق
                      </label>
                    </div>
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-700">
                    <div className="mb-2 font-medium">الأولوية</div>
                    <div className="space-y-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" />
                        عالي
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" />
                        متوسط
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" />
                        منخفض
                      </label>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 mt-2 pt-2 px-4 py-2">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      تطبيق
                    </button>
                  </div>
                </div>
              </div>}
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center" onClick={() => setShowModal('add-ticket')}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة تذكرة
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم التذكرة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الموضوع
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الشركة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الأولوية
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المسؤول
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آخر تحديث
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عدد الردود
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map(ticket => <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">#{ticket.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {ticket.subject}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {ticket.company}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${ticket.priority === 'عالي' ? 'bg-red-100 text-red-800' : ticket.priority === 'متوسط' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${ticket.status === 'مفتوح' ? 'bg-blue-100 text-blue-800' : ticket.status === 'قيد المعالجة' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {ticket.assignedTo || 'غير معين'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(ticket.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {ticket.messages ? ticket.messages.length : 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <button className="text-blue-600 hover:text-blue-900" onClick={() => setViewingTicket(ticket.id)}>
                      عرض
                    </button>
                    <button className="text-amber-600 hover:text-amber-900" onClick={() => setShowModal(`edit-ticket-${ticket.id}`)}>
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              عرض {filteredTickets.length} من أصل {supportTickets.length}{' '}
              تذكرة
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                السابق
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">
                1
              </span>
              <button className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            التواصل مع الدعم الفني
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                المحادثة المباشرة
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                تواصل مع فريق الدعم الفني مباشرة عبر المحادثة
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                بدء محادثة
              </button>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                الاتصال الهاتفي
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                اتصل بفريق الدعم الفني على الرقم المخصص
              </p>
              <a href="tel:+966123456789" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                920001234
              </a>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                البريد الإلكتروني
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                راسلنا عبر البريد الإلكتروني وسنرد عليك في أقرب وقت
              </p>
              <a href="mailto:support@example.com" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                إرسال بريد إلكتروني
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>;
  };
  return <div className="w-full">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">لوحة الإدارة</h1>
      <p className="text-gray-600">إدارة النظام والمستخدمين والتقارير</p>
    </div>
    {/* Tabs Navigation */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto">
          <button className={`py-4 px-6 text-center border-b-2 text-sm font-medium whitespace-nowrap ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('overview')}>
            نظرة عامة
          </button>
          <button className={`py-4 px-6 text-center border-b-2 text-sm font-medium whitespace-nowrap ${activeTab === 'companies' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('companies')}>
            إدارة الشركات
          </button>
          <button className={`py-4 px-6 text-center border-b-2 text-sm font-medium whitespace-nowrap ${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('users')}>
            إدارة المستخدمين
          </button>
          <button className={`py-4 px-6 text-center border-b-2 text-sm font-medium whitespace-nowrap ${activeTab === 'packages' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('packages')}>
            إدارة الباقات
          </button>
          <button className={`py-4 px-6 text-center border-b-2 text-sm font-medium whitespace-nowrap ${activeTab === 'support' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('support')}>
            الدعم الفني
          </button>
        </nav>
      </div>
      <div className="p-6">
        {/* Render active tab content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'companies' && renderCompaniesTab()}
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'packages' && renderPackagesTab()}
        {activeTab === 'support' && renderSupportTab()}
      </div>
    </div>
  </div>
};
export default ManagementDashboard;