import * as React from 'react';
import { Box } from './Boxes';

export const BoxesContext = React.createContext<Box[] | undefined>(undefined);

export function useBoxesContext() {
  const boxes = React.useContext(BoxesContext);

  if (boxes === undefined) {
    throw new Error('useBoxesContext must be used with a boxesContext');
  }

  return boxes;
}
