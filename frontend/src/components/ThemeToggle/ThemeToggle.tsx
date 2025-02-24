import React from 'react';
import { IconMoon, IconSunHigh, IconSunMoon } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { useAuth } from '@/hooks/AuthProvider';
import { useTheme } from '@/hooks/ThemeProvider';

const ThemeToggle = () => {
  const { theme } = useAuth();
  const { toggleTheme } = useTheme();

  return (
    <div>
      <Button h="50px" bg="myPurple.4" onClick={toggleTheme}>
        {theme === 'dark' ? <IconSunMoon /> : <IconSunMoon />}
      </Button>
    </div>
  );
};

export default ThemeToggle;
