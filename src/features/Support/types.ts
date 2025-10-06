export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface ChatUser {
  id: string;
  name: string;
  avatarUrl?: string;
  isSupport: boolean;
}

export interface ChatMessage {
  id: string;
  user: ChatUser;
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

export interface TicketMessage {
  sender: "support" | "customer";
  message: string;
  timestamp: string | Date;
}

export interface TicketAttachment {
  filename: string;
  originalName: string;
  path: string;
  mimetype: string;
  size: number;
}

export interface Ticket {
  _id: string;
  subject: string;
  classification: "low" | "medium" | "high";
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: number;
  messages?: TicketMessage[];
  messageCount?: number;
  attachments?: TicketAttachment[];
  rating?: number;
  ratingComment?: string;
  ratedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export interface TicketUpdateData {
  status?: Ticket["status"];
  priority?: number;
  classification?: Ticket["classification"];
}
