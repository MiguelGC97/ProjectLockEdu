﻿import { useEffect, useState } from 'react';
import { IconArrowLeft, IconSearch } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Input,
  ScrollArea,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { fetchBoxes } from '@/services/fetch';
import { BoxesProps, BoxType } from '@/types/types';

import './Boxes.module.css';

const Boxes: React.FC<BoxesProps> = ({ locker, onBoxClick, onReturn }) => {
  const location = useLocation();
  const { boxId, selectedValues } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<BoxType[]>();
  const theme = useMantineTheme();
  

  console.log('Box ID:', boxId); // box.id passed from Objects component
  console.log('Selected Values:', selectedValues);

  useEffect(() => {
    setLoading(true); // Set loading state before starting the request
    setError(null); // Clear previous errors

    const loadBoxes = async () => {
      const data = await fetchBoxes();
      setBoxes(data?.filter((b) => b.lockerId === locker.id));
    };

    loadBoxes();
    setLoading(false);
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
          {boxes?.map((box) => (
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
              <Flex w="100%" align="center" justify="space-between">
                <Stack>
                  <Title size="xl" c="white">
                    Casilla C{box.id}
                  </Title>
                  <Text size="md" c="white">
                    {box.description}
                  </Text>
                </Stack>
                <svg
                  viewBox="0 0 24 24"
                  version="1.1"
                  height="60px"
                  width="60px"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <title>open_door_line</title>{' '}
                    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      {' '}
                      <g
                        id="System"
                        transform="translate(-816.000000, -96.000000)"
                        fill-rule="nonzero"
                      >
                        {' '}
                        <g id="open_door_line" transform="translate(816.000000, 96.000000)">
                          {' '}
                          <path
                            d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
                            id="MingCute"
                            fill-rule="nonzero"
                          >
                            {' '}
                          </path>{' '}
                          <path
                            d="M14.2534,2.29104 C15.121985,2.146279 15.916565,2.77536663 15.9938515,3.63333818 L16,3.77063 L16,4.99994 L18,4.99994 C19.0543909,4.99994 19.9181678,5.81581733 19.9945144,6.85067759 L20,6.99994 L20,16.9999 C20,18.0542909 19.18415,18.9180678 18.1492661,18.9944144 L18,18.9999 L16,18.9999 L16,20.2293 C16,21.109855 15.2488492,21.7901453 14.3898362,21.7253089 L14.2534,21.7088 L5.6712,20.2785 C4.76040611,20.1266333 4.07933154,19.3740213 4.00646768,18.4672313 L4,18.3057 L4,5.6942 C4,4.77083556 4.63047491,3.97529117 5.51293334,3.7543449 L5.6712,3.72141 L14.2534,2.29104 Z M14,4.36087 L6,5.6942 L6,18.3057 L14,19.639 L14,4.36087 Z M18,6.99994 L16,6.99994 L16,16.9999 L18,16.9999 L18,6.99994 Z M11.5,10.4999 C12.3284,10.4999 13,11.1715 13,11.9999 C13,12.8284 12.3284,13.4999 11.5,13.4999 C10.6716,13.4999 10,12.8284 10,11.9999 C10,11.1715 10.6716,10.4999 11.5,10.4999 Z"
                            id="形状"
                            fill="#7072C2"
                          >
                            {' '}
                          </path>{' '}
                        </g>{' '}
                      </g>{' '}
                    </g>{' '}
                  </g>
                </svg>
              </Flex>
            </Box>
          ))}
        </Flex>
      </ScrollArea>
    </Box>
  );
};

export default Boxes;
