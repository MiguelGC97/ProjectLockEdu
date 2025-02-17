import { useEffect, useState } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import { Box, Button, createTheme, MantineProvider, NativeSelect, Textarea, Modal } from '@mantine/core';
import { fetchBoxesByLocker, fetchFormIncident, fetchLockers } from '@/services/fetch';
import { Boxs, Locker } from '@/types/types';
import classes from './ReportForm.module.css';
import { useAuth } from '@/hooks/AuthProvider';

const theme = createTheme({
  components: {
    Input: {
      classNames: {
        input: classes.input,
      },
    },
    InputWrapper: {
      classNames: {
        label: classes.label,
      },
    },
  },
});

export function ReportForm() {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [boxes, setBoxes] = useState<Boxs[]>([]);
  const [selectedLocker, setSelectedLocker] = useState('');
  const [selectedBox, setSelectedBox] = useState('');
  const [description, setDescription] = useState('');
  const [modal, setModal] = useState({ open: false, title: '', message: '', color: '' });
  const { user } = useAuth();

  useEffect(() => {
    const loadLockers = async () => {
      try {
        const data = await fetchLockers();
        setLockers(data);
      } catch (error) {
        console.error('Error fetching lockers:', error);
      }
    };
    loadLockers();
  }, []);

  const handleLockerChange = async (lockerId: string) => {
    setSelectedLocker(lockerId);
    setSelectedBox('');
    if (lockerId) {
      try {
        const data = await fetchBoxesByLocker(lockerId);
        setBoxes(data);
      } catch (error) {
        console.error('Error fetching boxes for locker:', error);
      }
    } else {
      setBoxes([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedLocker || !selectedBox || !description) {
      setModal({ open: true, title: 'Error', message: 'Por favor, complete todos los campos.', color: 'red' });
      return;
    }

    const reportData = {
      content: description,
      isSolved: false,
      userId: parseInt(user.id),
      boxId: parseInt(selectedBox, 10),
    };

    try {
      await fetchFormIncident(reportData);
      setModal({ open: true, title: 'Éxito', message: 'Reporte creado exitosamente', color: 'green' });
      setSelectedLocker('');
      setSelectedBox('');
      setDescription('');
    } catch (error) {
      setModal({ open: true, title: 'Error', message: 'Error al crear el reporte', color: 'red' });
    }
  };

  return (
    <MantineProvider theme={theme}>
      <Modal opened={modal.open} onClose={() => setModal({ ...modal, open: false })} title={modal.title} centered>
        <p style={{ color: modal.color }}>{modal.message}</p>
      </Modal>
      
      <Box bg="#4F51B3" style={{ borderRadius: '20px' }} p="xl" w="60em">
        <Box display="flex" mb="md">
          <IconArrowLeft size={30} color="white" />
          <h2 style={{ color: 'white', margin: 0, textAlign: 'center', flexGrow: 1 }}>Formulario de Incidencias</h2>
        </Box>

        <NativeSelect label="Armario" data={lockers.map(l => ({ value: l.id.toString(), label: l.description }))} value={selectedLocker} onChange={(e) => handleLockerChange(e.currentTarget.value)} />
        <NativeSelect label="Casilla" data={boxes.map(b => ({ value: b.id.toString(), label: b.description }))} value={selectedBox} onChange={(e) => setSelectedBox(e.currentTarget.value)} disabled={!selectedLocker} />
        <Textarea label="Descripción" placeholder="Añada su motivo de la incidencia" value={description} onChange={(e) => setDescription(e.currentTarget.value)} />
        
        <Box mt="md" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="filled" color="#3C3D85" radius="xl" onClick={handleSubmit}>Enviar</Button>
        </Box>
      </Box>
    </MantineProvider>
  );
}
