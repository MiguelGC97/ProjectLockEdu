import React from 'react';
import { IconMoon, IconSunHigh } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { useTheme } from '@/hooks/ThemeProvider';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <Button h="50px" bg="myPurple.4" onClick={toggleTheme}>
        {theme === 'dark' ? <IconSunHigh /> : <IconMoon />}
      </Button>
    </div>
  );
};

export default ThemeToggle;
