import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Flex, useMantineTheme } from '@mantine/core';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ToastContainerComponent from './components/ToastContainerComponent/ToastContainerComponent';
import { AuthProvider } from './hooks/AuthProvider';
import { ThemeProvider } from './hooks/ThemeProvider';
import BookingHistory from './pages/BookingsHistory.page';
import Home from './pages/Home.page';
import LockersAdmin from './pages/LockersAdmin.page';
import Login from './pages/Login.page';
import Reports from './pages/Reports.page';
import ReportsManager from './pages/ReportsManager.page';
import Settings from './pages/Settings.page';
import SettingsAdmin from './pages/SettingsAdmin.page';
import SettingsManager from './pages/SettingsManager.page';
import UsersAdmin from './pages/UsersAdmin.page';

// ✅ Import BrowserRouter correctly

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

const ThemeWrapper = () => {
  const theme = useMantineTheme();

  return (
    <Flex maw="100vw" mah="100vh" style={{ backgroundColor: theme.colors.myPurple[9] }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />

        {/* Role-Based Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          <Route path="/perfil" element={<Home />} />
          <Route path="/historial-reservas" element={<BookingHistory />} />
          <Route path="/incidencias" element={<Reports />} />
          <Route path="/configuraciones" element={<Settings />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
          <Route path="/incidencias-manager" element={<ReportsManager />} />
          <Route path="/configuraciones-manager" element={<SettingsManager />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} redirectPath="/" />}>
          <Route path="/armarios" element={<LockersAdmin />} />
          <Route path="/usuarios" element={<UsersAdmin />} />
          <Route path="/configuraciones-admin" element={<SettingsAdmin />} />
        </Route>
      </Routes>
      <ToastContainerComponent />
    </Flex>
  );
};
