import { useEffect, useState } from 'react';
import {
  IconArrowLeft,
  IconCirclePlus,
  IconPhotoPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import {
  Box,
  Button,
  Center,
  FileInput,
  Flex,
  Input,
  Modal,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { uploadBoxImage } from '@/services/fetch';
import { BoxEditType } from '@/types/types';

import './Boxes.module.css';

import { MdOutlineEdit } from 'react-icons/md';
import instance, { baseUrl } from '@/services/api';
import { useAuthStore, useBoxesStore, useLockersStore, useThemeStore } from '../store/store';

const Boxes: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { themeName } = useThemeStore();
  const { user } = useAuthStore();
  const { boxes, fetchAll, fetchBoxesByLockerId, create, update, deleteBox, setSelectedBox } =
    useBoxesStore();
  const { selectedLocker, setSelectedLocker } = useLockersStore();
  const [openedCreate, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [boxToDelete, setBoxToDelete] = useState<any | null>(null);
  const [boxToEdit, setBoxToEdit] = useState<any | null>(null);
  const icon = <IconPhotoPlus size={18} stroke={1.5} />;
  const [file, setFile] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const [newBox, setNewBox] = useState<any>({
    lockerId: selectedLocker?.id,
    description: '',
    filename: 'no-image',
  });

  useEffect(() => {
    if (!selectedLocker) return;

    fetchBoxesByLockerId(selectedLocker.id);
  }, [selectedLocker]);

  useEffect(() => {
    if (boxToEdit) {
      setBoxToEdit((prev: any) => ({
        ...prev,
        filename: prev?.filename || 'no-image',
      }));
    }
  }, [boxToEdit]);

  const wholeComponent = () => {
    return (
      <Center>
        <Box
          style={{
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
          bg={themeName === 'dark' ? 'myPurple.4' : 'transparent'}
          bd={themeName === 'dark' ? null : '1px solid myPurple.0'}
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
                  onClick={() => {
                    setSelectedLocker(null);
                  }}
                />
              </a>

              <Title fw="600" c="myPurple.0">
                Casillas - Armario {selectedLocker?.number}
              </Title>
            </Flex>

            <Center>
              {user?.role === 'TEACHER' ? (
                <Input
                  aria-label="buscar objeto"
                  w="20vw"
                  size="lg"
                  placeholder="Busca un objeto"
                  bd={themeName === 'dark' ? null : '1px solid myPurple.0'}
                  style={{ borderRadius: '5px' }}
                  rightSection={<IconSearch />}
                />
              ) : null}
            </Center>
          </Stack>
          <ScrollArea p="lg" m="md" h="62vh" scrollbarSize={16}>
            <Flex direction="column" h="auto" gap="sm">
              {!boxes || boxes.length === 0 ? (
                <Flex justify="center" align="center">
                  <Text size="lg" c="myPurple.0">
                    No hay casillas en este armario.
                  </Text>
                </Flex>
              ) : (
                boxes?.map((box) => (
                  <Skeleton visible={loading}>
                    <Box
                      aria-label={`casilla ${box.description}`}
                      key={box.id}
                      style={{
                        cursor: 'pointer',
                        borderRadius: 20,
                      }}
                      p="lg"
                      bg={themeName === 'dark' ? 'myPurple.8' : 'myPurple.8'}
                      bd={themeName === 'dark' ? 'none' : '1px solid myPurple.0'}
                      onClick={() => (user?.role === 'TEACHER' ? setSelectedBox(box) : null)}
                    >
                      <Flex w="100%" align="center" justify="space-between">
                        <Stack>
                          <Title aria-label="número de la casilla" size="xl" c="myPurple.0">
                            Casilla C{box.id}
                          </Title>
                          <Text
                            aria-label="descripción de la casilla"
                            lineClamp={1}
                            size="md"
                            c="myPurple.0"
                          >
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
                              stroke={themeName === 'dark' ? '#f8f7fc' : 'myPurple.0'}
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
                            <Button
                              onClick={() => {
                                openEditModal(box);
                              }}
                              c="myPurple.0"
                              variant="transparent"
                            >
                              <MdOutlineEdit size={24} />
                            </Button>
                          </Tooltip>
                        ) : null}
                        {user?.role === 'ADMIN' ? (
                          <Button
                            aria-label={`ver casillas del armario número ${selectedLocker.number}`}
                            onClick={() => setSelectedBox(box)}
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
                            <Button
                              onClick={() => {
                                openDeleteModal(box);
                              }}
                              c="myPurple.11"
                              variant="transparent"
                            >
                              <IconTrash size={24} />
                            </Button>
                          </Tooltip>
                        ) : null}
                      </Flex>
                    </Box>
                  </Skeleton>
                ))
              )}
            </Flex>
          </ScrollArea>
          {user?.role === 'ADMIN' ? (
            <Flex h="4%" gap={10} mr="25px" justify="flex-end" align="center">
              <Text c="myPurple.0" size="xl" fw={700}>
                Añadir nueva casilla al armario {selectedLocker?.number}
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
      </Center>
    );
  };

  if (error) {
    return (
      <Center>
        <Text color="red">{error}</Text>
      </Center>
    );
  }

  const handleChange = (field: keyof BoxEditType, value: string | File | null) => {
    setNewBox((prev) => ({ ...prev, [field]: value }));
  };

  const openDeleteModal = (box: any) => {
    setBoxToDelete(box);
    openDelete();
  };

  const openEditModal = (box: any) => {
    setBoxToEdit(box);
    openEdit();
  };

  const handleCreateBox = async (box: any, currentLockerId: number, file: any) => {
    try {
      const filepath = await uploadBoxImage(file);

      await create(box, currentLockerId, filepath);

      closeCreate();
      setNewBox({
        lockerId: selectedLocker?.id,
        description: '',
        filename: 'no-image',
      });
      setErrorMessage(null);
    } catch (error: any) {
      console.error('Error creating box:', error.message);
    }
  };

  const handleDeleteBox = async (receivedBox: any) => {
    try {
      if (receivedBox.filename !== null && receivedBox.filename !== 'no-image') {
        const fileToDelete = receivedBox.filename;
        try {
          const sliced = fileToDelete.slice(9);
          await instance.delete(`${baseUrl}/boxes/delete-box-image/${sliced}`);
        } catch (error: any) {
          if (error.response?.status !== 404) {
            throw error;
          }
        }
      }

      await deleteBox(receivedBox.id);

      closeDelete();
      setErrorMessage(null);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Ocurrió un error al eliminar el usuario');
      }
    }
  };

  const handleUpdateBox = async () => {
    if (!boxToEdit) return;

    try {
      setErrorMessage('');

      let newFilename = boxToEdit.filename || 'no-image';

      if (newImage) {
        if (boxToEdit.filename !== 'no-image') {
          try {
            const sliced = newFilename.slice(9);

            await instance.delete(`${baseUrl}/boxes/delete-box-image/${sliced}`);
          } catch (error: any) {
            if (error.response?.status !== 404) {
              throw error;
            }
          }
        }
        newFilename = await uploadBoxImage(newImage);
      }

      const updatedBox = { ...boxToEdit, filename: newFilename };

      await update(updatedBox);

      closeEdit();
      setNewImage(null);
    } catch (error: any) {
      console.error('Update failed:', error.response?.data);
      setErrorMessage(
        error.response?.status === 404
          ? 'La casilla no fue encontrada.'
          : error.response?.status === 400
            ? 'La solicitud contiene datos incorrectos.'
            : 'Error en la solicitud.'
      );
    }
  };

  return (
    <>
      <Modal size="lg" opened={openedCreate} onClose={closeCreate} title="Crear nueva casilla">
        <Flex direction="column" gap="md">
          {errorMessage && (
            <Text c="myPurple.11" size="sm" fw={500}>
              {errorMessage}
            </Text>
          )}

          <TextInput
            label="Descripción"
            placeholder="Ingrese la descripción"
            value={newBox.description}
            onChange={(e) => handleChange('description', e.target.value)}
            withAsterisk
            maxLength={60}
          />

          <FileInput
            rightSection={icon}
            label="Sube la imagen de la casilla"
            placeholder="Imagen de la casilla"
            rightSectionPointerEvents="none"
            mt="md"
            onChange={(file) => setFile(file)}
          />

          <Button
            size="md"
            onClick={() => {
              handleCreateBox(newBox, selectedLocker?.id, file);
            }}
            color="myPurple.4"
            fullWidth
          >
            Crear casilla
          </Button>
        </Flex>
      </Modal>

      <Modal size="lg" opened={openedDelete} onClose={closeDelete} title="Eliminar casilla">
        {boxToDelete ? (
          <>
            <Text size="md">
              ¿Estás seguro de que deseas eliminar la casilla <strong>C{boxToDelete?.id}</strong>{' '}
              del armario <strong>{selectedLocker?.number}</strong>? Todos sus objetos se eliminarán
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
              <Button size="md" onClick={() => handleDeleteBox(boxToDelete)} color="#C01B26">
                Eliminar casilla
              </Button>
            </Flex>
          </>
        ) : (
          <Text>Cargando...</Text>
        )}
      </Modal>

      <Modal opened={openedEdit} onClose={closeEdit} title="Editar casilla">
        {errorMessage && (
          <Text c="myPurple.11" size="sm" fw={500}>
            {errorMessage}
          </Text>
        )}

        {boxToEdit ? (
          <Flex direction="column" gap="md">
            <TextInput
              label="Descripción"
              placeholder="Ingrese la nueva descripción"
              value={boxToEdit?.description}
              onChange={(e) =>
                setBoxToEdit((prev: any) => ({ ...prev, description: e.target.value }))
              }
            />

            <FileInput
              rightSection={icon}
              label="Sube la imagen nueva de la casilla"
              placeholder="Imagen nueva de la casilla"
              rightSectionPointerEvents="none"
              mt="md"
              onChange={(file) => setNewImage(file)}
            />

            <Button size="md" onClick={handleUpdateBox} color="myPurple.4" fullWidth>
              Confirmar cambios
            </Button>
          </Flex>
        ) : (
          <Text>Cargando...</Text>
        )}
      </Modal>

      {wholeComponent()}
    </>
  );
};

export default Boxes;
