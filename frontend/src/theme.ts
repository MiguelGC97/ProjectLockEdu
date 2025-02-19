import { createTheme, MantineColorsTuple, rem } from '@mantine/core';

// Define color schemes for light and dark themes
const themes = {
  dark: [
    '#DBDCEC',
    '#BFC0DD',
    '#A9ABDA',
    '#7072C2',
    '#4F51B3',
    '#3C3D85',
    '#393A58',
    '#31324E',
    '#2A2B44',
    '#222337',
  ] as MantineColorsTuple,

  light: [
    '#F8F9FA',
    '#E9ECEF',
    '#DEE2E6',
    '#CED4DA',
    '#ADB5BD',
    '#6C757D',
    '#495057',
    '#343A40',
    '#212529',
    '#121212',
  ] as MantineColorsTuple,
};

// Function to create theme dynamically
export const getTheme = (themeName: 'light' | 'dark') =>
  createTheme({
    colors: {
      myPurple: themes[themeName], // Dynamically set based on preference
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
