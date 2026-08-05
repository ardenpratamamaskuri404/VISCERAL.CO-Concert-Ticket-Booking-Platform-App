// VISCERAL.CO — TypeScript Type Definitions

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN';
  createdAt?: string;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  photoUrl?: string;
}

export interface EventArtist {
  eventId: string;
  artistId: string;
  isHeadliner: boolean;
  artist: Artist;
}

export interface TicketCategory {
  id: string;
  eventId: string;
  name: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  isSalesClosed: boolean;
  salesStartDate?: string;
  salesEndDate?: string;
  earlyBirdPrice?: number;
  earlyBirdStartDate?: string;
  earlyBirdEndDate?: string;
  seats: Seat[];
}

export interface Seat {
  id: string;
  categoryId: string;
  seatNumber: string;
  status: 'AVAILABLE' | 'LOCKED' | 'SOLD';
  lockedUntil?: string;
  lockedByUserId?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  venueName: string;
  eventDate: string;
  bannerUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  salesClosed: boolean;
  isSeated: boolean;
  categories: TicketCategory[];
  artists: EventArtist[];
  createdAt?: string;
}

export interface TicketInfo {
  id: string;
  ticketCode: string;
  seatNumber: string;
  categoryName: string;
  status: 'ACTIVE' | 'CHECKED_IN' | 'CANCELLED';
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
  paymentProof?: string;
  paymentMethod: string;
  paymentChannel?: string;
  dokuReferenceId?: string;
  expiresAt: string;
  createdAt: string;
  eventId?: string;
  eventTitle: string;
  venueName?: string;
  eventDate?: string;
  tickets: TicketInfo[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    fullName: string;
    role: string;
  };
}

export interface Refund {
  id: string;
  orderId: string;
  reason: string;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED';
  processedBy?: string;
  createdAt: string;
}

export type PaymentMethodType = 
  | 'MANUAL_TRANSFER'
  | 'DOKU_VA'
  | 'DOKU_QRIS'
  | 'DOKU_EWALLET'
  | 'SHOPEEPAY'
  | 'OVO'
  | 'DANA'
  | 'MANDIRI_VA'
  | 'BCA_VA'
  | 'BRI_VA'
  | 'BNI_VA';
