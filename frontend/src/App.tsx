import '@mantine/core/styles.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Flex, useMantineTheme } from '@mantine/core';
import ToastContainerComponent from './components/ToastContainerComponent/ToastContainerComponent';
import { AuthProvider, useAuth } from './hooks/AuthProvider';
import { ThemeProvider, useTheme } from './hooks/ThemeProvider';
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
    </ThemeProvider>
  );
}

// New component to handle dynamic background color
const ThemeWrapper = () => {
  const theme = useMantineTheme();

  return (
    <Flex maw="100vw" mah="100vh" style={{ backgroundColor: theme.colors.myPurple[9] }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/perfil" element={<Home />} />
        <Route path="/incidencias" element={<Reports />} />
        <Route path="/historial-reservas" element={<BookingHistory />} />
        <Route path="/configuraciones" element={<Settings />} />
      </Routes>
      <ToastContainerComponent />
    </Flex>
  );
};
