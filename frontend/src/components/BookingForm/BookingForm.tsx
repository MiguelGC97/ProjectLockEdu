﻿import { useEffect, useRef, useState } from 'react';
import { IconArrowLeft, IconClock } from '@tabler/icons-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { DatePicker, DatesProvider, TimeInput } from '@mantine/dates';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';

import 'dayjs/locale/es';

import { useAuth } from '@/hooks/AuthProvider';
import instance, { baseUrl } from '@/services/api';
import { fetchBookingDatesByItemIds } from '@/services/fetch';
import { BookingFormProps, BoxType, Item } from '@/types/types';

import './BookingForm.module.css';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.locale('es');

const BookingForm: React.FC<BookingFormProps> = ({
  locker,
  box,
  items,
  onReturnToBox,
  onReturn,
  onBookingCreated,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [filteredObjects, setFilteredObjects] = useState<Item[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [pickupTime, setPickupTime] = useState<string>('');
  const [returnTime, setReturnTime] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const currentDate = dayjs();
  const { theme } = useAuth();
  const { user } = useAuth();
  const [unavailableDates, setUnavailableDates] = useState<{ checkIn: Date; checkOut: Date }[]>([]);

  const handlePickupTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPickupTime(event.target.value);
  };

  const handleReturnTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReturnTime(event.target.value);
  };

  const calculateReturnTimeLimit = (date: Date): string | null => {
    const selectedDate = dayjs(date).startOf('day');
  
   
    const activeBooking = unavailableDates.find(({ checkIn }) => {
      return dayjs(checkIn).isSame(selectedDate, 'day');
    });
  
    if (activeBooking) {
      
      const limitTime = dayjs(activeBooking.checkIn).subtract(5, 'minute').format('HH:mm');
      return limitTime;
    }
  
    return null; 
  };

  const handleDateRangeChange = (newRange: [Date | null, Date | null]) => {
    if (newRange[0] && newRange[1]) {
      const start = dayjs(newRange[0]);
      const end = dayjs(newRange[1]);

      const isInvalidRange = unavailableDates.some(({ checkIn, checkOut }) => {
        const checkInDate = dayjs(checkIn);
        const checkOutDate = dayjs(checkOut);

        return start.isBefore(checkInDate) && end.isAfter(checkOutDate);
      });

      if (isInvalidRange) {
        setError('Algunos de los días que has seleccionado ya están reservados');
        return;
      }

      const returnTimeLimit = calculateReturnTimeLimit(newRange[1]);

      if (returnTimeLimit) {
        setReturnTime(returnTimeLimit);
      }
    }

    setError(null);
    setDateRange(newRange);
  };

  const handleBookingConfirmation = async () => {
    if (!dateRange[0] || !dateRange[1] || !pickupTime || !returnTime) {
      setError('Selecciona uno o varios días y ambas horas para confirmar la reserva');
      return;
    }

    if (dayjs(dateRange[1]).isBefore(dayjs(dateRange[0]))) {
      setError('La fecha de devolución no puede ser anterior a la fecha de recogida.');
      return;
    }

    const description = 'Reserva de prueba';
    const state = 'pending';
    const itemIds = filteredObjects.map((object) => object.id.toString());
    const userId = user.id;
    const checkOut = dayjs(
      `${dayjs(dateRange[0]).format('YYYY-MM-DD')} ${pickupTime}`,
      'YYYY-MM-DD HH:mm'
    ).toISOString();
    const checkIn = dayjs(
      `${dayjs(dateRange[1]).format('YYYY-MM-DD')} ${returnTime}`,
      'YYYY-MM-DD HH:mm'
    ).toISOString();

    const bookingData = {
      description,
      checkIn,
      checkOut,
      state,
      itemIds,
      userId,
    };

    try {
      const response = await instance.post(`${baseUrl}/bookings`, bookingData);

      setConfirmedBooking({
        box,
        items: filteredObjects,
        pickupDate: dayjs(
          `${dayjs(dateRange[0]).format('YYYY-MM-DD')} ${pickupTime}`,
          'YYYY-MM-DD HH:mm'
        ).toDate(),
        returnDate: dayjs(
          `${dayjs(dateRange[1]).format('YYYY-MM-DD')} ${returnTime}`,
          'YYYY-MM-DD HH:mm'
        ).toDate(),
        ...response.data,
      });

      if (onBookingCreated) {
        onBookingCreated();
      }
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      setError('Hubo un error al crear la reserva. Inténtalo de nuevo.');
    }
  };

  if (!Array.isArray(items)) {
    console.error('Expected items to be an array, but got:', items);
    return <div>Items data is invalid.</div>; // Or handle the error appropriately
  }

  useEffect(() => {
    instance
      .get(`${baseUrl}/items`)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          const filtered = response.data.data
            .filter((object: Item) => {
              // Check if the object's boxId matches the box.id from props
              return object.boxId === box.id;
            })
            .filter((object: Item) => {
              const str = object.id ? object.id.toString() : ''; // Ensure boxId is converted safely

              return items.includes(str.trim()); // Trim any extra spaces
            });

          setFilteredObjects(filtered);
        } else {
          console.error('Data is not an array', response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
        setError('Failed to fetch items.');
      });
  }, [box]);

  useEffect(() => {
    if (filteredObjects.length > 0) {
      const itemIds = filteredObjects.map((item) => item.id.toString());

      fetchBookingDatesByItemIds(itemIds)
        .then((response) => {
          if (Array.isArray(response)) {
            const unavailableDates = response.map((booking) => ({
              checkIn: new Date(booking.checkIn),
              checkOut: new Date(booking.checkOut),
            }));

            setUnavailableDates(unavailableDates);
          } else {
            console.error('Unexpected response:', response);
          }
        })
        .catch((error) => {
          console.error('Error fetching unavailable dates:', error);
        });
    }
  }, [filteredObjects]);

  useEffect(() => { }, [dateRange]);

  if (confirmedBooking) {
    return (
      <Box
        style={{
          backgroundColor:
            theme === 'dark'
              ? 'var(--mantine-color-myPurple-4)'
              : 'var(--mantine-color-myPurple-8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '34vw',
          borderRadius: 20,
          padding: '2rem',
          color: 'var(--mantine-color-myPurple-0)',
        }}
        bd={theme === 'dark' ? null : '1px solid myPurple.0'}
      >
        <Title order={3}>Reserva Confirmada</Title>
        <Text>Casilla {confirmedBooking.box.id}</Text>
        <Text>
          Fecha de recogida: {dayjs(confirmedBooking.pickupDate).format('DD-MM-YYYY HH:mm')}
        </Text>
        <Text>
          Fecha de devolución: {dayjs(confirmedBooking.returnDate).format('DD-MM-YYYY  HH:mm')}
        </Text>
        <br />
        <Text>Items Reservados:</Text>
        <ul>
          {confirmedBooking.items.map((item: Item) => (
            <li key={item.id}>{item.description}</li>
          ))}
        </ul>
        <Button onClick={onReturnToBox} bg="myPurple.4" mt="lg">
          Entendido!
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box
        style={{
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
        bg={theme === 'dark' ? 'myPurple.4' : 'myPurple.8'}
        bd={theme === 'dark' ? null : '1px solid myPurple.0'}
        p="3%"
        mb="lg"
        h="86vh"
        w="34.5vw"
      >
        <Flex direction="column" justify="center" align="center" p="5%" h="100%" w="100%">
          <ScrollArea h="80%" w="100%">
            <Flex direction="column" justify="center" align="center" h="100%" w="100%" gap="10">
              <DatesProvider settings={{ locale: 'es', consistentWeeks: true }}>
                <Box
                  style={{
                    backgroundColor: '#ffff',
                    borderRadius: '14px',
                  }}
                  p="2vw"
                  h="100%"
                  w="24vw"
                  bd={theme === 'dark' ? null : '1px solid myPurple.0'}
                >
                  <DatePicker
                    type="range"
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    size="md"
                    p="1px"
                    allowSingleDateInRange
                    minDate={currentDate.toDate()}
                    excludeDate={(date) => {
                      const now = dayjs(); // Current date and time

                      return unavailableDates.some((unavailable) => {
                        const checkInDate = dayjs(unavailable.checkIn);
                        const checkOutDate = dayjs(unavailable.checkOut);

                        // Excludes dates if checkIn after current date
                        if (checkInDate.isAfter(now)) {
                          return dayjs(date).isBetween(
                            checkInDate.startOf('day'), // Start of unavailable dates range
                            checkOutDate.endOf('day'), // End of unavailable dates range
                            null,
                            '[]' // Includes range limits
                          );
                        }

                        return false;
                      });
                    }}
                    styles={{
                      month: {
                        minWidth: '20vw',
                      },
                      calendarHeader: {
                        margin: '0 auto',
                      },
                    }}
                    getDayProps={(date) => {
                      const isUnavailable = unavailableDates.some((unavailable) => {
                        const checkInDate = dayjs(unavailable.checkIn);
                        const checkOutDate = dayjs(unavailable.checkOut);

                        return dayjs(date).isBetween(checkInDate, checkOutDate, 'day', '[]');
                      });

                      const isSelected = dateRange?.some((d) => d && dayjs(d).isSame(date, 'day'));

                      const isInRange = dateRange[0] && dateRange[1] && dayjs(date).isBetween(
                        dayjs(dateRange[0]).startOf('day'),
                        dayjs(dateRange[1]).endOf('day'),
                        'day',
                        '[]'
                      );

                      const isFirstUnavailableDay = unavailableDates.some((unavailable) => {
                        const checkOutDate = dayjs(unavailable.checkOut);
                        return dayjs(date).isSame(checkOutDate, 'day');
                      });

                      let dayStyles: React.CSSProperties = {};

                      if (isUnavailable) {
                        dayStyles = {
                          backgroundColor: '#a83435',
                          opacity: 1,
                          color: 'white',
                        };
                      }



                      if (isInRange) {
                        dayStyles = {
                          backgroundColor: '#E7AF2E',
                          color: 'white',
                        };
                      }

                      if (isFirstUnavailableDay) {
                        dayStyles = {
                          ...dayStyles,
                          backgroundColor: '#d16465',

                          color: 'white',
                        };
                      }

                      if (isSelected) {
                        dayStyles = {
                          ...dayStyles,
                          backgroundColor: '#E7AF2E',
                          color: 'white',
                        };
                      }

                      return { style: dayStyles };
                    }}
                  />
                </Box>

                <Text mt="md" size="md" c="white" fw={500}>
                  {dateRange[0] && dateRange[1] ? (
                    dayjs(dateRange[0]).isSame(dateRange[1], 'day') ? (
                      `Reservar el ${dayjs(dateRange[0]).format('DD/MM/YYYY')}`
                    ) : (
                      `Reservar del ${dayjs(dateRange[0]).format('DD/MM/YYYY')} al ${dayjs(dateRange[1]).format('DD/MM/YYYY')}`
                    )
                  ) : (
                    'Selecciona un rango de fechas para reservar.'
                  )}
                </Text>

                <Flex justify="center" align="center" gap="md" mt="md" c="myPurple.0">
                  <TimeInput
                    label="Hora de recogida"
                    value={pickupTime ?? ''}
                    onChange={handlePickupTimeChange}
                    styles={{ input: { border: '1px solid var(--mantine-color-myPurple-0' } }}
                  />

                  <TimeInput
                    label="Hora de devolución"
                    value={returnTime ?? ''}
                    onChange={handleReturnTimeChange}
                    styles={{ input: { border: '1px solid var(--mantine-color-myPurple-0' } }}
                    maxTime={dateRange[1] ? calculateReturnTimeLimit(dateRange[1]) ?? undefined : undefined}
                  />
                </Flex>
              </DatesProvider>
            </Flex>

            <Flex
              direction="column"
              gap="sm"
              py="xl"
              mb="md"
              align="center"
              justify="center"
              c="myPurple.0"
            >
              <Stack mt="md">
                {filteredObjects.length > 0 ? (
                  <div>
                    <h3>Lo que quieres reservar:</h3>
                    <ul>
                      {filteredObjects.map((object) => (
                        <li key={object.id}>{object.description}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No objects selected.</p>
                )}
              </Stack>
            </Flex>
          </ScrollArea>

          {error && (
            <Flex justify="center" mt="sm">
              <Text
                size="md"
                fw={700}
                c="#FF6961"
                ta="center"
                style={{
                  backgroundColor: '#393A58',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #FF6961',
                }}
              >
                {error}
              </Text>
            </Flex>
          )}


          <Flex mx="auto" gap="2vw" maw="90%">
            <Button
              onClick={onReturnToBox}
              size="md"
              maw="8vw"
              bg="myPurple.6"
              radius="xl"
              mx="auto"
              mt="1vh"
            >
              Cancelar
            </Button>
            <Button
              size="md"
              maw="8vw"
              bg="myPurple.6"
              radius="xl"
              mx="auto"
              mt="1vh"
              onClick={handleBookingConfirmation}
            // disabled={!pickupTime || !returnTime}
            >
              Confirmar
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default BookingForm;
