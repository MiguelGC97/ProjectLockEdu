import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '@/hooks/AuthProvider';

export default function ToastContainerComponent() {
  const { theme } = useAuth();

  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      style={{
        fontFamily: 'Quicksand, sans-serif',
        borderRadius: '10px',
      }}
      toastStyle={{
        background: theme === 'dark' ? '#ffff' : '#ffff',
        color: 'var(--mantine-color-myPurple-9)',
      }}
    />
  );
}
