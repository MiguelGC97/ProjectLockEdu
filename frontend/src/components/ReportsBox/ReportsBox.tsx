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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ReportsBox() {
  const [incidences, setIncidences] = useState<Incidence[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [currentIncidence, setCurrentIncidence] = useState<Incidence | null>(null);
  const [newContent, setNewContent] = useState<string>('');

  const { user } = useAuth();

  useEffect(() => {
    const loadIncidences = async () => {
      try {
        const data = await fetchIncidencesByUserId(user.id);
        setIncidences(data);
      } catch (error) {
        console.error('Error cargando incidencias:', error);
        toast.error('Error al cargar las incidencias');
      }
    };

    loadIncidences();
  }, [user.id]);

  const handleEditClick = (incidence: Incidence) => {
    setCurrentIncidence(incidence);
    setNewContent(incidence.content);
    setModalOpened(true);
  };

  const handleSave = async () => {
    if (currentIncidence) {
      try {
        const response = await updateIncidenceContent(currentIncidence.id, newContent);

        if (response.message === 'Ha excedido el tiempo límite para actualizar este reporte') {
          toast.error('No puedes actualizar este reporte porque ha pasado el tiempo límite.');
          setModalOpened(false);
          return;
        }

        // Actualizar el estado local con el nuevo contenido
        setIncidences((prev) =>
          prev.map((inc) =>
            inc.id === currentIncidence.id ? { ...inc, content: newContent } : inc
          )
        );

        toast.success('Incidencia actualizada correctamente.');
        setModalOpened(false);
      } catch (error: any) {
        console.error('Error al actualizar la incidencia:', error);

        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Ocurrió un error inesperado. Inténtalo de nuevo más tarde.');
        }

        setModalOpened(false);
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

  const rows = incidences.map((report) => (
    <Accordion.Item key={report.id} value={`casilla-${report.boxId}`}>
      <Accordion.Control aria-label={`Incidencia en casilla ${report.boxId}, estado ${report.isSolved ? 'Resuelto' : 'Pendiente'}`}>
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
        onClick={() => handleEditClick(report)}
        role="button"
        tabIndex={0}
        aria-label={`Editar incidencia en casilla ${report.boxId}`}
      >
        <Flex align="center" gap="md">
          <Avatar src={report.user?.avatar} alt={`Avatar de ${report.user?.name}`} radius="xl" size="lg" />
          <Box>
            <Text c="white">{report.content}</Text>
          </Box>
        </Flex>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Box
      bg="transparent"
      h="80vh"
      bd="1px solid myPurple.1"
      w="100%"
      style={{
        borderRadius: '83px 0 25px 25px',
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <Center>
        <h2 id="incidencias-title">Incidencias</h2>
      </Center>
      <Divider size="xs" color="myPurple.1" />

      <ScrollArea p="lg" m="md" h="70vh" scrollbarSize={16} aria-labelledby="incidencias-title">
        <Flex direction="column" gap="xl">
          <Table horizontalSpacing="sm" verticalSpacing="sm">
            <Table.Thead c="white">
              <Table.Tr>
                <Table.Th style={{ textAlign: 'center', width: '33.33%' }}>
                  <Text c="white" fw={700}>Casilla</Text>
                </Table.Th>
                <Table.Th style={{ textAlign: 'center', width: '33.33%' }}>
                  <Text c="white" fw={700}>Fecha</Text>
                </Table.Th>
                <Table.Th style={{ textAlign: 'center', width: '33.33%' }}>
                  <Text c="white" fw={700}>Estado</Text>
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
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title">Editar Incidencia</h2>
        <Textarea
          value={newContent}
          onChange={(e) => setNewContent(e.currentTarget.value)}
          autosize
          minRows={5}
          maxRows={10}
          aria-label="Editar contenido de la incidencia"
        />
        <Flex justify="flex-end" mt="md">
          <Button
            onClick={handleSave}
            color="#4F51B3"
            aria-label="Guardar cambios en la incidencia"
          >
            Guardar
          </Button>
        </Flex>
      </Modal>
    </Box>
  );
}