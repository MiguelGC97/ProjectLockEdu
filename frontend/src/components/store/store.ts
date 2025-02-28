import Cookies from 'js-cookie';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import instance from '@/services/api';
import { login as authService } from '@/services/authService';
import {
  createBooking,
  createBox,
  createItem,
  createLocker,
  createUser,
  deleteBookingById,
  deleteBox,
  deleteItem,
  deleteLocker,
  deleteUser,
  fetchAllUsers,
  fetchBookingsByUserId,
  fetchBoxes,
  fetchBoxesByLocker,
  fetchItems,
  fetchLockers,
  updateAvatar,
  updateBookingState,
  updateBox,
  updateItem,
  updateLocker,
  updateUser,
} from '@/services/fetch';
import { getTheme } from '@/theme';
import { Booking, BoxType, Item, Locker, UserType } from '@/types/types';

// interfaces

interface AuthState {
  user: UserType | null;
  loading: boolean;
  login: (username: string, password: string, navigate: (path: string) => void) => Promise<void>;
  logout: (navigate: (path: string) => void) => void;
  // fetchUserPreferences: (userId: number) => Promise<void>;
  validateSession: () => Promise<void>;
  updateLoggedUserDetails: (userToEdit: UserType) => Promise<void>;
  updateLoggedUserAvatar: (userToEdit: UserType, avatar: string) => Promise<void>;
}

type ThemeState = {
  themeName: string;
  theme: ReturnType<typeof getTheme>;
  toggleTheme: () => void;
};

interface LockersState {
  lockers: Locker[];
  selectedLocker: Locker | null;
  fetchAll: () => void;
  create: (locker: Locker) => Promise<void>;
  update: (locker: Locker) => Promise<void>;
  deleteLocker: (id: number) => Promise<void>;
  setSelectedLocker: (locker: Locker | null) => void;
}

interface BoxesState {
  boxes: BoxType[];
  selectedBox: BoxType | null;
  fetchAll: () => void;
  fetchBoxesByLockerId: (lockerId: number) => void;
  create: (box: BoxType, currentLockerId: number, filepath: string) => Promise<void>;
  update: (box: BoxType) => Promise<void>;
  deleteBox: (id: number) => Promise<void>;
  setSelectedBox: (box: BoxType | null) => void;
}

interface ItemsState {
  items: Item[];
  fetchAll: () => void;
  create: (item: Item) => Promise<void>;
  update: (item: Item) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  selectedItems: Item[];
  setSelectedItems: (items: Item[]) => void;
}

interface BookingsState {
  bookings: Booking[];
  fetchByUserId: (userId: number) => void;
  create: (booking: Booking) => Promise<void>;
  deleteBooking: (id: number) => Promise<void>;
  updateBookingState: (id: number, bookingState: string) => Promise<void>;
}

interface UsersState {
  users: UserType[];
  selectedUser: UserType | null;
  fetchAll: () => void;
  create: (user: UserType, filepath: string) => Promise<void>;
  updateUserDetails: (userToEdit: UserType) => Promise<void>;
  updateUserAvatar: (userToEdit: UserType, avatar: string) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  setSelectedUser: (user: UserType | null) => void;
}

