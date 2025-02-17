import React from 'react';
import { Avatar, Flex, Text } from '@mantine/core';
import { useAuth } from '@/hooks/AuthProvider';

export default function UserBar() {
  const { user } = useAuth();

  return (
    <Flex miw={100} mih={20} justify="flex-end" px="xl" py="md" gap="2vw">
      <Flex direction="column" align="flex-end" gap="-1vw">
        <Text aria-label="user's name and surname" c="white" size="lg" fw={600}>
          {user?.name} {user?.surname}
        </Text>
        <Text aria-label="user's email" c="white" ml="" size="lg" fw={300}>
          {user?.username}
        </Text>
      </Flex>
      <Avatar size="lg" src={user?.avatar} alt="User profile photo" bd="3px solid white" />
    </Flex>
  );
}
