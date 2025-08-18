export const companies: Company[] = [{
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
export const users: User[] = [{
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
export const packages: PackageType[] = [
  {
    id: 1,
    name: "packages.basic",
    price: 1999,
    period: "packages.monthly",
    features: [
      "packages.features.autoReports",
      "packages.features.manageUsers5",
      "packages.features.storage3Months",
      "packages.features.emailSupport"
    ],
    usersLimit: 5,
    reportsLimit: 100,
    storageLimit: "5GB",
    status: "packages.active"
  },
  {
    id: 2,
    name: "packages.advanced",
    price: 4999,
    period: "packages.monthly",
    features: [
      "packages.features.autoReports",
      "packages.features.manageUsers10",
      "packages.features.storage1Year",
      "packages.features.support24",
      "packages.features.advancedReports"
    ],
    usersLimit: 10,
    reportsLimit: 500,
    storageLimit: "20GB",
    status: "packages.active",
    popularChoice: true
  },
  {
    id: 3,
    name: "packages.professional",
    price: 9999,
    period: "packages.monthly",
    features: [
      "packages.features.autoReports",
      "packages.features.manageUsersUnlimited",
      "packages.features.storage3Years",
      "packages.features.support24",
      "packages.features.advancedReports",
      "packages.features.api",
      "packages.features.fullCustomization"
    ],
    usersLimit: 999,
    reportsLimit: 999,
    storageLimit: "100GB",
    status: "packages.active"
  }
];

// Sample data for support tickets
type PriorityKey = "high" | "medium" | "low";
type StatusKey = "open" | "in-progress" | "resolved";

const priorityMap: Record<string, PriorityKey> = {
  "عالي": "high",
  "متوسط": "medium",
  "منخفض": "low",
};

const statusMap: Record<string, StatusKey> = {
  "مفتوح": "open",
  "قيد المعالجة": "in-progress",
  "مغلق": "resolved",
};

export const supportTickets: SupportTicket[] = [
  {
    id: 1,
    subject: 'مشكلة في سحب التقارير التلقائي',
    status: statusMap['مفتوح'],
    priority: priorityMap['عالي'],
    createdAt: '2023-11-22T10:30:00',
    updatedAt: '2023-11-22T10:30:00',
    company: 'شركة المستقبل العقارية',
    assignedTo: 'محمد الدعم',
    messages: [
      {
        id: 1,
        ticketId: 1,
        sender: 'سارة الأحمد',
        senderRole: 'user',
        senderAvatar: 'https://via.placeholder.com/40/D97706/FFFFFF?text=S',
        message: 'نواجه مشكلة في سحب التقارير بشكل تلقائي منذ الصباح. هل يمكن المساعدة في حل المشكلة؟',
        timestamp: '2023-11-22T10:30:00'
      },
      {
        id: 2,
        ticketId: 1,
        sender: 'محمد الدعم',
        senderRole: 'support',
        senderAvatar: 'https://via.placeholder.com/40/3B82F6/FFFFFF?text=M',
        message: 'شكراً للتواصل معنا. هل يمكن مشاركة رسائل الخطأ التي تظهر لديكم أثناء محاولة سحب التقارير؟',
        timestamp: '2023-11-22T10:45:00'
      },
      {
        id: 3,
        ticketId: 1,
        sender: 'سارة الأحمد',
        senderRole: 'user',
        senderAvatar: 'https://via.placeholder.com/40/D97706/FFFFFF?text=S',
        message: 'نعم، تظهر رسالة "فشل في الاتصال بالخادم" عند محاولة سحب التقارير. سأرفق لكم لقطة شاشة للخطأ.',
        timestamp: '2023-11-22T11:00:00',
        attachments: ['screenshot1.jpg']
      }
    ]
  },
  {
    id: 2,
    subject: 'استفسار عن ترقية الباقة',
    status: statusMap['قيد المعالجة'],
    priority: priorityMap['متوسط'],
    createdAt: '2023-11-21T14:15:00',
    updatedAt: '2023-11-22T09:20:00',
    company: 'شركة الرياض العقارية',
    assignedTo: 'أحمد المساعد',
    messages: [
      {
        id: 4,
        ticketId: 2,
        sender: 'أحمد الراشد',
        senderRole: 'user',
        senderAvatar: 'https://via.placeholder.com/40/4F46E5/FFFFFF?text=A',
        message: 'نرغب في معرفة تفاصيل ترقية الباقة من الأساسية إلى المتقدمة وما هي الخطوات المطلوبة؟',
        timestamp: '2023-11-21T14:15:00'
      },
      {
        id: 5,
        ticketId: 2,
        sender: 'أحمد المساعد',
        senderRole: 'support',
        senderAvatar: 'https://via.placeholder.com/40/10B981/FFFFFF?text=A',
        message: 'مرحباً بك، يمكنك ترقية الباقة من خلال صفحة الاشتراكات في لوحة التحكم. سأرسل لك دليل مفصل بالخطوات المطلوبة.',
        timestamp: '2023-11-21T15:30:00'
      },
      {
        id: 6,
        ticketId: 2,
        sender: 'أحمد المساعد',
        senderRole: 'support',
        senderAvatar: 'https://via.placeholder.com/40/10B981/FFFFFF?text=A',
        message: 'تم إرسال دليل الترقية إلى بريدك الإلكتروني. هل هناك أي استفسارات أخرى؟',
        timestamp: '2023-11-22T09:20:00',
        attachments: ['upgrade_guide.pdf']
      }
    ]
  },
  {
    id: 3,
    subject: 'طلب إضافة مستخدمين جدد',
    status: statusMap['مغلق'],
    priority: priorityMap['منخفض'],
    createdAt: '2023-11-20T11:45:00',
    updatedAt: '2023-11-21T13:30:00',
    company: 'مجموعة الخليج للعقارات',
    assignedTo: 'سارة الدعم',
    messages: [
      // messages same as before...
    ]
  },
  // Add the remaining tickets similarly, mapping priority & status
];


