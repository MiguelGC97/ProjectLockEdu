import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Flex, MantineProvider, MantineThemeProvider, useMantineTheme } from '@mantine/core';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAuthStore, useThemeStore } from './components/store/store';
import ToastContainerComponent from './components/ToastContainerComponent/ToastContainerComponent';
import { ThemeProvider } from './hooks/ThemeProvider';
import BookingHistory from './pages/BookingsHistory.page';
import DashboardAdmin from './pages/DashboardAdmin.page';
import Home from './pages/Home.page';
import Login from './pages/Login.page';
import Reports from './pages/Reports.page';
import ReportsManager from './pages/ReportsManager.page';
import Settings from './pages/Settings.page';
import SettingsAdmin from './pages/SettingsAdmin.page';
import SettingsManager from './pages/SettingsManager.page';

// ✅ Import BrowserRouter correctly
export default function App() {
  const { theme, themeName } = useThemeStore();

  return (
    <MantineProvider theme={theme}>
      <Router>
        <ThemeWrapper />
      </Router>
    </MantineProvider>
  );
}

const ThemeWrapper = () => {
  const { theme, themeName } = useThemeStore();
  const { loading } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex maw="100vw" mah="100vh" style={{ backgroundColor: 'var(--mantine-color-myPurple-9)' }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />

        {/* Role-Based Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} redirectPath="/perfil" />}>
          <Route path="/perfil" element={<Home />} />
          <Route path="/historial-reservas" element={<BookingHistory />} />
          <Route path="/incidencias" element={<Reports />} />
          <Route path="/configuraciones" element={<Settings />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={['MANAGER']} redirectPath="/incidencias-manager" />
          }
        >
          <Route path="/incidencias-manager" element={<ReportsManager />} />
          <Route path="/configuraciones-manager" element={<SettingsManager />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} redirectPath="/panel-admin" />}>
          <Route path="/panel-admin" element={<DashboardAdmin />} />
          <Route path="/configuraciones-admin" element={<SettingsAdmin />} />
        </Route>
      </Routes>
      <ToastContainerComponent />
    </Flex>
  );
};
