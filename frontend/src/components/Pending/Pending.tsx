import { IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Box, Center, Divider, Flex, Group, ScrollArea, Table, Text, Title } from '@mantine/core';

import './Pending.module.css';

import { BookingHistoryProps, Booking } from '@/types/types';
import { fetchBookingsByUserIdAndState } from '@/services/fetch';

const Pending: React.FC<BookingHistoryProps> = ({ locker, box, booking }) => {

  const [bookings, setBookings] = useState<Booking[]>();

  const userId = 1;
  const state = "pending";

  useEffect(() => {
    const loadBookings = async () => {
      const data = await fetchBookingsByUserIdAndState(userId, state);
      setBookings(data);
      console.log(data);
    }
    loadBookings();
  }, [])

  function formatTime(timeString: string): string {
    // function for formatting the timestamp to display only the hours and minutes in the notification
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

  const rows = bookings?.map((b) => {
    const lockerId = b.items[0]?.box.locker.id;
    const boxId = b.items[0]?.box.id;

    const lockerBoxInfo = lockerId && boxId ? `A0${lockerId}-C0${boxId}` : '';

    return (
      <Table.Tr key={b.id} c="white">
        <Table.Td>
          {lockerBoxInfo}
        </Table.Td>

        <Table.Td>
          {formatDate(b.checkOut)}
        </Table.Td>

        <Table.Td>
          {formatTime(b.checkOut)}
        </Table.Td>

        <Table.Td c="red">
          {'             '}
          <IconTrash />
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Box bg="transparent" h="60vh" bd="1px solid myPurple.1" style={{ borderRadius: 40 }}>
      <Center>
        <h2>Reservas pendientes</h2>
      </Center>
      <Divider size="xs" color="myPurple.1" />

      <ScrollArea p="lg" m="md" h="50vh" scrollbarSize={16}>
        <Flex direction="column" gap="xl">
          <Table horizontalSpacing="sm" verticalSpacing="sm">
            <Table.Thead c="white">
              <Table.Tr size="xl">
                <Table.Th>
                  <Text c="white" fw={700}>
                    Casilla
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text c="white" fw={700}>
                    Fecha
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text c="white" fw={700}>
                    Horario
                  </Text>
                </Table.Th>
                <Table.Th> </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Flex>
      </ScrollArea>
    </Box>
  );
}

export default Pending;
