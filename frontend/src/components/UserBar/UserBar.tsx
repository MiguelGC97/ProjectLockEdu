import React from 'react';
import { Avatar, Flex, Text } from '@mantine/core';
import { useThemeContext } from '@/hooks/AppProvider';
import { useAuth } from '@/hooks/AuthProvider';

export default function UserBar() {
  const { user } = useAuth();
  const { currentTheme } = useThemeContext();

  return (
    <Flex miw={100} mih={20} justify="flex-end" px="xl" py="md" gap="2vw">
      <Flex direction="column" align="flex-end" gap="-1vw">
        <Text
          size="lg"
          fw={600}
          style={{ color: `${currentTheme === 'light' ? '#06060E' : '#ffff'}` }}
        >
          {user?.name} {user?.surname}
        </Text>
        <Text
          ml=""
          size="lg"
          fw={400}
          style={{ color: `${currentTheme === 'light' ? '#4F51B3' : '#ffff'}` }}
        >
          {user?.username}
        </Text>
      </Flex>
      <Avatar
        size="lg"
        src={user?.avatar}
        alt="User profile photo"
        style={{ border: `3px solid ${currentTheme === 'light' ? '#8D8FCE' : '#ffff'}` }}
      />
    </Flex>
  );
}
