import instance, { baseUrl } from '@/services/api';
import { BoxType, Locker } from '@/types/types';

export async function fetchLockers(): Promise<Locker[]> {
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
export async function fetchBoxes(): Promise<BoxType[]> {
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
