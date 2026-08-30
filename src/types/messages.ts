export type MessageStatus = 'unread' | 'read' | 'replied';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  message: string;
  status: MessageStatus;
  is_starred: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}
