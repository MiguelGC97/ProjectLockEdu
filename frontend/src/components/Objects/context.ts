import * as React from 'react';
import { Object } from '@/types/types';

export const ObjectsContext = React.createContext<Object[] | undefined>(undefined);

export function useObjectsContext() {
  const objects = React.useContext(ObjectsContext);

  if (objects === undefined) {
    throw new Error('useObjectsContext must be used with a ObjectsContext');
  }

  return objects;
}
