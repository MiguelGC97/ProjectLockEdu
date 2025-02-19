import { createTheme, MantineColorsTuple, rem } from '@mantine/core';

const myPurpleDark: MantineColorsTuple = [
  '#DBDCEC', //done
  '#BFC0DD', //done
  '#A9ABDA', //done
  '#7072C2', //done
  '#4F51B3', //done
  '#3C3D85', //done
  '#393A58', //done
  '#31324E', //done
  '#2A2B44', //done
  '#222337', //done
];

const myPurpleLight: MantineColorsTuple = [
  '#222337', //done
  '#2A2B44', //done
  '#31324E', //done
  '#393A58', //done
  '#3C3D85', //done
  '#4F51B3', //done
  '#7072C2', //done
  '#A9ABDA', //done
  '#e8e9fa', //done
  '#DBDCEC', //done
];

// Function to return theme dynamically based on themeName
export const getTheme = (themeName: 'light' | 'dark') =>
  createTheme({
    colors: {
      myPurple: themeName === 'dark' ? myPurpleDark : myPurpleLight, // Dynamically assign colors
    },
    shadows: {
      md: '1px 1px 3px rgba(0, 0, 0, .25)',
      xl: '5px 5px 3px rgba(0, 0, 0, .25)',
    },
    headings: {
      fontFamily: 'Quicksand, sans-serif',
      sizes: {
        h1: { fontSize: rem(36) },
      },
    },
  });
