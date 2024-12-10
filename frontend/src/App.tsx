import '@mantine/core/styles.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Flex, MantineProvider } from '@mantine/core';
import { SideMenu } from './components/SideMenu/SideMenu';
import Home from './pages/Home.page';
import Reports from './pages/Reports.page';
import { theme } from './theme';

import './App.module.css';

import BookingHistory from './pages/BookingHistory.page';
import Settings from './pages/Settings.page';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <Flex maw="100vw" mah="100vh" style={{ backgroundColor: theme.colors.myPurple[6] }}>
          <SideMenu />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/incidencias" element={<Reports />} />
            <Route path="/historial-reservas" element={<BookingHistory />} />
            <Route path="/configuraciones" element={<Settings />} />
          </Routes>
        </Flex>
      </Router>
    </MantineProvider>
  );
}
