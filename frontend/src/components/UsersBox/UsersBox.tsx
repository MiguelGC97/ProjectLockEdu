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
  ScrollArea,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/hooks/AuthProvider';
import { fetchAllUsers } from '@/services/fetch';
import { Booking, Item, UserType } from '@/types/types';
import classes from './UsersBox.module.css';

const UsersBox: React.FC = () => {
  const [users, setUsers] = useState<any[] | undefined>([]);
  const [openedCreate, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetchAllUsers();
      setUsers(response);
    };

    fetchUsers();
  }, []); // Empty dependency array to only run on mount

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
            <Text fw={700}>{userFullName}</Text>
          </Flex>
        </Table.Td>

        <Table.Td>
          <Text c={roleColor} fw={700}>
            {roleTranslation.toUpperCase()}
          </Text>
        </Table.Td>

        <Table.Td>
          <Tooltip label="Editar usuario">
            <Button c="myPurple.0" variant="transparent">
              <MdOutlineEdit cursor="pointer" size={28} onClick={openEdit} />
            </Button>
          </Tooltip>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <Modal opened={openedCreate} onClose={closeCreate} title="Create new user">
        Olá, aqui você criará um user
      </Modal>
      <Modal opened={openedEdit} onClose={closeEdit} title="Create new user">
        Olá, aqui você editará um user
      </Modal>
      <Box
        bg="transparent"
        h="86vh"
        miw="56vw"
        bd="1px solid myPurple.1"
        style={{ borderRadius: '83px 0 25px 25px' }}
      >
        <Center>
          <h2
            style={{ color: 'var(--mantine-color-myPurple-0)', fontWeight: '700' }}
            data-testid="history-title"
          >
            Usuarios
          </h2>
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
                    {/* <Table.Th>
                    <Text c="myPurple.0" fw={700}>
                      Turno
                    </Text>
                  </Table.Th> */}
                    <Table.Th>
                      <Text c="myPurple.0" fw={700}>
                        Permisos
                      </Text>
                    </Table.Th>
                    <Table.Th>
                      <Text c="myPurple.0" fw={700}>
                        {' '}
                      </Text>
                    </Table.Th>
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
        <Divider size="xs" color="myPurple.0" />
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
