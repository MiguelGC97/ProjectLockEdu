import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useAuth } from '@/hooks/AuthProvider';
import { login as loginService } from '@/services/authService';
import classes from '../App.module.css';

const Login: React.FC = () => {
  const { login } = useAuth(); // Use the login function from context
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className={classes.loginWrapper}>
      <Paper className={classes.loginForm} radius={0} p={30}>
        <Title order={2} className={classes.loginTitle} ta="center" mt="md" mb={50}>
          Inicia sesión con tus credenciales
        </Title>

        {/* Username field */}
        <TextInput
          label="Correo eletrónico"
          placeholder="Escribe tu correo"
          size="md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password field */}
        <PasswordInput
          label="Contraseña"
          placeholder="Escribe tu contraseña"
          mt="md"
          size="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Remember Me checkbox */}
        <Checkbox
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
        <Button fullWidth mt="xl" size="md" onClick={handleSubmit}>
          Acceder a mi cuenta
        </Button>

        {/* Link to the registration page (optional) */}
        <Anchor href="" size="sm" mt="md" align="center" block>
          ¿Olvidaste tu contraseña?
        </Anchor>
      </Paper>
    </div>
  );
};

export default Login;
