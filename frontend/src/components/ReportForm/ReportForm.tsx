import { useEffect, useState } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import { Box, Button, createTheme, MantineProvider, NativeSelect, Textarea } from '@mantine/core';
import { fetchBoxesByLocker, fetchFormIncident, fetchLockers } from '@/services/fetch';
import { Boxs, Locker } from '@/types/types';
import classes from './ReportForm.module.css';
import { useAuth } from '@/hooks/AuthProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>, type: 'locker' | 'box') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      (e.currentTarget as HTMLSelectElement).size = type === 'locker' ? lockers.length + 1 : boxes.length + 1;
    } else if (e.key === 'Escape') {
      e.preventDefault();
      (e.currentTarget as HTMLSelectElement).size = 1;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.currentTarget.size = 1;
  };

  return (
    <MantineProvider theme={theme}>
      <Box
        bg="#4F51B3"
        style={{
          borderRadius: '20px',
          borderTopLeftRadius: '0',
          borderTopRightRadius: '0',
          position: 'relative',
        }}
        p="xl"
        w="60em"
        aria-labelledby="report-form-title"
      >
        <Box display="flex" mb="md">
          <Box role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && console.log('Volver')} aria-label="Volver atrás">
            <IconArrowLeft size={30} color="white" />
          </Box>
          <Box style={{ flexGrow: 1 }}>
            <h2 id="report-form-title" style={{ color: 'white', margin: 0, textAlign: 'center' }}>
              Formulario de Incidencias
            </h2>
          </Box>
        </Box>

        {/* Selector de Armario */}
        <NativeSelect
          mt="md"
          label="Armario"
          aria-label="Selecciona un armario"
          data={[
            { value: '', label: 'Seleccione un armario' },
            ...lockers.map((locker) => ({
              value: locker.id.toString(),
              label: locker.description || `Locker ${locker.id}`,
            })),
          ]}
          value={selectedLocker}
          onChange={(e) => handleLockerChange(e.currentTarget.value)}
          onKeyDown={(e) => handleKeyDown(e, 'locker')}
          onBlur={handleBlur}
          data-testid="locker-select"
          classNames={{ input: classes.input, label: classes.label }}
        />

        {/* Selector de Casilla */}
        <NativeSelect
          mt="md"
          label="Casilla"
          aria-label="Selecciona una casilla"
          data={[
            { value: '', label: 'Seleccione una casilla' },
            ...boxes.map((box) => ({
              value: box.id.toString(),
              label: box.description || `Box ${box.id}`,
            })),
          ]}
          value={selectedBox}
          onChange={(e) => setSelectedBox(e.currentTarget.value)}
          onKeyDown={(e) => handleKeyDown(e, 'box')}
          onBlur={handleBlur}
          disabled={!selectedLocker}
          data-testid="box-select"
          classNames={{ input: classes.input, label: classes.label }}
        />

        {/* Descripción */}
        <Textarea
          mt="md"
          label="Descripción"
          placeholder="Añada su motivo de la incidencia"
          aria-label="Escriba la descripción de la incidencia"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          classNames={{ input: classes.input, label: classes.label }}
        />

        <Box mt="md" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="filled"
            color="#3C3D85"
            radius="xl"
            onClick={() => toast.success('Reporte enviado')}
            aria-label="Enviar reporte"
          >
            Enviar
          </Button>
        </Box>
      </Box>
    </MantineProvider>
  );
}
