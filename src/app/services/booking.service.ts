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
}