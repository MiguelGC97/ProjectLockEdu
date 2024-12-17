import React from 'react';
import { Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import LoginForm from '@/components/LoginForm/LoginForm';

const Login: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      {isMobile ? (
        <Flex maw="100%" h="100vh">
          <LoginForm />
        </Flex>
      ) : (
        <Flex maw="100%">
          <Flex maw="55%" h="100vh">
            <img
              className="loginImage"
              src="https://images.unsplash.com/photo-1553799296-2da61db672c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="login"
            />
          </Flex>
          <LoginForm />
        </Flex>
      )}
    </>
  );
};

export default Login;
