// Router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import History from './pages/History.page';
import Home from './pages/Home.page';
import Notifications from './pages/Notifications.page';
import Profile from './pages/Profile.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/perfil',
    element: <Profile />,
  },
  {
    path: '/notificaciones',
    element: <Notifications />,
  },
  {
    path: '/historial-reservas',
    element: <History />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
