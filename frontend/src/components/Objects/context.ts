import * as React from 'react';
import { Item } from '@/types/types';

export const ObjectsContext = React.createContext<Item[] | undefined>(undefined);

export function useObjectsContext() {
  const objects = React.useContext(ObjectsContext);

  if (objects === undefined) {
    throw new Error('useObjectsContext must be used within an ObjectsProvider');
  }

  return objects;
}
