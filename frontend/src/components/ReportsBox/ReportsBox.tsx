import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  Accordion,
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Modal,
  ScrollArea,
  Table,
  Text,
  Textarea,
} from '@mantine/core';
import { useAuth } from '@/hooks/AuthProvider';
import { fetchIncidencesByUserId, updateIncidenceContent } from '@/services/fetch';
import { Incidence } from '@/types/types';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ReportsBox() {
  const [incidences, setIncidences] = useState<Incidence[]>();
  const [modalOpened, setModalOpened] = useState(false);
  const [currentIncidence, setCurrentIncidence] = useState<Incidence | null>(null);
  const [newContent, setNewContent] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    const loadIncidences = async () => {
      const data = await fetchIncidencesByUserId(user.id);
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
    if (!currentIncidence) return;

    try {
      const updatedIncidence = await updateIncidenceContent(currentIncidence.id, newContent);
      toast.success("Incidencia actualizada con éxito");
      setIncidences((prev) =>
        prev?.map((inc) =>
          inc.id === currentIncidence.id ? { ...inc, content: newContent } : inc
        )
      );
      setModalOpened(false);
    } catch (error: any) {
      let errorMessage = "Error al actualizar. Inténtalo de nuevo.";
      if (error.response) {
        errorMessage = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      if (errorMessage.includes("excedido el tiempo") || error.response?.status === 400) {
        toast.warning("Han pasado más de 10 minutos no se puede actualizar la incidencia");
        setModalOpened(false);
      } else {
        toast.error(`Error: ${errorMessage}`);
      }
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
    <Accordion.Item key={report.id} value={`incidencia-${report.id}`} aria-labelledby={`incidencia-${report.id}`} data-testid={`incidencia-${report.id}`}>
      <Accordion.Control
        aria-expanded={report.isSolved ? 'true' : 'false'}
        aria-controls={`casilla-${report.boxId}-panel`}
        data-testid={`incidencia-control-${report.id}`}
      >
        <Flex justify="space-between" align="center">
          <Box style={{ width: '33.33%', textAlign: 'center', color: 'white' }}>
            Casilla {report.boxId}
          </Box>
          <Box style={{ width: '33.33%', textAlign: 'center', color: 'white' }}>
            {new Date(report.createdAt).toLocaleDateString()}
          </Box>
          <Box style={{ width: '33.33%', textAlign: 'center' }}>
            <Text color={report.isSolved ? 'green' : '#FF5C5C'} fw="bold">
              {report.isSolved ? 'Resuelto' : 'Pendiente'}
            </Text>
          </Box>
        </Flex>
      </Accordion.Control>
      <Accordion.Panel
        id={`casilla-${report.boxId}-panel`}
        style={{
          backgroundColor: '#3C3D85',
          padding: '1rem',
        }}
        onClick={() => handleEditClick(report)}
        role="button"
        aria-label={`Editar incidencia ${report.boxId}`}
        data-testid={`incidencia-panel-${report.id}`}
      >
        <Flex align="center" gap="md">
          <Avatar
            src={report.user?.avatar}
            alt={report.user?.name}
            radius="xl"
            size="lg"
          />
          <Box>
            <Text c="white">{report.content}</Text>
          </Box>
        </Flex>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Box bg="transparent" h="80vh" bd="1px solid myPurple.1" w="100%" style={{
      borderRadius: '83px 0 25px 25px'
    }}>
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
        aria-labelledby="modal-edit-incidence"
        data-testid="edit-incidence-modal"
      >
        <Textarea
          value={newContent}
          onChange={(e) => setNewContent(e.currentTarget.value)}
          autosize
          minRows={5}
          maxRows={10}
          aria-label="Contenido de la incidencia"
          data-testid="incidence-content-textarea"
        />
        <Flex justify="flex-end" mt="md">
          <Button onClick={handleSave} color="#4F51B3" aria-label="Guardar cambios" data-testid="save-incidence-button">
            Guardar
          </Button>
        </Flex>
      </Modal>
    </Box>
  );
}