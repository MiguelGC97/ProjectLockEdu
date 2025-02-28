import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '@/hooks/AuthProvider';
import { useThemeStore } from '../store/store';

export default function ToastContainerComponent() {
  const { themeName } = useThemeStore();

  return (
    <ToastContainer
      position="bottom-right"
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
        background: themeName === 'dark' ? '#ffff' : '#ffff',
        color: 'var(--mantine-color-myPurple-9)',
      }}
    />
  );
}
