import { useEffect, useState } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { Box, Center, Divider, Flex, Group, ScrollArea, Table, Text, Title } from '@mantine/core';

import './Pending.module.css';

import { useAuth } from '@/hooks/AuthProvider';
import { fetchBookingsByUserIdAndState } from '@/services/fetch';
import { Booking, BookingHistoryProps, PendingProps } from '@/types/types';

const Pending: React.FC<BookingHistoryProps> = ({ locker, box, booking }) => {
  const [bookings, setBookings] = useState<Booking[]>();

  const { user, theme } = useAuth();
  const state = 'pending';

  useEffect(() => {
    const loadBookings = async () => {
      const data = await fetchBookingsByUserIdAndState(user.id, state);
      setBookings(data);
    };
    loadBookings();
  }, []);

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

  const rows = bookings?.map((b) => {
    const lockerId = b.items[0]?.box.locker.id;
    const boxId = b.items[0]?.box.id;

    const lockerBoxInfo = lockerId && boxId ? `A0${lockerId}-C0${boxId}` : '';

    return (
      <Table.Tr key={b.id} c="myPurple.0">
        <Table.Td aria-label="nombre de la casilla">{lockerBoxInfo}</Table.Td>

        <Table.Td aria-label="fecha de recogida">{formatDate(b.checkOut)}</Table.Td>

        <Table.Td aria-label="hora de recogida">{formatTime(b.checkOut)}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Box bg="transparent" h="60vh" bd="1px solid myPurple.1" style={{ borderRadius: 40 }}>
      <Center>
        <h2 style={{ color: 'var(--mantine-color-myPurple-0)' }}>Reservas pendientes</h2>
      </Center>
      <Divider size="xs" color="myPurple.0" />

      <ScrollArea p="lg" m="md" h="50vh" scrollbarSize={16}>
        <Flex direction="column" gap="xl">
          <Table horizontalSpacing="sm" verticalSpacing="sm">
            <Table.Thead c="myPurple.0" aria-label="cabecera del cuadro de reservas pendientes">
              <Table.Tr size="xl">
                <Table.Th>
                  <Text c="myPurple.0" fw={700}>
                    Casilla
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text c="myPurple.0" fw={700}>
                    Fecha de recogida
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text c="myPurple.0" fw={700}>
                    Hora de recogida
                  </Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Flex>
      </ScrollArea>
    </Box>
  );
};

export default Pending;
