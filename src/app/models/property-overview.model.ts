export interface RecentBooking {
  id: string;
  guestName: string;
  propertyName: string;
  start: string;
  end: string;
}

export interface UpcomingCheckIn {
  imageUrl: string;
  guestName: string;
  propertyName: string;
  date: string;
}

export interface PropertyOverview {
  today: {
    booked: number;
    checkIns: number;
    checkOuts: number;
  };
  recentBookings: RecentBooking[];
  upcomingCheckIns: UpcomingCheckIn[];
}