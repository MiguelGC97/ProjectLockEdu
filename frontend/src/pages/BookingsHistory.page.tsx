// BookingHistory.page.tsx
import { useState, useEffect } from 'react';
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
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');


  return (
    <>
      {isMobile ? (
        <MobileMenu/>
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

// return (
//   <>
//     {isMobile ? (
//       <MobileMenu />
//     ) : (
//       <Flex style={{ height: '100vh', backgroundColor: theme.colors.myPurple[6] }}>
//         <SideMenu />
//         <Flex direction="column" w="100%">
//           <UserBar />
//           <Flex 
//             w="100%" 
//             h="100%" 
//             p="xl" 
//             direction="column" 
//             align="center" 
//             justify="flex-start"
//           >
//             <BookingHistoryBox />
//           </Flex>
//         </Flex>
//       </Flex>
//     )}
//   </>
// );
// };

export default BookingsHistory;
