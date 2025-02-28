import axios from 'axios';
import { useAuth } from '@/hooks/AuthProvider';
import instance, { baseUrl } from '@/services/api';
import { Booking, BoxEditType, BoxType, Incidence, Item, Locker, UserType } from '@/types/types';

// function to fetch lockers
export async function fetchLockers(): Promise<Locker[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/lockers`, { withCredentials: true });
    if (response.status >= 200 && response.status < 300 && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Unexpected response format', response.data.data);
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

// Function to fetch boxes
export async function fetchObjectTypes(): Promise<any[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/types`);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching object types:', error);
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

export async function resolveIncidence(id: number, isSolved: boolean): Promise<any> {
  try {
    await instance.put(`${baseUrl}/reports/resolve/${id}`, { isSolved });
  } catch (error) {
    console.error('Error updating State:', error);
    throw error;
  }
}

//function to fetchBoxesByLocker
export async function fetchBoxesByLocker(lockerId: number): Promise<BoxType[] | undefined> {
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

//function to fetch items by box id
export async function fetchItemsByBox(boxId: number): Promise<Item[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/items/box/${boxId}`);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching items by box id:', error);
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

export async function updatePassword(
  user: any,
  oldPassword: string,
  newPassword: string
): Promise<any | undefined> {
  try {
    const userId = user?.id;
    const response = await instance.put(`${baseUrl}/users/password/${userId}`, {
      oldPassword,
      newPassword,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data.message;
    }
  } catch (error: any) {
    if (error.response) {
      console.error('Error updating user password:', error.response.data);
      throw new Error(error.response?.data?.message || 'An error occurred while updating password');
    } else {
      console.error('Error updating user password:', error);
      throw new Error('An error occurred while updating password');
    }
  }
}

export async function updateOwnPassword(
  user: any,
  oldPassword: string,
  newPassword: string
): Promise<any | undefined> {
  try {
    const userId = user?.id;
    const response = await instance.put(`${baseUrl}/users/own-password/${userId}`, {
      oldPassword,
      newPassword,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data.message;
    }
  } catch (error: any) {
    if (error.response) {
      console.error('Error updating user password:', error.response.data);
      throw new Error(error.response?.data?.message || 'An error occurred while updating password');
    } else {
      console.error('Error updating user password:', error);
      throw new Error('An error occurred while updating password');
    }
  }
}

export async function fetchAllUsers(): Promise<any[] | undefined> {
  try {
    const response = await instance.get(`${baseUrl}/users`, { withCredentials: true });
    if (response.status >= 200 && response.status < 300 && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Unexpected response format', response.data.data);
      return [];
    }
  } catch (error: any) {
    console.error('Error fetching all users:', error.message);
    return []; // Devuelve un arreglo vacío para evitar romper la app.
  }
}

export async function createUser(
  user: any,
  filepath: string | undefined
): Promise<any | undefined> {
  try {
    const newUser = {
      name: user.name,
      surname: user.surname,
      username: user.username,
      password: user.password,
      avatar: filepath,
      role: user.role,
    };
    const response = await instance.post(`${baseUrl}/users`, newUser);

    return response.data;
  } catch (error: any) {
    console.error('Error creating user:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Unexpected error while creating user');
  }
}

export async function deleteUser(userId: any): Promise<any | undefined> {
  try {
    const response = await instance.delete(`${baseUrl}/users/${userId}`);

    return response.data;
  } catch (error: any) {
    console.error('Error al borrar el usuario:', error.response?.data || error.message);
    throw error;
  }
}

export const updateUser = async (userToEdit: any): Promise<any | undefined> => {
  if (!userToEdit.id) {
    return;
  }

  try {
    const response = await instance.put(`${baseUrl}/users/${userToEdit.id}`, userToEdit);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const createLocker = async (locker: any): Promise<any | undefined> => {
  try {
    const response = await instance.post(`${baseUrl}/lockers`, locker);

    return response.data;
  } catch (error: any) {
    console.error('Error al crear el armario:', error.response?.data || error.message);
    throw error;
  }
};

export async function deleteLocker(lockerId: any): Promise<any | undefined> {
  try {
    const response = await instance.delete(`${baseUrl}/lockers/${lockerId}`);

    return response.data;
  } catch (error: any) {
    console.error('Error al borrar el armario:', error.response?.data || error.message);
    throw error;
  }
}

export const updateLocker = async (locker: Locker): Promise<any | undefined> => {
  try {
    const response = await instance.put(`${baseUrl}/lockers/${locker.id}`, locker);

    return response.data;
  } catch (error) {
    console.error('Error updating locker:', error);
    throw error;
  }
};

export const uploadBoxImage = async (file: any): Promise<string | undefined> => {
  try {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await instance.post(`${baseUrl}/boxes/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.filepath;
    }
  } catch (error: any) {
    console.error('Error uploading file:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'File upload failed');
  }
};

export const uploadBanner = async (file: any): Promise<string | undefined> => {
  try {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await instance.post(`${baseUrl}/settings/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.filepath;
    }
  } catch (error: any) {
    console.error('Error uploading file:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'File upload failed');
  }
};

export const createBox = async (
  box: BoxEditType,
  currentLockerId: number,
  filePath: string | undefined
): Promise<any | undefined> => {
  try {
    const newBox = {
      description: box.description,
      lockerId: currentLockerId,
      filename: filePath,
    };

    const response = await instance.post(`${baseUrl}/boxes`, newBox);
    return response.data;
  } catch (error: any) {
    console.error('Error creating box:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Unexpected error while creating box');
  }
};

export const deleteBox = async (boxId: number): Promise<any | undefined> => {
  try {
    const response = await instance.delete(`${baseUrl}/boxes/${boxId}`);
    return response;
  } catch (error: any) {
    console.error('Error deleting box:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error while deleting the box.');
  }
};

export const updateBox = async (box: any): Promise<any | undefined> => {
  try {
    const response = await instance.put(`${baseUrl}/boxes/${box.id}`, box);
    return response.data;
  } catch (error: any) {
    console.error('Error updating box:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error while updating the box.');
  }
};

export const uploadAvatar = async (file: any): Promise<any | undefined> => {
  try {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await instance.post(`${baseUrl}/users/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.filepath;
    }
  } catch (error: any) {
    console.error('Error uploading file:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'File upload failed');
  }
};

export const updateAvatar = async (user: any, avatar: string): Promise<any | undefined> => {
  try {
    const response = await instance.put(
      `${baseUrl}/users/update-avatar/${user.id}`,
      { avatar },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error updating avatar:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error while updating the avatar.');
  }
};

export const createItem = async (newItem: any): Promise<any | undefined> => {
  try {
    const response = await instance.post(`${baseUrl}/items`, newItem);

    return response.data;
  } catch (error: any) {
    console.error('Error al crear el objeto:', error.response?.data || error.message);
    throw error;
  }
};

export async function deleteItem(itemId: any): Promise<any | undefined> {
  try {
    const response = await instance.delete(`${baseUrl}/items/${itemId}`);

    return response.data;
  } catch (error: any) {
    console.error('Error al borrar el armario:', error.response?.data || error.message);
    throw error;
  }
}

export const updateItem = async (itemToUpdate: any): Promise<any | undefined> => {
  try {
    const response = await instance.put(`${baseUrl}/items/${itemToUpdate.id}`, itemToUpdate);

    return response.data;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

export const createBooking = async (booking: any): Promise<any | undefined> => {
  try {
    const response = await instance.post(`${baseUrl}/bookings`, booking);

    return response.data;
  } catch (error: any) {
    console.error('Error creating booking:', error.response?.data || error.message);
    throw error;
  }
};
