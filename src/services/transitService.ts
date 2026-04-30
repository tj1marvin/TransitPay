import { BusRoute, Ticket, UserProfile, TicketStatus, Transaction } from '../types';

// Mock data for initial development
const MOCK_ROUTES: BusRoute[] = [
  { id: '1', from: 'Central Station', to: 'Airport Terminal 1', price: 12.50, departureTime: '08:30 AM', busNumber: 'EXP-101', duration: '45m' },
  { id: '2', from: 'Central Station', to: 'Business District', price: 4.20, departureTime: '09:00 AM', busNumber: 'CITY-22', duration: '20m' },
  { id: '3', from: 'Tech Park', to: 'Harbor Gateway', price: 6.80, departureTime: '10:15 AM', busNumber: 'EXP-505', duration: '35m' },
  { id: '4', from: 'North Park', to: 'Central Station', price: 3.50, departureTime: '11:00 AM', busNumber: 'CITY-10', duration: '15m' },
  { id: '5', from: 'South View', to: 'Airport Terminal 1', price: 15.00, departureTime: '12:00 PM', busNumber: 'EXP-101', duration: '55m' },
];

export class TransitService {
  private static user: UserProfile = {
    uid: 'dev-user-123',
    email: 'marvin@example.com',
    displayName: 'Marvin',
    balance: 50.00
  };

  private static tickets: Ticket[] = [];
  private static transactions: Transaction[] = [];

  static async getRoutes(): Promise<BusRoute[]> {
    return MOCK_ROUTES;
  }

  static async getUserProfile(): Promise<UserProfile> {
    return this.user;
  }

  static async purchaseTicket(route: BusRoute): Promise<Ticket> {
    if (this.user.balance < route.price) {
      throw new Error('Insufficient balance');
    }

    this.user.balance -= route.price;
    const ticketId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const ticket: Ticket = {
      id: ticketId,
      userId: this.user.uid,
      routeId: route.id,
      routeName: `${route.from} → ${route.to}`,
      price: route.price,
      purchaseDate: new Date().toISOString(),
      status: TicketStatus.ACTIVE,
      qrCodeData: `TRANSIT-${Math.random().toString(36).substr(2, 6)}`
    };

    const transaction: Transaction = {
      id: `TX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: 'purchase',
      amount: -route.price,
      description: `Ticket Purchase: ${route.from} to ${route.to}`,
      date: new Date().toISOString()
    };
    
    this.tickets.unshift(ticket);
    this.transactions.unshift(transaction);
    return ticket;
  }

  static async cancelTicket(ticketId: string): Promise<void> {
    const ticketIndex = this.tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) throw new Error('Ticket not found');
    
    const ticket = this.tickets[ticketIndex];
    if (ticket.status !== TicketStatus.ACTIVE) throw new Error('Ticket cannot be cancelled');

    ticket.status = TicketStatus.CANCELLED;
    this.user.balance += ticket.price;

    const transaction: Transaction = {
      id: `TX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: 'refund',
      amount: ticket.price,
      description: `Refund: ${ticket.routeName}`,
      date: new Date().toISOString()
    };
    
    this.transactions.unshift(transaction);
  }

  static async getTickets(): Promise<Ticket[]> {
    return this.tickets;
  }

  static async getTransactions(): Promise<Transaction[]> {
    return this.transactions;
  }

  static async addFunds(amount: number): Promise<void> {
    this.user.balance += amount;
    
    const transaction: Transaction = {
      id: `TX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: 'reload',
      amount: amount,
      description: 'Wallet Reload',
      date: new Date().toISOString()
    };
    
    this.transactions.unshift(transaction);
  }
}
