import { useState } from 'react';
import { IconBell, IconHistory, IconUser } from '@tabler/icons-react';
import { Flex, Group, Tabs, Text } from '@mantine/core';
import Pending from '../Pending/Pending';
import { TabsContext } from './context';

import './BottomTabs.module.css';

const BottomTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | undefined>('profile');

  return (
    <TabsContext.Provider value={activeTab}>
      <Flex className="tabs-container" h="100vh" w="100vw">
        <Flex className="tabs-panel" w="100vw" h="8vh" justify="space-around" align="center">
          <Flex
            justify="center"
            align="center"
            direction="column"
            onClick={() => setActiveTab('profile')}
          >
            <IconUser color={activeTab === 'profile' ? '#E7AF2E' : '#BFC0DD'} />
          </Flex>
          <Flex
            justify="center"
            align="center"
            direction="column"
            onClick={() => setActiveTab('history')}
          >
            <IconHistory color={activeTab === 'history' ? '#E7AF2E' : '#BFC0DD'} />
          </Flex>
          <Flex
            justify="center"
            align="center"
            direction="column"
            onClick={() => setActiveTab('notifications')}
          >
            <IconBell color={activeTab === 'notifications' ? '#E7AF2E' : '#BFC0DD'} />
          </Flex>
        </Flex>
      </Flex>
    </TabsContext.Provider>
  );
};

export default BottomTabs;
