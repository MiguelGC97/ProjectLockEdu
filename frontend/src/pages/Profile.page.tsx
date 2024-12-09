// Home.page.tsx
import { useState } from 'react';
import { Flex, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Banner } from '@/components/Banner/Banner';
import BottomTabs from '@/components/BottomTabs/BottomTabs';
import Boxes from '@/components/Boxes/Boxes';
import Lockers from '@/components/Lockers/Lockers';
import MobileMenu from '@/components/MobileMenu/MobileMenu';
import { NotificationsBox } from '@/components/NotificationsBox/NotificationsBox';
import Objects from '@/components/Objects/Objects';
import { Pending } from '@/components/Pending/Pending';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import UserBar from '@/components/UserBar/UserBar';
import { BoxType, Locker } from '@/types/types';

const Profile: React.FC = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [selectedBox, setSelectedBox] = useState<BoxType | null>(null);

  const handleLockerClick = (locker: Locker) => {
    console.log('Locker selected:', locker); // Debugging log
    setSelectedLocker(locker);
    console.log('Updated selectedLocker state:', selectedLocker); // This may not immediately reflect the updated state due to React's asynchronous state update
  };

  const handleBoxClick = (box: BoxType) => {
    console.log('Box clicked:', box);
    setSelectedBox(box);
  };

  const handleReturnToLockers = () => {
    setSelectedLocker(null);
    setSelectedBox(null);
  };

  const handleReturnToBoxes = () => {
    setSelectedBox(null);
  };

  return (
    <>
      {isMobile ? (
        <BottomTabs />
      ) : (
        <Flex style={{ backgroundColor: theme.colors.myPurple[6] }}>
          <Flex w="100%" gap="lg">
            <SideMenu />
            <Flex direction="column" w="100%">
              <UserBar />
              <Flex gap="lg" wrap="wrap">
                <Flex gap="lg" direction="column">
                  <Banner />
                  <Flex miw={800} w={1100} gap="lg">
                    <NotificationsBox />
                    <Pending />
                  </Flex>
                </Flex>
                {!selectedLocker ? (
                  <Lockers onLockerClick={handleLockerClick} />
                ) : !selectedBox ? (
                  <Boxes
                    locker={selectedLocker}
                    onBoxClick={handleBoxClick}
                    onReturn={handleReturnToLockers}
                  />
                ) : (
                  <Objects box={selectedBox} onReturn={handleReturnToBoxes} />
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Profile;
