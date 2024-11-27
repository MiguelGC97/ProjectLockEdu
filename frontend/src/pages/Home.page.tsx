// Home.page.tsx
import { useState } from 'react';
import { Flex, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Banner } from '@/components/Banner/Banner';
import BookingForm from '@/components/BookingForm/BookingForm';
import Boxes from '@/components/Boxes/Boxes';
import Lockers from '@/components/Lockers/Lockers';
import MobileMenu from '@/components/MobileMenu/MobileMenu';
import { Notifications } from '@/components/Notifications/Notifications';
import Objects from '@/components/Objects/Objects';
import { Pending } from '@/components/Pending/Pending';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import UserBar from '@/components/UserBar/UserBar';
import { BoxType, Locker } from '@/types/types';

const Home: React.FC = () => {
  const theme = useMantineTheme();
  const matches = useMediaQuery('(min-width: 85em)');
  const matches2 = useMediaQuery('(max-width: 93em)');
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [selectedBox, setSelectedBox] = useState<BoxType | null>(null);
  const [createBooking, setCreateBooking] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[] | null>(null);

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
      {matches ? (
        matches2 ? (
          <Flex style={{ backgroundColor: theme.colors.myPurple[6] }}>
            <Flex w="100%" gap="lg">
              <SideMenu />
              <Flex direction="column" w="100%">
                <UserBar />
                <Flex gap="lg" wrap="wrap">
                  <Flex maw={800} gap="lg" direction="column">
                    <Banner />
                    <Flex miw={600} maw="auto" gap="lg">
                      <Notifications />
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
          <Flex style={{ backgroundColor: theme.colors.myPurple[6] }}>
            <Flex w="100%" gap="lg">
              <SideMenu />
              <Flex direction="column" w="100%">
                <UserBar />
                <Flex gap="lg" wrap="wrap">
                  <Flex gap="lg" direction="column">
                    <Banner />
                    <Flex miw={800} w={1100} gap="lg">
                      <Notifications />
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
                  ) : selectedBox && selectedItems && createBooking ? (
                    <BookingForm box={selectedBox} items={selectedItems} />
                  ) : null}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        )
      ) : (
        <Flex style={{ backgroundColor: theme.colors.white }}>
          <Flex w="100%" gap="lg">
            <MobileMenu />
            <Flex direction="column" w="100%">
              <UserBar />
              <Flex gap="lg" wrap="wrap">
                <Flex gap="lg" direction="column">
                  <Banner />
                  <Flex miw={800} w={1100} gap="lg">
                    <Notifications />
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
                  ) : !createBooking ? (
                    <Objects
                      box={selectedBox}
                      onReturn={handleReturnToBoxes}
                      onCreateBooking={handleCreateBookingClick}
                    />
                  ) : (
                    <BookingForm box={selectedBox} items={selectedItems} />
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

export default Home;
