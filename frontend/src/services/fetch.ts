import instance, { baseUrl } from '@/services/api';
import { BoxType, Locker } from '@/types/types';

// function to fetch lockers
export async function fetchLockers(): Promise<Locker[]> {
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
