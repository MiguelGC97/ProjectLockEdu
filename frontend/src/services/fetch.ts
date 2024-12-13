import instance, { baseUrl } from '@/services/api';
import { BoxType, Incidence, Locker } from '@/types/types';

// function to fetch lockers
export async function fetchLockers(): Promise<Locker[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/lockers`);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Data is not an array', response.data);
    }
  } catch (error) {
    console.error('Error fetching lockers:', error);
    return []; // handle error by returning an empty array
  }
}

// Function to fetch boxes
export async function fetchBoxes(): Promise<BoxType[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/boxes`);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Data is not an array', response.data.data);
      return [];
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

export async function fetchIncidencesByUserId(userId: string): Promise<Incidence[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/reports/user/${userId}`);
    if (Array.isArray(response.data.reports)) {
      return response.data.reports; // Solo devolvemos los reportes
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
  teacherId: number;
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
