﻿import { useEffect, useState } from 'react';
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
import { useDisclosure } from '@mantine/hooks';
import instance, { baseUrl } from '@/services/api';
import { BookingFormProps, BoxType, Item } from '@/types/types';

import './BookingForm.module.css';

const BookingForm: React.FC<BookingFormProps> = (box, items) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredObjects, setFilteredObjects] = useState<Item[]>([]);
  const theme = useMantineTheme();

  if (!Array.isArray(items)) {
    console.error('Expected items to be an array, but got:', items);
    return <div>Items data is invalid.</div>; // Or handle the error appropriately
  }
  useEffect(() => {
    instance
      .get(`${baseUrl}/items`)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          const all = response.data.data;
          const filtered = all.filter((object: Item) => {
            const str = object.boxId.toString();
            const inc = items.includes(str);
            return inc;
          });
          setFilteredObjects(filtered);
        } else {
          console.error('Data is not an array', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
      });
  }, [box]);

  if (loading) {
    return (
      <Center>
        <LoadingOverlay />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Text color="red">{error}</Text>
      </Center>
    );
  }

  return (
    <>
      {/* <Modal opened={opened} onClose={close} title="Authentication" centered size="55rem">
        <Text>¿Estás seguro de que quieres hacer esta reserva?</Text>
      </Modal> */}
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
        <Stack mb="2vh" gap="xl">
          <Flex gap="29%">
            <a>
              <IconArrowLeft color="white" size="30px" />
            </a>

            <Title fw="600" c="white">
              {' '}
            </Title>
          </Flex>
        </Stack>
        <Flex
          direction="column"
          style={{
            border: '1px solid #DBDCEC',
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            backgroundColor: theme.colors.myPurple[6],
          }}
          pb="xl"
        >
          <ScrollArea h="36vh" scrollbarSize={16} mb="xl">
            <Flex direction="column" gap="sm" py="xl" mb="md">
              <Stack mt="md">
                {filteredObjects.length > 0 ? (
                  <div>
                    <h3>You have selected the following objects:</h3>
                    <ul>
                      {filteredObjects.map((object) => (
                        <li key={object.id}>
                          {/* Space to display the object description */}
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
              onClick={() => {
                null;
              }}
              size="md"
              maw="8vw"
              bg="myPurple.4"
              radius="xl"
              mx="auto"
              mt="1vh"
            >
              Cancelar
            </Button>
            <Button size="md" maw="8vw" bg="myPurple.4" radius="xl" mx="auto" mt="1vh">
              Confirmar reserva
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default BookingForm;
