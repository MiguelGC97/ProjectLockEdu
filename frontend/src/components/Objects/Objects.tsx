import { useEffect, useState } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import {
  Box,
  Button,
  Center,
  Flex,
  ScrollArea,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import instance, { baseUrl } from '@/services/api';
import { BoxType, Item, ObjectsProps } from '@/types/types';

const Objects: React.FC<ObjectsProps> = ({ box, onReturn }) => {
  const [objects, setObjects] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useMantineTheme();

  useEffect(() => {
    const fetchObjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await instance.get(`${baseUrl}/items`);
        if (Array.isArray(response.data.data)) {
          setObjects(response.data.data.filter((o) => o.boxId === box.id));
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        setError('Failed to fetch objects.');
        console.error('Error fetching objects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [box]);

  if (loading) {
    return (
      <Center>
        <Text>Loading objects...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Text color="red">{error}</Text>
      </Center>
    );
  }

  return (
    <Box
      style={{
        backgroundColor: theme.colors.myPurple[4],
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
      }}
      px="1vw"
      mb="lg"
      h="86vh"
      w="34.5vw"
    >
      <Stack my="4vh" gap="xl">
        <Flex align="center" justify="space-between" px="1vw">
          <Button variant="outline" leftIcon={<IconArrowLeft />} onClick={onReturn}>
            Return to Boxes
          </Button>
          <Title fw="600" c="white">
            Objects
          </Title>
        </Flex>
      </Stack>
      <ScrollArea p="lg" m="md" h="62vh" scrollbarSize={16}>
        <Flex direction="column" gap="sm">
          {objects.length > 0 ? (
            objects.map((object) => (
              <Box
                key={object.id}
                style={{
                  cursor: 'pointer',
                  borderRadius: 20,
                  backgroundColor: theme.colors.myPurple[6],
                }}
                p="sm"
              >
                <Title size="md" c="white">
                  {object.name}
                </Title>
                <Text c="white" size="sm">
                  {object.description}
                </Text>
              </Box>
            ))
          ) : (
            <Center>
              <Text>No objects found in this box.</Text>
            </Center>
          )}
        </Flex>
      </ScrollArea>
    </Box>
  );
};

export default Objects;
