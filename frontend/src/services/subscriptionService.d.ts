declare module './subscriptionService' {
    export function regSw(): Promise<ServiceWorkerRegistration>;
    export function subscribe(serviceWorkerReg: ServiceWorkerRegistration, subscriptionName: string): Promise<void>;
    export function checkIfAlreadySubscribed(): Promise<boolean>;
    export function getAllSubscriptions(): Promise<any>;
    export function sendNotificationToSubscriptionName(subscriptionName: string, notificationMessage: string): Promise<any>;
    export function unregisterFromServiceWorker(): Promise<void>;
}
