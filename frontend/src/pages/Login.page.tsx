import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Anchor,
  Button,
  Checkbox,
  Flex,
  Image,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import LoginForm from '@/components/LoginForm/LoginForm';
import { useAuth } from '@/hooks/AuthProvider';
import { login as loginService } from '@/services/authService';
import classes from '../App.module.css';

const Login: React.FC = () => {
  return (
    <Flex>
      <Image
        maw="55%"
        h="100vh"
        src="https://images.unsplash.com/photo-1553799296-2da61db672c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <LoginForm />
    </Flex>
  );
};

export default Login;
