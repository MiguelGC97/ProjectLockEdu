// Home.page.tsx
import { Flex, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Banner } from '@/components/Banner/Banner';
import { LoginForm } from '@/components/LoginForm/LoginForm';

const LoginPage: React.FC = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      {isMobile ? (<></>) : (<>
      <Flex p="xl" direction="column" w="100%">
        <LoginForm/>
        <LoginForm/>
      </Flex>
      </>)}
    </>
  );
};

export default LoginPage;
