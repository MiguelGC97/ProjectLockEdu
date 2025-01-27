import { useState } from 'react';
import { IconBell, IconHistory, IconUser } from '@tabler/icons-react';
import { Flex, Tabs, Text } from '@mantine/core';
import Pending from '../Pending/Pending';

import './BottomTabs.module.css';

const BottomTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>('profile');

  return (
    <Flex className="flex-panel" direction="column">
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        styles={{
          root: {
            width: '100%',
            zIndex: 20,
            backgroundColor: 'black',
          },
        }}
        inverted
      >
        <Tabs.Panel value="profile">
          <Pending />
        </Tabs.Panel>
        <Tabs.Panel value="history">
          <Pending />
        </Tabs.Panel>
        <Tabs.Panel value="notifications">AAAA</Tabs.Panel>

        <Tabs.List grow className="tab-list">
          <Tabs.Tab className="tab" value="profile">
            <Flex align="center" justify="center" direction="column">
              <IconUser size={32} />
              <Text fw="500">Inicio</Text>
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab className="tab" value="history">
            <Flex align="center" justify="center" direction="column">
              <IconHistory size={32} />
              <Text fw="500">Reservas</Text>
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab className="tab" value="notifications">
            <Flex align="center" justify="center" direction="column">
              <IconBell size={32} />
              <Text fw="500">Notificaciones</Text>
            </Flex>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </Flex>
  );
};

export default BottomTabs;
