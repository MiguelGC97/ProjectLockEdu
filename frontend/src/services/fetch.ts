﻿import { useAuth } from '@/hooks/AuthProvider';
import instance, { baseUrl } from '@/services/api';
import { Booking, BoxType, Incidence, Item, Locker, UserType } from '@/types/types';

// function to fetch lockers
export async function fetchLockers(): Promise<Locker[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/lockers`);
    if (response.status >= 200 && response.status < 300 && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Unexpected response format', response.data);
      return [];
    }
  } catch (error: any) {
    console.error('Error fetching lockers:', error.message);
    return []; // Devuelve un arreglo vacío para evitar romper la app.
  }
}

// Function to fetch boxes
export async function fetchBoxes(): Promise<BoxType[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/boxes`);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching boxes:', error);
    return [];
  }
}

// function to fetch incidences
export async function fetchIncidences(): Promise<Incidence[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/reports`);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching Incidences:', error);
    return [];
  }
}

// function to fetch incidences by username
export async function fetchIncidencesByUsername(
  username: string
): Promise<Incidence[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/reports/${username}`);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching Incidences:', error);
    return [];
  }
}

// function to fetch incidences by userId

export async function fetchIncidencesByUserId(userId: number): Promise<Incidence[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/reports/user/${userId}`);

    if (Array.isArray(response.data.reports) && response.data.reports.length > 0) {
      return response.data.reports;
    } else {
      console.warn('No incidences found for the given user ID');
      return [];
    }
  } catch (error) {
    console.error('Error fetching incidences by user ID:', error);
    return [];
  }
}

//function to send data from incidences- we need to collect the right data

export async function fetchFormIncident(reportData: {
  content: string;
  isSolved: boolean;
  userId: number;
  boxId: number;
}): Promise<any> {
  try {
    const response = await instance.post(`${baseUrl}/reports`, reportData);
    return response.data.data;
  } catch (error) {
    console.error('Error sending report data', error);
    throw error;
  }
}

//function to update the incidences - implement the timer
export async function updateIncidenceContent(id: number, content: string): Promise<any> {
  try {
    await instance.put(`${baseUrl}/reports/update/${id}`, { content });
  } catch (error) {
    console.error('Error updating Incidence:', error);
    throw error;
  }
}

//function to fetchBoxesByLocker
export async function fetchBoxesByLocker(lockerId: string): Promise<BoxType[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/boxes/locker/${lockerId}`);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.error(`Error fetching boxes for locker ${lockerId}:`, error);
    return [];
  }
}

//function to fetch items
export async function fetchItems(): Promise<Item[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/items`);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

//function to fetch bookings by user Id
export async function fetchBookingsByUserId(userId: number): Promise<Booking[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/bookings/users/${userId}`);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching bookings', error);
    return [];
  }
}

//fetch bookings by user id and booking state
export async function fetchBookingsByUserIdAndState(
  userId: number,
  state: string
): Promise<Booking[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/bookings/users/${userId}/state/${state}`);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching bookings', error);
    return [];
  }
}

//fetch dates and item Ids from all bookings
export async function fetchBookingDatesByItemIds(
  itemIds: string[]
): Promise<{ checkIn: string; checkOut: string }[]> {
  try {
    if (itemIds.length === 0) {
      console.warn('No item IDs provided');
      return [];
    }

    const response = await instance.post(`${baseUrl}/bookings/items`, { itemIds });

    if (response.status >= 200 && response.status < 300 && response.data.itemDates) {
      return response.data.itemDates;
    } else {
      console.error('Unexpected response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching booking dates by items:', error);
    return [];
  }
}

//update booking state by Id
export async function updateBookingState(bookingId: number, state: string): Promise<any> {
  try {
    const response = await instance.put(`${baseUrl}/bookings/${bookingId}`, { state });
    if (response.status >= 200 && response.status < 300) {
      return response.data.data;
    } else {
      console.error('Error updating booking state:', response.data);
      throw new Error('Error updating booking state');
    }
  } catch (error) {
    console.error('Error updating booking state:', error);
    throw error;
  }
}

//delete booking by Id
export async function deleteBookingById(bookingId: number): Promise<void> {
  try {
    const response = await instance.delete(`${baseUrl}/bookings/${bookingId}`);
    if (response.status >= 200 && response.status < 300) {
    } else {
      console.error('Unexpected error while trying to delete booking:', response.data);
    }
  } catch (error) {
    console.error(`Error trying to delete booking ${bookingId}:`, error);
    throw error;
  }
}
export async function updatePassword(user: UserType, password: string): Promise<string> {
  try {
    const userId = user?.id;
    const response = await instance.put(`${baseUrl}/users/${userId}`, { password });
    if (response.status >= 200 && response.status < 300) {
      return response.data.data;
    } else {
      console.error('Error updating user password:', response.data.data);
      throw new Error('Error updating user password');
    }
  } catch (error) {
    console.error('Error user password:', error);
    throw error;
  }
}
