// Router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BookingHistory from './pages/BookingHistory.page';
import Home from './pages/Home.page';
import Reports from './pages/Reports.page';
import Settings from './pages/Settings.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/incidencias',
    element: <Reports />,
  },
  {
    path: '/historial-reservas',
    element: <BookingHistory />,
  },
  {
    path: '/configuraciones',
    element: <Settings />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}