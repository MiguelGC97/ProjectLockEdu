import instance, { baseUrl } from '@/services/api';
import { BoxType, Incidence, Item, Locker, Booking } from '@/types/types';

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
export async function fetchIncidencesByUsername(username:string): Promise<Incidence[] | undefined> {
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
    console.error("Error fetching incidences by user ID:", error);
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
export async function updateIncidenceContent(
  id: number,
  content: string
): Promise<any> {
  try {
    await instance.put(`${baseUrl}/reports/update/${id}`, { content });
  } catch (error) {
    console.log (content);
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


// 
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

export async function fetchBookingsByUserIdAndState(userId: number, state: string): Promise<Booking[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/bookings/users/${userId}/state/${state}`);
    if (Array.isArray(response.data.data)) {
      console.log(JSON.stringify(response.data.data, null, 2));
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching bookings', error);
    return [];
  }
}

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

export async function deleteBookingById(bookingId: number): Promise<void> {
  try {
    const response = await instance.delete(`${baseUrl}/bookings/${bookingId}`);
    if (response.status >= 200 && response.status < 300) {
      console.log(`Booking ${bookingId} deleted`);
    } else {
      console.error('Unexpected error while trying to delete booking:', response.data);
    }
  } catch (error) {
    console.error(`Error trying to delete booking ${bookingId}:`, error);
    throw error; 
  }
}
