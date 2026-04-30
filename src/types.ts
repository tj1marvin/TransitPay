export interface Transaction {
  id: string;
  type: 'reload' | 'purchase' | 'refund';
  amount: number;
  description: string;
  date: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  balance: number;
}

export interface BusRoute {
  id: string;
  from: string;
  to: string;
  price: number;
  departureTime: string;
  busNumber: string;
  duration: string;
}

export enum TicketStatus {
  ACTIVE = 'active',
  USED = 'used',
  CANCELLED = 'cancelled'
}

export interface Ticket {
  id: string;
  userId: string;
  routeId: string;
  routeName: string;
  price: number;
  purchaseDate: string;
  status: TicketStatus;
  qrCodeData: string;
}
