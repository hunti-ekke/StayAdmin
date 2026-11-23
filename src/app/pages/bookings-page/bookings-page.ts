import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Booking } from '../../models/booking.model';
import { BookingStatus, bookingStatusLabels } from '../../models/booking-status';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-bookings-page',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './bookings-page.html',
  styleUrl: './bookings-page.scss',
})
export class BookingsPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly bookingService = inject(BookingService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly statuses = Object.values(BookingStatus);
  public readonly statusLabels = bookingStatusLabels;
  public readonly bookingStatus = BookingStatus;
  public readonly columns = ['guestName', 'propertyName', 'start', 'end', 'status', 'actions'];
  public readonly bookings = signal<Booking[]>([]);
  public readonly selectedStatus = signal<BookingStatus | ''>('');
  public readonly loading = signal(false);
  public readonly updating = signal(false);
  public readonly errorMessage = signal('');
  public readonly actionError = signal('');

  public readonly statusControl =
    this.formBuilder.nonNullable.control<BookingStatus | ''>('');

  public readonly filteredBookings = computed(() => {
    const status = this.selectedStatus();
    return status
      ? this.bookings().filter((booking) => booking.status === status)
      : this.bookings();
  });

  public readonly summary = computed(() => {
    const bookings = this.bookings();

    return {
      total: bookings.length,
      pending: bookings.filter((booking) => booking.status === BookingStatus.Pending).length,
      confirmed: bookings.filter((booking) => booking.status === BookingStatus.Confirmed).length,
      cancelled: bookings.filter((booking) => booking.status === BookingStatus.Cancelled).length,
    };
  });

  public ngOnInit(): void {
    this.loadBookings();
  }

  public loadBookings(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.actionError.set('');

    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.bookings.set(bookings);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);

        if (error.status === 401) {
          this.authService.logout();
          void this.router.navigateByUrl('/login');
          return;
        }

        this.errorMessage.set(
          error.status === 0
            ? 'Az API nem érhető el.'
            : 'Nem sikerült betölteni a foglalásokat.',
        );
      },
    });
  }

  public applyFilter(): void {
    this.selectedStatus.set(this.statusControl.value);
  }

  public statusLabel(status: BookingStatus): string {
    return this.statusLabels[status];
  }

  public confirmBooking(booking: Booking): void {
    if (booking.status !== BookingStatus.Pending) {
      return;
    }

    this.runAction(
      booking,
      'confirm',
      `Biztosan visszaigazolod ${booking.guestName} foglalását?`,
    );
  }

  public cancelBooking(booking: Booking): void {
    if (
      booking.status !== BookingStatus.Pending &&
      booking.status !== BookingStatus.Confirmed
    ) {
      return;
    }

    this.runAction(
      booking,
      'cancel',
      `Biztosan lemondod ${booking.guestName} foglalását?`,
    );
  }

  private runAction(
    booking: Booking,
    action: 'confirm' | 'cancel',
    message: string,
  ): void {
    if (this.updating() || !window.confirm(message)) {
      return;
    }

    this.updating.set(true);
    this.actionError.set('');

    const request =
      action === 'confirm'
        ? this.bookingService.confirmBooking(booking.id)
        : this.bookingService.cancelBooking(booking.id);

    request.subscribe({
      next: () => {
        this.updating.set(false);
        this.loadBookings();
      },
      error: (error: HttpErrorResponse) => {
        this.updating.set(false);

        if (error.status === 401) {
          this.authService.logout();
          void this.router.navigateByUrl('/login');
          return;
        }

        this.actionError.set(
          error.status === 0
            ? 'Az API nem érhető el.'
            : error.status === 400 || error.status === 404
              ? 'A művelet már nem hajtható végre. Frissítsd a listát.'
              : 'Nem sikerült módosítani a foglalást.',
        );
      },
    });
  }
}