import { useEffect, useState } from 'react';
import { IconTrash } from '@tabler/icons-react';
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
  ScrollArea,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useAuth } from '@/hooks/AuthProvider';
import { fetchAllUsers } from '@/services/fetch';
import { Booking, Item, UserType } from '@/types/types';

const UsersBox: React.FC = () => {
  const [users, setUsers] = useState<any[] | undefined>([]);

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
            {role}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text>
            <MdOutlineEdit />
          </Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
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

      <ScrollArea p="lg" m="md" h="50vh" scrollbarSize={16}>
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
    </Box>
  );
};

export default UsersBox;
