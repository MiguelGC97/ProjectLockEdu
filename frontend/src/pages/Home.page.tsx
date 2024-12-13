// Home.page.tsx
import { useState } from 'react';
import { Flex, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Banner } from '@/components/Banner/Banner';
import BookingForm from '@/components/BookingForm/BookingForm';
import BottomTabs from '@/components/BottomTabs/BottomTabs';
import Boxes from '@/components/Boxes/Boxes';
import Lockers from '@/components/Lockers/Lockers';
import { NotificationsBox } from '@/components/NotificationsBox/NotificationsBox';
import Objects from '@/components/Objects/Objects';
import { Pending } from '@/components/Pending/Pending';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import UserBar from '@/components/UserBar/UserBar';
import { BoxType, Locker } from '@/types/types';

const Home: React.FC = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [selectedBox, setSelectedBox] = useState<BoxType | null>(null);
  const [createBooking, setCreateBooking] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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

  const handleCreateBookingClick = (box: BoxType, items: string[]) => {
    setCreateBooking(true);
    setSelectedBox(box);
    setSelectedItems(items);
  };

  const handleReturnToBoxes = () => {
    setSelectedBox(null);
  };

  return (
    <>
      {isMobile ? (
        <BottomTabs />
      ) : (
        <>
          {' '}
          <SideMenu />
          <Flex pl="1.5%" style={{ backgroundColor: theme.colors.myPurple[6] }}>
            <Flex maw="100%" gap="lg">
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
                  ) : selectedBox && !createBooking ? (
                    <Objects
                      box={selectedBox}
                      onReturn={handleReturnToBoxes}
                      onCreateBooking={handleCreateBookingClick}
                    />
                  ) : createBooking ? (
                    <BookingForm box={selectedBox} items={selectedItems} />
                  ) : null}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
};

export default Home;