import '@mantine/core/styles.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Flex } from '@mantine/core';
import { AppProvider, ThemeProvider, useThemeContext } from './hooks/AppProvider';
import AuthProvider from './hooks/AuthProvider';
import BookingHistory from './pages/BookingsHistory.page';
import Home from './pages/Home.page';
import Login from './pages/Login.page';
import Reports from './pages/Reports.page';
import Settings from './pages/Settings.page';

import './App.module.css';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            {' '}
            {/* Ensure this wraps your whole app */}
            <Flex maw="100vw" mah="100vh">
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
      </ThemeProvider>
    </Router>
  );
};

export default App;
