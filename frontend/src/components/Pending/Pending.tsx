import { useEffect, useState } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { Box, Center, Divider, Flex, Group, ScrollArea, Table, Text, Title } from '@mantine/core';

import './Pending.module.css';

import { useThemeContext } from '@/hooks/AppProvider';
import { useAuth } from '@/hooks/AuthProvider';
import { fetchBookingsByUserIdAndState } from '@/services/fetch';
import { Booking, BookingHistoryProps, PendingProps } from '@/types/types';

const Pending: React.FC<BookingHistoryProps> = ({ locker, box, booking }) => {
  const { currentTheme } = useThemeContext();
  const [bookings, setBookings] = useState<Booking[]>();

  const { user } = useAuth();
  const state = 'pending';

  useEffect(() => {
    const loadBookings = async () => {
      const data = await fetchBookingsByUserIdAndState(user.id, state);
      setBookings(data);
      console.log(data);
    };
    loadBookings();
  }, []);

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
      <Table.Tr
        key={b.id}
        style={{
          color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
        }}
      >
        <Table.Td>{lockerBoxInfo}</Table.Td>

        <Table.Td>{formatDate(b.checkOut)}</Table.Td>

        <Table.Td>{formatTime(b.checkOut)}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Box
      bg="transparent"
      h="60vh"
      bd={currentTheme === 'light' ? '1px solid #4F51B3' : '1px solid #F1F2FF'}
      style={{ borderRadius: 40 }}
    >
      <Center>
        <h2
          style={{
            color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
          }}
        >
          Reservas pendientes
        </h2>
      </Center>
      <Divider color={currentTheme === 'light' ? '#4F51B3' : '#F1F2FF'} size="xs" />

      <ScrollArea p="lg" m="md" h="50vh" scrollbarSize={16}>
        <Flex direction="column" gap="xl">
          <Table
            horizontalSpacing="sm"
            verticalSpacing="sm"
            borderColor={currentTheme === 'light' ? '#4F51B3' : '#F1F2FF'}
          >
            <Table.Thead c="white">
              <Table.Tr size="xl">
                <Table.Th>
                  <Text
                    style={{
                      color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
                    }}
                    fw={700}
                  >
                    Casilla
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text
                    style={{
                      color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
                    }}
                    fw={700}
                  >
                    Fecha de recogida
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text
                    style={{
                      color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
                    }}
                    fw={700}
                  >
                    Hora de recogida
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
};

export default Pending;
