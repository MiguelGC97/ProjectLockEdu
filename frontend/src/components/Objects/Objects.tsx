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

import { useAppContext, useThemeContext } from '@/hooks/AppProvider';

const Objects: React.FC<ObjectsProps> = ({ onReturn, onCreateBooking }) => {
  const { objects, setObjects } = useAppContext();
  const { selectedObjects, setSelectedObjects } = useAppContext();
  const { selectedBox } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string[]>([]);
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const { currentTheme } = useThemeContext();

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
          backgroundColor: theme.colors.myPurple[4],
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
        bg={currentTheme === 'light' ? '#E0E1FA' : '#5F60BD'}
        bd={currentTheme === 'light' ? '1px solid #5F60BD' : '#ffff'}
        p="3%"
        mb="lg"
        h="86vh"
        w="34.5vw"
      >
        <Stack mb="2vh" gap="xl">
          <Flex gap="29%">
            <a>
              <IconArrowLeft
                c={currentTheme === 'light' ? '#06060E' : '#ffff'}
                size="30px"
                onClick={onReturn}
              />
            </a>

            <Title fw="600" c={currentTheme === 'light' ? '#06060E' : '#ffff'}>
              Casilla C0{selectedBox.id}
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
          bg={currentTheme === 'light' ? '#ffff' : '#393A58'}
          bd={currentTheme === 'light' ? '1px solid #4F51B3' : '1px solid #F1F2FF'}
          pb="xl"
        >
          <Image
            src="/assets/gomadridpride_locker-in-the-city-1.jpg"
            fallbackSrc="/assets/fallback.png"
            mah="20vh"
            onClick={open}
          />
          <Divider c={currentTheme === 'light' ? '#06060E' : '#ffff'} />
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
                            borderBottom: '3 solid #fff',
                          }}
                        >
                          <Checkbox
                            c={currentTheme === 'light' ? '#06060E' : '#ffff'}
                            color={currentTheme === 'light' ? '#06060E' : '#AEB0F2'}
                            ml="1vw"
                            value={`${object.id}`}
                            label={object.description}
                          />
                        </Flex>
                        <Divider c={currentTheme === 'light' ? '#06060E' : '#ffff'} />
                      </>
                    ))
                  ) : (
                    <Center>
                      <Text c={currentTheme === 'light' ? '#06060E' : '#ffff'}>
                        No hay ningun objeto disponible en esta casilla.
                      </Text>
                    </Center>
                  )}
                </Stack>
              </Checkbox.Group>
            </Flex>
          </ScrollArea>
          <Flex mx="auto" gap="2vw" maw="90%">
            <Button
              onClick={() => {
                const selectedItems = objects.filter((object) => value.includes(`${object.id}`));
                setSelectedObjects(selectedItems);
                onCreateBooking(selectedBox, selectedItems);
                console.log(selectedItems);
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
  );
};

export default Objects;
