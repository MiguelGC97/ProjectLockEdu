import '@mantine/core/styles.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Flex, MantineProvider } from '@mantine/core';
import { AppProvider } from './hooks/AppProvider';
import AuthProvider from './hooks/AuthProvider';
import Home from './pages/Home.page';
import Login from './pages/Login.page';
import Reports from './pages/Reports.page';
import { theme } from './theme';

import './App.module.css';

import BookingHistory from './pages/BookingsHistory.page';
import Settings from './pages/Settings.page';

const App: React.FC = () => {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <AuthProvider>
          <AppProvider>
            <Flex maw="100vw" mah="100vh" style={{ backgroundColor: theme.colors.myPurple[6] }}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/perfil" element={<Home />} />
                <Route path="/incidencias" element={<Reports />} />
                <Route path="/historial-reservas" element={<BookingHistory />} />
                <Route path="/configuraciones" element={<Settings />} />
              </Routes>
            </Flex>
          </AppProvider>
        </AuthProvider>
      </Router>
    </MantineProvider>
  );
};

export default App;
