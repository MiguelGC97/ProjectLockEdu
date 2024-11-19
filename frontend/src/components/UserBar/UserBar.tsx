import React from 'react';
import { Avatar, Flex, Text } from '@mantine/core';

const user = {
  name: 'Pepita Pérez',
  email: 'pepitaperez@mail.com',
};

export default function UserBar() {
  return (
    <Flex miw={100} mih={20} justify="flex-end" px="xl" py="md" gap="4vw">
      <Flex direction="column" gap="-1vw">
        <Text c="white" size="lg" fw={600}>
          {user.name}
        </Text>
        <Text c="white" ml="2vw" size="lg" fw={300}>
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
