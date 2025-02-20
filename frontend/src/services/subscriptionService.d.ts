declare module '@/services/subscriptionService' {
    export function unregisterAllServiceWorkers(): void;
    export function regSw(): Promise<ServiceWorkerRegistration>;
    export function subscribe(
        serviceWorkerReg: ServiceWorkerRegistration,
        subscriptionName: string
    ): Promise<void>;
    export function sendNotificationToSubscriptionName(
        subscriptionName: string,
        notificationMessage: string
    ): Promise<any>;
    export function getAllSubscriptions(): Promise<any>;
    export function checkIfAlreadySubscribed(): Promise<boolean>;
    export function unregisterFromServiceWorker(): Promise<void>;
}
