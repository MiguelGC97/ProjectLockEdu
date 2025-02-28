import { IconCirclePlus, IconSearch, IconTrash } from '@tabler/icons-react';
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Modal,
  NumberInput,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';

import './Lockers.module.css';

import { useEffect, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import { useDisclosure } from '@mantine/hooks';
import { Locker, LockersProps } from '@/types/types';
import { useAuthStore, useLockersStore, useThemeStore } from '../store/store';
import { LockersContext } from './context';

const Lockers: React.FC = () => {
  const { themeName } = useThemeStore();
  const { user } = useAuthStore();
  const { lockers, create, deleteLocker, update, fetchAll, setSelectedLocker } = useLockersStore();
  const [openedCreate, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockerToDelete, setLockerToDelete] = useState<any | null>(null);
  const [lockerToEdit, setLockerToEdit] = useState<Locker | null>(null);

  const [newLocker, setNewLocker] = useState<any>({
    description: '',
    number: null,
    location: '',
  });

  useEffect(() => {
    const loadLockers = async () => {
      try {
        await fetchAll();
      } catch (error) {
        console.error('Error fetching lockers:', error);
      }
    };
    loadLockers();
  }, [lockers]);

  const handleChange = (field: keyof any, value: string) => {
    setNewLocker((prev) => ({ ...prev, [field]: value }));
  };

  const openDeleteModal = (locker: any) => {
    setLockerToDelete(locker);
    openDelete();
  };

  const openEditModal = (locker: Locker) => {
    setLockerToEdit(locker);
    openEdit();
  };

  const handleCreateLocker = async () => {
    try {
      await create(newLocker);
      closeCreate();
      setNewLocker({
        description: '',
        number: null,
        location: '',
      });
      setErrorMessage(null);
    } catch (error: any) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message || 'Ocurrió un error inesperado');
      } else if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Ocurrió un error inesperado');
      } else {
        setErrorMessage('Ocurrió un error inesperado');
      }
    }
  };

  const handleDeleteLocker = async (lockerId: number) => {
    try {
      await deleteLocker(lockerId);
      closeDelete();
      setErrorMessage(null);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Ocurrió un error al eliminar el armario.');
      }
    }
  };

  const handleUpdateLocker = async () => {
    try {
      setErrorMessage('');

      if (!lockerToEdit) {
        return;
      }

      const updatedLocker = {
        ...lockerToEdit,
        number: lockerToEdit.number,
        description: lockerToEdit.description,
        location: lockerToEdit.location,
      };

      await update(updatedLocker);
      closeEdit();
    } catch (error: any) {
      switch (error.response?.status) {
        case 404:
          setErrorMessage('El armario no fue encontrado.');
          break;
        case 409:
          setErrorMessage('El número del armario ya está en uso.');
          break;
        case 400:
          setErrorMessage('La solicitud contiene datos incorrectos.');
          break;
        default:
          setErrorMessage('Error en la solicitud.');
          break;
      }
    }
  };

  return (
    <LockersContext.Provider value={lockers}>
      <Modal size="lg" opened={openedCreate} onClose={closeCreate} title="Crear nuevo armario">
        <Flex direction="column" gap="md">
          {errorMessage && (
            <Text c="myPurple.11" size="sm" fw={500}>
              {errorMessage}
            </Text>
          )}

          <NumberInput
            label="Numero"
            placeholder="Ingrese el nuevo número"
            value={newLocker.number}
            onChange={(value) => handleChange('number', value)}
            min={1}
            withAsterisk
          />

          <TextInput
            label="Descripción"
            placeholder="Ingrese la descripción"
            maxLength={60}
            value={newLocker.description}
            onChange={(e) => handleChange('description', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Ubicación"
            placeholder="Ingrese la ubicación"
            value={newLocker.location}
            maxLength={10}
            onChange={(e) => handleChange('location', e.target.value)}
            withAsterisk
          />

          <Button size="md" onClick={handleCreateLocker} color="myPurple.4" fullWidth>
            Crear armario
          </Button>
        </Flex>
      </Modal>

      <Modal size="lg" opened={openedDelete} onClose={closeDelete} title="Eliminar armario">
        {lockerToDelete ? (
          <>
            <Text size="md">
              ¿Estás seguro de que deseas eliminar el armario{' '}
              <strong>0{lockerToDelete.number}</strong>? Todas sus casillas y objetos se eliminarán
              también.
            </Text>

            {errorMessage && (
              <Text color="red" size="sm" fw={500} mt="sm">
                {errorMessage}
              </Text>
            )}

            <Flex gap="md" justify="space-between" mt="md">
              <Button size="md" onClick={closeDelete} color="gray">
                Cancelar
              </Button>
              <Button
                size="md"
                onClick={() => handleDeleteLocker(lockerToDelete.id)}
                color="#C01B26"
              >
                Eliminar armario
              </Button>
            </Flex>
          </>
        ) : (
          <Text>Cargando...</Text>
        )}
      </Modal>

      <Modal opened={openedEdit} onClose={closeEdit} title="Editar armario">
        {errorMessage && (
          <Text c="myPurple.11" size="sm" fw={500}>
            {errorMessage}
          </Text>
        )}

        {lockerToEdit ? (
          <Flex direction="column" gap="md">
            {/* <NumberInput
              label="Numero"
              placeholder="Ingrese el nuevo numero"
              value={lockerToEdit?.number}
              onChange={(value) => setLockerToEdit({ ...lockerToEdit, number: value })}
              min={1}
            /> */}

            <TextInput
              label="Descripción"
              placeholder="Ingrese la nueva descripción"
              value={lockerToEdit?.description}
              maxLength={60}
              onChange={(e) => setLockerToEdit({ ...lockerToEdit, description: e.target.value })}
            />

            <TextInput
              label="Ubicación"
              placeholder="Ingrese la nueva ubicación"
              value={lockerToEdit?.location}
              maxLength={10}
              onChange={(e) => setLockerToEdit({ ...lockerToEdit, location: e.target.value })}
            />

            <Button size="md" onClick={handleUpdateLocker} color="myPurple.4" fullWidth>
              Confirmar cambios
            </Button>
          </Flex>
        ) : (
          <Text>Cargando...</Text>
        )}
      </Modal>

      <Box
        direction="column"
        bg={themeName === 'dark' ? 'var(--mantine-color-myPurple-4)' : 'transparent'}
        bd={themeName === 'dark' ? null : '1px solid var(--mantine-color-myPurple-0)'}
        px="1vw"
        mb="lg"
        h="86vh"
        w="34vw"
        style={{
          backgroundColor: themeName === 'dark' ? 'var(--mantine-color-myPurple-4)' : 'transparent',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
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
                bd={themeName === 'dark' ? null : '1px solid var(--mantine-color-myPurple-0)'}
                style={{ borderRadius: '5px' }}
                w="20vw"
                size="lg"
                placeholder="Busca un objeto"
                rightSection={<IconSearch />}
              />
            ) : null}
          </Center>
        </Stack>
        <ScrollArea p="lg" m="md" h={user?.role === 'TEACHER' ? '62vh' : '60vh'} scrollbarSize={16}>
          <Flex direction="column" gap="sm">
            {lockers?.map((locker) => {
              return (
                <Box
                  aria-label={`armario número ${locker.number}`}
                  h="auto"
                  bg={
                    themeName === 'dark'
                      ? 'var(--mantine-color-myPurple-8)'
                      : 'var(--mantine-color-myPurple-8)'
                  }
                  bd={themeName === 'dark' ? null : '1px solid var(--mantine-color-myPurple-0)'}
                  style={{ borderRadius: 20 }}
                  p="sm"
                >
                  <Flex direction="column" gap="lg" p="sm">
                    <Flex gap="10vw" justify="center" align="center">
                      <Flex direction="column" gap="1vh" justify="center" miw="45%">
                        <Title
                          aria-label={`armario número ${locker.number}`}
                          size="xl"
                          c="myPurple.0"
                          tt="uppercase"
                        >
                          Armario {locker.number}
                        </Title>
                        <Flex gap="md" justify="flex-start">
                          <Flex gap={5}>
                            <Text
                              aria-label={`descripción del armario número ${locker.number}`}
                              c="myPurple.0"
                              lineClamp={3}
                              maw={220}
                            >
                              <Text c="myPurple.0" fw={700}>
                                Descripción:
                              </Text>{' '}
                              {locker.description}
                            </Text>
                          </Flex>
                        </Flex>
                        <Flex gap="sm" justify="flex-start">
                          <Flex gap={5}>
                            <Text c="myPurple.0" fw={700}>
                              Ubicación:
                            </Text>{' '}
                            <Text
                              maw="100px"
                              aria-label={`ubicación del armario número ${locker.number}`}
                              c="myPurple.0"
                            >
                              {locker.location}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                      <svg
                        fill={themeName === 'dark' ? '#f8f7fc' : 'myPurple.0'}
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
                    <Flex w="100%" justify={user?.role === 'TEACHER' ? 'center' : 'space-between'}>
                      {user?.role === 'ADMIN' ? (
                        <Tooltip label="Editar armario">
                          <Button
                            onClick={() => openEditModal(locker)}
                            c="myPurple.0"
                            variant="transparent"
                          >
                            <MdOutlineEdit size={24} />
                          </Button>
                        </Tooltip>
                      ) : null}
                      <Button
                        aria-label={`ver casillas del armario número ${locker.number}`}
                        onClick={() => {
                          setSelectedLocker(locker);
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
                          <Button
                            onClick={() => openDeleteModal(locker)}
                            c="myPurple.11"
                            variant="transparent"
                          >
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
