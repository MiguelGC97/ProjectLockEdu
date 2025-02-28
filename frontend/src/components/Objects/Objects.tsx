import { useEffect, useState } from 'react';
import { IconArrowLeft, IconCirclePlus, IconTrash } from '@tabler/icons-react';
import { MdOutlineEdit } from 'react-icons/md';
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
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { imageBaseUrl } from '@/services/api';
import { fetchObjectTypes } from '@/services/fetch';
import { Item } from '@/types/types';

import './Objects.module.css';

import { useAuthStore, useBoxesStore, useItemsStore, useThemeStore } from '../store/store';
import { ObjectsContext } from './context';

const Objects: React.FC = () => {
  const [objectTypes, setObjectTypes] = useState<any[] | undefined>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string[]>([]);
  const {
    items,
    fetchAll,
    fetchItemsByBoxId,
    create,
    update,
    deleteItem,
    selectedItems,
    setSelectedItems,
  } = useItemsStore();
  const { selectedBox, setSelectedBox } = useBoxesStore();
  const { themeName } = useThemeStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedCreate, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [objectToDelete, setObjectToDelete] = useState<any | null>(null);
  const [objectToEdit, setObjectToEdit] = useState<any | null>(null);
  const { user } = useAuthStore();

  const src = imageBaseUrl + selectedBox?.filename;

  const [newObject, setNewObject] = useState<any>({
    typeId: 1,
    boxId: selectedBox?.id,
    isReserved: false,
    description: '',
  });

  useEffect(() => {
    const loadObjects = async () => {
      await fetchItemsByBoxId(selectedBox.id);
    };
    loadObjects();
  }, []);

  useEffect(() => {
    const loadTypeNames = async () => {
      const types = await fetchObjectTypes();
      setObjectTypes(types);
    };
    loadTypeNames();
  }, [items]);

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

  const handleChange = (field: keyof any, value: string) => {
    if (field === 'typeId') {
      value = parseInt(value, 10);
    }

    setObjectToEdit((prev) => ({ ...prev, [field]: value }));

    setNewObject((prev) => ({ ...prev, [field]: value }));
  };

  const openDeleteModal = (receivedItem: any) => {
    setObjectToDelete(receivedItem);
    openDelete();
  };

  const openCreateModal = async () => {
    openCreate();
  };

  const openEditModal = async (receivedItem: any) => {
    setObjectToEdit(receivedItem);
    openEdit();
  };

  const handleCreateObject = async () => {
    try {
      await create(newObject);
      closeCreate();
      setNewObject({
        typeId: 1,
        boxId: selectedBox?.id,
        isReserved: false,
        description: '',
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

  const handleDeleteObject = async (objectId: any) => {
    try {
      await deleteItem(objectId);
      closeDelete();
      setErrorMessage(null);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Ocurrió un error al eliminar el objeto.');
      }
    }
  };

  const handleUpdateObject = async () => {
    try {
      setErrorMessage('');
      if (!objectToEdit?.id) {
        setErrorMessage('id del objeto no encontrado.');
        return;
      }

      const updatedObject = {
        ...objectToEdit,
        boxId: selectedBox?.id,
        description: objectToEdit.description,
      };

      await update(updatedObject);

      closeEdit();
    } catch (error: any) {
      switch (error.response?.status) {
        case 404:
          setErrorMessage('El objeto no fue encontrado.');
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
    <>
      <Modal
        size="lg"
        opened={openedCreate}
        onClose={closeCreate}
        title={`Crear nuevo objeto en casilla C${selectedBox?.id}`}
      >
        <Flex direction="column" gap="md">
          {errorMessage && (
            <Text c="myPurple.11" size="sm" fw={500}>
              {errorMessage}
            </Text>
          )}

          <TextInput
            label="Descripción"
            placeholder="Ingrese la descripción"
            maxLength={40}
            value={newObject.description}
            onChange={(e) => handleChange('description', e.target.value)}
            withAsterisk
          />

          <Select
            label="Categoría"
            placeholder="Seleccione una nueva categoría"
            data={
              objectTypes?.map((type) => ({
                value: type.id.toString(),
                label: type.typeName,
              })) || []
            }
            value={newObject.typeId.toString()}
            onChange={(value) => handleChange('typeId', value || '')}
            withAsterisk
          />

          <Button size="md" onClick={handleCreateObject} color="myPurple.4" fullWidth>
            Crear objeto
          </Button>
        </Flex>
      </Modal>

      <Modal
        size="lg"
        opened={openedDelete}
        onClose={closeDelete}
        title={`Eliminar objeto de casilla C${selectedBox.id}`}
      >
        {objectToDelete ? (
          <>
            <Text size="md">
              ¿Estás seguro de que deseas eliminar el objeto{' '}
              <strong>{objectToDelete.description}</strong> de la casilla {selectedBox.id}?
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
                onClick={() => handleDeleteObject(objectToDelete.id)}
                color="#C01B26"
              >
                Eliminar objeto
              </Button>
            </Flex>
          </>
        ) : (
          <Text>Cargando...</Text>
        )}
      </Modal>

      <Modal opened={openedEdit} onClose={closeEdit} title="Editar objeto">
        {errorMessage && (
          <Text c="myPurple.11" size="sm" fw={500}>
            {errorMessage}
          </Text>
        )}

        {objectToEdit ? (
          <Flex direction="column" gap="md">
            <TextInput
              label="Descripción"
              placeholder="Ingrese la nueva descripción"
              value={objectToEdit?.description}
              maxLength={40}
              onChange={(e) => setObjectToEdit({ ...objectToEdit, description: e.target.value })}
            />

            <Select
              label="Categoría"
              placeholder="Seleccione una nueva categoría"
              data={
                objectTypes?.map((type) => ({
                  value: type.id.toString(),
                  label: type.typeName,
                })) || []
              }
              onChange={(value) => handleChange('typeId', value || '')}
            />

            <Button size="md" onClick={handleUpdateObject} color="myPurple.4" fullWidth>
              Confirmar cambios
            </Button>
          </Flex>
        ) : (
          <Text>Cargando...</Text>
        )}
      </Modal>

      <Modal opened={opened} onClose={close} title="Imagen de la casilla" centered size="55rem">
        <Image src={src} fallbackSrc="/assets/fallback.png" onClick={open} />
      </Modal>
      <Box
        style={{
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
        bg={themeName === 'dark' ? 'myPurple.4' : 'transparent'}
        bd={themeName === 'dark' ? null : '1px solid myPurple.0'}
        p="3%"
        mb="lg"
        h="86vh"
        w="34.5vw"
      >
        <Stack mb="2vh" gap="xl">
          <Flex gap="29%">
            <a>
              <IconArrowLeft
                color="var(--mantine-color-myPurple-0)"
                size="30px"
                onClick={() => setSelectedBox(null)}
              />
            </a>

            <Title fw="600" c="myPurple.0">
              Casilla C{selectedBox?.id}
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
          <Image src={src} fallbackSrc="/assets/fallback.png" mah="20vh" onClick={open} />
          <Divider color="myPurple.0" />
          <ScrollArea h="36vh" scrollbarSize={16} mb="xl">
            <Flex direction="column" gap="sm" py="xl" mb="md">
              {user?.role === 'ADMIN' ? (
                <Flex direction="column">
                  <Stack mt="md">
                    {items?.length > 0 ? (
                      items?.map((object) => {
                        const type = objectTypes?.find((type) => type.id === object.typeId);

                        return (
                          <>
                            <Flex w="100%" align="center" justify="space-between" key={object.id}>
                              <Flex direction="column">
                                <Text ml={10} fw={600} c="myPurple.0" maw="100%" truncate>
                                  {object.description}
                                </Text>
                                <Text fw={400} ml={10} c="myPurple.0" maw="100%" truncate>
                                  <Flex gap={7}>
                                    <Text fw={600}>Categoría:</Text>
                                    <Text>{type ? type.typeName : 'Sin categoría'}</Text>{' '}
                                  </Flex>
                                </Text>
                              </Flex>
                              <Flex justify="center" align="center" mr={20}>
                                <Button c="myPurple.0" variant="transparent">
                                  <MdOutlineEdit
                                    cursor="pointer"
                                    size={22}
                                    onClick={() => openEditModal(object)}
                                  />
                                </Button>
                                <Button c="myPurple.11" variant="transparent">
                                  <IconTrash
                                    cursor="pointer"
                                    size={22}
                                    onClick={() => openDeleteModal(object)}
                                  />
                                </Button>
                              </Flex>
                            </Flex>
                            <Divider color="myPurple.0" />
                          </>
                        );
                      })
                    ) : (
                      <Center>
                        <Text c="myPurple.0">No hay objetos disponibles en esta casilla.</Text>
                      </Center>
                    )}
                  </Stack>
                </Flex>
              ) : (
                <Checkbox.Group value={value} onChange={setValue}>
                  <Stack mt="md">
                    {objects?.length > 0 ? (
                      objects?.map((object) => {
                        const type = objectTypes?.find((type) => type.id === object.typeId);
                        return (
                          <>
                            <Flex justify="space-between" align="center" pr="md">
                              <Flex
                                key={object.id}
                                style={{
                                  cursor: 'pointer',
                                }}
                                w="300px"
                              >
                                <Checkbox
                                  styles={{
                                    label: {
                                      color: 'myPurple.0',
                                      fontWeight: 600,
                                      truncate: true,
                                    },
                                  }}
                                  color="myPurple.4"
                                  c="myPurple.0"
                                  ml="1vw"
                                  size="md"
                                  value={`${object.id}`}
                                  label={object.description}
                                  maw="100%"
                                />
                              </Flex>
                              <Text c="myPurple.0">{type ? type.typeName : 'Sin categoría'}</Text>
                            </Flex>
                            <Divider color="myPurple.0" />
                          </>
                        );
                      })
                    ) : (
                      <Center>
                        <Text c="myPurple.0">No hay objetos disponibles en esta casilla.</Text>
                      </Center>
                    )}
                  </Stack>
                </Checkbox.Group>
              )}
            </Flex>
          </ScrollArea>
          <Flex mx="auto" gap="2vw" maw="90%">
            <Button
              disabled={user?.role === 'TEACHER' ? value.length === 0 : false}
              rightSection={user?.role === 'ADMIN' ? <IconCirclePlus /> : ''}
              onClick={() => {
                if (user?.role === 'ADMIN') {
                  openCreateModal();
                } else {
                  setCreateBooking(true);
                }
              }}
              size="md"
              maw={user?.role === 'ADMIN' ? '15vw' : '8vw'}
              bg="myPurple.4"
              radius="xl"
              mx="auto"
              mt="1vh"
            >
              {user?.role === 'ADMIN' ? 'Añadir objeto nuevo' : 'Hacer reserva'}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Objects;
