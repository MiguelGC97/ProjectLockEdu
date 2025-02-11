import { Box, Center, Divider, Flex, ScrollArea, Text, Title } from '@mantine/core';

import './NotificationsBox.module.css';

import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { useThemeContext } from '@/hooks/AppProvider';
import instance from '@/services/api';
import { Booking } from '@/types/types';

//this interface defines the values types of Booking object for later usage in the component

function sortBookings(bookings: Booking[]): Booking[] {
  const now = Date.now();

  //logic to sort the bookings by the closest notification time
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
  // function for formatting the timestamp to display only the hours and minutes in the notification
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function NotificationsBox() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { currentTheme } = useThemeContext();

  const matches = useMediaQuery('(min-width: 85em)');
  const matches2 = useMediaQuery('(max-width: 93em)');

  // useEffect(() => {
  //   //it fetches the filteredbookings using the axios instance (provisionally this will be commented and we will use the hardcoded filteredNotifications.json in the assets folder )
  //   // the response.data will be called reservations for the sake of distinction
  //   instance
  //     .get('../../assets/filteredBookings.json')
  //     .then((response) => {
  //       const reservations: Booking[] = response.data;
  //       const sortedReservations = sortBookings(reservations);
  //       console.log(sortedReservations);
  //       setBookings(sortedReservations); //sets the sorted reservations in state
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching filtered bookings:', error);
  //     });
  // }, []);

  useEffect(() => {
    //for testing purposes, let's use fetch to retrieve filtered bookings in json file
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
        setBookings(sortedReservations); //sets the sorted reservations in state
      })
      .catch((error) => {
        console.error('Error fetching filtered bookings:', error);
      });
  }, []);

  return (
    <>
      {matches ? (
        matches2 ? (
          //component for small desktops - max 1440
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
                Notificaciones
              </h2>
            </Center>
            <Divider size="xs" color={currentTheme === 'light' ? '#4F51B3' : '#F1F2FF'} />

            <ScrollArea p="lg" m="md" h="50vh" scrollbarSize={16}>
              <Flex direction="column" gap="sm">
                {bookings.map((sb) => {
                  const lockerName = sb.Object.Box.Locker.name;
                  const boxName = sb.Object.Box.name;
                  const lockerLocation = sb.Object.Box.Locker.location;

                  return (
                    <Box
                      h="auto"
                      bg={
                        sb.type === 'recogida'
                          ? 'rgba(34, 139, 230, .20)'
                          : 'rgba(231, 175, 46, .20)'
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
                              <Text
                                style={{
                                  color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
                                }}
                                fw={700}
                              >
                                Casilla:
                              </Text>{' '}
                              <Text
                                style={{
                                  color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
                                }}
                              >
                                {lockerName}
                                {boxName}
                              </Text>
                            </Flex>
                            <Flex gap={5}>
                              <Text
                                style={{
                                  color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
                                }}
                                fw={700}
                              >
                                Ubicación:
                              </Text>{' '}
                              <Text
                                style={{
                                  color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
                                }}
                              >
                                {lockerLocation}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                        <Title
                          fw={600}
                          c={sb.type === 'recogida' ? 'rgba(34, 139, 230)' : 'rgba(231, 175, 46)'}
                        >
                          {sb.type === 'recogida'
                            ? formatTime(sb.checkOutTime)
                            : formatTime(sb.checkOutTime)}
                        </Title>
                      </Flex>
                    </Box>
                  );
                })}
              </Flex>
            </ScrollArea>
          </Box>
        ) : (
          //component for big desktops - min 1440
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
                Notificaciones
              </h2>
            </Center>
            <Divider size="xs" color={currentTheme === 'light' ? '#4F51B3' : '#F1F2FF'} />

            <ScrollArea p="lg" m="md" h="50vh" scrollbarSize={16}>
              <Flex direction="column" gap="sm">
                {bookings.map((sb) => {
                  const lockerName = sb.Object.Box.Locker.name;
                  const boxName = sb.Object.Box.name;
                  const lockerLocation = sb.Object.Box.Locker.location;

                  return (
                    <Box
                      h="auto"
                      bg={
                        sb.type === 'recogida'
                          ? 'rgba(34, 139, 230, .20)'
                          : 'rgba(231, 175, 46, .20)'
                      }
                      style={{ borderRadius: 20 }}
                      p="md"
                      bd={`1px solid ${sb.type === 'recogida' ? 'rgba(34, 139, 230)' : 'rgba(231, 175, 46)'}`}
                    >
                      <Flex gap="xl" justify="center" align="center">
                        <Flex gap="sm" direction="column" justify="center">
                          <Text
                            fw={700}
                            style={{ color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}` }}
                          >
                            Recordatorio de {sb.type}:
                          </Text>
                          <Flex gap="md" justify="flex-start">
                            <Flex gap={5}>
                              <Text
                                fw={700}
                                style={{
                                  color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
                                }}
                              >
                                Casilla:
                              </Text>{' '}
                              <Text
                                style={{
                                  color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
                                }}
                              >
                                {lockerName}
                                {boxName}
                              </Text>
                            </Flex>
                            <Flex gap={5}>
                              <Text
                                style={{
                                  color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
                                }}
                                fw={700}
                              >
                                Ubicación:
                              </Text>{' '}
                              <Text
                                style={{
                                  color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
                                }}
                              >
                                {lockerLocation}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                        <Title
                          fw={600}
                          c={sb.type === 'recogida' ? 'rgba(34, 139, 230)' : 'rgba(231, 175, 46)'}
                        >
                          {sb.type === 'recogida'
                            ? formatTime(sb.checkOutTime)
                            : formatTime(sb.checkOutTime)}
                        </Title>
                      </Flex>
                    </Box>
                  );
                })}
              </Flex>
            </ScrollArea>
          </Box>
        )
      ) : (
        //component for mobile and tablet -- needs to be changed
        <Box
          bg="transparent"
          h="50vh"
          bd={currentTheme === 'light' ? '1px solid #4F51B3' : '1px solid #F1F2FF'}
          style={{ borderRadius: 40 }}
        >
          <Center>
            <h2
              style={{
                color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}`,
              }}
            >
              Notificaciones
            </h2>
          </Center>
          <Divider size="xs" color={currentTheme === 'light' ? '#4F51B3' : '#F1F2FF'} />

          <ScrollArea p="lg" m="md" h="50vh" scrollbarSize={16}>
            <Flex direction="column" gap="sm">
              {bookings.map((sb) => {
                const lockerName = sb.Object.Box.Locker.name;
                const boxName = sb.Object.Box.name;
                const lockerLocation = sb.Object.Box.Locker.location;

                return (
                  <Box
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
                        <Text
                          fw={700}
                          style={{ color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}` }}
                        >
                          Recordatorio de {sb.type}:
                        </Text>
                        <Flex gap="md" justify="flex-start">
                          <Flex gap={5}>
                            <Text
                              fw={700}
                              style={{ color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}` }}
                            >
                              Casilla:
                            </Text>{' '}
                            <Text
                              style={{ color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}` }}
                            >
                              {lockerName}
                              {boxName}
                            </Text>
                          </Flex>
                          <Flex gap={5}>
                            <Text
                              fw={700}
                              style={{ color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}` }}
                            >
                              Ubicación:
                            </Text>{' '}
                            <Text
                              style={{ color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}` }}
                            >
                              {lockerLocation}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                      <Title
                        fw={600}
                        c={sb.type === 'recogida' ? 'rgba(34, 139, 230)' : 'rgba(231, 175, 46)'}
                      >
                        {sb.type === 'recogida'
                          ? formatTime(sb.checkOutTime)
                          : formatTime(sb.checkOutTime)}
                      </Title>
                    </Flex>
                  </Box>
                );
              })}
            </Flex>
          </ScrollArea>
        </Box>
      )}
    </>
  );
}
