// Home.page.tsx
import { Flex, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Banner } from '@/components/Banner/Banner';
import BookingHistoryBox from '@/components/BookingHistoryBox/BookingHistoryBox';
import MobileMenu from '@/components/MobileMenu/MobileMenu';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import UserBar from '@/components/UserBar/UserBar';

const Settings: React.FC = () => {
  const theme = useMantineTheme();
  const matches = useMediaQuery('(min-width: 85em)');
  const matches2 = useMediaQuery('(max-width: 93em)');

  return (
    <>
      <div>Hola holita historial</div>
    </>
  );
};

export default Settings;
