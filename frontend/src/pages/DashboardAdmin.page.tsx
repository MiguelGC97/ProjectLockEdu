import { useState } from 'react';
import { Flex, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Boxes from '@/components/Boxes/Boxes';
import Lockers from '@/components/Lockers/Lockers';
import Objects from '@/components/Objects/Objects';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import { useAuthStore, useBoxesStore, useLockersStore } from '@/components/store/store';
import UserBar from '@/components/UserBar/UserBar';
import UsersBox from '@/components/UsersBox/UsersBox';
import { useAuth } from '@/hooks/AuthProvider';
import { BoxType, Locker } from '@/types/types';

const DashboardAdmin: React.FC = () => {
  const { user } = useAuthStore();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { selectedLocker } = useLockersStore();
  const { selectedBox } = useBoxesStore();

  return (
    <>
      {!isMobile ? (
        <Flex h="100%" w="100%">
          <SideMenu />
          <Flex direction="column" w="100vw" justify="center">
            <Flex w="100%" justify="space-between" align="center" px="lg">
              <Text size="xl" c="myPurple.0" fw={700}>
                Panel de administradores
              </Text>
              <UserBar />
            </Flex>

            <Flex h="100%" w="100%" gap={30} justify="flex-end" align="flex-start" px="xl">
              <UsersBox />
              {/* Conditional rendering for the different states */}
              {!selectedLocker && !selectedBox && <Lockers />}

              {selectedLocker && !selectedBox && <Boxes />}

              {selectedBox && <Objects />}
            </Flex>
          </Flex>
        </Flex>
      ) : null}
    </>
  );
};

export default DashboardAdmin;
