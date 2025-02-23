import React from 'react';
import { IconMoon, IconSunHigh } from '@tabler/icons-react';
import { Avatar, Button, Flex, Text } from '@mantine/core';
import { useAuth } from '@/hooks/AuthProvider';
import { useTheme } from '@/hooks/ThemeProvider';
import { imageBaseUrl } from '@/services/api';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

export default function UserBar() {
  const { user } = useAuth();
  const src = imageBaseUrl + user?.avatar;

  return (
    <Flex
      position="fixed"
      miw={100}
      mih={20}
      justify="flex-end"
      align="center"
      px="xl"
      py="lg"
      gap="2vw"
    >
      <ThemeToggle />
      <Flex direction="column" align="flex-end" gap="-1vw">
        <Flex gap="5" align="center">
          <Text aria-label="nombre y apellido del usuario" c="myPurple.0" size="lg" fw={600}>
            {user?.name} {user?.surname}{' '}
          </Text>
          {user?.role === 'TEACHER' ? null : (
            <Text size="lg" fw={600} c="myPurple.12">
              ({user?.role === 'ADMIN' ? user?.role : null})
            </Text>
          )}
        </Flex>
        <Text aria-label="correo electrónico del usuario" c="myPurple.0" ml="" size="lg" fw={400}>
          {user?.username}
        </Text>
      </Flex>
      <Avatar size="lg" src={src} alt="User's profile photo" bd="3px solid myPurple.0" />
    </Flex>
  );
}
