import { BookingStatus } from './booking-status';

export interface Booking {
  id: string;
  guestName: string;
  propertyName: string;
  start: string;
  end: string;
  status: BookingStatus;
}