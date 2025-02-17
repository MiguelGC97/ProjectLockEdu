import '@mantine/core/styles.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Flex, MantineProvider } from '@mantine/core';
import AuthProvider from './hooks/AuthProvider';
import Home from './pages/Home.page';
import Login from './pages/Login.page';
import Reports from './pages/Reports.page';
import { ToastContainer } from 'react-toastify';
import { theme } from './theme';

import './App.module.css';

import BookingHistory from './pages/BookingsHistory.page';
import LoginPage from './pages/Login.page';
import Settings from './pages/Settings.page';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Flex maw="100vw" mah="100vh" style={{ backgroundColor: theme.colors.myPurple[6] }}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/perfil" element={<Home />} />
              <Route path="/incidencias" element={<Reports />} />
              <Route path="/historial-reservas" element={<BookingHistory />} />
              <Route path="/configuraciones" element={<Settings />} />
            </Routes>
          </Flex>
        </AuthProvider>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </MantineProvider>
  );
}
