﻿import instance, { baseUrl } from '@/services/api';
import { BoxType, Item, Locker } from '@/types/types';

// function to fetch lockers
export async function fetchLockers(): Promise<Locker[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/lockers`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching lockers:', error);
    return [];
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

// Function to fetch objects
export async function fetchItems(): Promise<Item[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/items`);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching objects:', error);
    return [];
  }
}
