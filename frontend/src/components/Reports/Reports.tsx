import { IconTrash } from '@tabler/icons-react';
import { Box, Center, Divider, Flex, Group, ScrollArea, Table, Text, Title } from '@mantine/core';

import './Pending.module.css';

const pendingReservations = [
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
  {
    box: 'C02A03',
    date: '28/05/2024',
    checkOutHour: '16:00',
    checkInHour: '18:00',
  },
];

export function Pending() {
  const rows = pendingReservations.map((p) => (
    <Table.Tr c="white">
      <Table.Td>{p.box}</Table.Td>
      <Table.Td>{p.date}</Table.Td>
      <Table.Td>
        {p.checkOutHour}-{p.checkInHour}
      </Table.Td>
      <Table.Td c="red">
        {'             '}
        <IconTrash />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box bg="transparent" h="60vh" bd="1px solid myPurple.1" style={{ borderRadius: 40 }}>
      <Center>
        <h2>Reservas pendientes</h2>
      </Center>
      <Divider size="xs" color="myPurple.1" />

      <ScrollArea p="lg" m="md" h="50vh" scrollbarSize={16}>
        <Flex direction="column" gap="xl">
          <Table horizontalSpacing="sm" verticalSpacing="sm">
            <Table.Thead c="white">
              <Table.Tr size="xl">
                <Table.Th>
                  <Text c="white" fw={700}>
                    Casilla
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text c="white" fw={700}>
                    Fecha
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text c="white" fw={700}>
                    Horario
                  </Text>
                </Table.Th>
                <Table.Th> </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Flex>
      </ScrollArea>
    </Box>
  );
}
