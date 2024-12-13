import '@mantine/core/styles.css';

import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { Flex, MantineProvider } from '@mantine/core';
import AuthProvider from './hooks/AuthProvider';
import Home from './pages/Home.page';
import Login from './pages/Login.page';
import Reports from './pages/Reports.page';
import { theme } from './theme';

import './App.module.css';

import { AnimatePresence } from 'motion/react';
import BookingHistory from './pages/BookingHistory.page';
import Settings from './pages/Settings.page';

export default function App() {
  const location = useLocation();

  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <AnimatePresence mode="wait">
          <Flex maw="100vw" mah="100vh" style={{ backgroundColor: theme.colors.myPurple[6] }}>
            <Router>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/perfil" element={<Home />} />
                <Route path="/incidencias" element={<Reports />} />
                <Route path="/historial-reservas" element={<BookingHistory />} />
                <Route path="/configuraciones" element={<Settings />} />
              </Routes>
            </Router>
          </Flex>
        </AnimatePresence>
      </AuthProvider>
    </MantineProvider>
  );
}
