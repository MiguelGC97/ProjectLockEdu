import { useEffect, useState } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  createTheme,
  InputLabel,
  MantineProvider,
  NativeSelect,
  Textarea,
} from '@mantine/core';
import { useAuth } from '@/hooks/AuthProvider';
import { useTheme } from '@/hooks/ThemeProvider';
import { fetchBoxesByLocker, fetchFormIncident, fetchLockers } from '@/services/fetch';
import { Boxs, Locker } from '@/types/types';
import classes from './ReportForm.module.css';

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
  const { theme } = useTheme();
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [boxes, setBoxes] = useState<Boxs[]>([]);
  const [selectedLocker, setSelectedLocker] = useState('');
  const [selectedBox, setSelectedBox] = useState('');
  const [description, setDescription] = useState('');
  const [thumbsUpEmojis, setThumbsUpEmojis] = useState<{ id: number; top: number; left: number }[]>(
    []
  );

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
      toast.error('Por favor, complete todos los campos.');
      return;
    }

    const reportData = {
      content: description,
      isSolved: false,
      userId: parseInt(user.id),
      boxId: parseInt(selectedBox, 10),
    };

    console.log('Enviando reporte:', reportData);

    try {
      await fetchFormIncident(reportData);
      toast.success('Reporte creado exitosamente');

      setSelectedLocker('');
      setSelectedBox('');
      setDescription('');

      generateThumbsUpEmojis();
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      toast.error('Error al crear el reporte');
    }
  };

  const generateThumbsUpEmojis = () => {
    const newEmojis = Array.from({ length: 8 }, (_, index) => ({
      id: Date.now() + index,
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));
    setThumbsUpEmojis((prev) => [...prev, ...newEmojis]);

    setTimeout(() => {
      setThumbsUpEmojis([]);
    }, 5000);
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
    <>
      <Box
        bg={theme === 'dark' ? 'myPurple.4' : 'myPurple.8'}
        bd={theme === 'dark' ? null : '1px solid myPurple.0'}
        style={{
          borderRadius: '20px',
          borderTopLeftRadius: '0',
          borderTopRightRadius: '0',
          position: 'relative',
        }}
        p="xl"
        w="60em"
      >
        {thumbsUpEmojis.map((emoji) => (
          <div
            key={emoji.id}
            className={classes.thumbsUp}
            style={{
              position: 'absolute',
              top: `${emoji.top}%`,
              left: `${emoji.left}%`,
            }}
          >
            👍
          </div>
        ))}

        <Box display="flex" mb="md">
          <Box>
            <IconArrowLeft
              size={30}
              color="var(--mantine-color-myPurple-0)"
              aria-label="Volver al menú anterior"
              tabIndex={0} // Permite la navegación por teclado
              onKeyDown={(e) => e.key === 'Enter' && console.log('Volver')}
              role="button"
            />
          </Box>
          <Box style={{ flexGrow: 1 }}>
            <h2
              data-testid="reportForm"
              style={{ color: 'var(--mantine-color-myPurple-0)', margin: 0, textAlign: 'center' }}
              aria-live="polite"
              tabIndex={0}
            >
              Formulario de Incidencias
            </h2>
          </Box>
        </Box>

        <NativeSelect
          mt="md"
          label="Armario"
          data={lockerOptions}
          value={selectedLocker}
          c="myPurple.0"
          onChange={(e) => handleLockerChange(e.currentTarget.value)}
          data-testid="locker-select"
          aria-label="Selecciona un armario"
          aria-required="true"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleLockerChange(e.currentTarget.value);
            }
          }}
          // className="custom-focus"
        />

        <NativeSelect
          mt="md"
          label="Casilla"
          data={boxOptions}
          value={selectedBox}
          c="myPurple.0"
          onChange={(e) => setSelectedBox(e.currentTarget.value)}
          disabled={!selectedLocker}
          data-testid="box-select"
          aria-label="Selecciona una casilla"
          aria-disabled={!selectedLocker}
          tabIndex={0}
          className="custom-focus"
        />

        <Textarea
          tabIndex={0}
          mt="md"
          label="Descripción"
          c="myPurple.0"
          placeholder="Añada su motivo de la incidencia"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          data-testid="description-textarea"
          aria-label="editar de la incidencia"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        <Box mt="md" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="filled"
            color="#3C3D85"
            radius="xl"
            onClick={handleSubmit}
            data-testid="submit-button"
            aria-label="Enviar reporte"
            aria-disabled={!selectedLocker || !selectedBox || !description}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSubmit();
              }
            }}
          >
            Enviar
          </Button>
        </Box>
      </Box>
    </>
  );
}
