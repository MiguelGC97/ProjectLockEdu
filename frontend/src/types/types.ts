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
  objectId: number;
  userId: number;
  description: string;
  checkOutTime: string;
  checkInTime: string;
  type: 'recogida' | 'devolución';
  Object: {
    id: number;
    name: string;
    Box: {
      id: number;
      name: string;
      Locker: {
        name: string;
        location: string;
      };
    };
  };
}

export interface Item {
  id: number;
  description: string;
  state: string;
  boxId: number;
  typeId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ObjectsProps {
  box: BoxType;
  onReturn: () => void;
  onCreateBooking: (box: BoxType, items: string[]) => void;
}

export interface BookingFormProps {
  box: BoxType;
  items: string[]; // This is the array of selected item ids.
}

export interface Incidence {
  id: number;
  content: string;
  isSolved: boolean;
  createdAt: string;
  boxId: number;
}