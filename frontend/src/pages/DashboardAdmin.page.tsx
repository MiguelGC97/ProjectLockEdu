import { useState } from 'react';
import { Flex, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Boxes from '@/components/Boxes/Boxes';
import Lockers from '@/components/Lockers/Lockers';
import Objects from '@/components/Objects/Objects';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import UserBar from '@/components/UserBar/UserBar';
import UsersBox from '@/components/UsersBox/UsersBox';
import { useAuth } from '@/hooks/AuthProvider';
import { BoxType, Locker } from '@/types/types';

const DashboardAdmin: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [selectedBox, setSelectedBox] = useState<BoxType | null>(null);

  const handleLockerClick = (locker: Locker) => {
    setSelectedLocker(locker);
  };

  const handleBoxClick = (box: BoxType) => {
    setSelectedBox(box);
  };

  const handleReturnToLockers = () => {
    setSelectedLocker(null);
    setSelectedBox(null);
  };

  const handleReturnToBoxes = () => {
    setSelectedBox(null);
  };

  const returnNull = () => {
    return null;
  };

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

            <Flex h="100%" w="100%" gap={30} justify="flex-end" px="xl">
              <UsersBox />
              {/* Conditional rendering for the different states */}
              {!selectedLocker && !selectedBox && <Lockers onLockerClick={handleLockerClick} />}

              {selectedLocker && !selectedBox && (
                <Boxes
                  locker={selectedLocker}
                  onBoxClick={handleBoxClick}
                  onReturn={handleReturnToLockers}
                />
              )}

              {selectedBox && (
                <Objects
                  box={selectedBox}
                  onReturn={handleReturnToBoxes}
                  onCreateBooking={returnNull}
                />
              )}
            </Flex>
          </Flex>
        </Flex>
      ) : null}
    </>
  );
};

export default DashboardAdmin;
