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
import { DateTimePicker, DatesProvider, Calendar } from '@mantine/dates';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import dayjs from 'dayjs';
import instance, { baseUrl } from '@/services/api';
import { BookingFormProps, BoxType, Item } from '@/types/types';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useAuth } from '@/hooks/AuthProvider';

dayjs.extend(customParseFormat);

import './BookingForm.module.css';

const BookingForm: React.FC<BookingFormProps> = ({ box, items, onReturnToBox, onReturn, onBookingCreated }) => {
  const [error, setError] = useState<string | null>(null);
  const [filteredObjects, setFilteredObjects] = useState<Item[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const theme = useMantineTheme();
  const { user } = useAuth();



  const handlePickupDate = (date: Date | null) => {
    setPickupDate(date);
  };

  const handleReturnDate = (date: Date | null) => {
    setReturnDate(date);
  };

  const handleBookingConfirmation = async () => {

    if (!pickupDate || !returnDate) {
      setError('Por favor, selecciona ambas fechas: la de recogida y la de devolución.');
      return;
    }

    if (dayjs(returnDate).isBefore(dayjs(pickupDate))) {
      setError('La fecha de devolución no puede ser anterior a la fecha de recogida.');
      return;
    }

    const description = "Reserva de prueba";
    const state = "pending";
    const itemIds = filteredObjects.map((object) => object.id.toString());
    const userId = user.id;

    const bookingData = {
      description,
      checkIn: returnDate ? dayjs(returnDate).toISOString() : null,
      checkOut: pickupDate ? dayjs(pickupDate).toISOString() : null,
      state,
      itemIds,
      userId,
    };

    console.log('Sent data', bookingData);

    try {
      const response = await instance.post(`${baseUrl}/bookings`, bookingData);
      console.log('Booking created:', response.data);

      setConfirmedBooking({
        box,
        items: filteredObjects,
        pickupDate,
        returnDate,
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
              console.log('Checking object with boxId:', str); // Debugging the boxId value
              console.log('Items array:', items); // Debugging the items array
              console.log('Is in items:', items.includes(str)); // Check if str is in items
              return items.includes(str.trim()); // Trim any extra spaces
            });

          console.log('Filtered objects:', filtered); // Check the result
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
        p="3%"
        mb="lg"
        h="86vh"
        w="34.5vw"
      >
        <Flex direction="column" justify="center" align="center" p="5%" h="100%" w="100%">
          <ScrollArea h="80%" w="100%">
            <Flex direction="column" justify="center" align="center" h="100%" w="100%" gap="10">
              <DatesProvider settings={{ consistentWeeks: true }}>
                <DateTimePicker w="70%" c="white"
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
              <DateTimePicker w="70%" c="white"
                valueFormat="DD MMM YYYY hh:mm A"
                label="Selecciona una fecha de devolución"
                placeholder="Selecciona una fecha de devolución"
                value={returnDate}
                onChange={handleReturnDate}
              />
            </Flex>

            <Flex direction="column" gap="sm" py="xl" mb="md" align="center" justify="center" c="white">
              <Stack mt="md">
                {filteredObjects.length > 0 ? (
                  <div>
                    <h3>Lo que vas a reservar:</h3>
                    <ul>
                      {filteredObjects.map((object) => (
                        <li key={object.id}>
                          {object.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No objects selected.</p>
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
            <Button size="md" maw="8vw" bg="myPurple.6"     radius="xl" mx="auto" mt="1vh"
              onClick={handleBookingConfirmation}
              disabled={!pickupDate || !returnDate}
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