// Stores

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        loading: true,

        // Login
        login: async (username, password, navigate) => {
          try {
            const response = await authService(username, password);
            const { user } = response;

            sessionStorage.setItem('user', JSON.stringify(user));
            set({ user, loading: false });
            // await get().fetchUserPreferences(user.id);

            if (user.role === 'ADMIN') {
              navigate('/panel-admin');
            } else if (user.role === 'TEACHER') {
              navigate('/perfil');
            } else {
              navigate('/incidencias-manager');
            }
          } catch (error: any) {
            console.error('Error al acceder a cuenta:', error.response?.data || error.message);
            throw error;
          }
        },

        // Logout
        logout: (navigate) => {
          Cookies.remove('connect.sid');
          sessionStorage.removeItem('user');
          set({ user: null });
          navigate('/');
        },

        // // Fetch user preferences
        // fetchUserPreferences: async (userId) => {
        //   try {
        //     const res = await instance.get(`${baseUrl}/users/settings/${userId}`, {
        //       withCredentials: true,
        //     });
        //     set({
        //       theme: res.data.settings.theme,
        //       banner: res.data.settings.banner,
        //       notification: res.data.settings.notifications,
        //     });
        //   } catch (error) {
        //     console.error('Error fetching user preferences:', error);
        //   }
        // },

        // Update logged user details
        updateLoggedUserDetails: async (userToEdit) => {
          try {
            const response = await updateUser(userToEdit);
            if (response?.loggedUser) {
              sessionStorage.setItem('user', JSON.stringify(response.loggedUser));
              set({ user: response.loggedUser });
            }
            return response;
          } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error updating user details.');
          }
        },

        // Update logged user avatar
        updateLoggedUserAvatar: async (userToEdit, avatar) => {
          try {
            const response = await updateAvatar(userToEdit, avatar);
            if (response?.loggedUser) {
              sessionStorage.setItem('user', JSON.stringify(response.loggedUser));
              set({ user: response.loggedUser });
            }
            return response;
          } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error updating user avatar.');
          }
        },

        // Validate session
        validateSession: async () => {
          const sessionSid = Cookies.get('connect.sid');
          const savedUser = sessionStorage.getItem('user');

          if (savedUser) {
            set({ user: JSON.parse(savedUser), loading: false });
            return;
          }

          if (!sessionSid) {
            set({ loading: false });
            return;
          }

          try {
            const res = await instance.get('/users/validateSession', { withCredentials: true });
            const userData = res.data.user;
            sessionStorage.setItem('user', JSON.stringify(userData));
            set({ user: userData, loading: false });
            // await get().fetchUserPreferences(userData.id);
          } catch (error: any) {
            console.error('Session validation failed:', error.response || error);
            Cookies.remove('connect.sid');
            sessionStorage.removeItem('user');
            set({ user: null, loading: false });
          }
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        themeName: 'dark',
        theme: getTheme('dark'),
        toggleTheme: () => {
          const newThemeName = get().themeName === 'dark' ? 'light' : 'dark';
          set(
            { themeName: newThemeName, theme: getTheme(newThemeName) },
            false,
            `toggleTheme -> ${newThemeName}`
          );
        },
      }),
      {
        name: 'theme-storage',
        storage: createJSONStorage(() => localStorage),
      }
    ),
    { name: 'ThemeStore' }
  )
);

