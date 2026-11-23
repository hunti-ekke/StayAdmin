import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Booking } from '../models/booking.model';
import { API_URL } from './api-url';
import { getAuthHttpHeaders } from './auth-headers';

@Service()
export class BookingService {
  private readonly httpClient = inject(HttpClient);

  public getBookings() {
    return this.httpClient.get<Booking[]>(`${API_URL}/bookings`, {
      headers: getAuthHttpHeaders(),
    });
  }

  public confirmBooking(id: string) {
    return this.httpClient.post<void>(`${API_URL}/bookings/${id}/confirm`, null, {
      headers: getAuthHttpHeaders(),
    });
  }

  public cancelBooking(id: string) {
    return this.httpClient.post<void>(`${API_URL}/bookings/${id}/cancel`, null, {
      headers: getAuthHttpHeaders(),
    });
  }
}