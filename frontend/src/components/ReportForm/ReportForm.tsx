import { useEffect, useState } from 'react';
import { Box, Button, NativeSelect, Textarea } from '@mantine/core';
import { fetchBoxes, fetchLockers } from '@/services/fetch';
import { BoxType, Locker } from '@/types/types';

export function ReportForm() {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [boxes, setBoxes] = useState<BoxType[]>([]);
  const [selectedLocker, setSelectedLocker] = useState<string>('');
  const [selectedBox, setSelectedBox] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Fetch lockers and boxes data on component mount
  useEffect(() => {
    const loadLockersAndBoxes = async () => {
      try {
        const [lockersData, boxesData] = await Promise.all([fetchLockers(), fetchBoxes()]);
        setLockers(lockersData || []);
        setBoxes(boxesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    loadLockersAndBoxes();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    const reportData = {
      content: description,
      isSolved: false,
      teacherId: 1, // You can dynamically set this or get from the context
    };

    // Use URLSearchParams to format the body for x-www-form-urlencoded
    const formBody = new URLSearchParams();
    for (const key in reportData) {
      if (reportData.hasOwnProperty(key)) {
        formBody.append(key, reportData[key]);
      }
    }

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Correct content type
        },
        body: formBody.toString(), // Convert to string for URL-encoded format
      });

      if (!response.ok) {
        throw new Error('Error creating report');
      }

      const result = await response.json();
      console.log('Report created:', result);
      alert('Report created successfully');
    } catch (error) {
      console.error('Error sending report:', error);
      alert('Error creating report');
    }
  };

  // Prepare options for NativeSelect components
  const lockerOptions = lockers?.map((locker) => ({
    value: locker.id.toString(),
    label: locker.description || `Locker ${locker.id}`,
  }));

  const boxOptions = boxes?.map((box) => ({
    value: box.id.toString(),
    label: box.name || `Casilla nº ${box.id}`,
  }));

  return (
    <Box bg="#4F51B3" style={{ borderRadius: '20px' }} p="xl">
      {/* Locker Select */}
      <NativeSelect
        mt="md"
        label="Elige un armario"
        data={lockerOptions}
        value={selectedLocker}
        onChange={(e) => setSelectedLocker(e.currentTarget.value)}
      />

      {/* Box Select */}
      <NativeSelect
        mt="md"
        label="Elige una casilla"
        data={boxOptions}
        value={selectedBox}
        onChange={(e) => setSelectedBox(e.currentTarget.value)}
      />

      {/* Description Textarea */}
      <Textarea
        mt="md"
        label="Description"
        placeholder="Describa la incidencia"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        styles={{
          input: {
            maxHeight: '200px',
            overflow: 'auto',
          },
        }}
      />

      {/* Submit Button */}
      <Box mt="md" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="filled" color="#3C3D85" radius="xl" onClick={handleSubmit}>
          Enviar incidencia
        </Button>
      </Box>
    </Box>
  );
}
