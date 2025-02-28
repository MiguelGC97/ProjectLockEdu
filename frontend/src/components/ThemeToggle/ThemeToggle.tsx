import React from 'react';
import { IconMoon, IconSunHigh, IconSunMoon } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { useAuth } from '@/hooks/AuthProvider';
import { useAuthStore, useThemeStore } from '../store/store';

const ThemeToggle = () => {
  const { themeName, toggleTheme } = useThemeStore();

  return (
    <div>
      <Button h="50px" bg="myPurple.4" onClick={toggleTheme}>
        {themeName === 'dark' ? <IconSunMoon /> : <IconSunMoon />}
      </Button>
    </div>
  );
};

export default ThemeToggle;
