import { useEffect, useState } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
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
import { fetchItems } from '@/services/fetch';
import { Item, ObjectsProps } from '@/types/types';

import './Objects.module.css';

import { useTheme } from '@/hooks/ThemeProvider';
import { ObjectsContext } from './context';

const Objects: React.FC<ObjectsProps> = ({ box, onReturn, onCreateBooking }) => {
  const [objects, setObjects] = useState<Item[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string[]>([]);
  const { theme } = useTheme();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const loadObjects = async () => {
      const data = await fetchItems();
      setObjects(data?.filter((o: any) => o.boxId === box.id));
    };
    loadObjects();
  }, []);

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
        <Text c="red">{error}</Text>
      </Center>
    );
  }

  return (
    <ObjectsContext.Provider value={objects}>
      <>
        <Modal opened={opened} onClose={close} title="Authentication" centered size="55rem">
          <Image
            src="/assets/gomadridpride_locker-in-the-city-1.jpg"
            fallbackSrc="/assets/fallback.png"
            onClick={open}
          />
        </Modal>
        <Box
          style={{
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
          bg={theme === 'dark' ? 'myPurple.4' : 'transparent'}
          bd={theme === 'dark' ? null : '1px solid myPurple.0'}
          p="3%"
          mb="lg"
          h="86vh"
          w="34.5vw"
        >
          <Stack mb="2vh" gap="xl">
            <Flex gap="29%">
              <a>
                <IconArrowLeft size="30px" onClick={onReturn} />
              </a>

              <Title fw="600" c="myPurple.0">
                Casilla C0{box.id}
              </Title>
            </Flex>
          </Stack>
          <Flex
            direction="column"
            style={{
              border: '1px solid var(--mantine-color-myPurple-0)',
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
            }}
            bg="myPurple.8"
            pb="xl"
          >
            <Image
              src="/assets/gomadridpride_locker-in-the-city-1.jpg"
              fallbackSrc="/assets/fallback.png"
              mah="20vh"
              onClick={open}
            />
            <Divider color="myPurple.0" />
            <ScrollArea h="36vh" scrollbarSize={16} mb="xl">
              <Flex direction="column" gap="sm" py="xl" mb="md">
                <Checkbox.Group value={value} onChange={setValue}>
                  <Stack mt="md">
                    {objects?.length > 0 ? (
                      objects?.map((object) => (
                        <>
                          <Flex
                            key={object.id}
                            style={{
                              cursor: 'pointer',
                            }}
                          >
                            <Checkbox
                              styles={{
                                label: {
                                  color: 'myPurple.0',
                                },
                              }}
                              color="myPurple.4"
                              c="myPurple.0"
                              ml="1vw"
                              value={`${object.id}`}
                              label={object.description}
                            />
                          </Flex>
                          <Divider color="myPurple.0" />
                        </>
                      ))
                    ) : (
                      <Center>
                        <Text c="myPurple.0">No hay ningun objeto disponible en esta casilla.</Text>
                      </Center>
                    )}
                  </Stack>
                </Checkbox.Group>
              </Flex>
            </ScrollArea>
            <Flex mx="auto" gap="2vw" maw="90%">
              <Button
                onClick={() => {
                  onCreateBooking(box, value);
                }}
                disabled={value.length === 0}
                size="md"
                maw="8vw"
                bg="myPurple.4"
                radius="xl"
                mx="auto"
                mt="1vh"
              >
                Hacer reserva
              </Button>
            </Flex>
          </Flex>
        </Box>
      </>
    </ObjectsContext.Provider>
  );
};

export default Objects;
