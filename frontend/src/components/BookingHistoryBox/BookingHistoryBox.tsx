import { useEffect, useState } from 'react';
import { IconTrash } from '@tabler/icons-react';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  ScrollArea,
  Table,
  Text,
  Title,
} from '@mantine/core';

import './BookingHistoryBox.module.css';

import { useAuth } from '@/hooks/AuthProvider';
import { deleteBookingById, fetchBookingsByUserId, updateBookingState } from '@/services/fetch';
import { Booking, BookingHistoryProps, Item } from '@/types/types';

const BookingHistoryBox: React.FC<BookingHistoryProps> = ({ locker, box, booking }) => {
  const [bookings, setBookings] = useState<Booking[]>();
  const [items, setItems] = useState<Item[]>();

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const loadBookings = async () => {
      try {
        const data = await fetchBookingsByUserId(user.id);
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    loadBookings();
  }, [user?.id]);

  const translateState = (state: string): string => {
    switch (state) {
      case 'pending':
        return 'Pendiente';
      case 'withdrawn':
        return 'Recogido';
      case 'returned':
        return 'Devuelto';
      default:
        return state;
    }
  };

  const getStateColor = (state: string): string => {
    switch (state) {
      case 'pending':
        return 'yellow';
      case 'withdrawn':
        return 'green';
      case 'returned':
        return 'white';
      default:
        return 'white';
    }
  };

  const sortedBookings = bookings?.sort((a, b) => {
    const order = { pending: 1, withdrawn: 2, returned: 3 };
    return (order[a.state] || 4) - (order[b.state] || 4);
  });

  function formatTime(timeString: string): string {
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  function formatDate(timeString: string): string {
    const date = new Date(timeString);

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  }

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      await deleteBookingById(bookingId);
      setBookings((prevBookings) => prevBookings?.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error(`Error trying to delete booking ${bookingId}:`, error);
    }
  };

  const handleUpdateState = async (
    bookingId: number,
    newState: 'pending' | 'withdrawn' | 'returned'
  ) => {
    try {
      await updateBookingState(bookingId, newState);
      setBookings((prevBookings) =>
        prevBookings?.map((b) => (b.id === bookingId ? { ...b, state: newState } : b))
      );
    } catch (error) {
      console.error(`Error updating booking ${bookingId}:`, error);
    }
  };

  const rows = sortedBookings?.map((b) => {
    const lockerId = b.items[0]?.box.locker.id;
    const boxId = b.items[0]?.box.id;
    const state = b.state;
    const itemsDescriptions = b.items?.map((i) => i.description);
    const itemsList = itemsDescriptions?.length ? (
      <ul>
        {itemsDescriptions.map((desc, index) => (
          <li key={index}>{desc}</li>
        ))}
      </ul>
    ) : (
      <Text c="gray">No hay ítems</Text>
    );

    const lockerBoxInfo = lockerId && boxId ? `A0${lockerId}-C0${boxId}` : '';

    const dateColor =
      b.state === 'pending' ? 'yellow' : b.state === 'withdrawn' ? 'yellow' : 'white';

    return (
      <Table.Tr key={b.id} c="white">
        <Table.Td>{lockerBoxInfo}</Table.Td>

        <Table.Td>
          <Text c={b.state === 'pending' ? 'yellow' : 'white'}>
            {formatDate(b.checkOut)} | {formatTime(b.checkOut)}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text c={b.state === 'withdrawn' ? 'yellow' : 'white'}>
            {formatDate(b.checkIn)} | {formatTime(b.checkIn)}
          </Text>
        </Table.Td>

        <Table.Td>{itemsList}</Table.Td>

        <Table.Td>
          <Text c={getStateColor(b.state)} fw={700}>
            {translateState(b.state)}
          </Text>
        </Table.Td>

        <Table.Td>
          {b.state === 'pending' && (
            <Button
              onClick={() => handleUpdateState(b.id, 'withdrawn')}
              size="md"
              maw="8vw"
              bg="myPurple.4"
              radius="xl"
              data-testid={`withdraw-button`}
            >
              Recoger
            </Button>
          )}
          {b.state === 'withdrawn' && (
            <Button
              onClick={() => handleUpdateState(b.id, 'returned')}
              size="md"
              maw="8vw"
              bg="myPurple.3"
              radius="xl"
              data-testid={`return-button`}
            >
              Devolver
            </Button>
          )}
        </Table.Td>

        <Table.Td c="red">
          <IconTrash
            onClick={() => handleDeleteBooking(b.id)}
            style={{ cursor: 'pointer' }}
            color="#FF5C5C"
            data-testid={`delete-booking`}
          />
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Box
      bg="transparent"
      h="60vh"
      bd="1px solid myPurple.1"
      style={{ borderRadius: '83px 0 25px 25px' }}
    >
      <Center>
        <h2 data-testid="history-title">Historial de reservas</h2>
      </Center>
      <Divider size="xs" color="myPurple.1" />

      <ScrollArea p="lg" m="md" h="50vh" scrollbarSize={16}>
        <Flex direction="column" gap="xl">
          {bookings && bookings.length > 0 ? (
            <Table horizontalSpacing="sm" verticalSpacing="sm">
              <Table.Thead c="white">
                <Table.Tr size="xl">
                  <Table.Th>
                    <Text c="white" fw={700}>Casilla</Text>
                  </Table.Th>
                  <Table.Th>
                    <Text c="white" fw={700}>Fecha de recogida</Text>
                  </Table.Th>
                  <Table.Th>
                    <Text c="white" fw={700}>Fecha de devolución</Text>
                  </Table.Th>
                  <Table.Th>
                    <Text c="white" fw={700}>Objetos reservados</Text>
                  </Table.Th>
                  <Table.Th>
                    <Text c="white" fw={700}>Estado</Text>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          ) : (
            <Center h="40vh">
              <Text c="gray" size="lg" fw={500}>
                No tienes reservas registradas.
              </Text>
            </Center>
          )}
        </Flex>
      </ScrollArea>
    </Box>
  );
};

export default BookingHistoryBox;
