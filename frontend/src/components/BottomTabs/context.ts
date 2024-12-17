import * as React from 'react';

export const TabsContext = React.createContext<string | undefined>(undefined);

export function useTabsContext() {
  const activeTab = React.useContext(TabsContext);

  if (activeTab === undefined) {
    throw new Error('useTabsContext must be used with a tabsContext');
  }

  return activeTab;
}
