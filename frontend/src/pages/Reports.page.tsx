// Home.page.tsx
import { Flex, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Banner } from '@/components/Banner/Banner';
import BookingHistoryBox from '@/components/BookingHistoryBox/BookingHistoryBox';
import MobileMenu from '@/components/MobileMenu/MobileMenu';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import UserBar from '@/components/UserBar/UserBar';
import { ReportsBox } from '@/components/ReportsBox/ReportsBox';
import { ReportForm } from '@/components/ReportForm/ReportForm';

const Reports: React.FC = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <>
      {isMobile ? (<></>) : (<>
      <Flex p="xl" direction="column" w="100%">
        
        <UserBar/>
        <ReportsBox/>
        <ReportForm/>
      </Flex>
      </>)}
    </>
  );
};

export default Reports;
