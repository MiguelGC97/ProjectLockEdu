import { useState } from 'react';
import {
  IconCalendarTime,
  IconLogout,
  IconMessageReport,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Center, Flex, Image, rem, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import classes from './SideMenu.module.css';

interface NavbarLinkProps {
  icon: typeof IconUser;
  label: string;
  active?: boolean;
  onClick?(): void;
  to?: string; // Add a to prop for the route path
}

function NavbarLink({ icon: Icon, label, active, onClick, to }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon style={{ width: rem(30), height: rem(30) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const menuData = [
  { icon: IconUser, label: 'Perfil', to: '/' },
  { icon: IconCalendarTime, label: 'Historial de reservas', to: '/historial-reservas' },
  { icon: IconMessageReport, label: 'Incidencias', to: '/incidencias' },
  { icon: IconSettings, label: 'Configuraciones', to: '/configuraciones' },
];

export function SideMenu() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  const iconLinks = menuData.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index);
        if (link.to) {
          navigate(link.to); // Navigate to the page when clicked
        }
      }}
    />
  ));

  return (
    <div mah="100vh" className={classes.navbar}>
      <Center>
        <Image w="60px" src="/assets/logoApp.png" />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {iconLinks}
        </Stack>
      </div>

      <Flex direction="column" justify="flex-end" mb="6vh" align="flex-end" h="55vh">
        <NavbarLink icon={IconLogout} label="Salir" onClick={() => console.log('Logout')} />
      </Flex>
    </div>
  );
}