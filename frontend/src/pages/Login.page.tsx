import React from 'react';
import { Flex, Image } from '@mantine/core';
import LoginForm from '@/components/LoginForm/LoginForm';

import '../App.module.css';

const Login: React.FC = () => {
  return (
    <Flex maw="100%">
      <img
        className="imageLogin"
        src="https://images.unsplash.com/photo-1553799296-2da61db672c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="login"
      />
      <LoginForm />
    </Flex>
  );
};

export default Login;
