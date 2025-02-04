// Home.page.tsx
import { Avatar, Flex, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Banner } from '@/components/Banner/Banner';
import BookingHistoryBox from '@/components/BookingHistoryBox/BookingHistoryBox';
import MobileMenu from '@/components/MobileMenu/MobileMenu';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import UserBar from '@/components/UserBar/UserBar';
import { useAuth } from '@/hooks/AuthProvider';

const Settings: React.FC = () => {
  const theme = useMantineTheme();
  const matches = useMediaQuery('(min-width: 85em)');
  const matches2 = useMediaQuery('(max-width: 93em)');
  const { user } = useAuth();

  return (
    <>
      <SideMenu />
      <Flex p="xl" direction="column" w="100%">
        <UserBar />
      </Flex>
      
    </>
  );
};

export default Settings;
