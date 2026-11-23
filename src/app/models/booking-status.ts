export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
}

export const bookingStatusLabels: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: 'Függőben',
  [BookingStatus.Confirmed]: 'Visszaigazolt',
  [BookingStatus.Cancelled]: 'Lemondva',
};