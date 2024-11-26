// Router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BookingForm from './components/BookingForm/BookingForm';
import Home from './pages/Home.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/booking-form',
    element: <BookingForm />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
