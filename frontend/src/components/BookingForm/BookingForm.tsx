import { useEffect, useState } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
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
import { useObjectsContext } from '@/components/Objects/context';
import instance, { baseUrl } from '@/services/api';
import { BookingFormProps, BoxType, Item } from '@/types/types';

import './BookingForm.module.css';

const BookingForm: React.FC<BookingFormProps> = ({ items }) => {
  const allObjects: Item[] = useObjectsContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<number[]>([]);
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);

  const selectedItems: Item[] = allObjects.filter(
    (object: Item) => items.some((item: Item) => item.id === object.id) // Check if the item's id matches the selected id
  );

  useEffect(() => {}, []);

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
    <ObjectsProvider>
      <Modal opened={opened} onClose={close} title="Authentication" centered size="55rem">
        <Text>¿Estás seguro de que quieres hacer esta reserva?</Text>
      </Modal>
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
              <IconArrowLeft color="white" size="30px" onClick={onReturn} />
            </a>

            <Title fw="600" c="white">
              Casilla C0{box.id}
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
                {selectedItems.length > 0 ? (
                  <div>
                    <h3>You have selected the following objects:</h3>
                    <ul>
                      {selectedItems.map((object) => (
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
            <Button
              onClick={handleSubmit}
              disabled={value.length > 0 ? null : 'true'}
              size="md"
              maw="8vw"
              bg="myPurple.4"
              radius="xl"
              mx="auto"
              mt="1vh"
            >
              Confirmar reserva
            </Button>
          </Flex>
        </Flex>
      </Box>
    <ObjectsProvider/>
  );
};

export default BookingForm;