export const useLockersStore = create<LockersState>()(
  devtools(
    persist(
      (set) => ({
        lockers: [],
        selectedLocker: null,
        fetchAll: async () => {
          try {
            const lockers = await fetchLockers();
            set({ lockers });
          } catch (error) {
            console.error('Failed to fetch lockers:', error);
          }
        },
        create: async (locker) => {
          try {
            const newLocker = await createLocker(locker);
            set((state) => ({ lockers: [...state.lockers, newLocker] }));
          } catch (error) {
            console.error('Failed to create locker:', error);
          }
        },
        update: async (locker) => {
          try {
            await updateLocker(locker);
            set((state) => ({
              lockers: state.lockers.map((l) => (l.id === locker.id ? locker : l)),
            }));
          } catch (error) {
            console.error('Failed to update locker:', error);
          }
        },
        deleteLocker: async (id) => {
          try {
            await deleteLocker(id);
            set((state) => ({ lockers: state.lockers.filter((l) => l.id !== id) }));
          } catch (error) {
            console.error('Failed to delete locker:', error);
          }
        },
        setSelectedLocker: (locker) => set({ selectedLocker: locker ?? null }),
      }),
      {
        name: 'lockers-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export const useBoxesStore = create<BoxesState>()(
  devtools(
    persist(
      (set) => ({
        boxes: [],
        selectedBox: null,
        fetchAll: async () => {
          try {
            const boxes = await fetchBoxes();
            set({ boxes });
          } catch (error) {
            console.error('Failed to fetch boxes:', error);
          }
        },
        fetchBoxesByLockerId: async (lockerId) => {
          try {
            const boxes = await fetchBoxesByLocker(lockerId);
            set({ boxes });
          } catch (error) {
            console.error('Failed to fetch boxes by locker id:', error);
          }
        },
        create: async (box, currentLockerId, filepath) => {
          try {
            await createBox(box, currentLockerId, filepath);
            set((state) => ({ boxes: [...state.boxes, box] }));
          } catch (error) {
            console.error('Failed to create box:', error);
          }
        },
        update: async (box) => {
          try {
            await updateBox(box);
            set((state) => ({
              boxes: state.boxes.map((b) => (b.id === box.id ? box : b)),
            }));
          } catch (error) {
            console.error('Failed to update box:', error);
          }
        },
        deleteBox: async (id) => {
          try {
            await deleteBox(id);
            set((state) => ({ boxes: state.boxes.filter((b) => b.id !== id) }));
          } catch (error) {
            console.error('Failed to delete box:', error);
          }
        },
        setSelectedBox: (box) => set({ selectedBox: box ?? null }),
      }),
      {
        name: 'boxes-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export const useItemsStore = create<ItemsState>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        selectedItems: [],
        fetchAll: async () => {
          try {
            const items = await fetchItems();
            set({ items });
          } catch (error) {
            console.error('Failed to fetch items:', error);
          }
        },
        create: async (item) => {
          try {
            await createItem(item);
            set((state) => ({ items: [...state.items, item] }));
          } catch (error) {
            console.error('Failed to create item:', error);
          }
        },
        update: async (item) => {
          try {
            await updateItem(item);
            set((state) => ({
              items: state.items.map((i) => (i.id === item.id ? item : i)),
            }));
          } catch (error) {
            console.error('Failed to update item:', error);
          }
        },
        deleteItem: async (id) => {
          try {
            await deleteItem(id);
            set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
          } catch (error) {
            console.error('Failed to delete item:', error);
          }
        },
        setSelectedItems: (items) => set({ selectedItems: items }),
      }),
      {
        name: 'items-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export const useBookingsStore = create<BookingsState>()(
  devtools(
    persist(
      (set) => ({
        bookings: [],
        fetchByUserId: async (userId) => {
          try {
            const bookings = await fetchBookingsByUserId(userId);
            set({ bookings });
          } catch (error) {
            console.error('Failed to fetch bookings by user id:', error);
          }
        },
        create: async (booking) => {
          try {
            const newBooking = await createBooking(booking);
            set((state) => ({ bookings: [...state.bookings, newBooking] }));
          } catch (error) {
            console.error('Failed to create booking:', error);
          }
        },
        deleteBooking: async (id) => {
          try {
            await deleteBookingById(id);
            set((state) => ({ bookings: state.bookings.filter((b) => b.id !== id) }));
          } catch (error) {
            console.error('Failed to delete booking:', error);
          }
        },
        updateBookingState: async (id, bookingState) => {
          try {
            await updateBookingState(id, bookingState);

            set((state) => ({
              bookings: state.bookings.map((b) =>
                b.id === id ? { ...b, state: bookingState } : b
              ),
            }));
          } catch (error) {
            console.error('Failed to update booking state:', error);
          }
        },
      }),
      {
        name: 'bookings-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export const useUsersStore = create<UsersState>()(
  devtools(
    persist(
      (set) => ({
        users: [],
        selectedUser: null,
        fetchAll: async () => {
          try {
            const users = await fetchAllUsers();
            set({ users });
          } catch (error) {
            console.error('Failed to fetch users:', error);
            throw error;
          }
        },
        create: async (user, filepath) => {
          try {
            const newUser = await createUser(user, filepath);
            set((state) => ({ users: [...state.users, newUser] }));
          } catch (error) {
            console.error('Failed to create user:', error);
          }
        },
        updateUserDetails: async (userToEdit) => {
          try {
            const updatedUser = await updateUser(userToEdit);
            if (updatedUser) {
              set((state) => ({
                users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
              }));
            }
          } catch (error) {
            console.error('Failed to update user details:', error);
          }
        },
        updateUserAvatar: async (userToEdit, avatar) => {
          try {
            const response = await updateAvatar(userToEdit, avatar);
            if (response?.loggedUser) {
              set((state) => ({
                users: state.users.map((u) => (u.id === userToEdit.id ? response.loggedUser : u)),
              }));
            }
            return response;
          } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error updating user avatar.');
          }
        },
        deleteUser: async (id) => {
          try {
            await deleteUser(id);
            set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
          } catch (error) {
            console.error('Failed to delete user:', error);
          }
        },
        setSelectedUser: (user) => set({ selectedUser: user }),
      }),
      {
        name: 'users-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

useAuthStore.getState().validateSession();
