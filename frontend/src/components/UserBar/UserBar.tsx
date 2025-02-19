﻿import React from 'react';
import { useTheme } from '@emotion/react';
import { Avatar, Flex, Text } from '@mantine/core';
import { useAuth } from '@/hooks/AuthProvider';

export default function UserBar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <Flex miw={100} mih={20} justify="flex-end" px="xl" py="md" gap="2vw">
      <Button onClick={toggleTheme} color="myColor.5">
        Cambiar a {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
      </Button>
      <Flex direction="column" align="flex-end" gap="-1vw">
        <Text aria-label="nombre y apellido del usuario" c="white" size="lg" fw={600}>
          {user?.name} {user?.surname}
        </Text>
        <Text aria-label="correo eletrónico del usuario" c="white" ml="" size="lg" fw={300}>
          {user?.username}
        </Text>
      </Flex>
      <Avatar size="lg" src={user?.avatar} alt="User's profile photo" bd="3px solid white" />
    </Flex>
  );
}
