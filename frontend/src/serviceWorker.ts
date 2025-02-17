export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/serviceWorker.js');
        console.log('Service Worker registrado:', registration);
      } catch (error) {
        console.error('Error registrando el Service Worker:', error);
      }
    } else {
      console.warn('Tu navegador no soporta Service Workers.');
    }
  };