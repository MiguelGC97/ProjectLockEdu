import React, { useState } from 'react';
import { IconAt, IconKey } from '@tabler/icons-react';
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
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useAuth } from '@/hooks/AuthProvider';
import { login as loginService } from '@/services/authService';
import classes from '../../App.module.css';

const LoginForm: React.FC = () => {
  const theme = useMantineTheme();
  const { login } = useAuth(); // Use the login function from context
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // call the login service with the username and password
      const data = await loginService(username, password);

      // Assuming the response data contains the user and access token
      login(data.user); // Update the Auth context with the logged-in user
      localStorage.setItem('access_token', data.access_token); // Store token in localStorage

      // Optionally store the user in localStorage if 'Remember Me' is checked
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirect to the profile or dashboard page
      navigate('/perfil');
    } catch (err: any) {
      // If login fails, display an error message
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      w="auto"
      h="auto"
      style={{ backgroundColor: theme.colors.myPurple[9] }}
    >
      <Flex radius={0} align="center" justify="center" px="auto" direction="column" gap="-5">
        <Image w="50%" src="/assets/logo-login.png" />
        <Text color="white" mt="md" mb={50}>
          Inicia sesión con tus credenciales
        </Text>

        {/* Username field */}
        <TextInput
          leftSection={<IconAt />}
          radius="xl"
          c="white"
          miw={isMobile ? '80%' : '40%'}
          label="Correo eletrónico"
          placeholder="Escribe tu correo"
          size="md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password field */}
        <PasswordInput
          leftSection={<IconKey />}
          radius="xl"
          c="white"
          label="Contraseña"
          placeholder="Escribe tu contraseña"
          miw={isMobile ? '80%' : '40%'}
          mt="md"
          size="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Remember Me checkbox */}
        <Checkbox
          color="myPurple.3"
          c="white"
          label="Mantenerme conectado"
          mt="xl"
          size="md"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />

        {/* Error message if login fails */}
        {error && (
          <Text c="red" size="sm" align="center" mt="md">
            {error}
          </Text>
        )}

        {/* Login button */}
        <Button
          miw={isMobile ? '80%' : '40%'}
          color="myPurple.4"
          radius="xl"
          mt="xl"
          size="md"
          fw={400}
          onClick={handleSubmit}
        >
          Acceder a mi cuenta
        </Button>

        {/* Link to the registration page (optional) */}
        <Anchor c="white" href="" size="sm" mt="md" align="center" block>
          ¿Olvidaste tu contraseña?
        </Anchor>
      </Flex>
    </Flex>
  );
};

export default LoginForm;
