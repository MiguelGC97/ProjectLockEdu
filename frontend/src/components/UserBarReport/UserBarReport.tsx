import React from 'react';
import { TbAlertHexagon } from 'react-icons/tb';
import { Avatar, Button, Flex, Text } from '@mantine/core';

const user = {
  name: 'Pepita Pérez',
  email: 'pepitaperez@mail.com',
};

interface UserBarReportProps {
  onToggleVisibility: () => void;
}

export default function UserBarReport({ onToggleVisibility }: UserBarReportProps) {
  return (
    <Flex miw={100} mih={20} justify="flex-end" px="xl" py="md" gap="2vw">
      <Button
        color="#4F51B3"
        size="lg"
        h="2.8em"
        w="8em"
        p="5px"
        radioGroup="md"
        leftSection={<TbAlertHexagon style={{ marginLeft: -20 }} size={17} />}
        onClick={onToggleVisibility} // Llama a la función pasada como prop
        style={{ marginRight: '20px' }}
      >
        <Flex direction="column" justify="right" align="flex-start">
          <Text size="sm" c="white">
            Reportar
          </Text>
          <Text size="sm" c="white">
            Incidencia
          </Text>
        </Flex>
      </Button>

      <Flex direction="column" align="flex-end" gap="-1vw">
        <Text c="white" size="lg" fw={600}>
          {user.name}
        </Text>
        <Text c="white" ml="" size="lg" fw={300}>
          {user.email}
        </Text>
      </Flex>
      <Avatar
        size="lg"
        src="https://images.unsplash.com/photo-1609436132311-e4b0c9370469?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="User profile photo"
        bd="3px solid white"
      />
    </Flex>
  );
}
