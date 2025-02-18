import { useState } from 'react';
import {
  IconCalendarTime,
  IconLogout,
  IconMessageReport,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Center, Flex, Image, rem, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import { useAuth } from '@/hooks/AuthProvider';
import classes from './SideMenu.module.css';

interface NavbarLinkProps {
  icon: typeof IconUser;
  label: string;
  active?: boolean;
  onClick?(): void;
  to?: string;
}

function NavbarLink({ icon: Icon, label, active, onClick, to }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined} aria-label={label}>
        <Icon style={{ width: rem(30), height: rem(30) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const menuData = [
  { icon: IconUser, label: 'Perfil', to: '/perfil' },
  { icon: IconCalendarTime, label: 'Historial de reservas', to: '/historial-reservas' },
  { icon: IconMessageReport, label: 'Incidencias', to: '/incidencias' },
  { icon: IconSettings, label: 'Configuraciones', to: '/configuraciones' },
];

export function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const activeIndex = menuData.findIndex((link) => link.to === location.pathname);

  const handleLogout = () => {
    logout();
  };

  const iconLinks = menuData.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === activeIndex}
      onClick={() => {
        navigate(link.to);
      }}
    />
  ));

  return (
    <div mah="100vh" className={classes.navbar}>
      <Center>
        <Image w="60px" src="/assets/logoApp.png" alt='Logo de LockEdu' />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {iconLinks}
        </Stack>
      </div>

      <Flex direction="column" justify="flex-end" mb="6vh" align="flex-end" h="55vh">
        <NavbarLink icon={IconLogout} label="Salir" onClick={handleLogout} />
      </Flex>
    </div>
  );
}
