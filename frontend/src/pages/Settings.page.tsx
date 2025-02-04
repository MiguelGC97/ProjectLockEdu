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
      <Flex justify="flex-end">
        <Avatar size="lg" src={user?.avatar} alt="User profile photo" bd="3px solid white" />
      </Flex>
      
    </>
  );
};

export default Settings;
