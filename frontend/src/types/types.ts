//for Locker component
export interface Locker {
  id: number;
  description: string;
  number: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoxType {
  id: number;
  description: string;
  filename: string;
  lockerId: number;
  createdAt: string;
  updatedAt: string;
  locker: Locker;
}

export interface LockersProps {
  onLockerClick: (locker: Locker) => void;
}

export interface BoxesProps {
  locker: Locker;
  onBoxClick: (box: BoxType) => void;
  onReturn: () => void;
}

export interface Booking {
  id: number;
  items: Item[];
  userId: number;
  description: string;
  checkOut: string;
  checkIn: string;
  state: 'pending' | 'withdrawn' | 'returned';
}

export interface Item {
  id: number;
  description: string;
  state: string;
  boxId: number;
  typeId: number;
  createdAt: string;
  updatedAt: string;
  box: BoxType;
}

export interface ObjectsProps {
  box: BoxType;
  onReturn: () => void;
  onCreateBooking: (box: BoxType, items: string[]) => void;
}

export interface BookingFormProps {
  box: BoxType;
  items: string[]; // This is the array of selected item ids.
  onReturnToBox: () => void;
  onReturn: () => void;
}

export interface BookingHistoryProps {
  locker: Locker;
  box: BoxType;
  booking: Booking;
}
