import ReactDOM from 'react-dom/client';
import App from './App';
import { registerServiceWorker } from './serviceWorker';

const addManifestLink = () => {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/manifest.json'; // Ruta al manifiesto
    document.head.appendChild(link);
  
    // // También puedes agregar el icono si es necesario
    // const iconLink = document.createElement('link');
    // iconLink.rel = 'icon';
    // iconLink.href = '/assets/icon-192x192.png'; // Ruta al icono
    // document.head.appendChild(iconLink);
  };
  
  addManifestLink();

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
