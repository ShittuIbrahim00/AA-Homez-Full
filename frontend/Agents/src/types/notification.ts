export interface NotificationData {
  for: string;
  type: string;
  action?: string;
  changes?: Record<string, any>;
  priority: string;
  timestamp: string;
  propertyId: string;
  propertyName?: string;
  subPropertyId?: number | null;
  transactionId?: number;
  amount?: number;
  soldTo?: string;
  agentId?: string;
  error?: string;
}

export interface Notification {
  sid: number;
  uid: number;
  aid: number | null;
  title: string;
  body: string;
  isRead: boolean;
  status: string | null;
  data: NotificationData;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface NotificationResponse {
  message: string;
  status: boolean;
  data: {
    notifications: Notification[];
    total: number;
    page: number;
    totalPages: number;
    unreadCount: number;
  };
}
