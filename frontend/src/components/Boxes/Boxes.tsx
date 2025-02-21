import { useEffect, useState } from 'react';
import { IconArrowLeft, IconCirclePlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Input,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/hooks/AuthProvider';
import { useTheme } from '@/hooks/ThemeProvider';
import { fetchBoxes } from '@/services/fetch';
import { BoxesProps, BoxType } from '@/types/types';

import './Boxes.module.css';

import { MdOutlineEdit } from 'react-icons/md';

const Boxes: React.FC<BoxesProps> = ({ locker, onBoxClick, onReturn }) => {
  const location = useLocation();
  const { boxId, selectedValues } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<BoxType[]>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [openedCreate, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadBoxes = async () => {
      const data = await fetchBoxes();
      setBoxes(data?.filter((b) => b.lockerId === locker.id));
    };

    loadBoxes();
    setLoading(false);
  }, [locker]);

  if (loading) {
    return (
      <Center>
        <Text>Loading boxes...</Text>
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
      <Modal opened={openedCreate} onClose={closeCreate} title="Crear casilla">
        Olá, aqui você criará uma casilla
      </Modal>
      <Modal opened={openedEdit} onClose={closeEdit} title="Editar casilla">
        Olá, aqui você editará uma casilla
      </Modal>
      <Modal opened={openedDelete} onClose={closeDelete} title="Borrar casilla">
        Olá, aqui você confirmará que quer deletar uma casilla
      </Modal>
      <Box
        style={{
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
        bg={theme === 'dark' ? 'myPurple.4' : 'transparent'}
        bd={theme === 'dark' ? null : '1px solid myPurple.0'}
        px="1vw"
        mb="lg"
        h="86vh"
        w="34.5vw"
      >
        <Stack my="4vh" gap="xl">
          <Flex gap="18%">
            <a>
              <IconArrowLeft
                aria-label="volver a armarios"
                color="var(--mantine-color-myPurple-0)"
                size="30px"
                onClick={onReturn}
              />
            </a>

            <Title fw="600" c="myPurple.0">
              Casillas - Armario {locker?.number}
            </Title>
          </Flex>

          <Center>
            {user?.role === 'TEACHER' ? (
              <Input
                aria-label="buscar objeto"
                w="20vw"
                size="lg"
                placeholder="Busca un objeto"
                bd={theme === 'dark' ? null : '1px solid myPurple.0'}
                style={{ borderRadius: '5px' }}
                rightSection={<IconSearch />}
              />
            ) : null}
          </Center>
        </Stack>
        <ScrollArea p="lg" m="md" h="62vh" scrollbarSize={16}>
          <Flex direction="column" gap="sm">
            {boxes?.map((box) => (
              <Box
                aria-label={`casilla ${box.description}`}
                key={box.id}
                style={{
                  cursor: 'pointer',
                  borderRadius: 20,
                }}
                p="lg"
                bg={theme === 'dark' ? 'myPurple.8' : 'myPurple.8'}
                bd={theme === 'dark' ? 'none' : '1px solid myPurple.0'}
                onClick={() => (user?.role === 'TEACHER' ? onBoxClick(box) : null)}
              >
                <Flex w="100%" align="center" justify="space-between">
                  <Stack>
                    <Title aria-label="número de la casilla" size="xl" c="myPurple.0">
                      Casilla C{box.id}
                    </Title>
                    <Text aria-label="descripción de la casilla" size="md" c="myPurple.0">
                      {box.description}
                    </Text>
                  </Stack>
                  <svg
                    width="80px"
                    height="80px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {' '}
                      <path
                        d="M8.75 7.75H15.25M8.75 10.75H15.25M15 14V16M6 20V21M18 20V21M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
                        stroke={theme === 'dark' ? '#f8f7fc' : 'myPurple.0'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{' '}
                    </g>
                  </svg>
                </Flex>
                <Flex
                  w="100%"
                  pt={user?.role === 'ADMIN' ? '10px' : null}
                  justify={user?.role === 'TEACHER' ? 'center' : 'space-between'}
                >
                  {user?.role === 'ADMIN' ? (
                    <Tooltip label="Editar armario">
                      <Button onClick={openEdit} c="myPurple.0" variant="transparent">
                        <MdOutlineEdit size={24} />
                      </Button>
                    </Tooltip>
                  ) : null}
                  {user?.role === 'ADMIN' ? (
                    <Button
                      aria-label={`ver casillas del armario número ${locker.number}`}
                      onClick={() => onBoxClick(box)}
                      size="md"
                      maw="8vw"
                      bg="myPurple.4"
                      radius="xl"
                    >
                      Ver Objetos
                    </Button>
                  ) : null}
                  {user?.role === 'ADMIN' ? (
                    <Tooltip label="Borrar armario">
                      <Button onClick={openDelete} c="myPurple.11" variant="transparent">
                        <IconTrash size={24} />
                      </Button>
                    </Tooltip>
                  ) : null}
                </Flex>
              </Box>
            ))}
          </Flex>
        </ScrollArea>
        {user?.role === 'ADMIN' ? (
          <Flex h="4%" gap={10} mr="25px" justify="flex-end" align="center">
            <Text c="myPurple.0" size="xl" fw={700}>
              Añadir nueva casilla al armario {locker?.number}
            </Text>

            <IconCirclePlus
              cursor="pointer"
              onClick={openCreate}
              color="var(--mantine-color-myPurple-0)"
              size={36}
              style={{
                transition: 'transform 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </Flex>
        ) : null}
      </Box>
    </>
  );
};

export default Boxes;
