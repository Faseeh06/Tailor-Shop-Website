export interface Reservation {
  id?: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  reason: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
