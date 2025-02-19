this.addEventListener('activate', function (event) {
    console.log('Service Worker activated');
});

this.addEventListener('push', async function (event) {
    console.log('Notification push received');

    try {
        const message = await event.data.json();
        let { title, description, image } = message;

        if (!title || !description) {
            console.error('Missing notification data');
            return;
        }

        await event.waitUntil(
            this.registration.showNotification(title, {
                body: description,
                icon: image,
                actions: [
                    {
                        action: "some action",
                        title: title,
                        icon: ''
                    },
                ],
            })
        );
    } catch (error) {
        console.error('Error while processing the notification', error);
    }
});