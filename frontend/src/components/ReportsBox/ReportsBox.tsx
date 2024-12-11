import { Box, Center, Divider, Flex, Group, ScrollArea, Table, Text, Title } from '@mantine/core';

import './ReportsBox.module.css';

import { Incidence } from '@/types/types';
import { fetchIncidences } from '@/services/fetch';
import { useEffect, useState } from 'react';

export function ReportsBox() {

  const [incidences, setIncidences] = useState<Incidence[]>([]);

  useEffect(() => {
    const loadIncidences = async () => {
      const data = await fetchIncidences();
      setIncidences(data);
    };

    loadIncidences();
  }, []);


  const rows = incidences.map((report) => (
    <Table.Tr key={report.id}>
      
      <Table.Td>{new Date(report.createdAt).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Text color={report.isSolved ? 'green' : 'red'} fw="bold">
          {report.isSolved ? 'Resuelto' : 'Pendiente'}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box bg="transparent" h="60vh" bd="1px solid myPurple.1" style={{ borderRadius: 40 }}>
      <Center>
        <h2>Incidencias</h2>
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
                    Estado
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
