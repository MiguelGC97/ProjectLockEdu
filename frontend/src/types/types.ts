//for Locker component
export interface Locker {
  id: number;
  description: string;
  number: number;
  location: string;
}

export interface BoxType {
  id: number;
  description: string;
  filename: string;
  locker_id: number;
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
  object_id: number;
  user_id: number;
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

export interface Object {
  id: string;
  description: string;
  state: string;
  box_id: string;
  type_id: string;
}

export interface ObjectType {
  id: number;
  name: string;
  description: string;
  box_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ObjectsProps {
  box: BoxType;
  onReturn: () => void;
}
