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