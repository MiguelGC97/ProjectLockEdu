// BookingHistory.page.tsx
import { useEffect, useState } from 'react';
import { Flex, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Banner } from '@/components/Banner/Banner';
import BookingHistoryBox from '@/components/BookingHistoryBox/BookingHistoryBox';
import MobileMenu from '@/components/MobileMenu/MobileMenu';
// import { ReportsBox } from '@/components/ReportsBox/ReportsBox';
import { ReportForm } from '@/components/ReportForm/ReportForm';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import UserBar from '@/components/UserBar/UserBar';

const BookingsHistory: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      {isMobile ? (
        <MobileMenu />
      ) : (
        <>
          <SideMenu />

          <Flex p="xl" direction="column" w="100%">
            <UserBar />
            {/* <ReportsBox/> */}
            <BookingHistoryBox />
          </Flex>
        </>
      )}
    </>
  );
};

export default BookingsHistory;
