self.addEventListener('push', function(event) {
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { title: 'Notificación', body: event.data.text() };
        }
    }

    const options = {
        body: data.body || 'Tienes una nueva notificación en el panel de administrador.',
        icon: '/vite.svg', // Idealmente cambiar por tu logo.jpeg
        badge: '/vite.svg',
        data: {
            url: data.url || '/admin'
        },
        vibrate: [200, 100, 200, 100, 200, 100, 200]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Portfolio Admin', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    const urlToOpen = event.notification.data.url;
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
