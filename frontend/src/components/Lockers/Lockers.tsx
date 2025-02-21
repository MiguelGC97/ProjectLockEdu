import { IconCirclePlus, IconSearch, IconTrash } from '@tabler/icons-react';
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';

import './Lockers.module.css';

import { useEffect, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/hooks/AuthProvider';
import { useTheme } from '@/hooks/ThemeProvider';
import { fetchLockers } from '@/services/fetch';
import { Locker, LockersProps } from '@/types/types';
import { LockersContext } from './context';

const Lockers: React.FC<LockersProps> = ({ onLockerClick }) => {
  const [lockers, setLockers] = useState<Locker[] | undefined>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [openedCreate, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  useEffect(() => {
    const loadLockers = async () => {
      try {
        const data = await fetchLockers();
        setLockers(data || []);
      } catch (error) {
        console.error('Error fetching lockers:', error);
      }
    };
    loadLockers();
  }, []);
  return (
    <LockersContext.Provider value={lockers}>
      <Modal opened={openedCreate} onClose={closeCreate} title="Crear armario">
        Olá, aqui você criará um locker
      </Modal>
      <Modal opened={openedEdit} onClose={closeEdit} title="Editar armario">
        Olá, aqui você editará um locker
      </Modal>
      <Modal opened={openedDelete} onClose={closeDelete} title="Deletar armario">
        Olá, aqui você confirmará que quer deletar um locker
      </Modal>
      <Box
        bg={theme === 'dark' ? 'myPurple.4' : 'transparent'}
        bd={theme === 'dark' ? null : '1px solid myPurple.0'}
        px="1vw"
        mb="lg"
        h="86vh"
        w="34vw"
        style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
      >
        <Stack my="4vh" gap="xl">
          <Center>
            <Title aria-label="titulo de la sesión" fw="600" c="myPurple.0">
              Armarios
            </Title>
          </Center>
          {/* Search input for lockers */}
          <Center>
            {user?.role === 'TEACHER' ? (
              <Input
                aria-label="buscar objeto"
                bd={theme === 'dark' ? null : '1px solid myPurple.0'}
                style={{ borderRadius: '5px' }}
                w="20vw"
                size="lg"
                placeholder="Busca un objeto"
                rightSection={<IconSearch />}
              />
            ) : null}
          </Center>
        </Stack>
        <ScrollArea p="lg" m="md" h={user?.role === 'TEACHER' ? '62vh' : '61vh'} scrollbarSize={16}>
          <Flex direction="column" gap="sm">
            {lockers?.map((locker) => {
              return (
                <Box
                  aria-label={`armario número ${locker.number}`}
                  h="auto"
                  bg={theme === 'dark' ? 'myPurple.8' : 'myPurple.8'}
                  bd={theme === 'dark' ? null : '1px solid myPurple.0'}
                  style={{ borderRadius: 20 }}
                  p="sm"
                >
                  <Flex direction="column" gap="lg" p="sm">
                    <Flex gap="10vw" justify="center" align="center">
                      <Flex direction="column" gap="1vh" justify="center">
                        <Title
                          aria-label={`armario número ${locker.number}`}
                          size="xl"
                          c="myPurple.0"
                        >
                          Armario 0{locker.number}
                        </Title>
                        <Flex gap="md" justify="flex-start">
                          <Flex gap={5}>
                            <Text c="myPurple.0" fw={700}>
                              Ubicación:
                            </Text>{' '}
                            <Text
                              aria-label={`ubicación del armario número ${locker.number}`}
                              c="myPurple.0"
                            >
                              {locker.location}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                      <svg
                        fill={theme === 'dark' ? '#f8f7fc' : 'myPurple.0'}
                        height="60px"
                        width="60px"
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 512 512"
                        xml:space="preserve"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {' '}
                          <g>
                            {' '}
                            <g>
                              {' '}
                              <g>
                                {' '}
                                <path d="M448,0H64C52.218,0,42.667,9.551,42.667,21.333V448v42.667C42.667,502.449,52.218,512,64,512 c11.782,0,21.333-9.551,21.333-21.333v-21.333h149.333v21.333c0,11.782,9.551,21.333,21.333,21.333 c11.782,0,21.333-9.551,21.333-21.333v-21.333h149.333v21.333c0,11.782,9.551,21.333,21.333,21.333s21.333-9.551,21.333-21.333 V448V21.333C469.333,9.551,459.782,0,448,0z M426.667,426.667H277.333v-384h149.333V426.667z M85.333,42.667h149.333v384H85.333 V42.667z"></path>{' '}
                                <path d="M149.333,128h21.333c11.782,0,21.333-9.551,21.333-21.333c0-11.782-9.551-21.333-21.333-21.333h-21.333 c-11.782,0-21.333,9.551-21.333,21.333C128,118.449,137.551,128,149.333,128z"></path>{' '}
                                <path d="M170.667,149.333h-21.333c-11.782,0-21.333,9.551-21.333,21.333c0,11.782,9.551,21.333,21.333,21.333h21.333 c11.782,0,21.333-9.551,21.333-21.333C192,158.885,182.449,149.333,170.667,149.333z"></path>{' '}
                                <path d="M341.333,128h21.333c11.782,0,21.333-9.551,21.333-21.333c0-11.782-9.551-21.333-21.333-21.333h-21.333 c-11.782,0-21.333,9.551-21.333,21.333C320,118.449,329.551,128,341.333,128z"></path>{' '}
                                <path d="M362.667,149.333h-21.333c-11.782,0-21.333,9.551-21.333,21.333c0,11.782,9.551,21.333,21.333,21.333h21.333 c11.782,0,21.333-9.551,21.333-21.333C384,158.885,374.449,149.333,362.667,149.333z"></path>{' '}
                              </g>{' '}
                            </g>{' '}
                          </g>{' '}
                        </g>
                      </svg>
                    </Flex>
                    <Flex w="100%" justify="space-between">
                      {user?.role === 'ADMIN' ? (
                        <Tooltip label="Editar armario">
                          <Button onClick={openEdit} c="myPurple.0" variant="transparent">
                            <MdOutlineEdit size={24} />
                          </Button>
                        </Tooltip>
                      ) : null}
                      <Button
                        aria-label={`ver casillas del armario número ${locker.number}`}
                        onClick={() => {
                          onLockerClick(locker);
                        }}
                        size="md"
                        maw="8vw"
                        bg="myPurple.4"
                        radius="xl"
                      >
                        Ver casillas
                      </Button>
                      {user?.role === 'ADMIN' ? (
                        <Tooltip label="Borrar armario">
                          <Button onClick={openDelete} c="myPurple.11" variant="transparent">
                            <IconTrash size={24} />
                          </Button>
                        </Tooltip>
                      ) : null}
                    </Flex>
                  </Flex>
                </Box>
              );
            })}
          </Flex>
        </ScrollArea>
        {user?.role === 'ADMIN' ? (
          <Flex h="4%" gap={10} mr="25px" justify="flex-end" align="center">
            <Text c="myPurple.0" size="xl" fw={700}>
              Añadir nuevo armario
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
    </LockersContext.Provider>
  );
};

export default Lockers;
