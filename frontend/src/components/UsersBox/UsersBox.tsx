import { useEffect, useState } from 'react';
import { IconCirclePlus, IconTrash } from '@tabler/icons-react';
import { MdOutlineEdit } from 'react-icons/md';
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Image,
  Modal,
  PasswordInput,
  ScrollArea,
  Select,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/hooks/AuthProvider';
import { createUser, deleteUser, fetchAllUsers, updateUser } from '@/services/fetch';
import { UserType } from '@/types/types';
import classes from './UsersBox.module.css';

const UsersBox: React.FC = () => {
  const [users, setUsers] = useState<any[] | undefined>([]);
  const [openedCreate, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserType | null>(null);

  const [newUser, setNewUser] = useState<any>({
    name: '',
    surname: '',
    username: '',
    password: '',
    avatar: '',
    role: '',
  });

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

  const openDeleteModal = (user: UserType) => {
    setUserToDelete(user);
    openDelete();
  };

  const openEditModal = (user: UserType) => {
    setUserToEdit(user);
    openEdit();
  };

  const handleCreateUser = async () => {
    try {
      const response = await createUser(newUser);
      if (response) {
        setUsers((prev) => (prev ? [...prev, response.user] : [response.user]));
        closeCreate();
        setNewUser({ name: '', surname: '', username: '', password: '', avatar: '', role: '' });
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
  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await deleteUser(userId);
      if (response) {
        setUsers((prev) => prev?.filter((u) => u.id !== userId));
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

  const handleUpdateUser = async () => {
    try {
      if (!userToEdit) return;
      const response = await updateUser(userToEdit);
      if (response) {
        setUsers((prevUsers) =>
          prevUsers?.map((user) => (user.id === userToEdit.id ? { ...user, ...userToEdit } : user))
        );
        closeEdit();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage('Ocurrió un error al actualizar el usuario');
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

    return (
      <Table.Tr key={id} c="myPurple.0">
        <Table.Td>
          <Flex align="center" gap={10}>
            <Avatar size="lg" src={avatar} alt="User's profile photo" bd="3px solid myPurple.0" />
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
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <TextInput
            label="Apellido"
            placeholder="Ingrese el apellido"
            value={newUser.surname}
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
          <TextInput
            label="Avatar (URL)"
            placeholder="Ingrese la URL del avatar"
            onChange={(e) => handleChange('avatar', e.target.value)}
          />
          <Select
            label="Rol"
            placeholder="Seleccione un rol"
            data={[
              { value: 'ADMIN', label: 'Administrador' },
              { value: 'TEACHER', label: 'Profesor' },
              { value: 'MANAGER', label: 'Gestor de incidencias' },
            ]}
            value={newUser.role}
            onChange={(value) => handleChange('role', value || '')}
            withAsterisk
          />
          <Button size="md" onClick={handleCreateUser} color="myPurple.4" fullWidth>
            Crear usuario
          </Button>
        </Flex>
      </Modal>

      <Modal opened={openedEdit} onClose={closeEdit} title="Editar usuario">
        {userToEdit ? (
          <Flex direction="column" gap="md">
            <TextInput
              label="Nombre"
              placeholder="Ingrese el nombre"
              value={userToEdit.name}
              onChange={(e) => setUserToEdit({ ...userToEdit, name: e.target.value })}
            />
            <TextInput
              label="Apellido"
              placeholder="Ingrese el apellido"
              value={userToEdit.surname}
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
            <TextInput
              label="Avatar (URL)"
              placeholder="Ingrese la URL del nuevo avatar"
              onChange={(e) => setUserToEdit({ ...userToEdit, avatar: e.target.value })}
            />
            <Select
              label="Rol"
              placeholder="Seleccione un rol"
              data={[
                { value: 'ADMIN', label: 'Administrador' },
                { value: 'TEACHER', label: 'Profesor' },
                { value: 'MANAGER', label: 'Gestor de incidencias' },
              ]}
              value={userToEdit.role}
              onChange={(value) => setUserToEdit({ ...userToEdit, role: value || '' })}
            />
            <Button size="md" onClick={handleUpdateUser} color="myPurple.4" fullWidth>
              Confirmar cambios
            </Button>
          </Flex>
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
              <Button size="md" onClick={() => handleDeleteUser(userToDelete.id)} color="#C01B26">
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
