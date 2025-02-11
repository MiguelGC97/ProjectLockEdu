import { useEffect, useState } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
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
import { DatesProvider, DateTimePicker } from '@mantine/dates';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useAppContext, useThemeContext } from '@/hooks/AppProvider';
import { useAuth } from '@/hooks/AuthProvider';
import instance, { baseUrl } from '@/services/api';
import { createBooking } from '@/services/fetch';
import { BookingFormProps, BoxType, Item } from '@/types/types';

import './BookingForm.module.css';

dayjs.extend(customParseFormat);

const BookingForm: React.FC<BookingFormProps> = ({
  box,
  onReturnToBox,
  onReturn,
  onBookingCreated,
}) => {
  const [error, setError] = useState<string | null>(null);
  const { selectedObjects, setSelectedObjects } = useAppContext();
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const theme = useMantineTheme();
  const { user } = useAuth();
  const { currentTheme } = useThemeContext();

  // Handle Date Change for Pickup and Return
  const handlePickupDate = (date: Date | null) => {
    setPickupDate(date);
    setError(null); // Clear error when user interacts
  };

  const handleReturnDate = (date: Date | null) => {
    setReturnDate(date);
    setError(null); // Clear error when user interacts
  };

  // Confirm Booking
  const handleBookingConfirmation = async () => {
    if (!pickupDate || !returnDate) {
      setError('Por favor, selecciona ambas fechas: la de recogida y la de devolución.');
      return;
    }

    if (dayjs(returnDate).isBefore(dayjs(pickupDate))) {
      setError('La fecha de devolución no puede ser anterior a la fecha de recogida.');
      return;
    }
    console.log(selectedObjects);

    const description = 'Reserva de prueba';
    const state = 'pending';
    const itemIds = selectedObjects.map((item) => item.id);

    // Ensure there are selected items
    if (itemIds.length === 0) {
      setError('Por favor, selecciona al menos un objeto para reservar.');
      return;
    }

    const bookingData = {
      description,
      checkIn: returnDate ? dayjs(returnDate).toISOString() : null,
      checkOut: pickupDate ? dayjs(pickupDate).toISOString() : null,
      state,
      itemIds,
      userId: user.id,
    };

    console.log('Sent data', bookingData);

    try {
      await createBooking(bookingData);
      setConfirmedBooking({
        box,
        items: selectedObjects,
        pickupDate,
        returnDate,
      });
      if (onBookingCreated) {
        onBookingCreated();
      }
      // Clear form after successful submission
      setPickupDate(null);
      setReturnDate(null);
      setSelectedObjects([]);
    } catch (error) {
      setError('Hubo un error al crear la reserva. Inténtalo de nuevo.');
    }
  };

  // Validate selectedObjects
  if (!Array.isArray(selectedObjects)) {
    console.error('Expected items to be an array, but got:', selectedObjects);
    return <div>Items data is invalid.</div>;
  }

  const renderError = error && <Text color="red">{error}</Text>;

  if (confirmedBooking) {
    return (
      <Box
        style={{
          backgroundColor: theme.colors.myPurple[4],
          borderRadius: 20,
          padding: '2rem',
          color: 'white',
        }}
      >
        <Title order={3}>Reserva Confirmada</Title>
        <Text>Locker: {confirmedBooking.box.name}</Text>
        <Text>Pickup Date: {dayjs(confirmedBooking.pickupDate).format('YYYY-MM-DD HH:mm')}</Text>
        <Text>Return Date: {dayjs(confirmedBooking.returnDate).format('YYYY-MM-DD HH:mm')}</Text>
        <Text>Items Reservados:</Text>
        <ul>
          {confirmedBooking.items.map((item: Item) => (
            <li key={item.id}>{item.description}</li>
          ))}
        </ul>
        <Button onClick={onReturnToBox} mt="lg">
          Volver
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box
        style={{
          backgroundColor: theme.colors.myPurple[4],
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
        bg={currentTheme === 'light' ? '#E0E1FA' : '#5F60BD'}
        bd={currentTheme === 'light' ? '1px solid #5F60BD' : null}
        p="3%"
        mb="lg"
        h="86vh"
        w="34.5vw"
      >
        <Flex direction="column" justify="center" align="center" p="5%" h="100%" w="100%">
          <ScrollArea h="80%" w="100%">
            <Flex direction="column" justify="center" align="center" h="100%" w="100%" gap="10">
              <DatesProvider settings={{ consistentWeeks: true }}>
                <DateTimePicker
                  w="70%"
                  color={currentTheme === 'light' ? '#06060E' : '#ffff'}
                  style={{ color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}` }}
                  valueFormat="DD MMM YYYY hh:mm A"
                  label="Selecciona una fecha de recogida"
                  placeholder="Selecciona una fecha de recogida"
                  size="sm"
                  value={pickupDate}
                  onChange={handlePickupDate}
                  classNames={{
                    input: 'custom-input',
                  }}
                />
              </DatesProvider>
              <DateTimePicker
                w="70%"
                color={currentTheme === 'light' ? '#06060E' : '#ffff'}
                style={{ color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}` }}
                valueFormat="DD MMM YYYY hh:mm A"
                label="Selecciona una fecha de devolución"
                placeholder="Selecciona una fecha de devolución"
                value={returnDate}
                onChange={handleReturnDate}
              />
            </Flex>

            <Flex
              direction="column"
              gap="sm"
              py="xl"
              mb="md"
              align="center"
              justify="center"
              c="white"
            >
              <Stack mt="md">
                {selectedObjects.length > 0 ? (
                  <div>
                    <h3 style={{ color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}` }}>
                      Lo que vas a reservar:
                    </h3>
                    <ul>
                      {selectedObjects.map((object) => (
                        <li
                          style={{ color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}` }}
                          key={object.id}
                        >
                          {object.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p style={{ color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}` }}>
                    No objects selected.
                  </p>
                )}
              </Stack>
            </Flex>
          </ScrollArea>

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
              disabled={!pickupDate || !returnDate || selectedObjects.length === 0}
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
