// FIX: Removed self-import of TripCategory which caused a declaration conflict.
export type TripCategory = 'Bivouac' | 'Randonnée';

export interface Trip {
  id: number;
  title: string;
  destination: string;
  type: string;
  category: TripCategory;
  purpose: string;
  difficulty: 'Easy' | 'Medium' | 'Difficult';
  distance: number; // in Km
  duration: string;
  price: number; // in Dzd
  includes: string[];
  departureTime: string;
  returnTime: string;
  meetingPoint: string;
  equipment: string[];
  toBring: string;
  serviceOffered: string;
  rating: number;
  reviewCount: number;
  imageUrls: string[];
  isNextWeekend?: boolean;
}

export interface BookingDetails {
    tripId: number;
    fullName: string;
    photoId: string; // Storing as base64 string
    pickupPoint: string;
    email: string;
    phone: string;
    ticketCount: number;
    amountPaid: number;
    remainingBalance: number;
    totalPrice: number;
    paymentId: string;
    paymentMethod: 'card';
    feedback?: string;
}