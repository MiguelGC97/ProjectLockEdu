import { useEffect, useState } from 'react';
import { IconArrowLeft, IconSearch } from '@tabler/icons-react';
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  ScrollArea,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import instance, { baseUrl } from '@/services/api';
import { BoxesProps, BoxType } from '@/types/types';

import './Boxes.module.css';

const Boxes: React.FC<BoxesProps> = ({ locker, onBoxClick, onReturn }) => {
  const [boxes, setBoxes] = useState<BoxType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useMantineTheme();

  useEffect(() => {
    setLoading(true); // Set loading state before starting the request
    setError(null); // Clear previous errors

    // Fetch boxes using .then()
    instance
      .get(`${baseUrl}/boxes`)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setBoxes(response.data.data.filter((b) => b.lockerId === locker.id));
        } else {
          setError('Unexpected response format');
        }
      })
      .catch((error) => {
        setError('Failed to fetch boxes.');
      })
      .finally(() => {
        setLoading(false); // Set loading state to false after the request is finished
      });
  }, [locker]); // Dependency array ensures this effect runs when `locker` changes;

  if (loading) {
    return (
      <Center>
        <Text>Loading boxes...</Text>
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
        <Flex gap="33%">
          <a>
            <IconArrowLeft color="white" size="30px" onClick={onReturn} />
          </a>

          <Title fw="600" c="white">
            Casillas
          </Title>
        </Flex>

        <Center>
          <Input w="20vw" size="lg" placeholder="Busca un objeto" rightSection={<IconSearch />} />
        </Center>
      </Stack>
      <ScrollArea p="lg" m="md" h="62vh" scrollbarSize={16}>
        <Flex direction="column" gap="sm">
          {boxes.map((box) => (
            <Box
              key={box.id}
              onClick={() => onBoxClick(box)}
              style={{
                cursor: 'pointer',
                borderRadius: 20,
                backgroundColor: theme.colors.myPurple[6],
              }}
              p="lg"
            >
              <Stack>
                <Title size="xl" c="white">
                  Casilla C{box.id}
                </Title>
                <Text size="md" c="white">
                  {box.description}
                </Text>
              </Stack>
            </Box>
          ))}
        </Flex>
      </ScrollArea>
    </Box>
  );
};

export default Boxes;
