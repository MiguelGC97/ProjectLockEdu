import React from 'react';
import { Flex } from '@mantine/core';
import { useTheme } from '@/hooks/ThemeProvider';
import { useAuthStore } from '../store/store';

export default function BookingFormBox() {
  const { user } = useAuthStore();

  return <Flex>Hello {user}</Flex>;
}
