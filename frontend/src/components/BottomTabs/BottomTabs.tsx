import { IconBell, IconHistory, IconUser } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Text } from '@mantine/core';

const BottomTabs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (value: string) => {
    navigate(value);
  };

  return (
    <Tabs
      value={location.pathname}
      onTabChange={handleTabChange}
      styles={{
        root: { position: 'fixed', bottom: 0, width: '100%', backgroundColor: 'white', zIndex: 10 },
      }}
    >
      <Tabs.List grow className="tab-list">
        <Tabs.Tab className="tab" value="/perfil">
          <IconUser size={32} />
          Inicio
        </Tabs.Tab>
        <Tabs.Tab className="tab" value="/historial-reservas">
          <IconHistory size={32} />
          Reservas
        </Tabs.Tab>
        <Tabs.Tab className="tab" value="/notificaciones">
          <IconBell size={32} />
          <Text>Notificaciones</Text>
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};

export default BottomTabs;
