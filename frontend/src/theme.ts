import { createTheme, MantineColorsTuple, rem } from '@mantine/core';

const myPurple: MantineColorsTuple = [
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

export const theme = createTheme({
  colors: {
    // purple gradient
    myPurple,
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

// // additional colors
//     myBlack: '#06060E',
//     green: '#12B886',
//     red: '#FA5252', new red:'#FF5C5C'
//     yellow: '#E7AF2E',
//     brightBlue: '#228BE6',
