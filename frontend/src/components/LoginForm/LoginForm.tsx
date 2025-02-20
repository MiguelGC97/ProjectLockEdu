import React, { useState } from 'react';
import { IconAt, IconKey } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import {
  Anchor,
  Button,
  Checkbox,
  Flex,
  Image,
  PasswordInput,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useAuth } from '@/hooks/AuthProvider';

const LoginForm: React.FC = () => {
  const theme = useMantineTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      await login(username, password);
      navigate('/perfil');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
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
      <Flex radius={0} align="center" justify="center" px="auto" direction="column">
        <Image w="50%" src="/assets/logo-login.png" alt="logo de lockEdu" />
        <Text color="myPurple.0" mt="md" mb={50}>
          Inicia sesión con tus credenciales
        </Text>

        {/* Username field */}
        <TextInput
          data-testid="username-input"
          leftSection={<IconAt />}
          radius="xl"
          c="myPurple.0"
          miw="40%"
          label="Correo eletrónico"
          placeholder="Escribe tu correo"
          size="md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password field */}
        <PasswordInput
          data-testid="password-input"
          leftSection={<IconKey />}
          radius="xl"
          c="myPurple.0"
          label="Contraseña"
          placeholder="Escribe tu contraseña"
          miw="40%"
          mt="md"
          size="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Remember Me checkbox */}
        <Checkbox
          color="myPurple.3"
          c="myPurple.0"
          label="Mantenerme conectado"
          mt="xl"
          size="md"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />

        {/* Error message if login fails */}
        {error && (
          <Text data-testid="login-error" c="red" size="sm" align="center" mt="md">
            {error}
          </Text>
        )}

        {/* Login button */}
        <Button
          data-testid="submit-button"
          miw="40%"
          color="myPurple.4"
          radius="xl"
          mt="xl"
          size="md"
          fw={400}
          onClick={handleSubmit}
          onKeyDown={handleKeyDown}
        >
          Acceder a mi cuenta
        </Button>

        {/* Link to the registration page (optional) */}
        <Anchor c="myPurple.0" href="" size="sm" mt="md" align="center">
          ¿Olvidaste tu contraseña?
        </Anchor>
      </Flex>
    </Flex>
  );
};

export default LoginForm;
