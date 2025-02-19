import '@mantine/core/styles.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Flex } from '@mantine/core';
import { AuthProvider, useAuth } from './hooks/AuthProvider';
import { ThemeProvider, useTheme } from './hooks/ThemeProvider'; // Import useTheme

import BookingHistory from './pages/BookingsHistory.page';
import Home from './pages/Home.page';
import Login from './pages/Login.page';
import Reports from './pages/Reports.page';
import Settings from './pages/Settings.page';
import { getTheme } from './theme';

import './App.module.css';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <ThemeWrapper />
        </AuthProvider>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

// New component to handle dynamic background color
const ThemeWrapper = () => {
  const { theme } = useAuth(); // Get the current theme

  return (
    <Flex maw="100vw" mah="100vh">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/perfil" element={<Home />} />
        <Route path="/incidencias" element={<Reports />} />
        <Route path="/historial-reservas" element={<BookingHistory />} />
        <Route path="/configuraciones" element={<Settings />} />
      </Routes>
    </Flex>
  );
};
