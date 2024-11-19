import { IconSearch } from '@tabler/icons-react';
import { Box, Button, Center, Flex, Input, ScrollArea, Stack, Text, Title } from '@mantine/core';

import './Box.module.css';

import { useEffect, useState } from 'react';
import instance from '@/services/api';
import { BoxType } from '@/types/types';
import { BoxesContext } from './context';

const mockBoxes = [
  {
    id: 'C01',
    description: 'A Box',
    imgUrl: 'Aula 106',
    locker_id: '0-01',
  },
  {
    id: 'C02',
    description: 'A Box',
    imgUrl: 'Aula 106',
    locker_id: '0-01',
  },
  {
    id: 'C03',
    description: 'A Box',
    imgUrl: 'Aula 106',
    locker_id: '0-02',
  },
  {
    id: 'C04',
    description: 'A Box',
    imgUrl: 'Aula 106',
    locker_id: '0-02',
  },
];

export default function Boxes() {
  const [boxes, setBoxes] = useState<Box[]>([]);

  useEffect((): any => {
    try {
      let boxes: any;

      instance.get('/boxes').then((response) => {
        boxes = response.data;
      });

      setBoxes(mockBoxes);

      return boxes;
    } catch (err: any) {
      console.log(err.message);
      return null;
    }
  }, []);

  return (
    <BoxesContext.Provider value={boxes}>
      <Box
        bg="myPurple.4"
        px="1vw"
        mb="lg"
        h="86vh"
        w="34.5vw"
        style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
      >
        <Stack my="4vh" gap="xl">
          <Center>
            <Title fw="600" c="white">
              Casillas
            </Title>
          </Center>
          {/* Search input for Boxes */}
          <Center>
            <Input
              w="20vw"
              size="lg"
              placeholder="Busque un objecto"
              rightSection={<IconSearch />}
            />
          </Center>
        </Stack>
        <ScrollArea p="lg" m="md" h="62vh" scrollbarSize={16}>
          <Flex direction="column" gap="sm">
            {boxes.map((box) => {
              return (
                <Box h="auto" bg="myPurple.6" style={{ borderRadius: 20 }} p="sm">
                  <Flex direction="column" gap="lg" p="sm">
                    <Flex gap="10vw" justify="center" align="center">
                      <Flex direction="column" gap="1vh" justify="center">
                        <Title size="xl" c="white">
                          Armario {box.id}
                        </Title>
                        <Flex gap="md" justify="flex-start">
                          <Flex gap={5}>
                            <Text c="white" fw={700}>
                              Casilla:
                            </Text>{' '}
                            <Text c="white">{box.locker_id}</Text>
                          </Flex>
                        </Flex>
                      </Flex>
                      <svg
                        fill="#7072C2"
                        height="60px"
                        width="60px"
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 512 512"
                        xml:space="preserve"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {' '}
                          <g>
                            {' '}
                            <g>
                              {' '}
                              <g>
                                {' '}
                                <path d="M448,0H64C52.218,0,42.667,9.551,42.667,21.333V448v42.667C42.667,502.449,52.218,512,64,512 c11.782,0,21.333-9.551,21.333-21.333v-21.333h149.333v21.333c0,11.782,9.551,21.333,21.333,21.333 c11.782,0,21.333-9.551,21.333-21.333v-21.333h149.333v21.333c0,11.782,9.551,21.333,21.333,21.333s21.333-9.551,21.333-21.333 V448V21.333C469.333,9.551,459.782,0,448,0z M426.667,426.667H277.333v-384h149.333V426.667z M85.333,42.667h149.333v384H85.333 V42.667z"></path>{' '}
                                <path d="M149.333,128h21.333c11.782,0,21.333-9.551,21.333-21.333c0-11.782-9.551-21.333-21.333-21.333h-21.333 c-11.782,0-21.333,9.551-21.333,21.333C128,118.449,137.551,128,149.333,128z"></path>{' '}
                                <path d="M170.667,149.333h-21.333c-11.782,0-21.333,9.551-21.333,21.333c0,11.782,9.551,21.333,21.333,21.333h21.333 c11.782,0,21.333-9.551,21.333-21.333C192,158.885,182.449,149.333,170.667,149.333z"></path>{' '}
                                <path d="M341.333,128h21.333c11.782,0,21.333-9.551,21.333-21.333c0-11.782-9.551-21.333-21.333-21.333h-21.333 c-11.782,0-21.333,9.551-21.333,21.333C320,118.449,329.551,128,341.333,128z"></path>{' '}
                                <path d="M362.667,149.333h-21.333c-11.782,0-21.333,9.551-21.333,21.333c0,11.782,9.551,21.333,21.333,21.333h21.333 c11.782,0,21.333-9.551,21.333-21.333C384,158.885,374.449,149.333,362.667,149.333z"></path>{' '}
                              </g>{' '}
                            </g>{' '}
                          </g>{' '}
                        </g>
                      </svg>
                    </Flex>
                    <Center>
                      <Button size="md" maw="8vw" bg="myPurple.3" radius="xl">
                        Ver casillas
                      </Button>
                    </Center>
                  </Flex>
                </Box>
              );
            })}
          </Flex>
        </ScrollArea>
      </Box>
    </BoxesContext.Provider>
  );
}
