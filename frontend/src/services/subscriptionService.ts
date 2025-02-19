import axios from 'axios';

const API = process.env.VITE_BASE_URL;

function unregisterAllServiceWorkers(): void {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

async function regSw(): Promise<ServiceWorkerRegistration> {
  if ('serviceWorker' in navigator) {
    let url = process.env.PUBLIC_URL + '/sw.js';
    const reg = await navigator.serviceWorker.register(url, { scope: '/' });
    return reg;
  }
  throw new Error('serviceworker not supported');
}

async function subscribe(
  serviceWorkerReg: ServiceWorkerRegistration, 
  subscriptionName: string
): Promise<void> {
  let subscription = await serviceWorkerReg.pushManager.getSubscription();
  if (subscription === null) {
    subscription = await serviceWorkerReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.VITE_PUBLIC_KEY
    });
    await axios.post(`${API}/subscribe`, { subscriptionName, subscription });
  }
}

async function sendNotificationToSubscriptionName(
  subscriptionName: string, 
  notificationMessage: string
): Promise<any> {
  const message = {
    subscriptionName,
    notificationMessage
  };
  return axios.post(`${API}/sendNotificationToSubscriptionName`, message);
}

async function getAllSubscriptions(): Promise<any> {
  return axios.get(`${API}`);
}

async function checkIfAlreadySubscribed(): Promise<boolean> {
  const serviceWorkerReg = await navigator.serviceWorker.getRegistration('/sw.js');
  if (!serviceWorkerReg) return false;

  let subscription = await serviceWorkerReg.pushManager.getSubscription();

  if (subscription !== null) return true;

  return false;
}

async function unregisterFromServiceWorker(): Promise<void> {
  const serviceWorkerReg = await navigator.serviceWorker.getRegistration('/sw.js');

  if (!serviceWorkerReg) return;
  let subscription = await serviceWorkerReg.pushManager.getSubscription();

  if (!subscription) return;

  await axios.post(`${API}/deleteByEndpoint`, { endpoint: subscription.endpoint });
  await subscription.unsubscribe();
}

export {
  regSw,
  subscribe,
  unregisterAllServiceWorkers,
  checkIfAlreadySubscribed,
  getAllSubscriptions,
  sendNotificationToSubscriptionName,
  unregisterFromServiceWorker
};
