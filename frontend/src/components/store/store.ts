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
  fetchItemsByBox,
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
  user: any | null;
  loading: boolean;
  login: (username: string, password: string, navigate: (path: string) => void) => Promise<void>;
  logout: (navigate: (path: string) => void) => void;
  validateSession: () => Promise<void>;
  updateLoggedUserDetails: (userToEdit: any) => Promise<void>;
  updateLoggedUserAvatar: (userToEdit: any, avatar: string) => Promise<void>;
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
  create: (box: BoxType, currentLockerId: number, filepath: string | undefined) => Promise<void>;
  update: (box: BoxType) => Promise<void>;
  deleteBox: (id: number) => Promise<void>;
  setSelectedBox: (box: BoxType | null) => void;
}

interface ItemsState {
  items: Item[];
  fetchAll: () => void;
  fetchItemsByBoxId: (boxId: number) => void;
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

// stores

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: JSON.parse(sessionStorage.getItem('user') || 'null'),
        loading: true,

        login: async (username, password, navigate) => {
          try {
            const response = await authService(username, password);
            const { user } = response;

            sessionStorage.setItem('user', JSON.stringify(user));
            set({ user, loading: false });

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

        logout: (navigate) => {
          Cookies.remove('connect.sid');
          sessionStorage.removeItem('user');
          set({ user: null });
          navigate('/');
        },

        updateLoggedUserDetails: async (userToEdit) => {
          try {
            const response = await updateUser(userToEdit);
            if (response) {
              sessionStorage.setItem('user', JSON.stringify(response.loggedUser));
              set(() => ({ user: response.loggedUser }));
            }
            return response;
          } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error updating user details.');
          }
        },

        updateLoggedUserAvatar: async (userToEdit, avatar) => {
          try {
            const response = await updateAvatar(userToEdit, avatar);
            if (response?.loggedUser) {
              sessionStorage.setItem('user', JSON.stringify(response.loggedUser));
              set((state) => ({ user: { ...state.user, avatar: response.loggedUser.avatar } }));
            }
            return response;
          } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error updating user avatar.');
          }
        },

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
          } catch (error: any) {
            console.error('Error al obtener los lockers:', error);
            throw new Error(
              error.response?.data?.message || 'No se pudieron obtener los armarios.'
            );
          }
        },
        create: async (locker) => {
          try {
            const newLocker = await createLocker(locker);
            set((state) => ({ lockers: [...state.lockers, newLocker] }));
          } catch (error: any) {
            console.error('Error al crear el locker:', error);
            throw new Error(error.response?.data?.message || 'No se pudo crear el armario.');
          }
        },
        update: async (locker) => {
          try {
            await updateLocker(locker);
            set((state) => ({
              lockers: state.lockers.map((l) => (l.id === locker.id ? locker : l)),
            }));
          } catch (error: any) {
            console.error('Error al actualizar el locker:', error);
            throw new Error(error.response?.data?.message || 'No se pudo actualizar el armario.');
          }
        },
        deleteLocker: async (id) => {
          try {
            await deleteLocker(id);
            set((state) => ({ lockers: state.lockers.filter((l) => l.id !== id) }));
          } catch (error: any) {
            console.error('Error al eliminar el locker:', error);
            throw new Error(error.response?.data?.message || 'No se pudo eliminar el armario.');
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
          } catch (error: any) {
            console.error('Error al obtener las cajas:', error);
            throw new Error(
              error.response?.data?.message || 'No se pudieron obtener las casillas.'
            );
          }
        },
        fetchBoxesByLockerId: async (lockerId) => {
          try {
            const boxes = await fetchBoxesByLocker(lockerId);
            set({ boxes });
          } catch (error: any) {
            console.error('Error al obtener cajas por ID de locker:', error);
            throw new Error(
              error.response?.data?.message ||
                'No se pudieron obtener las casillas de este armario.'
            );
          }
        },
        create: async (box, currentLockerId, filepath) => {
          try {
            await createBox(box, currentLockerId, filepath);
            set((state) => ({ boxes: [...state.boxes, box] }));
          } catch (error: any) {
            console.error('Error al crear la caja:', error);
            throw new Error(error.response?.data?.message || 'No se pudo crear la casilla.');
          }
        },
        update: async (box) => {
          try {
            await updateBox(box);
            set((state) => ({
              boxes: state.boxes.map((b) => (b.id === box.id ? box : b)),
            }));
          } catch (error: any) {
            console.error('Error al actualizar la caja:', error);
            throw new Error(error.response?.data?.message || 'No se pudo actualizar la casilla.');
          }
        },
        deleteBox: async (id) => {
          try {
            await deleteBox(id);
            set((state) => ({ boxes: state.boxes.filter((b) => b.id !== id) }));
          } catch (error: any) {
            console.error('Error al eliminar la caja:', error);
            throw new Error(error.response?.data?.message || 'No se pudo eliminar la casilla.');
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
          } catch (error: any) {
            console.error('Error al obtener los artículos:', error);
            throw new Error(
              error.response?.data?.message || 'No se pudieron obtener los artículos.'
            );
          }
        },
        fetchItemsByBoxId: async (boxId) => {
          try {
            const items = await fetchItemsByBox(boxId);
            set({ items });
          } catch (error: any) {
            console.error('Error al obtener artículos por ID de casilla:', error);
            throw new Error(
              error.response?.data?.message ||
                'No se pudieron obtener los artículos de esta casilla.'
            );
          }
        },
        create: async (item) => {
          try {
            await createItem(item);
            set((state) => ({ items: [...state.items, item] }));
          } catch (error: any) {
            console.error('Error al crear el artículo:', error);
            throw new Error(error.response?.data?.message || 'No se pudo crear el artículo.');
          }
        },
        update: async (item) => {
          try {
            await updateItem(item);
            set((state) => ({
              items: state.items.map((i) => (i.id === item.id ? item : i)),
            }));
          } catch (error: any) {
            console.error('Error al actualizar el artículo:', error);
            throw new Error(error.response?.data?.message || 'No se pudo actualizar el artículo.');
          }
        },
        deleteItem: async (id) => {
          try {
            await deleteItem(id);
            set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
          } catch (error: any) {
            console.error('Error al eliminar el artículo:', error);
            throw new Error(error.response?.data?.message || 'No se pudo eliminar el artículo.');
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
          } catch (error: any) {
            console.error('Error al obtener reservas por usuario:', error);
            throw new Error(
              error.response?.data?.message || 'No se pudieron obtener las reservas del usuario.'
            );
          }
        },
        create: async (booking) => {
          try {
            const newBooking = await createBooking(booking);
            set((state) => ({ bookings: [...state.bookings, newBooking] }));
          } catch (error: any) {
            console.error('Error al crear la reserva:', error);
            throw new Error(error.response?.data?.message || 'No se pudo crear la reserva.');
          }
        },
        deleteBooking: async (id) => {
          try {
            await deleteBookingById(id);
            set((state) => ({ bookings: state.bookings.filter((b) => b.id !== id) }));
          } catch (error: any) {
            console.error('Error al eliminar la reserva:', error);
            throw new Error(error.response?.data?.message || 'No se pudo eliminar la reserva.');
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
          } catch (error: any) {
            console.error('Error al actualizar el estado de la reserva:', error);
            throw new Error(
              error.response?.data?.message || 'No se pudo actualizar el estado de la reserva.'
            );
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
          } catch (error: any) {
            console.error('Failed to fetch users:', error);
            throw error;
          }
        },

        create: async (user, filepath) => {
          try {
            const newUser = await createUser(user, filepath);
            set((state) => ({ users: [...state.users, newUser] }));
          } catch (error: any) {
            console.error('Failed to create user:', error);
            throw error;
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
          } catch (error: any) {
            console.error('Failed to update user details:', error);
            throw error;
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
            console.error('Failed to update user avatar:', error);
            throw error;
          }
        },

        deleteUser: async (id) => {
          try {
            await deleteUser(id);
            set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
          } catch (error: any) {
            console.error('Failed to delete user:', error);
            throw error;
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
