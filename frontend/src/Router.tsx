// Router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
