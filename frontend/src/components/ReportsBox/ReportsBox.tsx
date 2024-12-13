import { useEffect, useState } from 'react';
import {
  Accordion,
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  ScrollArea,
  Table,
  Text,
  Modal,
  Textarea,
  Button,
} from '@mantine/core';
import styled from '@emotion/styled';
import { fetchIncidences, updateIncidenceContent } from '@/services/fetch';
import { Incidence } from '@/types/types';

export function ReportsBox() {
  const [incidences, setIncidences] = useState<Incidence[]>();
  const [modalOpened, setModalOpened] = useState(false);
  const [currentIncidence, setCurrentIncidence] = useState<Incidence | null>(null);
  const [newContent, setNewContent] = useState<string>('');

  useEffect(() => {
    const loadIncidences = async () => {
      const data = await fetchIncidences();
      setIncidences(data);
    };

    loadIncidences();
  }, []);

  const handleEditClick = (incidence: Incidence) => {
    setCurrentIncidence(incidence);
    setNewContent(incidence.content); 
    setModalOpened(true);
  };

  const handleSave = async () => {
    if (currentIncidence) {
      await updateIncidenceContent(currentIncidence.id, newContent);
      console.log(currentIncidence.id, newContent)
      setModalOpened(false);
      setIncidences(incidences?.map(inc => inc.id === currentIncidence?.id ? { ...inc, content: newContent } : inc));
    }
  };

  const StyledAccordion = styled(Accordion)`
    .mantine-Accordion-control {
      &:hover {
        background-color: #4f51b3;
        color: white;
      }
      &.mantine-Accordion-control-active {
        background-color: #4f51b3;
        color: white;
      }
    }
  `;

  const rows = incidences?.map((report) => (
    <Accordion.Item key={report.id} value={`casilla-${report.boxId}`}>
      <Accordion.Control>
        <Flex justify="space-between" align="center">
          <Box style={{ width: '33.33%', textAlign: 'center', color: 'white' }}>
            Casilla {report.boxId}
          </Box>
          <Box style={{ width: '33.33%', textAlign: 'center', color: 'white' }}>
            {new Date(report.createdAt).toLocaleDateString()}
          </Box>
          <Box style={{ width: '33.33%', textAlign: 'center' }}>
            <Text color={report.isSolved ? 'green' : 'red'} fw="bold">
              {report.isSolved ? 'Resuelto' : 'Pendiente'}
            </Text>
          </Box>
        </Flex>
      </Accordion.Control>
      <Accordion.Panel
        style={{
          backgroundColor: '#3C3D85',
          padding: '1rem',
        }}
        onClick={() => handleEditClick(report)} // Abrir modal al hacer clic en el contenido del panel
      >
        <Flex align="center" gap="md">
          <Avatar
            src={report.user?.avatar}
            alt={report.user?.name}
            radius="xl"
            size="lg"
          />
          <Box>
            <Text color="white">{report.content}</Text>
          </Box>
        </Flex>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Box bg="transparent" h="80vh" bd="1px solid myPurple.1" w="100%"  style={{
      borderRadius: '40px',
      borderTopRightRadius: '0', 
    }} >
      <Center>
        <h2>Incidencias</h2>
      </Center>
      <Divider size="xs" color="myPurple.1" />

      <ScrollArea p="lg" m="md" h="70vh" scrollbarSize={16}>
        <Flex direction="column" gap="xl">
          <Table horizontalSpacing="sm" verticalSpacing="sm">
            <Table.Thead c="white">
              <Table.Tr>
                <Table.Th style={{ textAlign: 'center', width: '33.33%' }}>
                  <Text c="white" fw={700}>
                    Casilla
                  </Text>
                </Table.Th>
                <Table.Th style={{ textAlign: 'center', width: '33.33%' }}>
                  <Text c="white" fw={700}>
                    Fecha
                  </Text>
                </Table.Th>
                <Table.Th style={{ textAlign: 'center', width: '33.33%' }}>
                  <Text c="white" fw={700}>
                    Estado
                  </Text>
                </Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
          </Table>
          <StyledAccordion>{rows}</StyledAccordion>
        </Flex>
      </ScrollArea>

     
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        centered
  
              
      >
        <Textarea
          value={newContent}
          onChange={(e) => setNewContent(e.currentTarget.value)}
          autosize
          minRows={5}
          maxRows={10}
        />
        <Flex justify="flex-end" mt="md">
          <Button onClick={handleSave} color="#4F51B3">
            Guardar
          </Button>
        </Flex>
      </Modal>
    </Box>
  );
}
