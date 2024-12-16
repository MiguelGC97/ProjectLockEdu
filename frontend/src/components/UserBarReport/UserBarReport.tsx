import React from 'react';
import { TbAlertHexagon } from 'react-icons/tb';
import { Avatar, Button, Flex, Text } from '@mantine/core';
import { useAuth } from '@/hooks/AuthProvider';

interface UserBarReportProps {
  onToggleVisibility: () => void;
}

export default function UserBarReport({ onToggleVisibility }: UserBarReportProps) {
  const { user } = useAuth();

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
        onClick={onToggleVisibility} //calls the prop function
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
          {user?.name} {user?.surname}
        </Text>
        <Text c="white" ml="" size="lg" fw={300}>
          {user?.username}
        </Text>
      </Flex>
      <Avatar size="lg" src={user?.avatar} alt="User profile photo" bd="3px solid white" />
    </Flex>
  );
}
