﻿// Home.page.tsx
import { useState } from 'react';
import { Flex, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Banner } from '@/components/Banner/Banner';
import Boxes from '@/components/Boxes/Boxes';
import Lockers from '@/components/Lockers/Lockers';
import MobileMenu from '@/components/MobileMenu/MobileMenu';
import { NotificationsBox } from '@/components/NotificationsBox/NotificationsBox';
import Objects from '@/components/Objects/Objects';
import { Pending } from '@/components/Pending/Pending';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import UserBar from '@/components/UserBar/UserBar';
import { BoxType, Locker } from '@/types/types';

const History: React.FC = () => {
  const matches = useMediaQuery('(min-width: 85em)');
  const matches2 = useMediaQuery('(max-width: 93em)');
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [selectedBox, setSelectedBox] = useState<BoxType | null>(null);
  const theme = useMantineTheme();

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

  return (
    <>
      {matches ? (
        matches2 ? (
          <Flex style={{ backgroundColor: theme.colors.myPurple[9] }}>
            <Flex w="100%" h="100%">
              <SideMenu />
              <Flex direction="column" w="100%">
                <UserBar />
                <Flex gap="lg" wrap="wrap">
                  <Flex maw={800} gap="lg" direction="column">
                    <Banner />
                    <Flex miw={600} maw="auto" gap="lg">
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
        ) : (
          <Flex style={{ backgroundColor: theme.colors.myPurple[9] }}>
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
        )
      ) : (
        <Flex style={{ backgroundColor: theme.colors.myPurple[9] }}>
          <Flex w="100%" gap="lg">
            <MobileMenu />
            <Flex direction="column" w="100%">
              <UserBar />
              <Flex gap="lg" wrap="wrap">
                <Flex gap="lg" direction="column">
                  <Banner />
                  <Flex miw={800} w={1100} gap="lg">
                    <NotificationsBox />
                    <Pending />
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
        </Flex>
      )}
    </>
  );
};

export default History;
