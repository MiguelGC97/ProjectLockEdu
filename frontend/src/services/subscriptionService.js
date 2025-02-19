import axios from 'axios';
import instance, { baseUrl } from '@/services/api';

const API = baseUrl;

function unregisterAllServiceWorkers() {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

async function regSw() {
  if ('serviceWorker' in navigator) {
    let url = baseUrl + '/sw.js';
    const reg = await navigator.serviceWorker.register(url, { scope: '/' });
    return reg;
  }
  throw Error('serviceworker not supported');
}

async function subscribe(serviceWorkerReg, subscriptionName) {
  let subscription = await serviceWorkerReg.pushManager.getSubscription();
  if (subscription === null) {
    subscription = await serviceWorkerReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.VITE_PUBLIC_KEY
    });
    axios.post(`${API}/subscribe`, { subscriptionName: subscriptionName, subscription: subscription });
  }
}

async function sendNotificationToSubscriptionName(subscriptionName, notificationMessage) {
  const message = {
    subscriptionName,
    notificationMessage
  }
  return axios.post(`${API}/sendNotificationToSubscriptionName`, message);
}

async function getAllSubscriptions() {
  return axios.get(`${API}`);
}

async function checkIfAlreadySubscribed() {
  const serviceWorkerReg = await navigator.serviceWorker.getRegistration('/sw.js');
  if (!serviceWorkerReg) return false;

  let subscription = await serviceWorkerReg.pushManager.getSubscription();

  if (subscription !== null) return true;

  return false;
}

async function unregisterFromServiceWorker() {
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