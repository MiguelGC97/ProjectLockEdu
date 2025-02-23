import { useEffect, useState } from 'react';
import { IconCirclePlus, IconPhotoPlus, IconTrash } from '@tabler/icons-react';
import { MdOutlineEdit } from 'react-icons/md';
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  FileInput,
  Flex,
  Group,
  Image,
  Modal,
  PasswordInput,
  ScrollArea,
  Select,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/hooks/AuthProvider';
import instance, { baseUrl, imageBaseUrl } from '@/services/api';
import {
  createUser,
  deleteUser,
  fetchAllUsers,
  updateAvatar,
  updateUser,
  uploadAvatar,
} from '@/services/fetch';
import { UserType } from '@/types/types';
import classes from './UsersBox.module.css';

const UsersBox: React.FC = () => {
  const [users, setUsers] = useState<any[] | undefined>([]);
  const [openedCreate, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const { user, updateUserDetails, updateUserAvatar } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  const icon = <IconPhotoPlus size={18} stroke={1.5} />;
  const [file, setFile] = useState(null);
  // const [newImage, setNewImage] = useState(null);

  const [newUser, setNewUser] = useState<any>({
    name: '',
    surname: '',
    username: '',
    password: '',
    avatar: 'no-image',
    role: '',
  });

  useEffect(() => {
    if (userToEdit) {
      setUserToEdit((prev: any) => ({
        ...prev,
        avatar: prev?.avatar || 'no-image',
      }));
    }
  }, [userToEdit]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetchAllUsers();
      setUsers(response);
    };
    fetchUsers();
  }, []);

  const handleChange = (field: keyof UserType, value: string) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const openDeleteModal = (userReceived: any) => {
    setUserToDelete(userReceived);
    openDelete();
  };

  const openEditModal = (userReceived: any) => {
    setUserToEdit(userReceived);
    openEdit();
  };

  const handleCreateUser = async (image: any) => {
    try {
      const avatarPath = await uploadAvatar(image);

      const response = await createUser(newUser, avatarPath);

      if (response) {
        setUsers((prev) => (prev ? [...prev, response.user] : [response.user]));
        closeCreate();

        setNewUser({
          name: '',
          surname: '',
          username: '',
          password: '',
          avatar: 'no-image',
          role: '',
        });
        setErrorMessage(null);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        console.error('Error creating user:', error);
        setErrorMessage('Ocurrió un error al crear el usuario');
      }
    }
  };

  const handleDeleteUser = async (receivedUser: any) => {
    try {
      if (receivedUser.avatar !== null && receivedUser.avatar !== 'no-image') {
        const filename = receivedUser.avatar;
        try {
          const sliced = filename.slice(9);

          await instance.delete(`${baseUrl}/users/delete-avatar/${sliced}`);
        } catch (error: any) {
          if (error.response?.status !== 404) {
            throw error;
          }
        }
      }

      const response = await deleteUser(receivedUser.id);
      if (response) {
        setUsers((prev) => prev?.filter((u) => u.id !== receivedUser.id));
        closeDelete();
        setErrorMessage(null);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Ocurrió un error al eliminar el usuario');
      }
    }
  };

  const handleUpdateUserDetails = async () => {
    try {
      if (!userToEdit) {
        return;
      }
      const response = await updateUserDetails(userToEdit);
      if (response) {
        setUsers((prevUsers) =>
          prevUsers?.map((usr) => (usr.id === userToEdit.id ? { ...usr, ...userToEdit } : usr))
        );
        closeEdit();
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.status === 404
          ? 'El usuario no fue encontrado.'
          : error.response?.status === 400
            ? 'La solicitud contiene datos incorrectos.'
            : error.response?.status === 409
              ? 'Ya existe un usuario con este correo.'
              : 'Un erro ocurrió al actualizar el usuario.'
      );
    }
  };

  const handleUpdateAvatar = async (image: any) => {
    if (!userToEdit) return;

    try {
      setErrorMessage('');

      let newFilename = userToEdit.avatar || 'no-image';

      if (image) {
        if (newFilename !== 'no-image') {
          try {
            const sliced = newFilename.slice(9);
            await instance.delete(`${baseUrl}/users/delete-avatar/${sliced}`);
          } catch (error: any) {
            if (error.response?.status !== 404) {
              throw error;
            }
          }
        }
        newFilename = await uploadAvatar(image);
      }

      let responseUpdate = null;

      if (userToEdit?.role === 'TEACHER' || userToEdit?.role === 'MANAGER') {
        responseUpdate = await updateAvatar(userToEdit, newFilename);
      } else {
        responseUpdate = await updateUserAvatar(userToEdit, newFilename);
      }

      if (responseUpdate?.updatedUser) {
        closeEdit();

        setSuccessMessage('¡Avatar actualizado con éxito!');

        setTimeout(() => {
          setSuccessMessage(null);
        }, 1500);

        setUsers((prevUsers) =>
          prevUsers?.map((usr) =>
            usr.id === userToEdit.id ? { ...usr, avatar: responseUpdate.updatedUser.avatar } : usr
          )
        );

        setUserToEdit((prev) => prev && { ...prev, avatar: responseUpdate.updatedUser.avatar });
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.status === 404
          ? 'El usuario no fue encontrado.'
          : error.response?.status === 400
            ? 'La solicitud contiene datos incorrectos.'
            : 'Error al actualizar el avatar.'
      );
    }
  };

  const rows = users?.map((u) => {
    const { id, name, surname, avatar, role } = u;
    const userFullName = `${name} ${surname}`;

    const roleTranslation =
      role === 'ADMIN'
        ? 'Administrador'
        : role === 'TEACHER'
          ? 'Profesor'
          : 'Gestor de incidencias';

    const roleColor =
      role === 'ADMIN' ? 'myPurple.12' : role === 'TEACHER' ? 'myPurple.0' : 'myPurple.10';

    const src = imageBaseUrl + avatar;

    return (
      <Table.Tr key={id} c="myPurple.0">
        <Table.Td>
          <Flex align="center" gap={10}>
            <Avatar size="lg" src={src} alt="User's profile photo" bd="3px solid myPurple.0" />
            <Flex direction="column">
              <Text fw={700}>{userFullName}</Text>
              <Text fw={400}>{u.username}</Text>
            </Flex>
          </Flex>
        </Table.Td>

        <Table.Td>
          <Text c={roleColor} fw={700}>
            {roleTranslation.toUpperCase()}
          </Text>
        </Table.Td>

        <Table.Td>
          <Flex gap={50}>
            <Tooltip label="Editar usuario">
              <Button c="myPurple.0" variant="transparent">
                <MdOutlineEdit cursor="pointer" size={28} onClick={() => openEditModal(u)} />
              </Button>
            </Tooltip>

            {u?.role !== 'ADMIN' ? (
              <Tooltip label="Eliminar usuario">
                <Button c="myPurple.11" variant="transparent">
                  <IconTrash cursor="pointer" size={28} onClick={() => openDeleteModal(u)} />
                </Button>
              </Tooltip>
            ) : null}
          </Flex>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <Modal size="lg" opened={openedCreate} onClose={closeCreate} title="Crear nuevo usuario">
        <Flex direction="column" gap="md">
          {errorMessage && (
            <Text c="myPurple.11" size="sm" fw={500}>
              {errorMessage}
            </Text>
          )}

          <TextInput
            label="Nombre"
            placeholder="Ingrese el nombre"
            value={newUser.name}
            maxLength={15}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <TextInput
            label="Apellido"
            placeholder="Ingrese el apellido"
            value={newUser.surname}
            maxLength={15}
            onChange={(e) => handleChange('surname', e.target.value)}
          />
          <TextInput
            label="Correo eletrónico"
            placeholder="Ingrese el correo eletrónico"
            value={newUser.username}
            onChange={(e) => handleChange('username', e.target.value)}
            withAsterisk
          />
          <PasswordInput
            label="Contraseña"
            placeholder="Ingrese la contraseña"
            value={newUser.password}
            onChange={(e) => handleChange('password', e.target.value)}
            withAsterisk
          />

          <Select
            label="Rol"
            placeholder="Seleccione un rol"
            data={[
              { value: 'TEACHER', label: 'Profesor' },
              { value: 'MANAGER', label: 'Gestor de incidencias' },
            ]}
            value={newUser.role}
            onChange={(value) => handleChange('role', value || '')}
            withAsterisk
          />

          <FileInput
            rightSection={icon}
            label="Sube una imagen de perfil"
            placeholder="Imagen de perfil"
            rightSectionPointerEvents="none"
            mt="md"
            onChange={(file) => {
              setFile(file);
            }}
          />

          <Button
            size="md"
            onClick={() => {
              handleCreateUser(file);
            }}
            color="myPurple.4"
            fullWidth
          >
            Crear nuevo usuario
          </Button>
        </Flex>
      </Modal>

      <Modal opened={openedEdit} onClose={closeEdit} title="Editar usuario">
        {userToEdit ? (
          <>
            {successMessage && (
              <Text c="myPurple.12" size="sm" fw={500}>
                {successMessage}
              </Text>
            )}
            <Tabs defaultValue="otherFields">
              <Tabs.List>
                <Tabs.Tab value="otherFields">Cambiar detalles</Tabs.Tab>
                <Tabs.Tab value="avatar">Cambiar avatar</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="otherFields">
                {errorMessage && (
                  <Text c="myPurple.11" size="sm" fw={500}>
                    {errorMessage}
                  </Text>
                )}{' '}
                <Flex direction="column" gap="md">
                  <TextInput
                    label="Nombre"
                    placeholder="Ingrese el nombre"
                    value={userToEdit.name}
                    maxLength={15}
                    onChange={(e) => setUserToEdit({ ...userToEdit, name: e.target.value })}
                  />
                  <TextInput
                    label="Apellido"
                    placeholder="Ingrese el apellido"
                    value={userToEdit.surname}
                    maxLength={15}
                    onChange={(e) => setUserToEdit({ ...userToEdit, surname: e.target.value })}
                  />
                  <TextInput
                    label="Correo electrónico"
                    placeholder="Ingrese el correo electrónico"
                    value={userToEdit.username}
                    onChange={(e) => setUserToEdit({ ...userToEdit, username: e.target.value })}
                  />
                  <PasswordInput
                    label="Contraseña nueva"
                    placeholder="Ingrese la contraseña nueva"
                    onChange={(e) => setUserToEdit({ ...userToEdit, password: e.target.value })}
                  />

                  {userToEdit?.id === user?.id ? null : (
                    <Select
                      label="Rol"
                      placeholder="Seleccione un rol"
                      data={[
                        { value: 'TEACHER', label: 'Profesor' },
                        { value: 'MANAGER', label: 'Gestor de incidencias' },
                      ]}
                      value={userToEdit?.role}
                      onChange={(value) => setUserToEdit({ ...userToEdit, role: value || '' })}
                    />
                  )}

                  <Button size="md" onClick={handleUpdateUserDetails} color="myPurple.4" fullWidth>
                    Confirmar cambios
                  </Button>
                </Flex>
              </Tabs.Panel>

              <Tabs.Panel value="avatar">
                {errorMessage && (
                  <Text c="myPurple.11" size="sm" fw={500}>
                    {errorMessage}
                  </Text>
                )}{' '}
                <Flex direction="column" gap={20}>
                  <FileInput
                    rightSection={icon}
                    label="Sube una imagen de perfil"
                    placeholder="Imagen de perfil"
                    rightSectionPointerEvents="none"
                    mt="md"
                    onChange={(file: any) => {
                      setFile(file);
                    }}
                  />

                  <Button
                    size="md"
                    onClick={() => handleUpdateAvatar(file)}
                    color="myPurple.4"
                    fullWidth
                  >
                    Confirmar nuevo avatar
                  </Button>
                </Flex>
              </Tabs.Panel>
            </Tabs>
          </>
        ) : (
          <Text>Cargando...</Text>
        )}
      </Modal>

      <Modal size="lg" opened={openedDelete} onClose={closeDelete} title="Eliminar usuario">
        {userToDelete ? (
          <>
            <Text size="md">
              ¿Estás seguro de que deseas eliminar el usuario{' '}
              <strong>
                {userToDelete.name} {userToDelete.surname}
              </strong>{' '}
              ({userToDelete.username})?
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
              <Button size="md" onClick={() => handleDeleteUser(userToDelete)} color="#C01B26">
                Eliminar usuario
              </Button>
            </Flex>
          </>
        ) : (
          <Text>Cargando...</Text>
        )}
      </Modal>

      <Box
        bg="transparent"
        h="86vh"
        miw="56vw"
        bd="1px solid myPurple.1"
        style={{ borderRadius: '83px 0 25px 25px' }}
      >
        <Center>
          <h2 style={{ color: 'var(--mantine-color-myPurple-0)', fontWeight: '700' }}>Usuarios</h2>
        </Center>
        <Divider size="xs" color="myPurple.0" />

        <ScrollArea p="lg" m="md" h="72%" scrollbarSize={16}>
          <Flex direction="column" gap="xl">
            {users && users.length > 0 ? (
              <Table horizontalSpacing="sm" verticalSpacing="sm" borderColor="myPurple.0">
                <Table.Thead c="myPurple.0">
                  <Table.Tr size="xl">
                    <Table.Th>
                      <Text c="myPurple.0" fw={700}>
                        Usuario
                      </Text>
                    </Table.Th>
                    <Table.Th>
                      <Text c="myPurple.0" fw={700}>
                        Permisos
                      </Text>
                    </Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            ) : (
              <Center h="40vh">
                <Text c="gray" size="lg" fw={500}>
                  No tienes usuarios registrados.
                </Text>
              </Center>
            )}
          </Flex>
        </ScrollArea>

        <Flex h="12%" gap={10} mr="25px" justify="flex-end" align="center">
          <Text c="myPurple.0" size="xl" fw={700}>
            Añadir nuevo usuario
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
      </Box>
    </>
  );
};

export default UsersBox;
