import { useEffect, useState } from 'react';
import { Box, NativeSelect, Textarea, Button, createTheme, MantineProvider } from '@mantine/core';
import { fetchBoxes, fetchLockers } from '@/services/fetch';
import { Boxs, Locker } from '@/types/types'; 
import classes from './ReportForm.module.css';
import { fetchFormIncident } from '@/services/fetch';


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

  useEffect(() => {
    const loadLockers = async () => {
      try {
        const data = await fetchLockers();
        setLockers(data);
      } catch (error) {
        console.error('Error fetching lockers:', error);
      }
    };

    const loadBoxes = async () => {
      try {
        const data = await fetchBoxes();
        setBoxes(data);
      } catch (error) {
        console.error('Error fetching boxes:', error);
      }
    };

    loadLockers();
    loadBoxes();
  }, []);

  const lockerOptions = lockers.map((locker) => ({
    value: locker.id.toString(),
    label: locker.description || `Locker ${locker.id}`,
  }));

  const boxOptions = boxes.map((box) => ({
    value: box.id.toString(),
    label: box.description || `Box ${box.id}`,
  }));

  const handleSubmit = async () => {
    if (!selectedLocker || !selectedBox || !description) {
      alert('Por favor, complete todos los campos.');
      return;
    }
  
    const reportData = {
      content: description,
      isSolved: false,
      teacherId: 1, // Ajusta según sea necesario
      boxId: parseInt(selectedBox, 10), // Convertir a número si es necesario
    };
  
    try {
      const response = await fetchFormIncident(reportData);
      console.log('Reporte creado:', response);
      alert('Reporte creado exitosamente');
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      alert('Error al crear el reporte');
    }
  };
    
  return (
    <MantineProvider theme={theme}>
      <Box bg="#4F51B3" style={{ borderRadius: '20px' }} p="xl">
        <NativeSelect
          mt="md"
          label="Armario"
          data={lockerOptions}
          value={selectedLocker}
          onChange={(e) => setSelectedLocker(e.currentTarget.value)}
        />

        <NativeSelect
          mt="md"
          label ="Casilla"
          data={boxOptions}
          value={selectedBox}
          onChange={(e) => setSelectedBox(e.currentTarget.value)}
        />

        <Textarea
          mt="md"
          label="Descripción"
          placeholder="Añada su motivo de la incidencia"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          styles={{
            input: {
              maxHeight: '200px',
              overflow: 'auto',
            },
          }}
        />

<Box
        mt="md"
        style={{
          display: 'flex',
          justifyContent: 'flex-end', 
        }}
      >
        <Button
          variant="filled"
          color="#3C3D85"
          radius="xl"
          style={{
            padding: '10px 20px', 
          }}
          onClick={handleSubmit}
        >
          Enviar
        </Button>
      </Box>
    </Box>
  </MantineProvider>
  );
}
