﻿import { Box, Center, Divider, Flex, ScrollArea, Text, Title } from '@mantine/core';

import './NotificationsBox.module.css';

import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { Booking } from '@/types/types';

function sortBookings(bookings: Booking[]): Booking[] {
  const now = Date.now();

  // Logic to sort the bookings by the closest notification time
  return bookings.sort((a, b) => {
    const aCheckInTime = new Date(a.checkInTime).getTime();
    const aCheckOutTime = new Date(a.checkOutTime).getTime();
    const bCheckInTime = new Date(b.checkInTime).getTime();
    const bCheckOutTime = new Date(b.checkOutTime).getTime();

    const aTimeDifference = Math.min(Math.abs(aCheckInTime - now), Math.abs(aCheckOutTime - now));
    const bTimeDifference = Math.min(Math.abs(bCheckInTime - now), Math.abs(bCheckOutTime - now));

    return aTimeDifference - bTimeDifference;
  });
}

function formatTime(timeString: string): string {
  // Function for formatting the timestamp to display only the hours and minutes in the notification
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function NotificationsBox() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    fetch('/assets/filteredBookings.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const reservations: Booking[] = data;
        const sortedReservations = sortBookings(reservations);
        setBookings(sortedReservations);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        setError('Error fetching filtered bookings.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {!isMobile ? (
        <Box
          bg="transparent"
          h="55vh"
          w="30vw"
          bd="1px solid myPurple.1"
          style={{ borderRadius: 40 }}
        >
          <Center>
            <h2>Notificaciones</h2>
          </Center>
          <Divider size="xs" color="myPurple.1" />
          <ScrollArea p="lg" m="md" h="70%" scrollbarSize={16}>
            <Flex direction="column" gap="sm">
              {bookings.map((sb) => {
                const lockerName = sb.Object.Box.Locker.name;
                const boxName = sb.Object.Box.name;
                const lockerLocation = sb.Object.Box.Locker.location;

                return (
                  <Box
                    key={sb.id} // Add key for unique identification of list items
                    h="auto"
                    bg={
                      sb.type === 'recogida' ? 'rgba(34, 139, 230, .20)' : 'rgba(231, 175, 46, .20)'
                    }
                    style={{ borderRadius: 20 }}
                    p="md"
                    bd={`1px solid ${sb.type === 'recogida' ? 'rgba(34, 139, 230)' : 'rgba(231, 175, 46)'}`}
                  >
                    <Flex gap="xl" justify="center" align="center">
                      <Flex gap="sm" direction="column" justify="center">
                        <Text fw={700} c="white">
                          Recordatorio de {sb.type}:
                        </Text>
                        <Flex gap="md" justify="flex-start">
                          <Flex gap={5}>
                            <Text c="white" fw={700}>
                              Casilla:
                            </Text>{' '}
                            <Text c="white">
                              {lockerName} {boxName}
                            </Text>
                          </Flex>
                          <Flex gap={5}>
                            <Text c="white" fw={700}>
                              Ubicación:
                            </Text>{' '}
                            <Text c="white">{lockerLocation}</Text>
                          </Flex>
                        </Flex>
                      </Flex>
                      <Title
                        fw={600}
                        c={sb.type === 'recogida' ? 'rgba(34, 139, 230)' : 'rgba(231, 175, 46)'}
                      >
                        {formatTime(sb.checkOutTime)}
                      </Title>
                    </Flex>
                  </Box>
                );
              })}
            </Flex>
          </ScrollArea>
        </Box>
      ) : (
        <div>Hola</div>
      )}
    </>
  );
}
