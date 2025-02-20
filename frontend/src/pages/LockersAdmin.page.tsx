import { useState } from 'react';
import { Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Boxes from '@/components/Boxes/Boxes';
import Lockers from '@/components/Lockers/Lockers';
import Objects from '@/components/Objects/Objects';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import { useAuth } from '@/hooks/AuthProvider';
import { BoxType, Locker } from '@/types/types';

const LockersAdmin: React.FC = () => {
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
          <Flex>
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
      ) : null}
    </>
  );
};

export default LockersAdmin;
