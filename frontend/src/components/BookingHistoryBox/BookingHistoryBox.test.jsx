import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import BookingHistoryBox from './BookingHistoryBox';
import { MantineProvider } from '@mantine/core';
import { deleteBookingById, fetchBookingsByUserId, updateBookingState } from '@/services/fetch';
import { vi } from 'vitest';
import { faker } from '@faker-js/faker';

// useAuth hook mock
vi.mock('@/hooks/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: '1' },
  }),
}));

// Mantine render
const renderWithMantine = (component) => {
  return render(<MantineProvider>{component}</MantineProvider>);
};

//Faker dynamic data generation
// const generateBooking = () => ({
//   id: faker.number.int(),
//   state: faker.helpers.arrayElement(['pending', 'withdrawn', 'returned']),
//   checkIn: faker.date.future().toISOString(),
//   checkOut: faker.date.future().toISOString(),
//   items: [
//     {
//       id: faker.number.int(),
//       description: faker.commerce.productName(),
//       box: {
//         id: faker.number.int(),
//         locker: {
//           id: faker.number.int(),
//         },
//       },
//     },
//   ],
// });

describe('BookingHistoryBox', () => {
  const testLocker = {
    id: 1,
    description: 'Locker 1',
    number: 101,
    location: 'Aula 1',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  };

  const testBox = {
    id: 1,
    description: 'Box 1',
    filename: 'box1.txt',
    lockerId: 1,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    locker: testLocker,
  };

  const testBooking = {
    id: 1,
    items: [
      {
        id: 1,
        description: 'Item 1',
        boxId: 1,
        typeId: 1,
        createdAt: '2025-02-17T10:00:00Z',
        updatedAt: '2025-02-17T10:00:00Z',
        box: {
          id: 1,
          description: 'Box 1',
          filename: 'box1.png',
          lockerId: 1,
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z',
          locker: {
            id: 1,
            description: 'Locker 1',
            number: 1,
            location: 'Room 1',
            createdAt: '2025-02-17T10:00:00Z',
            updatedAt: '2025-02-17T10:00:00Z',
          },
        },
      },
      {
        id: 2,
        description: 'Item 2',
        boxId: 2,
        typeId: 2,
        createdAt: '2025-02-17T10:00:00Z',
        updatedAt: '2025-02-17T10:00:00Z',
        box: {
          id: 2,
          description: 'Box 2',
          filename: 'box2.png',
          lockerId: 2,
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z',
          locker: {
            id: 2,
            description: 'Locker 2',
            number: 2,
            location: 'Room 2',
            createdAt: '2025-02-17T10:00:00Z',
            updatedAt: '2025-02-17T10:00:00Z',
          },
        },
      },
    ],
    userId: 1,
    description: 'Test Booking',
    checkIn: '2025-02-17T12:00:00Z',
    checkOut: '2025-02-17T10:00:00Z',
    state: 'pending',
  };

  beforeEach(() => {
    vi.mock('@/services/fetch', () => ({
      fetchBookingsByUserId: vi.fn(() =>
        Promise.resolve([
          {
            id: 1,
            state: 'pending',
            checkIn: '2025-02-17T12:00:00Z',
            checkOut: '2025-02-17T10:00:00Z',
            items: [{ description: 'Item 1', box: { locker: { id: 1 }, id: 1 } }],
          },
        ])
      ),
      deleteBookingById: vi.fn(() => Promise.resolve()),
      updateBookingState: vi.fn(() => Promise.resolve()),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders "No tienes reservas registradas" when bookings are empty', async () => {
    vi.mocked(fetchBookingsByUserId).mockResolvedValueOnce([]);

    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

    await waitFor(() => {
      expect(screen.getByText('No tienes reservas registradas.')).toBeInTheDocument();
    });
  });

  it('renders correctly and loads bookings', async () => {
    vi.mocked(fetchBookingsByUserId).mockResolvedValueOnce([
      {
        id: 1,
        state: 'pending',
        checkIn: '2025-02-17T12:00:00Z',
        checkOut: '2025-02-17T10:00:00Z',
        items: [{ description: 'Item 1', box: { locker: { id: 1 }, id: 1 } }],
      },
    ]);

    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

    await waitFor(() => {
      expect(screen.getByText('Historial de reservas')).toBeInTheDocument();
    });

    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('A01-C01')).toBeInTheDocument();
  });

  it('renders the correct state color for pending bookings', async () => {
    vi.mocked(fetchBookingsByUserId).mockResolvedValueOnce([
      {
        id: 1,
        state: 'pending',
        checkIn: '2025-02-17T12:00:00Z',
        checkOut: '2025-02-17T10:00:00Z',
        items: [{ description: 'Item 1', box: { locker: { id: 1 }, id: 1 } }],
      },
    ]);
    
    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

    await waitFor(() => {
      const stateText = screen.getByText('Pendiente');
      expect(stateText).toHaveStyle('color: var(--mantine-color-yellow-text)');
    });
  });

  it('updates booking state when "Recoger" button is clicked', async () => {
    vi.mocked(fetchBookingsByUserId).mockResolvedValueOnce([
      {
        id: 1,
        state: 'pending',
        checkIn: '2025-02-17T12:00:00Z',
        checkOut: '2025-02-17T10:00:00Z',
        items: [{ description: 'Item 1', box: { locker: { id: 1 }, id: 1 } }],
      },
    ]);

    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

    await waitFor(() => {
      expect(screen.getByText('Historial de reservas')).toBeInTheDocument();
    });

    const button = screen.getByText('Recoger');
    fireEvent.click(button);

    await waitFor(() => {
      expect(updateBookingState).toHaveBeenCalledWith(1, 'withdrawn');
    });
  });

  it('renders the correct number of bookings', async () => {
    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(2);
    });
  });

  it('renders the correct booking details', async () => {
    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('17/2/2025 | 10:00')).toBeInTheDocument();
      expect(screen.getByText('17/2/2025 | 12:00')).toBeInTheDocument();
    });
  });

  it('does not render "Recoger" button for returned bookings', async () => {
    vi.mocked(fetchBookingsByUserId).mockResolvedValueOnce([
      {
        id: 1,
        state: 'returned',
        checkIn: '2025-02-17T12:00:00Z',
        checkOut: '2025-02-17T10:00:00Z',
        items: [{ description: 'Item 1', box: { locker: { id: 1 }, id: 1 } }],
      },
    ]);

    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Recoger')).not.toBeInTheDocument();
    });
  });

  it('does not render "Devolver" button for pending bookings', async () => {
    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

    await waitFor(() => {
      expect(screen.queryByText('Devolver')).not.toBeInTheDocument();
    });
  });

  it('renders the correct state color for withdrawn bookings', async () => {
    vi.mocked(fetchBookingsByUserId).mockResolvedValueOnce([
      {
        id: 1,
        state: 'withdrawn',
        checkIn: '2025-02-17T12:00:00Z',
        checkOut: '2025-02-17T10:00:00Z',
        items: [{ description: 'Item 1', box: { locker: { id: 1 }, id: 1 } }],
      },
    ]);

    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

    await waitFor(() => {
      const stateText = screen.getByText('Recogido');
      expect(stateText).toHaveStyle('color: var(--mantine-color-green-text)');
    });
  });

  it('renders the correct state color for returned bookings', async () => {
    vi.mocked(fetchBookingsByUserId).mockResolvedValueOnce([
      {
        id: 1,
        state: 'returned',
        checkIn: '2025-02-17T12:00:00Z',
        checkOut: '2025-02-17T10:00:00Z',
        items: [{ description: 'Item 1', box: { locker: { id: 1 }, id: 1 } }],
      },
    ]);

    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

    await waitFor(() => {
      const stateText = screen.getByText('Devuelto');
      expect(stateText).toHaveStyle('color: var(--mantine-color-white)');
    });
  });

  it('calls deleteBookingById with the correct booking ID', async () => {
    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

    await waitFor(() => {
      const trashIcon = screen.getByTestId('delete-booking');
      fireEvent.click(trashIcon);
    });

    await waitFor(() => {
      expect(deleteBookingById).toHaveBeenCalledWith(1);
    });
  });

  it('updates the bookings list after deleting a booking', async () => {
    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

    await waitFor(() => {
      const trashIcon = screen.getByTestId('delete-booking');
      fireEvent.click(trashIcon);
    });

    await waitFor(() => {
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });
  });

  it('updates booking state when "Devolver" button is clicked', async () => {
    vi.mock('@/services/fetch', () => ({
      fetchBookingsByUserId: vi.fn(() =>
        Promise.resolve([
          {
            id: 1,
            state: 'withdrawn',
            checkIn: '2025-02-17T12:00:00Z',
            checkOut: '2025-02-17T10:00:00Z',
            items: [{ description: 'Item 1', box: { locker: { id: 1 }, id: 1 } }],
          },
        ])
      ),
      deleteBookingById: vi.fn(() => Promise.resolve()),
      updateBookingState: vi.fn(() => Promise.resolve()),
    }));

    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

    await waitFor(() => {
      expect(screen.getByText('Historial de reservas')).toBeInTheDocument();
    });

    const button = screen.getByText('Devolver');
    fireEvent.click(button);

    await waitFor(() => {
      expect(updateBookingState).toHaveBeenCalledWith(1, 'returned');
    });
  });

  it('deletes booking when trash icon is clicked', async () => {
    renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

    await waitFor(() => {
      expect(screen.getByText('Historial de reservas')).toBeInTheDocument();
    });

    const trashIcon = screen.getByTestId('delete-booking');
    fireEvent.click(trashIcon);

    await waitFor(() => {
      expect(deleteBookingById).toHaveBeenCalledWith(1);
    });
  });

  // it('renders correctly with extreme date values', async () => {

  //   const mockBooking = {
  //     id: faker.number.int(),
  //     state: 'pending',
  //     checkIn: faker.date.past({ years: 10 }).toISOString(),
  //     checkOut: faker.date.future({ years: 10 }).toISOString(),
  //     items: [
  //       {
  //         id: faker.number.int(),
  //         description: faker.lorem.paragraph(),
  //         box: {
  //           id: faker.number.int(),
  //           locker: {
  //             id: faker.number.int(),
  //           },
  //         },
  //       },
  //     ],
  //   };

  //   vi.mocked(fetchBookingsByUserId).mockResolvedValueOnce([mockBooking]);

  //   renderWithMantine(<BookingHistoryBox locker={testLocker} box={testBox} booking={testBooking} />);

  //   await waitFor(() => {
  //     expect(screen.getByText(mockBooking.items[0].description)).toBeInTheDocument();
  //     expect(screen.getByText(new Date(mockBooking.checkIn).toLocaleDateString('es-ES'))).toBeInTheDocument();
  //     expect(screen.getByText(new Date(mockBooking.checkOut).toLocaleDateString('es-ES'))).toBeInTheDocument();
  //   });
  // });
});