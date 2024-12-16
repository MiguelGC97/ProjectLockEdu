import { useEffect, useState } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import { Box, Button, createTheme, MantineProvider, NativeSelect, Textarea } from '@mantine/core';
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
      alert('Por favor, complete todos los campos.');
      return;
    }

    const reportData = {
      content: description,
      isSolved: false,
      userId: parseInt(user.id),
      boxId: parseInt(selectedBox, 10),
    };

    try {
      const response = await fetchFormIncident(reportData);
      alert('Reporte creado exitosamente');

      //clear form and toggle off.

      setSelectedLocker('');
      setSelectedBox('');
      setDescription('');
      

    } catch (error) {
      console.error('Error al enviar reporte:', error);
      alert('Error al crear el reporte');
    }
  };

  const lockerOptions = [
    { value: '', label: '' },
    ...lockers.map((locker) => ({
      value: locker.id.toString(),
      label: locker.description || `Locker ${locker.id}`,
    })),
  ];

  const boxOptions = [
    { value: '', label: '' },
    ...boxes.map((box) => ({
      value: box.id.toString(),
      label: box.description || `Box ${box.id}`,
    })),
  ];


  return (


    <MantineProvider theme={theme}>
      <Box
        bg="#4F51B3"
        style={{
          borderRadius: '20px',
          borderTopLeftRadius: '0',
          borderTopRightRadius: '0',
        }}
        p="xl"
        w="60em"
      >
        <Box display="flex" mb="md">
          <Box>
            <IconArrowLeft size={30} color="white" />
          </Box>
          <Box style={{ flexGrow: 1 }}>
            <h2 style={{ color: 'white', margin: 0, textAlign: 'center' }}>
              Formulario de Incidencias
            </h2>
          </Box>
        </Box>

        <NativeSelect
          mt="md"
          label="Armario"
          placeholder ="seleccione su armario"
          data={lockerOptions}
          value={selectedLocker}
          styles={{
            input: {
              color: 'white',
              backgroundColor: '#2A2B44',
            },
          }}
          onChange={(e) => handleLockerChange(e.currentTarget.value)}
        />

        <NativeSelect
          mt="md"
          label="Casilla"
          data={boxOptions}
          value={selectedBox}
          styles={{
            input: {
              color: 'white',
              backgroundColor: '#2A2B44',
            },
          }}
          onChange={(e) => setSelectedBox(e.currentTarget.value)}
          disabled={!selectedLocker}
        />

        <Textarea
          mt="md"
          label="Descripción"
          placeholder="Añada su motivo de la incidencia"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          styles={{
            input: {
              height: '300px',
              overflow: 'auto',
              color: 'white',
              backgroundColor: '#2A2B44',
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
