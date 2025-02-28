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

export interface BoxEditType {
  id?: number;
  description: string;
  filename: string | null;
  lockerId: number;
}

// export interface LockersProps {
//   onLockerClick: (locker: Locker) => void;
// }

// export interface BoxesProps {
//   onBoxClick: (box: BoxType) => void;
// }

export interface Booking {
  id: number;
  items: Item[];
  userId: number;
  description: string;
  checkOut: string;
  checkIn: string;
  state: string;
}

export interface Item {
  id: number;
  description: string;
  boxId: number;
  typeId: number;
  createdAt: string;
  updatedAt: string;
  box: BoxType;
}

// export interface ObjectsProps {
//   box: BoxType;
//   onReturn: () => void;
//   onCreateBooking: (box: BoxType, items: string[]) => void;
// }

export interface BookingFormProps {
  locker: Locker;
  box: BoxType;
  items: string[];
  onReturnToBox: () => void;
  onReturn: () => void;
  onBookingCreated: () => void;
}

export interface BookingHistoryProps {
  locker: Locker;
  box: BoxType;
  booking: Booking;
}

export interface PendingProps {
  bookings: Booking[];
  locker?: Locker;
  box?: BoxType;
  booking?: Booking;
}

export interface Incidence {
  id: number;
  content: string;
  isSolved: boolean;
  createdAt: string;
  boxId: number;
  user: {
    avatar: string;
    name: string;
  };
}

//enum for roles

export enum roles {
  TEACHER,
  ADMIN,
  MANAGER,
}
//type for user -- created primarily for AuthProvider
export interface UserType {
  id: number;
  name: string;
  surname: string;
  // password: string;
  username: string;
  avatar: string;
  role: 'TEACHER' | 'ADMIN' | 'MANAGER';
}

export interface Incidence {
  id: number;
  content: string;
  isSolved: boolean;
  createdAt: string;
  boxId: number;
  user: {
    avatar: string;
    name: string;
  };
}

export interface Boxs {
  id: number;
  description: string;
  createdAt: string;
}

export interface SettingsType {
  id: number;
  theme: string;
  banner: string;
  notifications: boolean;
}
