import { useEffect, useState } from 'react';
import {
  IconCalendarTime,
  IconCircleKey,
  IconLogout,
  IconMessageReport,
  IconReport,
  IconSettings,
  IconUser,
  IconUsers,
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
  const navigate = useNavigate();

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={() => {
          if (to) navigate(to);
          if (onClick) onClick();
        }}
        className={classes.link}
        data-active={active || undefined}
        aria-label={label}
      >
        <Icon style={{ width: rem(30), height: rem(30), color: 'white' }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const menuDataTeacher = [
  { icon: IconUser, label: 'Perfil', to: '/perfil' },
  { icon: IconCalendarTime, label: 'Historial de reservas', to: '/historial-reservas' },
  { icon: IconMessageReport, label: 'Incidencias', to: '/incidencias' },
  { icon: IconSettings, label: 'Configuraciones', to: '/configuraciones' },
];

const menuDataAdmin = [
  { icon: IconCircleKey, label: 'Armarios', to: '/armarios' },
  { icon: IconUsers, label: 'Usuarios', to: '/usuarios' },
  { icon: IconSettings, label: 'Configuraciones', to: '/configuraciones-admin' },
];

const menuDataManager = [
  { icon: IconReport, label: 'Incidencias', to: '/incidencias-manager' },
  { icon: IconSettings, label: 'Configuraciones', to: '/configuraciones-manager' },
];

export function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState(getUserType());

  useEffect(() => {
    setMenu(getUserType());
  }, [user]);

  function getUserType() {
    switch (user?.role) {
      case 'TEACHER':
        return menuDataTeacher;
      case 'ADMIN':
        return menuDataAdmin;
      case 'MANAGER':
        return menuDataManager;
      default:
        console.log(`Sorry, we could not define user's role.`);
        return [];
    }
  }

  const activeIndex = menu.findIndex((link) => link.to === location.pathname);

  const handleLogout = () => {
    logout();
  };

  const iconLinks = menu.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === activeIndex}
      onClick={() => navigate(link.to)}
    />
  ));

  return (
    <div className={classes.navbar}>
      <Flex
        pt="10px"
        h="100%"
        direction="column"
        align="stretch"
        gap="45vh"
        justify="space-between"
      >
        <Flex h="100vh" direction="column" gap="10px">
          <Center style={{ cursor: 'pointer' }}>
            <Image w="60px" src="/assets/logoApp.png" alt="Logo de LockEdu" />
          </Center>

          <div className={classes.navbarMain}>
            <Stack justify="center" gap={0}>
              {iconLinks}
            </Stack>
          </div>
        </Flex>

        <Flex direction="column" align="flex-end" h="100vh">
          <NavbarLink c="myPurple.0" icon={IconLogout} label="Salir" onClick={handleLogout} />
        </Flex>
      </Flex>
    </div>
  );
}
